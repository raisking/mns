# Contact Form Setup — What Was Actually Done

This is a record of how the Contact form → Google Sheets integration was
built and configured for this project, including the real issues hit along
the way and how they were fixed. For the generic step-by-step reference
(written for anyone doing this from scratch), see
[`contact-form-google-sheets.md`](contact-form-google-sheets.md) in this
same folder — this document is the "what we actually did and learned"
companion to that one.

**You told me you're creating a separate, dedicated Google Sheet for this
site and getting a `.com` domain.** Everything below marked
**⚠️ TEMPORARY** was set up against a test Sheet and `localhost` for local
development/verification — see [Switching to production](#switching-to-production)
at the bottom for exactly what to change and where.

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

---

## Switching to production

### 1. New Google Sheet

Once your dedicated Sheet exists (name it `Marietta Nepali Samaj - Contact
Submissions`, tab `Contact Submissions`, per the setup guide):

- **Simplest option:** keep the existing Apps Script deployment and just
  update its `SHEET_ID` Script Property to the new Sheet's ID
  (Apps Script → ⚙ Project Settings → Script Properties). The script opens
  whichever Sheet ID is configured there — it isn't hard-locked to the
  Sheet it was originally created from. No redeploy needed for this change
  alone (Script Properties take effect immediately).
- **Cleaner-separation option:** create a fresh Apps Script project bound
  to the new Sheet (Extensions → Apps Script from within it), repeat the
  Script Properties + deployment steps in
  [`contact-form-google-sheets.md`](contact-form-google-sheets.md), and
  update the Worker's `GOOGLE_APPS_SCRIPT_URL` secret to the new `/exec`
  URL.

Either way, generate a **new** `CONTACT_FORM_SECRET` for production rather
than reusing the test one above — set it in the new Script Properties and
as the Worker's production secret (step 3 below) with the same value in
both places.

### 2. Real `.com` domain

- **Turnstile:** add the real domain to the existing widget's domain
  allow-list (Turnstile dashboard → your widget → Settings), or create a
  separate production widget if you'd rather keep test/prod fully split.
- **`wrangler.toml`:** update `ALLOWED_ORIGIN` under `[vars]` to
  `https://<realdomain>.com`, and uncomment + fill in the `[[routes]]`
  block once the domain is attached to a Cloudflare zone.
- **Frontend:** set `VITE_TURNSTILE_SITE_KEY` in whatever environment
  config your production hosting uses (not `.env`, which is local-only and
  gitignored) — use the **production** Turnstile widget's site key if you
  created a separate one.

### 3. Cloudflare Worker secrets (production)

```bash
wrangler secret put GOOGLE_APPS_SCRIPT_URL     # production /exec URL
wrangler secret put CONTACT_FORM_SECRET         # new production secret
wrangler secret put TURNSTILE_SECRET_KEY        # production widget's secret key
```

Then:

```bash
npm run worker:deploy
```

### 4. Verify again

Same as the [Verification performed](#verification-performed) section
above, but against production: submit the live form on the real domain,
confirm the Worker call succeeds, and confirm exactly one new row lands in
the real Sheet. Don't consider production "done" until that row has
actually appeared.
