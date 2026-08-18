---
name: marietta-nepali-samaj-website
description: Full reference for the Marietta Nepali Samaj website — stack, structure, design system, and conventions. Read this before making changes so new work matches what's already here instead of drifting from it.
---

# Marietta Nepali Samaj — Website Reference

A nonprofit community org site for the Nepali diaspora in Marietta,
Georgia: cultural events, a weekly Nepali School, a photo gallery,
leadership pages, and donations. This file is the single place that
should stay current as the site evolves — see
[Keeping this file current](#keeping-this-file-current) at the bottom.

## Stack

- **React 19** + **TypeScript** (strict — `noUnusedLocals`,
  `noUnusedParameters`, `verbatimModuleSyntax` all on. Type-only imports
  must use `import type`.)
- **Vite 8** (`@vitejs/plugin-react`), **Tailwind CSS v4** (CSS-first
  config via `@theme` in `src/index.css` — there is no `tailwind.config.*`)
- **React Router v7** (`BrowserRouter`, routes in `src/App.tsx`)
- **Vitest** + **Testing Library** for tests
- **Cloudflare Workers** (`wrangler`) for the one backend endpoint that
  exists so far (`/api/contact`)
- **oxlint** for linting (`.oxlintrc.json`)

Scripts (`package.json`): `dev`, `build` (`tsc -b && vite build`), `lint`,
`test` / `test:watch`, `typecheck:worker`, `worker:dev` / `worker:deploy`.

## Repository structure

```text
src/
  assets/            Images — logos, banners, event/festival photos
  components/
    common/          Shared UI: Button, SectionHeader, PageHero, Emblem-
                      style bits, EmptyState, LoadingSpinner, ShoutoutModal
    contact/         ContactForm, TurnstileWidget (+ tests)
    events/          EventCard
    gallery/         AlbumCard
    layout/          Header, Footer, Layout, ScrollToTop
    leadership/      LeadershipCard
    posts/           PostCard (Facebook-style community post cards)
  config/            organization.ts (org info, social links, donation
                      categories), contactSubjects.ts (Contact form
                      dropdown — single source of truth, also imported by
                      the Worker)
  data/              mockData.ts — placeholder content (see below)
  pages/             One folder per route, index.tsx is the page
  services/          contactService.ts — POST /api/contact client
  types/             Shared TS interfaces, one file per domain concept
  utils/             contactValidation.ts — validation + spreadsheet-
                      sanitization, shared by the React app AND the Worker
  test/              setup.ts — Testing Library cleanup registration
  index.css          Design tokens (@theme), base layer, signature CSS
  App.tsx            Route table
  main.tsx           Entry point

workers/
  api/contact.ts     Cloudflare Worker: validates, verifies Turnstile,
                      forwards to Apps Script. Own tsconfig.json (no DOM
                      lib, @cloudflare/workers-types instead).

integrations/
  google-apps-script/contact-form/Code.gs   Apps Script that writes to
                      the Google Sheet. Not part of the npm build — copy/
                      pasted manually into the Apps Script editor.

docs/                This file, plus contact-form-google-sheets.md
                      (generic setup reference) and contact-form-setup.md
                      (record of the actual setup + issues hit)

wrangler.toml        Worker config. Secrets are NOT here — see
                      docs/contact-form-google-sheets.md.
vitest.config.ts      Test runner config (separate from vite.config.ts)
```

No `tests/` or `__tests__/` directory — test files are co-located
(`Thing.test.ts(x)` next to `Thing.ts(x)`).

## Design system

Every design choice traces back to Nepali material culture on purpose —
not generic template defaults. See the color/type rationale comments
directly in `src/index.css`.

**Color tokens** (`@theme` in `src/index.css`, so they're plain Tailwind
utilities — `bg-crimson`, `text-ink-soft`, etc.):

| Token | Hex | Meaning | Use |
|---|---|---|---|
| `crimson` / `crimson-dark` | `#c8102e` / `#970e23` | Nepal flag's field | Accent color: headings, section markers, secondary buttons |
| `indigo` / `indigo-dark` | `#003893` / `#00265f` | Nepal flag's border | **Primary action color** (buttons) — red reads as "danger" for CTAs, so indigo carries Donate/Submit/Contact |
| `marigold` / `marigold-light` | `#e7a33e` / `#f2c374` | Tika/garland gold | Accent only on dark surfaces — fails contrast as text on light backgrounds, verified via WCAG math when introduced |
| `ink` / `ink-soft` | `#241712` / `#5c4a3d` | — | Body text (replaces generic `gray-900`/`gray-600`) |
| `paper` / `paper-deep` | `#fbf6ec` / `#f1e4c9` | Lokta paper | Backgrounds (replaces generic `white`/`gray-50`) |

Older pages still have some literal `gray-*`/`red-*` Tailwind classes from
before this palette existed — not wrong, just not using the named tokens.
Prefer the tokens above for anything new.

**Type**: `font-display` = Baloo 2 (headings — applied automatically to
every `h1`–`h4` via the base layer, don't add the class by hand),
`font-body` = IBM Plex Sans Devanagari (default body text), `font-nav` =
Mona Sans (header nav only, applied at the `<nav>`/mobile-menu container
level so it inherits down). All three support Devanagari, since the site
mixes Nepali script into English copy (e.g. Posts, bilingual eyebrows).

**Signature elements** (the site's deliberate "this is ownable, not
templated" details — reuse these instead of inventing new ones):
- `.pennant-edge` — clip-path notch echoing Nepal's flag silhouette (the
  world's only non-rectangular national flag). Used once, on the Home
  hero's bottom edge.
- Two-tone crimson/indigo rule — `SectionHeader`'s underline, and the top
  accent bar in dropdown menus and `ShoutoutModal`.
- `.dhaka-strip` — repeating-gradient strip referencing Dhaka topi weave.
- Bilingual "Nepali · English" eyebrow labels (`SectionHeader`'s
  `eyebrow` prop, or hand-written where `SectionHeader` isn't used) —
  short, well-established words/phrases only, not composed sentences
  (translation-accuracy risk).
- `.card-lift` — crimson-tinted hover shadow instead of generic gray, for
  card components.

**Component conventions**:
- `Button` (`src/components/common/Button.tsx`): variants `primary`
  (indigo — the default action color), `secondary` (crimson), `accent`
  (marigold, for celebratory contexts like the Donate CTA), `outline`,
  `ghost`. Renders `<Link>` if `to` is set, `<a>` if `href` is set,
  otherwise `<button>` — `onClick` is forwarded in all three cases.
- `SectionHeader`: `eyebrow`/`title`/`subtitle`/`centered`/`light` props —
  use `light` on dark-background sections so the eyebrow renders in
  marigold instead of crimson (contrast-driven, not arbitrary).
- `PageHero`: shared hero banner for inner pages (`eyebrow`/`title`/
  `subtitle`/optional `image`), ink background with a crimson radial
  glow. Used by About/Objectives/Leadership/School/Events/Gallery/Contact
  — EventDetail and AlbumDetail have bespoke hero markup instead (they
  need back-links/dynamic photo content `PageHero` doesn't support).

## Routes (`src/App.tsx`)

`/`, `/about`, `/objectives`, `/leadership` (+ `/leadership/president`,
`/leadership/past-presidents`), `/nepali-school` (+ `/nepali-school/about`,
`/nepali-school/team`), `/events` (+ `/events/:slug`), `/gallery` (+
`/gallery/:slug`), `/donate`, `/contact`, `/donation-success`,
`/donation-cancelled`, `*` → NotFound. All nested under `Layout` (Header +
`<Outlet>` + Footer). `ScrollToTop` resets scroll position on route change
— see its file for why that's needed (React Router doesn't do this on its
own).

**Sub-page pattern** (Leadership, now Nepali School too): the index route
keeps its own distinct content and a quick-nav pill row (current page as
a plain `bg-ink` span, siblings as `bg-white border-gray-200` links,
`hover:border-crimson hover:text-crimson`) linking to sibling pages that
each own one slice of content — never duplicate a section across two of
these pages. The corresponding Header dropdown lists all of them,
including the index page itself as one of the children (see
`navItems` in `Header.tsx`).

## Data model

**Everything in `src/data/mockData.ts` is placeholder content** —
events, albums, leadership bios, objectives, gallery photos, Facebook
posts, monthly shoutouts, school staff. Several images are still generic
Unsplash stock photos (commented `// Unsplash placeholder images` in that
file) rather than real photos of this community. When real content/photos
become available, replace the relevant exports there; the components
consuming them don't need to change.

`LeadershipCard` isn't just for org leadership — `SchoolStaffMember`
(`src/types/SchoolStaff.ts`) is a superset of `LeadershipMember`'s shape
(`id`/`name`/`position`/`photo`/`bio`, plus a `category` field), so the
same card renders the School page's Principal/Teachers/Volunteers too
(`schoolStaff` in mockData, filtered by `category` in
`src/pages/School/index.tsx`). Reach for this pattern before building a
new card for "a person with a photo and title" — check whether
`LeadershipMember`'s shape already covers it first.

Org-level config lives in `src/config/organization.ts` (name, tagline,
contact info, social links, donation categories) — update values there
rather than hardcoding them in pages.

## Backend: the Contact form

The only real backend integration on the site. Full detail in
[`contact-form-google-sheets.md`](contact-form-google-sheets.md) (generic
setup reference) and [`contact-form-setup.md`](contact-form-setup.md)
(what was actually configured for this project, issues hit, and the
checklist for switching to the production Sheet/domain — **read that one
before touching Contact form config**, current values there are marked
temporary/test).

Architecture: `ContactForm.tsx` → `contactService.ts` → `POST /api/contact`
→ `workers/api/contact.ts` (independent server-side validation +
Turnstile verification) → `Code.gs` (Apps Script, shared-secret check +
spreadsheet-injection sanitization) → Google Sheet. React never talks to
Apps Script directly and never sees a secret. `contactValidation.ts` and
`contactSubjects.ts` are imported by both the frontend and the Worker, so
validation rules and the subject list only exist in one place each.

Secrets: `.env` (frontend, `VITE_TURNSTILE_SITE_KEY` only) and `.dev.vars`
(Worker local dev — `GOOGLE_APPS_SCRIPT_URL`, `CONTACT_FORM_SECRET`,
`TURNSTILE_SECRET_KEY`, `ALLOWED_ORIGIN`) are both gitignored and never
committed. Production secrets are pushed via `wrangler secret put`.

## Testing

`npm test` runs Vitest once; `npm run test:watch` for watch mode. Tests
are co-located next to the code they cover. `describe`/`it`/`expect`/`vi`
are imported explicitly from `'vitest'` per file — **`globals` is
deliberately off** in `vitest.config.ts` so `tsc -b` (the main app build)
never needs ambient test-framework types. Testing Library's auto-cleanup
also doesn't self-register without Vitest's `globals` on, so
`src/test/setup.ts` registers `cleanup()` in an `afterEach` by hand —
don't remove that or component tests will bleed state into each other.

The Worker has its own `workers/tsconfig.json` (no DOM lib,
`@cloudflare/workers-types` instead) and its own typecheck command
(`npm run typecheck:worker`) since it's outside `tsconfig.app.json`'s
`include: ["src"]`.

## Conventions worth knowing before editing

- **Tailwind v4 is CSS-first** — new design tokens go in the `@theme`
  block in `src/index.css`, not a config file.
- **`verbatimModuleSyntax`** — always `import type { Foo }` for type-only
  imports, or the build fails.
- **Local dev proxy**: `vite.config.ts` proxies `/api/*` to
  `http://localhost:8787` so the Contact form works locally against
  `wrangler dev` with zero CORS setup, matching same-origin production
  behavior.
- **Git**: this repo had no version control until a redesign checkpoint
  partway through the project's history — history before that point
  doesn't exist.
- **Windows dev environment** — when starting `npm run dev` in a new
  session, check nothing is already listening on 5173 first (a stale
  background process from an earlier session can silently shift Vite to
  5174, which then breaks the Worker's Origin/Referer check against
  `.dev.vars`'s `ALLOWED_ORIGIN`). Real incident, documented in
  `contact-form-setup.md`.

## Keeping this file current

This file is meant to track the site as it changes, not just describe it
once. **After any change that affects something documented above** — new
page/route, new design token, new shared component, new backend
integration, new env var/secret, changed conventions — update the
relevant section here in the same session as the change, the same way
you'd update a test.

A hook is configured (see `.claude/settings.json`) that reminds you to do
this after edits under `src/`, `workers/`, `integrations/`, or
`wrangler.toml` — it can't write the update for you (that needs actual
judgment about what's worth documenting), but it makes sure the reminder
doesn't get missed.
