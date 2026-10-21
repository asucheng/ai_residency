// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  createClient: vi.fn(),
  from: vi.fn(),
  insert: vi.fn(),
  select: vi.fn(),
  single: vi.fn(),
}));

vi.mock('@supabase/supabase-js', () => ({ createClient: mocks.createClient }));

import { createSupabaseSaver } from './supabaseStore.js';

const request = {
  email: 'owner@shop.com',
  storeUrl: 'https://myshop.com',
  productType: 'Candles',
  supportChannels: ['email' as const, 'other' as const],
  otherChannel: 'WhatsApp',
};

describe('createSupabaseSaver', () => {
  beforeEach(() => {
    mocks.createClient.mockReturnValue({ from: mocks.from });
    mocks.from.mockReturnValue({ insert: mocks.insert });
    mocks.insert.mockReturnValue({ select: mocks.select });
    mocks.select.mockReturnValue({ single: mocks.single });
  });

  it('inserts into quote_requests with snake_case columns and returns id and time', async () => {
    mocks.single.mockResolvedValue({
      data: { id: 'req-1', created_at: '2026-10-20T10:00:00+00:00' },
      error: null,
    });
    const save = createSupabaseSaver({ supabaseUrl: 'https://x.supabase.co', supabaseSecretKey: 'secret' });

    await expect(save(request)).resolves.toEqual({
      id: 'req-1',
      createdAt: '2026-10-20T10:00:00+00:00',
    });
    expect(mocks.createClient).toHaveBeenCalledWith(
      'https://x.supabase.co',
      'secret',
      expect.objectContaining({ auth: { persistSession: false, autoRefreshToken: false } }),
    );
    expect(mocks.from).toHaveBeenCalledWith('quote_requests');
    expect(mocks.insert).toHaveBeenCalledWith({
      email: 'owner@shop.com',
      store_url: 'https://myshop.com',
      product_type: 'Candles',
      support_channels: ['email', 'other'],
      other_channel: 'WhatsApp',
    });
    expect(mocks.select).toHaveBeenCalledWith('id, created_at');
  });

  it('gives Supabase requests a timeout signal', async () => {
    const globalFetch = vi.fn<typeof fetch>(() => Promise.resolve(new Response('{}')));
    vi.stubGlobal('fetch', globalFetch);
    createSupabaseSaver({ supabaseUrl: 'https://x.supabase.co', supabaseSecretKey: 'secret' });
    const options = mocks.createClient.mock.calls.at(-1)![2] as {
      global: { fetch: typeof fetch };
    };
    await options.global.fetch('https://x.supabase.co/rest/v1/quote_requests', { method: 'POST' });
    const init = globalFetch.mock.calls[0][1];
    expect(init?.method).toBe('POST');
    expect(init?.signal).toBeInstanceOf(AbortSignal);
    vi.unstubAllGlobals();
  });

  it('throws when Supabase returns an error', async () => {
    mocks.single.mockResolvedValue({ data: null, error: { message: 'permission denied' } });
    const save = createSupabaseSaver({ supabaseUrl: 'https://x.supabase.co', supabaseSecretKey: 'secret' });
    await expect(save(request)).rejects.toThrow('Supabase insert failed: permission denied');
  });
});
