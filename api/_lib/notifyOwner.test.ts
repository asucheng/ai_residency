// @vitest-environment node
import { describe, expect, it, vi } from 'vitest';
import { buildOwnerEmail, createResendNotifier } from './notifyOwner.js';

const request = {
  email: 'owner@shop.com',
  storeUrl: 'https://www.myshop.com/collections',
  productType: 'Candles',
  supportChannels: ['email' as const, 'other' as const],
  otherChannel: 'WhatsApp',
};
const saved = { id: 'req-1', createdAt: '2026-10-20T10:00:00+00:00' };
const env = {
  resendApiKey: 're_test',
  ownerEmail: 'me@example.com',
  emailFrom: 'StoreSidekick <onboarding@resend.dev>',
};

describe('buildOwnerEmail', () => {
  it('addresses the owner, replies to the requester and lists every detail', () => {
    expect(buildOwnerEmail(request, saved, env)).toEqual({
      from: 'StoreSidekick <onboarding@resend.dev>',
      to: ['me@example.com'],
      reply_to: 'owner@shop.com',
      subject: 'New quote request: www.myshop.com',
      text: [
        'New quote request',
        '',
        'Email: owner@shop.com',
        'Store: https://www.myshop.com/collections',
        'Sells: Candles',
        'Support channels: Email, Other',
        'Other channel: WhatsApp',
        '',
        'Submitted: 2026-10-20T10:00:00+00:00',
        'Request id: req-1',
      ].join('\n'),
    });
  });

  it('leaves out the other-channel line when there is none', () => {
    const email = buildOwnerEmail(
      { ...request, supportChannels: ['phone'], otherChannel: null },
      saved,
      env,
    );
    expect(email.text).toContain('Support channels: Phone');
    expect(email.text).not.toContain('Other channel');
  });
});

describe('createResendNotifier', () => {
  it('posts the email to Resend with the API key', async () => {
    const fetchFn = vi.fn<typeof fetch>(() => Promise.resolve(new Response('{"id":"e1"}', { status: 200 })));
    await createResendNotifier(env, fetchFn)(request, saved);

    expect(fetchFn).toHaveBeenCalledTimes(1);
    const [url, init] = fetchFn.mock.calls[0];
    expect(url).toBe('https://api.resend.com/emails');
    expect(init?.method).toBe('POST');
    expect(init?.headers).toEqual({
      Authorization: 'Bearer re_test',
      'Content-Type': 'application/json',
    });
    expect(JSON.parse(String(init?.body))).toEqual(buildOwnerEmail(request, saved, env));
  });

  it('throws when Resend rejects the email', async () => {
    const fetchFn = vi.fn<typeof fetch>(() =>
      Promise.resolve(new Response('{"message":"invalid key"}', { status: 401 })),
    );
    await expect(createResendNotifier(env, fetchFn)(request, saved)).rejects.toThrow(
      'Resend responded 401',
    );
  });
});
