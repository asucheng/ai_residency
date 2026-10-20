# Stage 1 Site: AI Customer-Service Assistant for a Pet Toy Store

## Purpose

A live, single-page website for an online pet-toy store that presents
its AI customer-service assistant. The assistant's job is to save the
owner the cost of hiring human support staff. It answers shopper
questions straight away, stays on the store's business, and hands
anything uncertain or money-related to the owner by email.

The page builds toward one main action: **joining the waitlist** to be
the first to hear about new product launches.

This is the Residency **Stage 1** deliverable: a live website with one
meaningful interaction, a README with run instructions, and a short
reflection. The working assistant is built in **Stage 2** (RAG
chatbot). Stage 1 presents its behaviour; it doesn't run it.

## Scope (Stage 1)

In scope:
- Content explaining what the assistant answers, what it declines, and
  when it hands off to the owner
- Example conversations shown as chat bubbles (hardcoded content)
- A working waitlist form that saves real email addresses to Supabase
- README, `REFLECTION.md`, and a verified live deployment

Out of scope (deferred to Stage 2 or later):
- A working AI assistant or live chat interface
- Retrieval over the product catalogue and policies
- Actually sending hand-off emails to the owner
- Integrations with email inboxes, REDnote, or other customer channels
- User accounts, auth, admin dashboard, CMS

## Page Structure

Single scrolling page with anchor-linked nav (no router):

1. **Header** — placeholder store name/logo, nav links to the sections
   below, and a "Join the waitlist" button
2. **Hero** — shoppers get instant answers and the owner doesn't need
   to hire support staff; primary button scrolls to the waitlist
3. **What you can ask** — four topics, each with a one-line example:
   - a specific toy (materials, size, durability, which pet it suits)
   - the store (ordering, delivery times, contact)
   - the brand (who we are, safety standards)
   - policies (shipping, returns)
4. **Example conversations** — chat-bubble exchanges, one per behaviour:
   - toy question → direct answer
   - policy question → direct answer
   - off-topic question → polite decline and redirect to store topics
   - refund request → hand-off message ("I've passed this to the
     owner, who will reply by email")
5. **Stays on topic** — the assistant only discusses the store, its
   products, brand, and policies, and politely declines anything else
6. **When a human steps in** — the assistant emails the owner, who
   makes the final call, when:
   - it can't answer confidently from store information
   - the question involves money: refunds, discounts, pricing
     exceptions
7. **Waitlist** — "Be the first to hear about new launches"; email
   field → Supabase insert → success message
8. **Footer** — store name, year, note that the store is fictional

## User Flow

Land → read the hero → see what the assistant answers and how it
behaves in the examples → understand off-topic and hand-off rules →
join the waitlist → see a success confirmation. No accounts, no
multi-step forms, no navigation beyond in-page anchors. Every
"Join the waitlist" button scrolls to the form.

## Data

**Static content** — topics, example conversations, and hand-off rules
live in TypeScript data files in the repo (for example
`src/content.ts`). Content changes mean editing source and redeploying.

**Dynamic data** — one Supabase table:

```
waitlist_signups
  id          uuid, primary key, default gen_random_uuid()
  email       text, not null, unique
  created_at  timestamptz, not null, default now()
```

- Row Level Security: the `anon` role may **INSERT only**. No
  SELECT/UPDATE/DELETE from the browser. Signups are read in the
  Supabase dashboard.
- The anon key ends up in the browser bundle by design. It's safe only
  because RLS limits it to inserts.

## Waitlist Form Behaviour

- Client trims the input and checks email format before submitting;
  invalid input shows an inline error and makes no request.
- The submit button is disabled while the request is in flight.
- Success: the form is replaced by a confirmation message.
- Duplicate email (unique-constraint error): show the same success
  message, since the person is already on the list, without revealing
  whether the email existed.
- Network or other errors: inline error message, form stays filled so
  the user can retry.

## Technology Choices

- Vite + React + TypeScript
- Plain CSS (no framework), responsive, mobile-first
- `@supabase/supabase-js`, used only for the waitlist insert
- Env vars: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, kept in a
  gitignored `.env` locally and documented in a committed `.env.example`
  with placeholder values

## Testing

- Unit tests (Vitest) for email validation and the form's
  idle/submitting/success/error states, with the Supabase call mocked
- Manual checks before calling Stage 1 done:
  - layout at phone (~375px) and desktop widths
  - all nav links and waitlist buttons scroll to the right section
  - browser console shows no errors or warnings
  - a real signup appears in the Supabase table
  - the live URL works in a signed-out (private) browser window

## Deployment

- Vercel, git-connected, auto-deploys on push to `main`
- Supabase env vars set in Vercel project settings
- Work happens on branches and merges into `main` through PRs

## Deliverables (Stage 1 checklist)

- Live URL that works signed-out
- `README.md`: what the site is, live URL, how to run locally, env
  vars, how to run tests
- `REFLECTION.md`: what was built, AI tools used, one technical
  decision, one bug fixed, what to improve
- No secrets in the repository

## Assumptions

- Store name, products, and policies are invented placeholders
- Waitlist collects email only
- No Supabase project exists yet; creating it, the table, and the RLS
  policy is part of implementation
- No existing brand colours or fonts; free rein on visual design

## Build Order

1. Scaffold Vite + React + TS, base layout, CSS reset, `.env.example`
2. Content data file and static sections (header, hero, what you can
   ask, stays on topic, when a human steps in, footer)
3. Example conversations component (chat bubbles)
4. Supabase project, `waitlist_signups` table, insert-only RLS policy
5. Waitlist form: validation, insert, success/duplicate/error states,
   with unit tests
6. Responsive and console-error pass
7. Deploy to Vercel, set env vars, verify signed-out
8. README and `REFLECTION.md`
