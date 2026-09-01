# Stage 1 Site: AI Customer-Service Agent Explainer (Pet Toy Business)

## Purpose

A small standalone website (no email/REDnote/other channel integrations
yet) that explains a future AI customer-service agent for an online
pet-toy business. Audience is dual-purpose: internal/stakeholder pitch
material now, with enough production polish that it could later be
pointed at real customers as a public landing page without a rebuild.

## Scope (Stage 1)

In scope:
- Static explainer content (problem, value prop, examples, scope,
  escalation rules)
- A working waitlist/contact form that persists real email addresses
  to Supabase

Out of scope (explicitly deferred to later stages):
- Any integration with email, REDnote, or other live customer channels
- An actual working AI agent / chat interface
- User accounts, auth, or admin dashboard
- CMS-driven content editing

## Page Structure

Single scrolling page, anchor-linked nav (no router needed):

1. **Header** — brand name/logo + nav links to sections below
2. **Hero / Problem** — states the customer problem (slow support,
   repetitive questions, off-hours gaps for a pet-toy shop)
3. **What the agent helps with** — 3-4 value props (fast answers,
   24/7 availability, consistent policy answers, frees up humans for
   complex cases)
4. **Example Q&A** — chat-bubble style examples (e.g. "Where's my
   order?" / "Is this toy safe for aggressive chewers?") with agent
   responses
5. **What it can handle** — bullet list of in-scope issue types (order
   status, product recommendations, sizing/safety FAQs, return policy)
6. **When it escalates to a human** — bullet list of out-of-scope
   triggers (damaged/recalled product, angry customer, payment
   disputes, anything outside policy)
7. **Waitlist / contact section** — email field, submit → Supabase
   insert → success message
8. **Footer**

## User Flow

Land → skim problem/value prop → scroll through examples and
capability/escalation lists → decide it's relevant → enter email →
see success confirmation. No accounts, no auth, no multi-step forms,
no page navigation beyond in-page anchors.

## Data

**Static content** — Q&A examples, capability list, escalation list
are hardcoded as TypeScript/JSON data files in the repo. No CMS;
content changes happen by editing source files and redeploying.

**Dynamic data** — one Supabase table:

```
waitlist_signups
  id          uuid, primary key, default gen_random_uuid()
  email       text, not null
  created_at  timestamptz, not null, default now()
```

- Client validates email format before attempting insert.
- Row Level Security: anonymous role may **INSERT only**. No
  SELECT/UPDATE/DELETE from the client. Reading signups happens via
  the Supabase dashboard/SQL editor, not the website.
- On successful insert, show a success message in place of the form.
  On failure (network/validation), show an inline error and let the
  user retry.

## Technology Choices

- Vite + React + TypeScript
- Plain CSS (no CSS framework), responsive layout
- `@supabase/supabase-js` client, used only for the waitlist insert —
  no other integrations
- Env vars: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`

## Deployment

- Vercel, git-connected, auto-deploy on push to `main`
- Supabase project created separately; env vars set in Vercel project
  settings (and in a local `.env` for development, gitignored)

## Assumptions

- Placeholder brand name is invented (fictional pet-toy business) since
  no real name was provided
- Waitlist form collects **email only**
- No Supabase project exists yet — implementation includes creating
  one and the table/policy above
- No existing brand colors/fonts — free rein on visual design
- No CMS; content edits happen by editing source files

## Implementation Plan (steps)

1. Scaffold Vite+React+TS app, base layout/shell, plain CSS reset
2. Build static content sections (hero, help-with, capabilities,
   escalation) with placeholder copy
3. Build Example Q&A component (chat-bubble UI) with placeholder
   examples
4. Create Supabase project + `waitlist_signups` table + insert-only
   RLS policy
5. Build waitlist form: validation, Supabase insert, success/error
   states
6. Responsive pass across breakpoints
7. Deploy to Vercel, wire env vars, verify end-to-end
