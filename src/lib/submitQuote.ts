import type { FieldErrors, QuoteRequestInput } from './quoteRequest';

export type QuotePayload = QuoteRequestInput & { website: string };

export type SubmitResult = { ok: true } | { ok: false; message: string; errors?: FieldErrors };

export const SUBMIT_ERROR_MESSAGE = 'Something went wrong. Please try again.';
export const FIX_FIELDS_MESSAGE = 'Please fix the highlighted fields.';

export async function submitQuoteRequest(
  payload: QuotePayload,
  fetchFn: typeof fetch = fetch,
): Promise<SubmitResult> {
  try {
    const response = await fetchFn('/api/quote-request', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const body = (await response.json().catch(() => null)) as {
      ok?: boolean;
      errors?: FieldErrors;
    } | null;
    if (response.ok && body?.ok) return { ok: true };
    if (response.status === 400 && body?.errors) {
      return { ok: false, message: FIX_FIELDS_MESSAGE, errors: body.errors };
    }
    return { ok: false, message: SUBMIT_ERROR_MESSAGE };
  } catch {
    return { ok: false, message: SUBMIT_ERROR_MESSAGE };
  }
}
