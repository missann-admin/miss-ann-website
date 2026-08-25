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
  - `GOFUNDME_URL` — null while no campaign exists; `/restore` then shows ways
    to help instead of a donate button. Setting a URL swaps in the button and
    embedded widget. **If set, add the campaign host to `frame-src` in
    [public/_headers](public/_headers)** or the iframe is blocked by CSP.
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
