/**
 * POST /api/contact
 *
 * React never talks to Google Apps Script directly and never sees any
 * secret. This Worker is the only thing that does: it independently
 * re-validates everything the client already validated (never trusting the
 * browser), verifies the Turnstile token server-side, then forwards a
 * sanitized payload to Apps Script along with a shared secret.
 */
import { validateContactForm, sanitizeForSpreadsheet } from '../../src/utils/contactValidation';
import type { ContactSubmitResponse } from '../../src/types/Contact';

export interface Env {
  GOOGLE_APPS_SCRIPT_URL: string;
  CONTACT_FORM_SECRET: string;
  TURNSTILE_SECRET_KEY: string;
  ALLOWED_ORIGIN: string;
}

// Generous enough for a 5000-char message in the worst-case UTF-8 expansion
// (Devanagari, emoji, etc.) plus JSON structure/escaping overhead, while
// still rejecting grossly oversized bodies outright.
const MAX_BODY_BYTES = 30_000;
const TURNSTILE_VERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';

function jsonResponse(body: ContactSubmitResponse, status: number, origin?: string | null): Response {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (origin) headers['Access-Control-Allow-Origin'] = origin;
  return new Response(JSON.stringify(body), { status, headers });
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function asString(value: unknown): string {
  return typeof value === 'string' ? value : '';
}

/**
 * True same-origin browser requests don't always carry an Origin header —
 * only genuinely cross-origin (or CORS-preflighted) requests are guaranteed
 * to. Falling back to Referer when Origin is absent avoids rejecting
 * legitimate same-origin submissions outright, while still rejecting
 * requests that carry neither (a real browser always sends at least one).
 */
function isAllowedOrigin(request: Request, allowedOrigin: string): boolean {
  const origin = request.headers.get('Origin');
  if (origin) {
    return origin === allowedOrigin;
  }

  const referer = request.headers.get('Referer');
  if (referer) {
    try {
      return new URL(referer).origin === allowedOrigin;
    } catch {
      return false;
    }
  }

  return false;
}

async function verifyTurnstile(token: string, secret: string, remoteIp: string | null): Promise<boolean> {
  if (!token) return false;
  try {
    const body = new URLSearchParams({ secret, response: token });
    if (remoteIp) body.set('remoteip', remoteIp);

    const res = await fetch(TURNSTILE_VERIFY_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body,
    });
    if (!res.ok) {
      // Operational signal only. A non-2xx here (as opposed to a 200 with
      // success:false) almost always means TURNSTILE_SECRET_KEY itself is
      // missing or malformed — see docs/contact-form-setup.md's
      // troubleshooting section for how this was diagnosed in production.
      console.error('contact form: siteverify HTTP error', res.status);
      return false;
    }
    const data = (await res.json()) as { success?: boolean; 'error-codes'?: string[] };
    if (data.success !== true) {
      // Cloudflare's own public error-codes taxonomy (e.g.
      // "invalid-input-response", "timeout-or-duplicate") — never our
      // secret, which never appears in siteverify's response body.
      console.error('contact form: siteverify rejected', data['error-codes']);
    }
    return data.success === true;
  } catch (err) {
    console.error('contact form: siteverify fetch threw', err instanceof Error ? err.message : String(err));
    return false;
  }
}

interface AppsScriptForwardInput {
  fullName: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  sourcePage: string;
}

/** Forwards a validated submission to Apps Script. Returns whether it was accepted. */
async function forwardToAppsScript(env: Env, payload: AppsScriptForwardInput): Promise<boolean> {
  try {
    const res = await fetch(env.GOOGLE_APPS_SCRIPT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        secret: env.CONTACT_FORM_SECRET,
        fullName: sanitizeForSpreadsheet(payload.fullName),
        email: sanitizeForSpreadsheet(payload.email),
        phone: sanitizeForSpreadsheet(payload.phone),
        subject: sanitizeForSpreadsheet(payload.subject),
        message: sanitizeForSpreadsheet(payload.message),
        sourcePage: sanitizeForSpreadsheet(payload.sourcePage),
      }),
    });
    if (!res.ok) {
      // Operational signal only.
      console.error('contact form: apps script HTTP error', res.status);
      return false;
    }
    const rawBody = await res.text();
    let data: { success?: boolean; error?: string };
    try {
      data = JSON.parse(rawBody) as { success?: boolean; error?: string };
    } catch {
      // Apps Script returned non-JSON — typically an HTML sign-in/error
      // page, which usually means the deployment's access setting reverted
      // away from "Anyone" (see docs/contact-form-setup.md).
      console.error('contact form: apps script returned non-JSON response');
      return false;
    }
    if (data.success !== true) {
      // Apps Script's own rejection reason (e.g. "Unauthorized." on a
      // CONTACT_FORM_SECRET mismatch between here and its Script
      // Properties) — never message content. See
      // docs/contact-form-setup.md's troubleshooting section.
      console.error('contact form: apps script reported failure', data.error ?? '(no reason given)');
    }
    return data.success === true;
  } catch (err) {
    console.error('contact form: apps script fetch threw', err instanceof Error ? err.message : String(err));
    return false;
  }
}

