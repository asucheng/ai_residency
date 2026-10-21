// @vitest-environment node
import { describe, expect, it } from 'vitest';
import { DEFAULT_EMAIL_FROM, readServerEnv } from './env.js';

const full = {
  SUPABASE_URL: 'https://x.supabase.co',
  SUPABASE_SECRET_KEY: 'secret',
  RESEND_API_KEY: 'resend',
  OWNER_EMAIL: 'me@example.com',
};

describe('readServerEnv', () => {
  it('reads all values and defaults the sender', () => {
    expect(readServerEnv({ ...full, EMAIL_FROM: '' })).toEqual({
      supabaseUrl: 'https://x.supabase.co',
      supabaseSecretKey: 'secret',
      resendApiKey: 'resend',
      ownerEmail: 'me@example.com',
      emailFrom: DEFAULT_EMAIL_FROM,
    });
  });

  it('uses EMAIL_FROM when set', () => {
    expect(readServerEnv({ ...full, EMAIL_FROM: 'Me <me@mydomain.com>' }).emailFrom).toBe(
      'Me <me@mydomain.com>',
    );
  });

  it('names every missing variable', () => {
    expect(() => readServerEnv({ SUPABASE_URL: 'https://x.supabase.co' })).toThrow(
      'Missing server env vars: SUPABASE_SECRET_KEY, RESEND_API_KEY, OWNER_EMAIL',
    );
  });
});
