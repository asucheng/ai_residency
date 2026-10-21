import { channelLabel, type QuoteRequest } from '../../src/lib/quoteRequest.js';
import type { ServerEnv } from './env.js';
import type { QuoteRequestDeps, SavedQuoteRequest } from './handleQuoteRequest.js';

export type OwnerEmail = {
  from: string;
  to: string[];
  reply_to: string;
  subject: string;
  text: string;
};

export function buildOwnerEmail(
  request: QuoteRequest,
  saved: SavedQuoteRequest,
  env: Pick<ServerEnv, 'ownerEmail' | 'emailFrom'>,
): OwnerEmail {
  const lines = [
    'New quote request',
    '',
    `Email: ${request.email}`,
    `Store: ${request.storeUrl}`,
    `Sells: ${request.productType}`,
    `Support channels: ${request.supportChannels.map(channelLabel).join(', ')}`,
  ];
  if (request.otherChannel) lines.push(`Other channel: ${request.otherChannel}`);
  lines.push('', `Submitted: ${saved.createdAt}`, `Request id: ${saved.id}`);

  return {
    from: env.emailFrom,
    to: [env.ownerEmail],
    reply_to: request.email,
    subject: `New quote request: ${new URL(request.storeUrl).hostname}`,
    text: lines.join('\n'),
  };
}

export function createResendNotifier(
  env: Pick<ServerEnv, 'resendApiKey' | 'ownerEmail' | 'emailFrom'>,
  fetchFn: typeof fetch = fetch,
  timeoutMs = 5000,
): QuoteRequestDeps['notify'] {
  return async (request, saved) => {
    const response = await fetchFn('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${env.resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(buildOwnerEmail(request, saved, env)),
      // A stalled email must not hold up a request that is already saved.
      signal: AbortSignal.timeout(timeoutMs),
    });
    if (!response.ok) {
      throw new Error(`Resend responded ${response.status}: ${await response.text()}`);
    }
  };
}
