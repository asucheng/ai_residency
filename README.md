# StoreSidekick — tailored AI customer service for online stores

A marketing site for a service that builds AI customer-service assistants around a specific
e-commerce store. Each assistant answers shoppers' questions about the store's products, brand and
policies, stays on topic, and emails the owner anything it can't handle or anything involving money.

Pricing isn't fixed, so the site's main action is **Request a quote**. Each request is saved to
Supabase and emailed to the business owner, who follows up with a custom quote.

Built for Stage 1 of the AI Engineer Residency. The working assistant comes in later stages.

**Live site:** https://storesidekick.vercel.app

## How it works

```
Browser form ──POST /api/quote-request──▶ Vercel function
                                            ├─ validate (same rules as the form)
                                            ├─ save to Supabase `quote_requests` (secret key, server only)
                                            └─ email the owner via Resend
```

The browser never holds a key. The public Supabase key has no access to the table.

## Tech stack

- Vite + React + TypeScript, plain CSS
- Vercel serverless function (`api/quote-request.ts`)
- Supabase (Postgres) for quote requests
- Resend for the owner notification email
- Vitest + Testing Library

## Run locally

Requirements: Node.js 20.19+, a Supabase project, a Resend account, and a Vercel account.

```bash
git clone https://github.com/asucheng/ai_residency.git
cd ai_residency
npm install
cp .env.example .env      # then fill in your values (gitignored)
npx vercel link            # connect to your Vercel project
npx vercel dev             # serves the site and /api together
```

`vercel dev` reads `.env` for the API's settings.

`npm run dev` serves only the page. The form needs `vercel dev` to reach the API.

## Environment variables (server only)

| Name | What it is |
| --- | --- |
| `SUPABASE_URL` | Supabase → Project Settings → API → Project URL |
| `SUPABASE_SECRET_KEY` | Supabase secret key (never expose it to the browser) |
| `RESEND_API_KEY` | Resend API key with sending access |
| `OWNER_EMAIL` | Where new quote requests are emailed |
| `EMAIL_FROM` | Optional sender, default `StoreSidekick <onboarding@resend.dev>` |

Locally they live in `.env`. For deployments, add them in Vercel for Production and Preview:

```bash
npx vercel env add SUPABASE_SECRET_KEY --environment production
```

## Database setup

In Supabase → SQL Editor, run [`supabase/schema.sql`](supabase/schema.sql). It creates
`quote_requests` with checks that mirror the form's validation, turns on Row Level Security, and
removes all access for the public key.

## Scripts

| Command | What it does |
| --- | --- |
| `npx vercel dev` | Run the site and API locally |
| `npm run dev` | Run the page only |
| `npm test` | Run the tests once |
| `npm run lint` | Lint |
| `npm run build` | Type-check (app and API) and build to `dist/` |

## Project structure

```
src/
  content.ts              all page copy
  components/             one component per section, plus QuoteForm
  lib/quoteRequest.ts     validation shared by the form and the API
  lib/submitQuote.ts      sends the form to the API
api/
  quote-request.ts        Vercel function entry
  _lib/                   handler, env, Supabase saver, Resend notifier
supabase/schema.sql       table and access rules
```
