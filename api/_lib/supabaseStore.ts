import { createClient } from '@supabase/supabase-js';
import type { ServerEnv } from './env.js';
import type { QuoteRequestDeps } from './handleQuoteRequest.js';

const SUPABASE_TIMEOUT_MS = 8000;

const fetchWithTimeout: typeof fetch = (input, init) => {
  const timeout = AbortSignal.timeout(SUPABASE_TIMEOUT_MS);
  const signal = init?.signal ? AbortSignal.any([init.signal, timeout]) : timeout;
  return fetch(input, { ...init, signal });
};

export function createSupabaseSaver(
  env: Pick<ServerEnv, 'supabaseUrl' | 'supabaseSecretKey'>,
): QuoteRequestDeps['save'] {
  const client = createClient(env.supabaseUrl, env.supabaseSecretKey, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: { fetch: fetchWithTimeout },
  });

  return async (request) => {
    const { data, error } = await client
      .from('quote_requests')
      .insert({
        email: request.email,
        store_url: request.storeUrl,
        product_type: request.productType,
        support_channels: request.supportChannels,
        other_channel: request.otherChannel,
      })
      .select('id, created_at')
      .single();
    if (error) throw new Error(`Supabase insert failed: ${error.message}`);
    return { id: String(data.id), createdAt: String(data.created_at) };
  };
}
