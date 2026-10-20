import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { joinWaitlist, WAITLIST_ERROR_MESSAGE } from './waitlist';

describe('joinWaitlist', () => {
  beforeEach(() => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllEnvs();
  });

  it('inserts the email and returns ok', async () => {
    const insert = vi.fn(() => Promise.resolve({ error: null }));
    await expect(joinWaitlist('ana@example.com', insert)).resolves.toEqual({ ok: true });
    expect(insert).toHaveBeenCalledWith('ana@example.com');
  });

  it('treats an email that is already on the list as success', async () => {
    const insert = vi.fn(() =>
      Promise.resolve({ error: { code: '23505', message: 'duplicate key value' } }),
    );
    await expect(joinWaitlist('ana@example.com', insert)).resolves.toEqual({ ok: true });
  });

  it('returns a friendly error for other database errors', async () => {
    const insert = vi.fn(() =>
      Promise.resolve({ error: { code: '42501', message: 'permission denied' } }),
    );
    await expect(joinWaitlist('ana@example.com', insert)).resolves.toEqual({
      ok: false,
      message: WAITLIST_ERROR_MESSAGE,
    });
  });

  it('returns a friendly error when the network request fails', async () => {
    const insert = vi.fn(() => Promise.reject(new TypeError('Failed to fetch')));
    await expect(joinWaitlist('ana@example.com', insert)).resolves.toEqual({
      ok: false,
      message: WAITLIST_ERROR_MESSAGE,
    });
  });

  it('returns a friendly error instead of throwing when Supabase env vars are missing', async () => {
    vi.stubEnv('VITE_SUPABASE_URL', '');
    vi.stubEnv('VITE_SUPABASE_ANON_KEY', '');
    await expect(joinWaitlist('ana@example.com')).resolves.toEqual({
      ok: false,
      message: WAITLIST_ERROR_MESSAGE,
    });
  });
});
