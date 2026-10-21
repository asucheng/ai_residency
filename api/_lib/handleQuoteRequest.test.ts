// @vitest-environment node
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  handleQuoteRequest,
  SERVER_ERROR_MESSAGE,
  type QuoteRequestDeps,
} from './handleQuoteRequest.js';

const validBody = {
  email: 'Owner@Shop.com',
  storeUrl: 'myshop.com',
  productType: 'Candles',
  supportChannels: ['email', 'live_chat'],
  otherChannel: '',
  website: '',
};

const saved = { id: 'req-1', createdAt: '2026-10-20T10:00:00+00:00' };

function post(body: unknown): Request {
  return new Request('http://localhost/api/quote-request', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: typeof body === 'string' ? body : JSON.stringify(body),
  });
}

function fakeDeps(overrides: Partial<QuoteRequestDeps> = {}) {
  const deps = {
    save: vi.fn<QuoteRequestDeps['save']>(() => Promise.resolve(saved)),
    notify: vi.fn<QuoteRequestDeps['notify']>(() => Promise.resolve()),
    ...overrides,
  };
  return { deps, getDeps: () => deps };
}

describe('handleQuoteRequest', () => {
  beforeEach(() => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('rejects methods other than POST', async () => {
    const { getDeps } = fakeDeps();
    const response = await handleQuoteRequest(
      new Request('http://localhost/api/quote-request'),
      getDeps,
    );
    expect(response.status).toBe(405);
    expect(response.headers.get('Allow')).toBe('POST');
  });

  it('rejects a body that is not JSON', async () => {
    const { deps, getDeps } = fakeDeps();
    const response = await handleQuoteRequest(post('{not json'), getDeps);
    expect(response.status).toBe(400);
    expect(await response.json()).toMatchObject({ ok: false });
    expect(deps.save).not.toHaveBeenCalled();
  });

  it('quietly accepts and drops a request with the honeypot filled', async () => {
    const { deps, getDeps } = fakeDeps();
    const response = await handleQuoteRequest(post({ ...validBody, website: 'spam.com' }), getDeps);
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ ok: true });
    expect(deps.save).not.toHaveBeenCalled();
    expect(deps.notify).not.toHaveBeenCalled();
  });

  it('returns field errors for an invalid request', async () => {
    const { deps, getDeps } = fakeDeps();
    const response = await handleQuoteRequest(post({ ...validBody, email: 'nope' }), getDeps);
    expect(response.status).toBe(400);
    const body = (await response.json()) as { ok: boolean; errors: Record<string, string> };
    expect(body.ok).toBe(false);
    expect(Object.keys(body.errors)).toEqual(['email']);
    expect(deps.save).not.toHaveBeenCalled();
  });

  it('saves the normalized request, notifies the owner and returns ok', async () => {
    const { deps, getDeps } = fakeDeps();
    const response = await handleQuoteRequest(post(validBody), getDeps);
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ ok: true });
    const expected = {
      email: 'owner@shop.com',
      storeUrl: 'https://myshop.com',
      productType: 'Candles',
      supportChannels: ['email', 'live_chat'],
      otherChannel: null,
    };
    expect(deps.save).toHaveBeenCalledWith(expected);
    expect(deps.notify).toHaveBeenCalledWith(expected, saved);
  });

  it('returns 500 and does not notify when saving fails', async () => {
    const { deps, getDeps } = fakeDeps({
      save: vi.fn(() => Promise.reject(new Error('db down'))),
    });
    const response = await handleQuoteRequest(post(validBody), getDeps);
    expect(response.status).toBe(500);
    expect(await response.json()).toEqual({ ok: false, message: SERVER_ERROR_MESSAGE });
    expect(deps.notify).not.toHaveBeenCalled();
  });

  it('still returns ok when the owner email fails, and logs it', async () => {
    const { getDeps } = fakeDeps({
      notify: vi.fn(() => Promise.reject(new Error('resend down'))),
    });
    const response = await handleQuoteRequest(post(validBody), getDeps);
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ ok: true });
    expect(console.error).toHaveBeenCalled();
  });

  it('returns 500 when server configuration is missing', async () => {
    const response = await handleQuoteRequest(post(validBody), () => {
      throw new Error('Missing server env vars: SUPABASE_URL');
    });
    expect(response.status).toBe(500);
    expect(await response.json()).toEqual({ ok: false, message: SERVER_ERROR_MESSAGE });
  });
});
