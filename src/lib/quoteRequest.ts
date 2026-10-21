import { isValidEmail, normalizeEmail } from './email.js';

export const CHANNEL_OPTIONS = [
  { id: 'email', label: 'Email' },
  { id: 'live_chat', label: 'Live chat' },
  { id: 'social_dms', label: 'Instagram/Facebook DMs' },
  { id: 'phone', label: 'Phone' },
  { id: 'marketplace', label: 'Marketplace messages (Amazon, Etsy, etc.)' },
  { id: 'none', label: 'None yet' },
  { id: 'other', label: 'Other' },
] as const;

export type ChannelId = (typeof CHANNEL_OPTIONS)[number]['id'];

const CHANNEL_IDS = new Set<string>(CHANNEL_OPTIONS.map((option) => option.id));

export function channelLabel(id: ChannelId): string {
  return CHANNEL_OPTIONS.find((option) => option.id === id)!.label;
}

export type QuoteRequestInput = {
  email: string;
  storeUrl: string;
  productType: string;
  supportChannels: string[];
  otherChannel: string;
};

export type QuoteRequest = {
  email: string;
  storeUrl: string;
  productType: string;
  supportChannels: ChannelId[];
  otherChannel: string | null;
};

export type QuoteField = 'email' | 'storeUrl' | 'productType' | 'supportChannels' | 'otherChannel';

export const FIELD_ORDER: QuoteField[] = [
  'email',
  'storeUrl',
  'productType',
  'supportChannels',
  'otherChannel',
];

export type FieldErrors = Partial<Record<QuoteField, string>>;

export type ValidationResult = { ok: true; value: QuoteRequest } | { ok: false; errors: FieldErrors };

const MAX_TEXT_LENGTH = 100;
const MAX_URL_LENGTH = 2048;

export const ERRORS = {
  email: 'Enter a valid email address.',
  storeUrl: 'Enter your store web address, like mystore.com.',
  productTypeMissing: 'Tell us what you sell.',
  productTypeTooLong: `Keep this under ${MAX_TEXT_LENGTH} characters.`,
  channelsMissing: 'Pick at least one option.',
  channelsUnknown: 'Pick from the options listed.',
  channelsNoneMixed: 'Choose "None yet" or your channels, not both.',
  otherMissing: 'Tell us which other channel you use.',
  otherTooLong: `Keep this under ${MAX_TEXT_LENGTH} characters.`,
} as const;

export function normalizeStoreUrl(raw: string): string | null {
  const trimmed = raw.trim();
  if (!trimmed) return null;
  const withScheme = /^[a-z][a-z\d+.-]*:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
  if (withScheme.length > MAX_URL_LENGTH) return null;
  let url: URL;
  try {
    url = new URL(withScheme);
  } catch {
    return null;
  }
  if (url.protocol !== 'http:' && url.protocol !== 'https:') return null;
  if (!url.hostname.includes('.')) return null;
  return withScheme;
}

function text(value: unknown): string {
  return typeof value === 'string' ? value : '';
}

export function validateQuoteRequest(input: unknown): ValidationResult {
  const data =
    typeof input === 'object' && input !== null && !Array.isArray(input)
      ? (input as Record<string, unknown>)
      : {};
  const errors: FieldErrors = {};

  const email = normalizeEmail(text(data.email));
  if (!isValidEmail(email)) errors.email = ERRORS.email;

  const storeUrl = normalizeStoreUrl(text(data.storeUrl));
  if (!storeUrl) errors.storeUrl = ERRORS.storeUrl;

  const productType = text(data.productType).trim();
  if (!productType) errors.productType = ERRORS.productTypeMissing;
  else if (productType.length > MAX_TEXT_LENGTH) errors.productType = ERRORS.productTypeTooLong;

  const rawChannels = Array.isArray(data.supportChannels) ? data.supportChannels : [];
  const known = rawChannels.filter(
    (c): c is ChannelId => typeof c === 'string' && CHANNEL_IDS.has(c),
  );
  const supportChannels = [...new Set(known)];
  if (known.length !== rawChannels.length) errors.supportChannels = ERRORS.channelsUnknown;
  else if (supportChannels.length === 0) errors.supportChannels = ERRORS.channelsMissing;
  else if (supportChannels.includes('none') && supportChannels.length > 1)
    errors.supportChannels = ERRORS.channelsNoneMixed;

  const wantsOther = supportChannels.includes('other');
  const otherText = text(data.otherChannel).trim();
  if (wantsOther && !otherText) errors.otherChannel = ERRORS.otherMissing;
  else if (wantsOther && otherText.length > MAX_TEXT_LENGTH) errors.otherChannel = ERRORS.otherTooLong;

  if (Object.keys(errors).length > 0 || !storeUrl) return { ok: false, errors };

  return {
    ok: true,
    value: {
      email,
      storeUrl,
      productType,
      supportChannels,
      otherChannel: wantsOther ? otherText : null,
    },
  };
}
