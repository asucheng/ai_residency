export type ServerEnv = {
  supabaseUrl: string;
  supabaseSecretKey: string;
  resendApiKey: string;
  ownerEmail: string;
  emailFrom: string;
};

export const DEFAULT_EMAIL_FROM = 'StoreSidekick <onboarding@resend.dev>';

const REQUIRED = ['SUPABASE_URL', 'SUPABASE_SECRET_KEY', 'RESEND_API_KEY', 'OWNER_EMAIL'] as const;

export function readServerEnv(env: Record<string, string | undefined> = process.env): ServerEnv {
  const missing = REQUIRED.filter((name) => !env[name]);
  if (missing.length > 0) {
    throw new Error(`Missing server env vars: ${missing.join(', ')}`);
  }
  return {
    supabaseUrl: env.SUPABASE_URL!,
    supabaseSecretKey: env.SUPABASE_SECRET_KEY!,
    resendApiKey: env.RESEND_API_KEY!,
    ownerEmail: env.OWNER_EMAIL!,
    emailFrom: env.EMAIL_FROM || DEFAULT_EMAIL_FROM,
  };
}
