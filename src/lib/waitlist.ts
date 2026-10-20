import { getSupabase } from './supabase';

export type WaitlistResult = { ok: true } | { ok: false; message: string };

export type InsertEmail = (
  email: string,
) => PromiseLike<{ error: { code?: string; message: string } | null }>;

export const WAITLIST_ERROR_MESSAGE = 'Something went wrong. Please try again.';

// Postgres unique_violation: the email is already on the list.
const DUPLICATE_EMAIL = '23505';

const insertIntoSupabase: InsertEmail = (email) =>
  getSupabase().from('waitlist_signups').insert({ email });

export async function joinWaitlist(
  email: string,
  insert: InsertEmail = insertIntoSupabase,
): Promise<WaitlistResult> {
  try {
    const { error } = await insert(email);
    if (!error || error.code === DUPLICATE_EMAIL) return { ok: true };
    console.error('Waitlist insert failed:', error.message);
    return { ok: false, message: WAITLIST_ERROR_MESSAGE };
  } catch (err) {
    console.error('Waitlist insert failed:', err);
    return { ok: false, message: WAITLIST_ERROR_MESSAGE };
  }
}
