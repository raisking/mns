import type { ContactFormPayload, ContactSubmitResponse } from '../types/Contact';

/**
 * Thrown on any failure to submit the contact form. The message is for
 * developer/console diagnostics only — components must never render
 * err.message directly (see the fixed, generic copy required by the UI).
 */
export class ContactSubmissionError extends Error {}

/**
 * Posts the contact form to the Cloudflare Worker. The Worker's URL is a
 * same-origin relative path — the React app never talks to Google Apps
 * Script, and never sees any secret.
 */
export async function submitContactForm(payload: ContactFormPayload): Promise<void> {
  let response: Response;
  try {
    response = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
  } catch {
    throw new ContactSubmissionError('Network error while submitting the contact form.');
  }

  let data: ContactSubmitResponse | null = null;
  try {
    data = (await response.json()) as ContactSubmitResponse;
  } catch {
    // Non-JSON response — fall through to the status-based error below.
  }

  if (!response.ok || !data?.success) {
    throw new ContactSubmissionError(
      `Contact form submission failed (status ${response.status}).`
    );
  }
}
