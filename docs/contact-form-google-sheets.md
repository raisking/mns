# Contact Form → Google Sheets Integration

How a submission on the Contact page ends up as one row in a Google Sheet.

```text
React Contact Form
        |
        | POST /api/contact
        v
Cloudflare Worker
        |
        +-- Server-side validation (independent of the browser)
        +-- Spam protection (honeypot)
        +-- Cloudflare Turnstile verification
        |
        v
Google Apps Script
        |
        +-- Verify shared secret
        +-- Validate data
        +-- Sanitize spreadsheet values
        |
        v
Google Sheet
```

The browser never talks to Google Apps Script and never sees any secret —
only the Cloudflare Turnstile **site key** (public by design) is
browser-visible. Everything else lives in Worker secrets and Apps Script
Script Properties.

---

## 1. Create the Google Sheet

1. Create a new Google Sheet named exactly:

   ```text
   Marietta Nepali Samaj - Contact Submissions
   ```

2. Rename the first tab to exactly:

   ```text
   Contact Submissions
   ```

3. Leave row 1 empty — `Code.gs` writes the header row itself the first
   time it runs (`Submitted At`, `Full Name`, `Email Address`,
   `Phone Number`, `Subject`, `Message`, `Source Page`, `Status`).

4. Copy the **Spreadsheet ID** out of the sheet's URL — the long string
   between `/d/` and `/edit`:

   ```text
   https://docs.google.com/spreadsheets/d/<THIS_IS_THE_SHEET_ID>/edit
   ```

## 2. Add the Apps Script

1. In the Sheet, open **Extensions → Apps Script**.
2. Delete the default `Code.gs` boilerplate and paste in the contents of
   [`integrations/google-apps-script/contact-form/Code.gs`](../integrations/google-apps-script/contact-form/Code.gs)
   from this repo.
3. Save the project (give it a name, e.g. "MNS Contact Form").

## 3. Configure Script Properties

Still in the Apps Script editor: **Project Settings** (gear icon) →
**Script Properties** → **Add script property**. Add all three:

| Property | Value |
|---|---|
| `SHEET_ID` | The Spreadsheet ID from step 1.4 |
| `SHEET_NAME` | `Contact Submissions` |
| `CONTACT_FORM_SECRET` | A long random string — generate one with e.g. `openssl rand -hex 32`. This exact value must also be set as the Worker's `CONTACT_FORM_SECRET` secret (step 6 below). |

Do not hardcode any of these inside `Code.gs` itself — the script reads
them from Script Properties at request time.

## 4. Deploy as a Web App

1. **Deploy → New deployment**.
2. Type: **Web app**.
3. Description: e.g. "Contact form intake — production".
4. Execute as: **Me**.
5. Who has access: **Anyone** (the Worker calls this over the public
   internet; the shared secret is what actually authorizes the request —
   Apps Script web apps can't be restricted to a single caller by IP).
6. Click **Deploy**, authorize the requested permissions, and copy the
   **Web app URL** — it ends in `/exec`.

   **Use the `/exec` URL, not a `/dev` URL.** The `/dev` URL only works for
   the script owner while logged into the Apps Script editor and is not a
   stable production endpoint.

7. Every time you edit `Code.gs` after this, you must create a **new
   deployment version** (Deploy → Manage deployments → Edit → New
   version) for the changes to take effect at the same `/exec` URL.

## 5. Configure the Cloudflare Worker secrets

From the repo root, with [wrangler](https://developers.cloudflare.com/workers/wrangler/)
authenticated against the right Cloudflare account:

```bash
wrangler secret put GOOGLE_APPS_SCRIPT_URL
# paste the /exec URL from step 4.6

wrangler secret put CONTACT_FORM_SECRET
# paste the exact same value used in Script Properties in step 3

wrangler secret put TURNSTILE_SECRET_KEY
# from the Cloudflare Turnstile dashboard — see step 6 below
```

`ALLOWED_ORIGIN` is not a secret — it's set as a plain variable in
[`wrangler.toml`](../wrangler.toml) (`[vars]` block). Update it there if
the production domain changes.

None of `GOOGLE_APPS_SCRIPT_URL`, `CONTACT_FORM_SECRET`, or
`TURNSTILE_SECRET_KEY` may ever be prefixed `VITE_` or referenced from
`src/` — that would ship them to the browser.

## 6. Set up Cloudflare Turnstile

1. In the Cloudflare dashboard: **Turnstile → Add site**.
2. Add the production domain (and `localhost` for local dev, as a
   separate widget or by allowing localhost on the same widget).
3. Copy the **Site Key** into the frontend env as `VITE_TURNSTILE_SITE_KEY`
   (see `.env.example`) — this one is meant to be public.
4. Copy the **Secret Key** and set it as the Worker secret
   `TURNSTILE_SECRET_KEY` (step 5 above) — this one must never reach the
   browser.

## 7. Route the Worker at `/api/*` in production

The frontend calls a same-origin relative path (`/api/contact`), so the
Worker needs to be attached to the same domain the site is served from.
In `wrangler.toml`, uncomment and fill in the `[[routes]]` block once the
domain/zone is confirmed, e.g.:

```toml
[[routes]]
pattern = "mariettanepalisamaj.org/api/*"
zone_name = "mariettanepalisamaj.org"
```

Then deploy the Worker:

```bash
npm run worker:deploy
```

## Local development

Run both dev servers side by side:

```bash
npm run dev          # Vite, http://localhost:5173
npm run worker:dev    # wrangler dev, http://localhost:8787
```

`vite.config.ts` proxies `/api/*` to `http://localhost:8787`, so the
browser only ever talks to the Vite origin — matching production, no CORS
configuration needed either locally or in production.

For local Worker secrets, create `.dev.vars` at the repo root (already
gitignored) with the same keys `wrangler secret put` would otherwise set:

```text
GOOGLE_APPS_SCRIPT_URL=...
CONTACT_FORM_SECRET=...
TURNSTILE_SECRET_KEY=...
```

Cloudflare Turnstile also has published **test keys** (documented on the
Turnstile dashboard) that always pass/fail predictably — useful for local
dev without solving a real challenge every time.

## Verifying it end-to-end

1. Fill out and submit the live Contact form.
2. Confirm the Worker returned success (Network tab: `POST /api/contact` → 200).
3. Open the Google Sheet and confirm **exactly one new row** appeared in
   `Contact Submissions`, with `Status = New` and a server-generated
   `Submitted At` timestamp.

Until that row has actually appeared from a real submission, treat the
integration as implemented but **not yet verified end-to-end** — the
automated tests cover the Worker/validation logic in isolation, but can't
confirm Apps Script deployment, Script Properties, or Sheet access are
correctly configured in your Google account.

## Column reference

| Column | Source |
|---|---|
| Submitted At | Server timestamp, generated in `Code.gs` at append time |
| Full Name | Form field `fullName` |
| Email Address | Form field `email` |
| Phone Number | Form field `phone` (blank if omitted) |
| Subject | Form field `subject` |
| Message | Form field `message` |
| Source Page | `window.location.href` at submit time |
| Status | Always `New` on insert |

## Changing the Subject dropdown later

Edit `src/config/contactSubjects.ts` — both the visible dropdown and the
Worker's server-side "is this an allowed subject" check read from that one
file, so there's nowhere else to keep in sync.
