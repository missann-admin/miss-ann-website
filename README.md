# Miss Ann — Restoration Website

Website for the restoration of **Miss Ann**, a 127-foot 1926 fantail motor
yacht listed on the National Register of Historic Places (#98001310), docked at
Evans Island, Monroe Bay, Colonial Beach, Virginia.

Built with React 18 + Vite + TypeScript, Tailwind CSS, and React Router.
Contact-form and email-signup submissions go to Supabase. Hosted on Cloudflare
Pages.

## Development

```
npm install
npm run dev       # dev server at http://localhost:5173
npm run build     # type-check + production build to dist/
npm run preview   # serve the production build locally
```

## Configuration

- `src/config.ts` — `GOFUNDME_URL` (null until the campaign launches) and
  `YOUTUBE_VIDEOS` (add videos without touching components).
- `.env.local` (gitignored — copy from `.env.example`):
  `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`. Mirror both in Cloudflare
  Pages → Settings → Environment variables.

## Photos

Drop photos into `public/images/` using the filenames in
[public/images/README.md](public/images/README.md). Placeholder blocks are
shown until each file exists — no code changes needed.

## Live site

https://miss-ann.missannadmin.workers.dev (custom domain `missann.us` pending DNS propagation)

## Deployment

Cloudflare Workers (static assets), project `miss-ann`, connected to this
GitHub repository. Build command `npm run build`, deploy command
`npx wrangler deploy`. [wrangler.jsonc](wrangler.jsonc) serves `dist/` with
SPA fallback for deep links.
