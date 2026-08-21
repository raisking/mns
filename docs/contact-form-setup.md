# Contact Form Setup — What Was Actually Done

This is a record of how the Contact form → Google Sheets integration was
built and configured for this project, including the real issues hit along
the way and how they were fixed. For the generic step-by-step reference
(written for anyone doing this from scratch), see
[`contact-form-google-sheets.md`](contact-form-google-sheets.md) in this
same folder — this document is the "what we actually did and learned"
companion to that one.

**Status as of August 2026: the form is live and working in production** at
`https://mns-hazel.vercel.app/contact`, submitting real rows to the Google
Sheet. A `.com` domain is still coming — see
[Next step: custom `.com` domain](#next-step-custom-com-domain) at the
bottom for exactly what to change when that happens. Everything below
marked **⚠️ TEMPORARY** was set up against a test Sheet and `localhost` for
local development — it's still true today (see the callout in
[Production rollout](#production-rollout-vercel--cloudflare-worker) below:
production is currently writing to that same test Sheet, not a separate
dedicated one).

---

## Architecture

```text
React Contact Form
        |
        | POST /api/contact
        v
Cloudflare Worker (workers/api/contact.ts)
        |
        +-- Rejects non-POST, validates Origin/Referer, caps body size
        +-- Honeypot check (silent no-op if filled)
        +-- Re-validates every field server-side (independent of React)
        +-- Verifies Cloudflare Turnstile token via siteverify
        |
        v
Google Apps Script (integrations/google-apps-script/contact-form/Code.gs)
        |
        +-- Verifies shared secret (CONTACT_FORM_SECRET)
        +-- Re-validates required fields
        +-- Sanitizes every value against spreadsheet formula injection
        +-- Appends one row with a server-generated timestamp, Status=New
        |
        v
Google Sheet ("Contact Submissions" tab)
```

The browser never talks to Apps Script directly and never sees any secret
— only the Turnstile **site key** (public by design) reaches the browser.

## What was built (code, already committed)

| Piece | File |
|---|---|
| Form component | `src/components/contact/ContactForm.tsx` |
| Turnstile widget wrapper | `src/components/contact/TurnstileWidget.tsx` |
| Subject dropdown (single source of truth) | `src/config/contactSubjects.ts` |
| Validation + spreadsheet sanitizer (shared by React and the Worker) | `src/utils/contactValidation.ts` |
| API client | `src/services/contactService.ts` |
| Cloudflare Worker | `workers/api/contact.ts` |
| Apps Script | `integrations/google-apps-script/contact-form/Code.gs` |
| Tests (55 total) | `src/utils/contactValidation.test.ts`, `workers/api/contact.test.ts`, `src/components/contact/ContactForm.test.tsx` |

The visible form UI (layout, colors, spacing, copy) was left exactly as it
was — only submission behavior was added.

## What was configured (accounts, done together in this session)

### Google Sheet ⚠️ TEMPORARY

- Sheet name: `Marietta Nepali Samaj - Contact Submissions`
- Tab name: `Contact Submissions`
- Spreadsheet ID used for testing: `1FMOkTGta9xrSBCBFeD41r5EpfD5kXEw_vnYNl7gEEgk`

### Apps Script ⚠️ TEMPORARY

- Bound to the test Sheet above, project named "MNS Contact Form".
- Script Properties set: `SHEET_ID`, `SHEET_NAME=Contact Submissions`,
  `CONTACT_FORM_SECRET` (a generated random secret — value lives only in
  `.dev.vars` locally, not in this repo).
- Deployed as a Web App (execute as Me, access Anyone). Current working
  `/exec` URL:

  ```text
  https://script.google.com/macros/s/AKfycbxFQHvccEZDU5fSLgQOTg5DVX8Xh-gWIhLosZy9caDtJrd3Dddg8hk8Yvm1ixV-BSVP/exec
  ```

### Cloudflare Turnstile ⚠️ TEMPORARY (localhost only)

- Widget created, Managed mode, domain allow-list currently includes
  `localhost` (production domain not added yet — do that when the real
  domain exists; see below).
- Site key (safe to keep, it's meant to be public):
  `0x4AAAAAAETeeylbMGI9XEWw`
- Secret key: stored only in `.dev.vars` locally — never committed.

### Local dev environment ⚠️ TEMPORARY (gitignored, not committed)

- `.env` — sets `VITE_TURNSTILE_SITE_KEY` for the frontend.
- `.dev.vars` — sets `GOOGLE_APPS_SCRIPT_URL`, `CONTACT_FORM_SECRET`,
  `TURNSTILE_SECRET_KEY`, and `ALLOWED_ORIGIN=http://localhost:5173` for
  `wrangler dev`.

Both files are excluded by `.gitignore` and were never committed — they
exist only on this machine.

## Verification performed

1. **Apps Script tested directly** with `curl`, bypassing the Worker, to
   confirm the Sheet/Script Properties/deployment were correct in
   isolation. Got `{"success":true}` and a row appeared in the Sheet.
2. **Worker tested directly** against `wrangler dev` with a fake Turnstile
   token — correctly rejected (`400`), proving the Worker really calls
   Cloudflare's live `siteverify` endpoint rather than trusting the client.
3. **Full pipeline tested through the real browser form** (React →
   Vite dev proxy → Worker → real Turnstile widget → Apps Script → Sheet)
   — confirmed `200 OK` and a real row appeared in the Sheet.

## Issues hit during setup, and how they were fixed

Keeping these for future reference — they're easy to hit again if the
Apps Script or local dev setup is ever redone.

**1. Apps Script pasted incorrectly the first time.**
Copying the code out of a chat message accidentally pulled in the file
path text above the code block as literal script content, producing
`ReferenceError: integrations is not defined (line 1, file "Code")`.
Fix: select only the code itself when copying, starting at `/**`.

**2. Editing `Code.gs` doesn't update the live `/exec` URL by itself.**
Saving the script only changes the draft. The deployed Web App keeps
serving whatever was live at its last deployment until you explicitly
create a **new version** of that *same* deployment (Deploy → Manage
deployments → edit → New version). Creating a brand new deployment
instead produces a *different* URL — which is what happened here, so the
working URL ended up different from the first one generated.

**3. `curl` and Apps Script redirects don't mix cleanly.**
Apps Script Web Apps respond to POST with a `302` to a
`script.googleusercontent.com/macros/echo?...` URL that must be fetched
with a plain `GET` to retrieve the actual result. Forcing `curl` to
preserve `POST` through that redirect (`--post302` etc.) breaks it. This
was `curl`-specific test tooling behavior — the real Worker uses the
standard `fetch()` API in `workers/api/contact.ts`, which already follows
this kind of redirect correctly with zero special-casing needed.

**4. The Worker's Origin check was too strict.**
`workers/api/contact.ts` originally rejected any request without an
`Origin` header. Real same-origin `fetch()` requests through the local
Vite dev proxy didn't reliably include one, so legitimate submissions were
rejected with `403`. Fixed by falling back to checking `Referer` when
`Origin` is absent (see `isAllowedOrigin()` in that file) — a request is
now only rejected if it carries *neither* header, or a mismatched one.
This fix is already committed and covered by tests.

**5. Two Vite dev server instances ended up running at once.**
A stale process from earlier in the session was still holding port
`5173`, so a later restart silently fell back to `5174`. The browser tab
was open against `5174`, while `.dev.vars`'s `ALLOWED_ORIGIN` was set to
`5173` — so Origin/Referer never matched, producing `403`s that looked
identical to issue #4 above but had a different root cause. Fixed by
killing both stale processes and starting a single fresh instance,
confirming its actual port before trusting it.

**This one recurred later** (multiple Vite/Wrangler processes had piled up
over a long session), so here's the fast path to diagnose and fix it
without re-deriving the above from scratch:

*Symptom:* form shows "We could not send your message right now" even
though everything's filled in correctly and Turnstile passed. Nothing
about the code changed since it last worked.

*Confirm it's this issue* (not a real bug) — call the Worker directly and
compare the two origins:
```bash
# Should return {"success":false} with HTTP 403 if wrong, since it's
# missing turnstileToken too — the point is just checking the status
# code isn't 403 (Origin rejected) for a *matching* Origin:
curl -s -w '\nHTTP %{http_code}\n' -X POST http://localhost:8787/api/contact \
  -H "Content-Type: application/json" \
  -H "Origin: http://localhost:5173" \
  -d '{"fullName":"t","email":"t@t.com","subject":"General Inquiry","message":"t"}'
```
If that 403s even with the correct origin, or if `http://localhost:5173/`
isn't reachable at all, stale processes are almost certainly the cause.

*Fix — kill everything and start exactly one of each:*
```powershell
# List what's actually running (Windows) — look for duplicate
# `npm run dev` / `wrangler dev` entries:
Get-CimInstance Win32_Process -Filter "Name = 'node.exe'" | Select-Object ProcessId, CommandLine

# Kill every one of them, then start fresh:
Stop-Process -Id <id> -Force   # repeat for each node.exe PID above
```
```bash
npm run dev          # confirm it lands on the port ALLOWED_ORIGIN expects (5173)
npm run worker:dev    # separate terminal/process — reads .dev.vars automatically
```
Then reload the browser tab pointed at whatever port `npm run dev` printed
— not whatever port an old tab happens to still be open to.

---

## Production rollout (Vercel + Cloudflare Worker)

This is the full account of what it took to get the form actually working
on the live internet, after the code was already pushed to GitHub and the
frontend deployed to Vercel. It took far more than a code push — nine
separate issues, each hiding the next one behind it. Keeping the complete
list here because most of these will recur if this ever gets redone (new
Worker, new Vercel project, migrating to a different host, etc.).

**⚠️ Known gap:** production is currently pointed at the same test Apps
Script / Google Sheet described earlier in this doc (`SHEET_ID`
`1FMOkTGta9xrSBCBFeD41r5EpfD5kXEw_vnYNl7gEEgk`) — the "create a separate
dedicated Sheet for production" step was never done. Real inquiries and
every test submission made while debugging this (several, all obviously
labeled as tests) are in the same sheet right now. Worth splitting before
this gets much more real-world traffic — see
[step 1 below](#1-optional-but-recommended-a-real-dedicated-sheet) in the
`.com` section for how.

### Current live configuration (non-secret values, safe to reference)

| What | Value |
|---|---|
| Frontend (Vercel) | `https://mns-hazel.vercel.app` |
| Worker | `https://marietta-nepali-samaj-contact-api.marietta-nepali-samaj.workers.dev` |
| `wrangler.toml` → `ALLOWED_ORIGIN` | `https://mns-hazel.vercel.app` |
| Turnstile site key (public by design) | `0x4AAAAAAETeeylbMGI9XEWw` |
| Turnstile allowed hostnames | includes `mns-hazel.vercel.app` |

`vercel.json` (repo root) ties the frontend build and the API proxy
together:

```json
{
  "framework": "vite",
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "rewrites": [
    { "source": "/api/:path*", "destination": "https://marietta-nepali-samaj-contact-api.marietta-nepali-samaj.workers.dev/api/:path*" },
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

### Issue 1 — Vercel build failed: wrong output directory

Vercel's default assumed a `build/` output folder (a Create React App
convention). Vite actually outputs to `dist/`. Error was literal: `No
Output Directory named "build" found`. Fixed by adding `vercel.json` with
`"outputDirectory": "dist"` (shown above).

### Issue 2 — the Worker had never been deployed to production

`npx wrangler whoami` returned "not authenticated" — this Worker had only
ever run locally via `wrangler dev`. Fixed by: `npx wrangler login`
(OAuth device-code flow, opens a browser tab to authorize), then `npm run
worker:deploy`, which prompted to register a one-time `*.workers.dev`
account subdomain (separate from the Worker's own `name` in
`wrangler.toml` — the final URL is
`<worker-name>.<account-subdomain>.workers.dev`).

### Issue 3 — nothing told Vercel to route `/api/contact` anywhere

`contactService.ts` calls `fetch('/api/contact', ...)` — a same-origin
relative path. That's correct for local dev (Vite's dev proxy handles it),
but in production the frontend (Vercel) and the Worker (`*.workers.dev`)
are two entirely separate domains. Without a rewrite, that fetch just
404s against Vercel's own (nonexistent) route. Fixed by the first
`rewrites` entry in `vercel.json` above, once the Worker's real URL was
known (verified directly with `curl` before trusting it — a GET returned
`405`, matching the Worker's own method-not-allowed logic exactly).

### Issue 4 — `ALLOWED_ORIGIN` still pointed at the unattached custom domain

`wrangler.toml` had `ALLOWED_ORIGIN = "https://mariettanepalisamaj.org"` —
correct for the eventual future, but nothing was serving from that domain
yet, so the Worker's own Origin check (`isAllowedOrigin()`) rejected every
real request from the actual live site with a `403`. Fixed by pointing it
at the real live URL, `https://mns-hazel.vercel.app`, with a code comment
flagging that this needs to change again once the `.com` domain is
attached (see the bottom of this doc).

### Issue 5 — every direct page load 404'd (not just the API)

After issues 1–4 were fixed, the whole site still appeared broken —
`GET /contact` returned a bare `404` before any JS, Turnstile, or API call
ever fired (confirmed with a headless browser: zero follow-up network
requests at all). Root cause: adding a custom `rewrites` array to
`vercel.json` **overrides** the automatic single-page-app fallback that
Vercel's Vite framework preset normally provides for free. React Router
does client-side routing — a direct hit on `/contact` needs Vercel to
serve `index.html` and let the router take over. Fixed by adding the
second `rewrites` entry above (`"/(.*)" → "/index.html"`), ordered *after*
the `/api/*` rule so API requests still match first (Vercel evaluates
`rewrites` in order and stops at the first match; static assets that
exist in `dist/` are still served by the filesystem check before any
rewrite is even considered, so this doesn't touch JS/CSS/image loading).

### Issue 6 — `VITE_TURNSTILE_SITE_KEY` existed in Vercel but was blank

Vite bakes `VITE_*` env vars in at **build time** — setting one in the
Vercel dashboard does nothing until the next build. Checked with `vercel
env pull` and found the variable already existed but held an empty
string, so the Turnstile widget's own render guard
(`{TURNSTILE_SITE_KEY && (...)}` in `ContactForm.tsx`) silently rendered
nothing. Worse, the same guard also skips the *frontend's* required-token
check, so the form could still be submitted — it just failed later, at
the Worker's server-side Turnstile verification, with no visible reason
why. Fixed by setting the real value via `vercel env add
VITE_TURNSTILE_SITE_KEY production` and triggering a fresh `vercel deploy
--prod` (the env var alone doesn't help an already-built deployment).

**Also found:** this Vercel project has several other env vars that
nothing in this codebase uses at all — `STRIPE_SECRET_KEY`,
`STRIPE_WEBHOOK_SECRET`, `CLOUDFLARE_ACCOUNT_ID`, `R2_BUCKET_NAME`,
`R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_PUBLIC_URL`,
`DATABASE_URL`, `VITE_APP_NAME`, `VITE_API_BASE_URL` — apparent leftover
scaffolding from something unrelated. Harmless (unused), but worth
deleting from the Vercel dashboard for hygiene whenever convenient.

### Issue 7 — Turnstile widget rejected the domain (error 110200)

Once the site key was correct, Turnstile failed with its own error
overlay: *"Unable to connect to website," Error Code 110200.* That code
specifically means the current hostname isn't on the widget's allowed-
hostname list — same shape of mistake as issue 4, just in a third place
(the Turnstile dashboard, not `wrangler.toml`). Fixed in the **Cloudflare
Turnstile dashboard**: widget → Hostname Management → add
`mns-hazel.vercel.app`. Not retryable client-side; takes effect
immediately once saved, no redeploy needed.

### Issue 8 — three Worker secrets, three different naming mistakes

`wrangler secret put <NAME>` only ever accepts the secret's **name** as
its argument — the value must be typed at the interactive prompt that
follows, never appended to the command. Running it as `wrangler secret put
NAME=value` (one string) doesn't error — it just creates a secret whose
**name** is the literal text `NAME=value`, leaving nothing actually bound
to `NAME`. This happened three separate times here and produced three
different failure modes, all diagnosed the same way: `npx wrangler secret
list` (prints names only, never values) —

- **`TURNSTILE_SECRET_KEY`** — two garbage-named secrets existed
  (`"0x4AAAAAAETeeylbMGI9XEWw"` and
  `"TURNSTILE_SECRET_KEY=0x4AAAAAAETee..."`), no secret literally named
  `TURNSTILE_SECRET_KEY`. At runtime this made `env.TURNSTILE_SECRET_KEY`
  `undefined`, which got sent to Cloudflare's `siteverify` as the literal
  string `"undefined"` — rejected with HTTP `400`,
  `error-codes: ["invalid-input-secret"]`.
- **`GOOGLE_APPS_SCRIPT_URL`** and **`CONTACT_FORM_SECRET`** — didn't
  exist under *any* name; never successfully set at all. Worker's `fetch()`
  to `env.GOOGLE_APPS_SCRIPT_URL` threw `Invalid URL: ` (empty string).
- **Fix, all three:** `npx wrangler secret put <EXACT_NAME>`, wait for the
  separate value prompt, paste only the value there, confirm it visibly
  appears before pressing Enter (one attempt silently stored an empty
  value because the paste didn't register).

### Issue 9 — `CONTACT_FORM_SECRET` mismatch between Worker and Apps Script

Once all three secrets existed under correct names, Turnstile passed
cleanly and the request reached Apps Script — which then rejected it with
its own `{"success":false,"error":"Unauthorized."}`. The Worker's
`CONTACT_FORM_SECRET` didn't match the value in the Apps Script's Script
Properties. This traces back to an earlier incident in this project: this
exact secret was once accidentally pasted into a chat session while
attempting the invalid `NAME=value` syntax, and rotating it had been
recommended at the time but not yet done — the two sides had simply
drifted apart since. Fixed by generating a fresh value
(`python -c "import secrets; print(secrets.token_urlsafe(32))"`) and
setting it **identically in both places**: the Apps Script's Script
Properties (⚙ Project Settings → Script Properties →
`CONTACT_FORM_SECRET`) and `wrangler secret put CONTACT_FORM_SECRET` on
the Worker.

### Diagnostic technique that actually cracked this

Guessing from symptoms alone didn't work — issues 6 through 9 all
produced the identical generic "We could not send your message right
now" on-screen, with completely different causes. What worked:

1. **`npx wrangler tail marietta-nepali-samaj-contact-api --format
   pretty`** — watches real production requests as they happen, live.
   Essential; nothing above was found by guessing.
2. `verifyTurnstile()` and `forwardToAppsScript()` in
   `workers/api/contact.ts` originally swallowed every failure silently
   (`return false` with no log). Temporarily added `console.error(...)`
   at each branch — the failing HTTP status, the provider's own
   `error-codes`/`error` text, never secret material or message content
   — redeployed, watched the tail for the next real submission, repeated
   as each layer got fixed and the next one surfaced.
3. A one-off `/api/debug-turnstile-secret` GET endpoint tested whether
   `TURNSTILE_SECRET_KEY` was valid in isolation (a deliberately bogus
   response token still tells you, via Cloudflare's error code, whether
   the *secret* itself is accepted) — useful for confirming a fix without
   needing a real browser to solve the widget each time. Removed after
   use; not something that should stay live in production.
4. Once root-caused, the verbose per-attempt logging was trimmed back to
   permanent, low-noise versions of the two most useful signals (Turnstile
   `error-codes`, Apps Script's own rejection reason) — see the code
   comments in `workers/api/contact.ts` for exactly what's still logged
   and why it's considered safe to keep.

### Final verification

Confirmed via the live tail showing a real `200`, and directly in the
Google Sheet — a new row from an actual submission on
`https://mns-hazel.vercel.app/contact`, not just an absence of errors.

---

## Next step: custom `.com` domain

Do this when the real domain is ready to attach.

### 1. (Optional but recommended) a real dedicated Sheet

Production has been running against the test Sheet from local dev — see
the callout at the top of [Production rollout](#production-rollout-vercel--cloudflare-worker).
To split them:

- **Simplest option:** keep the existing Apps Script deployment and just
  update its `SHEET_ID` Script Property to a new Sheet's ID
  (Apps Script → ⚙ Project Settings → Script Properties). The script opens
  whichever Sheet ID is configured there — it isn't hard-locked to the
  Sheet it was originally created from. No redeploy needed (Script
  Properties take effect immediately).
- **Cleaner-separation option:** create a fresh Apps Script project bound
  to the new Sheet, repeat the Script Properties + deployment steps in
  [`contact-form-google-sheets.md`](contact-form-google-sheets.md), and
  update the Worker's `GOOGLE_APPS_SCRIPT_URL` secret to the new `/exec`
  URL (`wrangler secret put GOOGLE_APPS_SCRIPT_URL`).

### 2. Attach the domain

- **Vercel:** add the domain in Project Settings → Domains, and follow its
  DNS instructions.
- **Turnstile:** add the new domain to the widget's allowed-hostnames list
  (Turnstile dashboard → your widget → Settings) — keep
  `mns-hazel.vercel.app` there too unless you're retiring it, per
  [issue 7](#issue-7--turnstile-widget-rejected-the-domain-error-110200)
  above.
- **`wrangler.toml`:** update `ALLOWED_ORIGIN` under `[vars]` to
  `https://<realdomain>.com` — see
  [issue 4](#issue-4--allowed_origin-still-pointed-at-the-unattached-custom-domain)
  for why this matters, then `npm run worker:deploy`. Optionally uncomment
  and fill in the `[[routes]]` block if routing the Worker directly on the
  domain's own Cloudflare zone instead of proxying through Vercel's
  `rewrites` (the current `vercel.json` proxy approach works fine either
  way and needs no change for the domain switch alone).
- **Frontend:** `VITE_TURNSTILE_SITE_KEY` in Vercel only needs to change
  if you created a **separate** production Turnstile widget instead of
  reusing the current one.

### 3. Verify again

Same as [Verification performed](#verification-performed) above, but
against the new domain: submit the live form, confirm the Worker call
succeeds, and confirm exactly one new row lands in the Sheet. Don't
consider it "done" until that row has actually appeared — see
[Issue 5](#issue-5--every-direct-page-load-404d-not-just-the-api) as a
reminder that "the homepage loads" isn't the same as "every route and the
form actually work."
