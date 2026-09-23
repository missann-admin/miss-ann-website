# Miss Ann — Restoration Website

Website for the restoration of **Miss Ann**, a 127-foot 1926 fantail motor
yacht listed on the National Register of Historic Places (#98001310), docked at
Evans Island, Monroe Bay, Colonial Beach, Virginia.

Built with React 18 + Vite + TypeScript, Tailwind CSS, and React Router.
Contact and email-signup submissions feed a Supabase-backed contact list.
Hosted on Cloudflare Workers (static assets).

**Live:** https://missann.us

## Development

```
npm install
npm run dev       # dev server at http://localhost:5173
npm run build     # type-check + production build to dist/
npm run preview   # serve the production build locally
```

## Configuration

- `src/config.ts`
  - `DONATE_URL` — PayPal donate link; null while none exists, in which case
    `/restore` shows non-monetary ways to help only. Setting a URL adds a
    "Donate Now" button alongside them, plus a not-tax-deductible disclosure
    (no nonprofit is behind the project yet — see Donations below).
  - `YOUTUBE_VIDEOS` — add videos without touching components.
  - `CONTACT_INTERESTS` — segmentation options on the contact form. Add new
    values freely; **do not rename existing ones**, or stored records stop
    matching that segment.
- `.env.local` (gitignored — copy from `.env.example`):
  `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`. These are **build-time**
  variables baked into the bundle, so they belong in the Cloudflare project's
  **Build** variables, not the runtime ones. Only a git push triggers a real
  rebuild — dashboard "redeploy" reuses the previous artifact.

## Database

SQL lives in [supabase/migrations](supabase/migrations), applied by pasting
into the Supabase SQL editor.

Two tables, and the split is deliberate:

- **`form_submissions`** — append-only raw intake. The public may only INSERT.
- **`contacts`** — the deduplicated contact list. **No anon policies at all**,
  so it is unreachable from the browser.

A `SECURITY DEFINER` trigger merges submissions into `contacts`. Allowing the
site to upsert `contacts` directly would let anyone overwrite records or probe
whether an email is on file; append-only intake plus a privileged merge avoids
that. Interests accumulate across submissions, and consent is sticky once given.

The `mailing_list` view returns only contacts who opted in — **market from that
view, never from `contacts`.**

Reading a table with the anon key returns `[]`, and UPDATE/DELETE return `204`
with zero rows affected. That is RLS working, not a hole: PostgREST reports
success even when policies filter every row out.

### Keeping the project awake

Free-tier Supabase projects are paused after 7 days without API activity.
This site is static, so nothing touches the database unless a visitor submits
a form — a quiet week is enough to take every form offline silently, since
the pages still load and only submissions fail. That happened on
2026-09-01 and went unnoticed for three weeks.

[.github/workflows/supabase-keepalive.yml](.github/workflows/supabase-keepalive.yml)
pings the REST API daily to prevent it. It needs a repository secret
**`SUPABASE_ANON_KEY`** (Settings → Secrets and variables → Actions); the
workflow fails loudly if it is missing rather than sending an
unauthenticated request that might not count as activity. Scheduled
workflows only run from the **default branch**, so this has no effect until
it is merged to `main`.

Note that GitHub disables scheduled workflows after 60 days of repository
inactivity. If this project ever goes quiet that long, re-enable it from the
Actions tab, or move the ping to a Cloudflare Worker cron trigger, which has
no equivalent rule.

## Donations

Handled via a PayPal donate link (`DONATE_URL` in `src/config.ts`), not
GoFundMe — no nonprofit exists yet, so keeping this in-house avoids platform
fees. Requires a PayPal **Business** account (free to open/upgrade to;
Personal accounts can't generate a Donate button or configure IPN).
[supabase/functions/paypal-ipn](supabase/functions/paypal-ipn) receives
PayPal's Instant Payment Notification on each completed donation, verifies
it by posting it back to PayPal, and logs it into `form_submissions` (see
[004_donations.sql](supabase/migrations/004_donations.sql)) — the same merge
trigger then rolls it into `contacts`, bumping `stage` to `donor` and
accumulating `total_donated_cents`. The anon insert policy explicitly
forbids setting `amount_cents`/`payment_event_id`, so only the IPN function
(using the service role key, which bypasses RLS) can create a donation
record — a site visitor cannot fake one through the public API.

The function also requires the IPN's `receiver_email` to match
`PAYPAL_RECEIVER_EMAIL`. PayPal's postback check proves only that a
transaction is genuine, not that it was paid to *us*; without the receiver
check, anyone could aim their own account's IPN at this endpoint and invent
donors. Only USD is accepted, since `mc_gross` is denominated in
`mc_currency` and totals are stored as a single scalar.

Setup:
1. Open/upgrade to a PayPal Business account, then create a Donate button
   (PayPal > Pay & Get Paid > PayPal Buttons) — copy the resulting link
   (`https://www.paypal.com/donate/?hosted_button_id=...`) into `DONATE_URL`.
2. Set the receiver: `supabase secrets set PAYPAL_RECEIVER_EMAIL=<the
   Business account's email>`. Must match exactly, or every IPN is rejected.
3. Deploy: `supabase functions deploy paypal-ipn --no-verify-jwt` (PayPal
   can't send our auth header, so JWT verification must be off for this one
   function).
4. PayPal > Account Settings > Notifications > Instant Payment
   Notifications > enable, and point the URL at the deployed function.

Donations are not tax-deductible until a nonprofit or fiscal sponsor is
arranged — the disclosure in `RestorationFund.tsx` reflects that and should
be removed if that changes.

## Photos

Drop photos into `public/images/` using the filenames in
[public/images/README.md](public/images/README.md). Placeholder blocks are
shown until each file exists — no code changes needed.

## Deployment

Cloudflare Workers (static assets), project `miss-ann`, connected to this
GitHub repository. Build command `npm run build`, deploy command
`npx wrangler deploy`.

- [wrangler.jsonc](wrangler.jsonc) — serves `dist/` with SPA fallback so deep
  links resolve.
- [public/_headers](public/_headers) — security headers and asset caching.
- Custom domains `missann.us` (canonical) and `www.missann.us`.

**Apply pending database migrations before deploying code that depends on
them**, or live forms will write to tables that do not exist.
