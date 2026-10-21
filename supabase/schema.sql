-- Quote requests from the StoreSidekick marketing site.
-- Only the server (Supabase secret key) writes here; the public key has no access.

drop table if exists public.waitlist_signups;

create table if not exists public.quote_requests (
  id uuid primary key default gen_random_uuid(),
  email text not null
    check (
      char_length(email) <= 254
      and email = lower(email)
      and email ~ '^[^\s@]+@[^\s@]+\.[^\s@]+$'
    ),
  store_url text not null
    check (char_length(store_url) <= 2048 and store_url ~* '^https?://'),
  product_type text not null
    check (char_length(product_type) between 1 and 100),
  support_channels text[] not null
    check (
      cardinality(support_channels) > 0
      and support_channels <@ array['email', 'live_chat', 'social_dms', 'phone', 'marketplace', 'none', 'other']::text[]
    ),
  other_channel text
    check (other_channel is null or char_length(other_channel) between 1 and 100),
  status text not null default 'new',
  created_at timestamptz not null default now()
);

alter table public.quote_requests enable row level security;
revoke all on public.quote_requests from anon, authenticated;
