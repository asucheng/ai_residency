import { describe, expect, it } from 'vitest';
import {
  channelLabel,
  ERRORS,
  normalizeStoreUrl,
  validateQuoteRequest,
  type QuoteRequestInput,
} from './quoteRequest';

const valid: QuoteRequestInput = {
  email: 'owner@shop.com',
  storeUrl: 'https://myshop.com',
  productType: 'Candles',
  supportChannels: ['email'],
  otherChannel: '',
};

describe('normalizeStoreUrl', () => {
  it.each([
    ['mystore.com', 'https://mystore.com'],
    ['  mystore.com/shop ', 'https://mystore.com/shop'],
    ['http://mystore.com', 'http://mystore.com'],
    ['https://MyStore.com', 'https://MyStore.com'],
  ])('accepts %j as %j', (raw, expected) => {
    expect(normalizeStoreUrl(raw)).toBe(expected);
  });

  it.each(['', '   ', 'not a url', 'ftp://mystore.com', 'localhost', 'https://'])(
    'rejects %j',
    (raw) => {
      expect(normalizeStoreUrl(raw)).toBeNull();
    },
  );

  it.each([
    'mystore.com/\nSubmitted: fake',
    'my\tstore.com',
    'mystore.com/a b',
    'mystore.com/\u0000',
    '.com',
    'mystore.com.',
  ])('rejects control characters, spaces and dotted-edge hosts: %j', (raw) => {
    expect(normalizeStoreUrl(raw)).toBeNull();
  });

  it('rejects URLs longer than 2048 characters', () => {
    expect(normalizeStoreUrl(`mystore.com/${'a'.repeat(2048)}`)).toBeNull();
  });
});

describe('validateQuoteRequest', () => {
  it('accepts a valid request and normalizes it', () => {
    const result = validateQuoteRequest({
      ...valid,
      email: '  Owner@Shop.COM ',
      storeUrl: 'myshop.com',
      productType: '  Candles  ',
    });
    expect(result).toEqual({
      ok: true,
      value: {
        email: 'owner@shop.com',
        storeUrl: 'https://myshop.com',
        productType: 'Candles',
        supportChannels: ['email'],
        otherChannel: null,
      },
    });
  });

  it('reports every missing required field', () => {
    const result = validateQuoteRequest({
      email: '',
      storeUrl: '',
      productType: '',
      supportChannels: [],
      otherChannel: '',
    });
    expect(result).toEqual({
      ok: false,
      errors: {
        email: ERRORS.email,
        storeUrl: ERRORS.storeUrl,
        productType: ERRORS.productTypeMissing,
        supportChannels: ERRORS.channelsMissing,
      },
    });
  });

  it('treats a non-object body as all fields missing', () => {
    for (const input of [null, 'hello', 42, ['x']]) {
      const result = validateQuoteRequest(input);
      expect(result.ok).toBe(false);
    }
  });

  it('rejects a product type over 100 characters', () => {
    const result = validateQuoteRequest({ ...valid, productType: 'x'.repeat(101) });
    expect(result).toEqual({ ok: false, errors: { productType: ERRORS.productTypeTooLong } });
  });

  it.each([
    ['productType', { productType: 'Candles\nSubmitted: fake' }],
    ['productType', { productType: 'a\u0000b' }],
    ['otherChannel', { supportChannels: ['other'], otherChannel: 'Whats\nApp' }],
  ])('rejects line breaks and control characters in %s', (field, overrides) => {
    const result = validateQuoteRequest({ ...valid, ...overrides });
    expect(result).toEqual({ ok: false, errors: { [field]: ERRORS.textInvalid } });
  });

  it('rejects an email containing control characters', () => {
    const result = validateQuoteRequest({ ...valid, email: 'a\u0000@shop.com' });
    expect(result).toEqual({ ok: false, errors: { email: ERRORS.email } });
  });

  it('rejects unknown channel ids', () => {
    const result = validateQuoteRequest({ ...valid, supportChannels: ['email', 'carrier_pigeon'] });
    expect(result).toEqual({ ok: false, errors: { supportChannels: ERRORS.channelsUnknown } });
  });

  it('rejects "none" combined with another channel', () => {
    const result = validateQuoteRequest({ ...valid, supportChannels: ['none', 'email'] });
    expect(result).toEqual({ ok: false, errors: { supportChannels: ERRORS.channelsNoneMixed } });
  });

  it('removes duplicate channels', () => {
    const result = validateQuoteRequest({ ...valid, supportChannels: ['email', 'email', 'phone'] });
    expect(result.ok && result.value.supportChannels).toEqual(['email', 'phone']);
  });

  it('requires the other-channel text when "other" is ticked', () => {
    const result = validateQuoteRequest({ ...valid, supportChannels: ['other'], otherChannel: '  ' });
    expect(result).toEqual({ ok: false, errors: { otherChannel: ERRORS.otherMissing } });
  });

  it('rejects other-channel text over 100 characters', () => {
    const result = validateQuoteRequest({
      ...valid,
      supportChannels: ['other'],
      otherChannel: 'x'.repeat(101),
    });
    expect(result).toEqual({ ok: false, errors: { otherChannel: ERRORS.otherTooLong } });
  });

  it('keeps other-channel text only when "other" is ticked', () => {
    const withOther = validateQuoteRequest({ ...valid, supportChannels: ['other'], otherChannel: ' WhatsApp ' });
    expect(withOther.ok && withOther.value.otherChannel).toBe('WhatsApp');
    const withoutOther = validateQuoteRequest({ ...valid, otherChannel: 'WhatsApp' });
    expect(withoutOther.ok && withoutOther.value.otherChannel).toBeNull();
  });
});

describe('channelLabel', () => {
  it('returns the display label for an id', () => {
    expect(channelLabel('social_dms')).toBe('Instagram/Facebook DMs');
  });
});
