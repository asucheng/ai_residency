const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_EMAIL_LENGTH = 254;
// oxlint-disable-next-line no-control-regex -- intentionally matches control characters
const CONTROL_CHARS = /[\u0000-\u001f\u007f]/;

export function normalizeEmail(raw: string): string {
  return raw.trim().toLowerCase();
}

export function isValidEmail(email: string): boolean {
  return (
    email.length <= MAX_EMAIL_LENGTH && !CONTROL_CHARS.test(email) && EMAIL_PATTERN.test(email)
  );
}
