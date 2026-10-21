// @vitest-environment node
import { describe, expect, it, vi } from 'vitest';
import {
  FIX_FIELDS_MESSAGE,
  SUBMIT_ERROR_MESSAGE,
  submitQuoteRequest,
  type QuotePayload,
} from './submitQuote';

const payload: QuotePayload = {
  email: 'owner@shop.com',
  storeUrl: 'https://myshop.com',
  productType: 'Candles',
  supportChannels: ['email'],
  otherChannel: '',
  website: '',
};

function respond(status: number, body: string) {
  return vi.fn<typeof fetch>(() => Promise.resolve(new Response(body, { status })));
}

describe('submitQuoteRequest', () => {
  it('posts JSON to the API and returns ok', async () => {
    const fetchFn = respond(200, '{"ok":true}');
    await expect(submitQuoteRequest(payload, fetchFn)).resolves.toEqual({ ok: true });
    const [url, init] = fetchFn.mock.calls[0];
    expect(url).toBe('/api/quote-request');
    expect(init?.method).toBe('POST');
    expect(JSON.parse(String(init?.body))).toEqual(payload);
  });

  it('returns the server field errors on 400', async () => {
    const fetchFn = respond(400, '{"ok":false,"errors":{"storeUrl":"Bad URL"}}');
    await expect(submitQuoteRequest(payload, fetchFn)).resolves.toEqual({
      ok: false,
      message: FIX_FIELDS_MESSAGE,
      errors: { storeUrl: 'Bad URL' },
    });
  });

  it('returns a generic error on a server error', async () => {
    const fetchFn = respond(500, '{"ok":false,"message":"boom"}');
    await expect(submitQuoteRequest(payload, fetchFn)).resolves.toEqual({
      ok: false,
      message: SUBMIT_ERROR_MESSAGE,
    });
  });

  it('returns a generic error when the response is not JSON', async () => {
    const fetchFn = respond(502, '<html>Bad gateway</html>');
    await expect(submitQuoteRequest(payload, fetchFn)).resolves.toEqual({
      ok: false,
      message: SUBMIT_ERROR_MESSAGE,
    });
  });

  it('returns a generic error when the network fails', async () => {
    const fetchFn = vi.fn<typeof fetch>(() => Promise.reject(new TypeError('Failed to fetch')));
    await expect(submitQuoteRequest(payload, fetchFn)).resolves.toEqual({
      ok: false,
      message: SUBMIT_ERROR_MESSAGE,
    });
  });
});
