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
    if (!res.ok) return false;
    const data = (await res.json()) as { success?: boolean };
    return data.success === true;
  } catch {
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
    if (!res.ok) return false;
    const data = (await res.json()) as { success?: boolean };
    return data.success === true;
  } catch {
    return false;
  }
}

export async function handleContactRequest(request: Request, env: Env): Promise<Response> {
  const origin = request.headers.get('Origin');

  // 2. Reject unsupported HTTP methods.
  if (request.method !== 'POST') {
    return jsonResponse({ success: false }, 405);
  }

  // 3. Validate the request origin.
  if (!origin || origin !== env.ALLOWED_ORIGIN) {
    return jsonResponse({ success: false }, 403);
  }

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
