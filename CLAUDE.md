# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Always Do First

**Invoke the `Frontend-design` skill** before writing code, every session, no exceptions.

## Design Rule

Do not make the contents, buttons, or overall design generic. Avoid template-default look and feel (generic card grids, stock CTA copy like "Learn More"/"Submit", boilerplate section layouts) — every page should reflect a deliberate, specific design choice for this org, not an AI-default pattern.

## Commands

```bash
npm run dev              # Vite dev server (default :5173 — see Windows note below)
npm run build            # tsc -b && vite build — must pass both to ship
npm run lint             # oxlint (.oxlintrc.json) — not eslint
npm test                 # vitest run (single pass)
npm run test:watch       # vitest watch mode
npx vitest run path/to/Thing.test.tsx   # run a single test file
npx vitest run -t "test name"           # run tests matching a name
npm run typecheck:worker # tsc -p workers/tsconfig.json --noEmit — Worker has its own tsconfig, excluded from tsconfig.app.json
npm run worker:dev       # wrangler dev — run the Cloudflare Worker locally (default :8787)
npm run worker:deploy    # wrangler deploy — deploys the Worker independently of the Vercel frontend build
```

There is no `tests/` directory — test files are co-located (`Thing.test.ts(x)` next to `Thing.ts(x)`).

To exercise the Contact form locally end-to-end, run `npm run worker:dev` alongside `npm run dev` — `vite.config.ts` proxies `/api/*` to `localhost:8787`. On Windows, check nothing is already listening on 5173 before starting a new session; a stale process silently shifting Vite to 5174 will fail the Worker's Origin check against `.dev.vars`'s `ALLOWED_ORIGIN`.

## Architecture

This is a **client-rendered SPA** (Vite + React 19 + TypeScript + React Router v7, no SSR/prerendering) with a **separate Cloudflare Worker backend**, deployed independently:

- **Frontend** → Vercel, built from `dist/` (`vercel.json` overrides Vercel's zero-config output dir and restores the SPA fallback to `index.html` — without that third rewrite rule, every client-side route 404s on direct load).
- **Backend** → one Cloudflare Worker (`workers/api/contact.ts`), deployed separately via `wrangler deploy`, not part of the Vercel build. `vercel.json` proxies `/api/*` to the Worker's `*.workers.dev` URL in production; `vite.config.ts` proxies the same path to `localhost:8787` in dev.
- Current production origin is `https://mns-hazel.vercel.app` — the custom domain `mariettanepalisamaj.org` is not yet attached (see `wrangler.toml`'s own comment). This origin string is duplicated in three places that must be updated together the day the domain switches: `wrangler.toml`'s `ALLOWED_ORIGIN`, `src/hooks/usePageMeta.ts`'s `SITE_URL`, and `index.html`'s static canonical/OG URLs.

**Contact form data flow** (the only real backend integration, spans 4+ files): `src/components/contact/ContactForm.tsx` → `src/services/contactService.ts` (`POST /api/contact`) → `workers/api/contact.ts` (independent server-side validation + Cloudflare Turnstile verification) → Google Apps Script (`integrations/google-apps-script/contact-form/Code.gs`, shared-secret check + spreadsheet-injection sanitization) → Google Sheet. React never talks to Apps Script directly and never sees a secret. `src/utils/contactValidation.ts` and `src/config/contactSubjects.ts` are imported by **both** the frontend and the Worker, so validation rules and the subject dropdown list exist in exactly one place each — update there, not in both.

**Per-route SEO metadata**: since there's no SSR, `index.html`'s static `<title>`/`<meta>` tags are identical on every route until JS runs. `src/hooks/usePageMeta.ts` is a hand-rolled DOM-mutation hook (not React 19's native title/meta hoisting) that every page calls once on mount to set title/description/canonical/OG/Twitter tags — this guarantees exactly one copy of each tag exists, never a duplicate alongside `index.html`'s fallback copies. All routes wire this in, including dynamic detail pages and `noindex`-flagged transactional pages.

**Design tokens**: Tailwind v4 is CSS-first — there is no `tailwind.config.*`; colors/fonts are declared in the `@theme` block in `src/index.css` (`saffron`, `indigo`, `marigold`, `ink`, `paper`, `himal` — each tied to a specific piece of Nepali material culture, not arbitrary). `verbatimModuleSyntax` is on, so type-only imports must use `import type { Foo }` or the build fails.

**Page/route structure**: `src/App.tsx` is the single route table, all nested under `Layout` (Header + `<Outlet>` + Footer). `src/pages/<Name>/index.tsx` is the page; several route families (Leadership, Nepali School) have sibling sub-pages sharing a quick-nav pill row rather than one page trying to hold everything. `src/data/mockData.ts` holds page content — much of it is explicitly-flagged placeholder/invented content pending real data from the org, so check a given export's surrounding comment before treating it as real.

For full detail beyond this file — the complete design-token rationale, every component's conventions and past bug history, the full route list, and the Contact form's production setup/incident history — see [`docs/SKILL.md`](docs/SKILL.md) (gitignored, local reference only; it documents itself as the place to keep current when this architecture changes).
