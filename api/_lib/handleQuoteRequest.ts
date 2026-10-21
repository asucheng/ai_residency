import { validateQuoteRequest, type QuoteRequest } from '../../src/lib/quoteRequest.js';

export type SavedQuoteRequest = { id: string; createdAt: string };

export type QuoteRequestDeps = {
  save(request: QuoteRequest): Promise<SavedQuoteRequest>;
  notify(request: QuoteRequest, saved: SavedQuoteRequest): Promise<void>;
};

export const SERVER_ERROR_MESSAGE = 'Something went wrong on our side. Please try again later.';

function json(body: unknown, status = 200, headers: Record<string, string> = {}): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', ...headers },
  });
}

function honeypotFilled(body: unknown): boolean {
  return typeof body === 'object' && body !== null && Boolean((body as { website?: unknown }).website);
}

export async function handleQuoteRequest(
  request: Request,
  getDeps: () => QuoteRequestDeps,
): Promise<Response> {
  if (request.method !== 'POST') {
    return json({ ok: false, message: 'Method not allowed.' }, 405, { Allow: 'POST' });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return json({ ok: false, message: 'Request body must be JSON.' }, 400);
  }

  // Bots fill every field, including the hidden one; pretend it worked.
  if (honeypotFilled(body)) return json({ ok: true });

  const result = validateQuoteRequest(body);
  if (!result.ok) return json({ ok: false, errors: result.errors }, 400);

  let deps: QuoteRequestDeps;
  let saved: SavedQuoteRequest;
  try {
    deps = getDeps();
    saved = await deps.save(result.value);
  } catch (err) {
    console.error('Saving quote request failed:', err);
    return json({ ok: false, message: SERVER_ERROR_MESSAGE }, 500);
  }

  // The request is saved; a failed email shouldn't fail it. The dashboard is the fallback.
  try {
    await deps.notify(result.value, saved);
  } catch (err) {
    console.error('Owner notification failed:', err);
  }

  return json({ ok: true });
}
