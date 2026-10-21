import { readServerEnv } from './_lib/env.js';
import { handleQuoteRequest, type QuoteRequestDeps } from './_lib/handleQuoteRequest.js';
import { createResendNotifier } from './_lib/notifyOwner.js';
import { createSupabaseSaver } from './_lib/supabaseStore.js';

function getDeps(): QuoteRequestDeps {
  const env = readServerEnv();
  return { save: createSupabaseSaver(env), notify: createResendNotifier(env) };
}

export default {
  fetch(request: Request): Promise<Response> {
    return handleQuoteRequest(request, getDeps);
  },
};