export async function handleContactRequest(request: Request, env: Env): Promise<Response> {
  // 2. Reject unsupported HTTP methods.
  if (request.method !== 'POST') {
    return jsonResponse({ success: false }, 405);
  }

  // 3. Validate the request origin.
  if (!isAllowedOrigin(request, env.ALLOWED_ORIGIN)) {
    return jsonResponse({ success: false }, 403);
  }
  const origin = env.ALLOWED_ORIGIN;

  // 4. Limit request-body size — checked against the Content-Length header
  //    when present, and again against the actual decoded bytes below in
  //    case that header is absent, wrong, or understated.
  const contentLength = request.headers.get('Content-Length');
  if (contentLength && Number(contentLength) > MAX_BODY_BYTES) {
    return jsonResponse({ success: false }, 413, origin);
  }

  // 5. Parse JSON safely.
  let rawText: string;
  try {
    rawText = await request.text();
  } catch {
    return jsonResponse({ success: false }, 400, origin);
  }
  if (new TextEncoder().encode(rawText).length > MAX_BODY_BYTES) {
    return jsonResponse({ success: false }, 413, origin);
  }

  let body: unknown;
  try {
    body = JSON.parse(rawText);
  } catch {
    return jsonResponse({ success: false }, 400, origin);
  }
  if (!isPlainObject(body)) {
    return jsonResponse({ success: false }, 400, origin);
  }

  // 6. Check the honeypot. Real visitors never fill it. Respond as if it
  //    succeeded, without forwarding anything to Apps Script — don't tip
  //    off whatever filled it that it was detected.
  const website = asString(body.website).trim();
  if (website !== '') {
    return jsonResponse({ success: true }, 200, origin);
  }

  // 7 & 8. Validate every field — including Subject against the allowed
  // list — independently of whatever the client already checked.
  const fullName = asString(body.fullName);
  const email = asString(body.email);
  const phone = asString(body.phone);
  const subject = asString(body.subject);
  const message = asString(body.message);
  const sourcePage = asString(body.sourcePage).slice(0, 2048);
  const turnstileToken = asString(body.turnstileToken);

  const { valid } = validateContactForm({ fullName, email, phone, subject, message });
  if (!valid) {
    return jsonResponse({ success: false }, 400, origin);
  }

  // 9. Verify Cloudflare Turnstile server-side — a client-side pass alone
  // is never trusted.
  const remoteIp = request.headers.get('CF-Connecting-IP');
  const turnstileOk = await verifyTurnstile(turnstileToken, env.TURNSTILE_SECRET_KEY, remoteIp);
  if (!turnstileOk) {
    return jsonResponse({ success: false }, 400, origin);
  }

  // 10-12. Forward validated, sanitized data to Apps Script with the shared
  // secret, and verify its response before telling React anything succeeded.
  const appsScriptOk = await forwardToAppsScript(env, {
    fullName: fullName.trim(),
    email: email.trim(),
    phone: phone.trim(),
    subject: subject.trim(),
    message: message.trim(),
    sourcePage,
  });

  if (!appsScriptOk) {
    // 14. Operational signal only — never log message content or secrets.
    console.error('contact form: Apps Script forwarding failed');
    return jsonResponse({ success: false }, 502, origin);
  }

  // 13. Return safe JSON to React — never anything from Apps Script verbatim.
  return jsonResponse({ success: true }, 200, origin);
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    return handleContactRequest(request, env);
  },
};
