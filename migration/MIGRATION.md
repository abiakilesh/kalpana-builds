# Migration: TanStack Start → Vite + React Router SPA

This pack converts the project to a static SPA you can deploy to Hostinger / Cloudflare Pages / Netlify.

## Steps (one-way — do this in your GitHub clone, not in Lovable)

1. In Lovable: top-right **GitHub → Connect to GitHub**, push the repo.
2. On your machine:
   ```bash
   git clone <your-repo-url>
   cd <repo>
   bash migration/apply.sh
   npm install
   npm run build
   ```
3. Upload everything inside `dist/` to your Hostinger `public_html/`.

The script:
- Removes TanStack Start, Cloudflare Worker, Wrangler, `@lovable.dev/vite-tanstack-config`
- Adds `react-router-dom`
- Replaces `vite.config.ts`, creates `index.html`, `src/main.tsx`, `src/App.tsx`
- Rewrites every route file (strips `createFileRoute` wrapper, converts `head()` → `document.title`)
- Patches `Header.tsx`, `Footer.tsx`, `CTAButton.tsx` to use `react-router-dom`
- Deletes `wrangler.jsonc`, `src/router.tsx`, `src/routeTree.gen.ts`, `src/routes/__root.tsx`, server-only files
- Adds `public/_redirects` (Netlify/Cloudflare Pages) and `public/.htaccess` (Hostinger/Apache) for SPA fallback

## What keeps working

- All UI, components, Tailwind styles, assets
- Supabase calls (browser fetch — no server needed)
- Lead popup (`LeadPopup.tsx`) and contact form
- Admin login + dashboard (Supabase Auth client-side)
- WhatsApp / phone CTAs
- Google Form embeds / popups (pure client iframes)

## Environment

Hostinger doesn't run `npm`. Build locally; only `dist/*` ships. If you ever need to change the Supabase URL/key, edit `.env` locally and rebuild.

`.env` keeps the same `VITE_SUPABASE_*` vars — they're inlined at build time.

## After upload, test

- `https://yourdomain.com/` → home loads
- `https://yourdomain.com/pricing` → refresh works (proves `.htaccess` is active)
- Submit lead popup → row appears in Supabase `leads` table
