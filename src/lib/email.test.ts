import { describe, expect, it } from 'vitest';
import { isValidEmail, normalizeEmail } from './email';

describe('normalizeEmail', () => {
  it('trims whitespace and lowercases', () => {
    expect(normalizeEmail('  Ana@Example.COM ')).toBe('ana@example.com');
  });
});

describe('isValidEmail', () => {
  it.each(['ana@example.com', 'a.b+toys@sub.example.co'])('accepts %s', (email) => {
    expect(isValidEmail(email)).toBe(true);
  });

  it.each(['', 'ana', 'ana@', '@example.com', 'ana@example', 'ana @example.com', 'ana@@example.com'])(
    'rejects %j',
    (email) => {
      expect(isValidEmail(email)).toBe(false);
    },
  );

  it('rejects addresses longer than 254 characters', () => {
    const email = `${'a'.repeat(245)}@example.com`;
    expect(email.length).toBeGreaterThan(254);
    expect(isValidEmail(email)).toBe(false);
  });
});
