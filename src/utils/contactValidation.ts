/**
 * Contact form validation + spreadsheet-injection sanitization.
 *
 * Deliberately dependency-free (no DOM, no Node, no Workers-only APIs) so
 * this single module can be imported from both the React app (for
 * immediate user feedback) and the Cloudflare Worker (as the authoritative,
 * independent server-side check — the Worker never trusts the client).
 */
import { isValidContactSubject } from '../config/contactSubjects';
import type { ContactFormErrors } from '../types/Contact';

export const FULL_NAME_MIN = 2;
export const FULL_NAME_MAX = 100;
export const EMAIL_MAX = 254;
export const PHONE_MAX = 30;
export const MESSAGE_MIN = 10;
export const MESSAGE_MAX = 5000;

// Practical, not full-RFC5322 — good enough for real addresses without the
// ReDoS risk of a more "complete" email regex.
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export interface ContactValidationInput {
  fullName: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}

export interface ContactValidationResult {
  valid: boolean;
  errors: ContactFormErrors;
}

export function validateContactForm(input: ContactValidationInput): ContactValidationResult {
  const errors: ContactFormErrors = {};

  const fullName = input.fullName.trim();
  if (!fullName) {
    errors.fullName = 'Full name is required.';
  } else if (fullName.length < FULL_NAME_MIN) {
    errors.fullName = `Full name must be at least ${FULL_NAME_MIN} characters.`;
  } else if (fullName.length > FULL_NAME_MAX) {
    errors.fullName = `Full name must be ${FULL_NAME_MAX} characters or fewer.`;
  }

  const email = input.email.trim();
  if (!email) {
    errors.email = 'Email address is required.';
  } else if (email.length > EMAIL_MAX) {
    errors.email = `Email address must be ${EMAIL_MAX} characters or fewer.`;
  } else if (!EMAIL_PATTERN.test(email)) {
    errors.email = 'Enter a valid email address.';
  }

  const phone = (input.phone ?? '').trim();
  if (phone.length > PHONE_MAX) {
    errors.phone = `Phone number must be ${PHONE_MAX} characters or fewer.`;
  }

  const subject = input.subject.trim();
  if (!subject) {
    errors.subject = 'Please select a subject.';
  } else if (!isValidContactSubject(subject)) {
    errors.subject = 'Please select a valid subject.';
  }

  const message = input.message.trim();
  if (!message) {
    errors.message = 'Message is required.';
  } else if (message.length < MESSAGE_MIN) {
    errors.message = `Message must be at least ${MESSAGE_MIN} characters.`;
  } else if (message.length > MESSAGE_MAX) {
    errors.message = `Message must be ${MESSAGE_MAX} characters or fewer.`;
  }

  return { valid: Object.keys(errors).length === 0, errors };
}

/**
 * Neutralizes spreadsheet formula injection. Google Sheets (and Excel/CSV
 * consumers) treat a cell as a formula when it starts with =, +, -, or @.
 * A leading apostrophe forces Sheets to treat the value as plain text
 * without altering what's visibly stored/read back via the API.
 */
export function sanitizeForSpreadsheet(value: string): string {
  const trimmed = value.trim();
  if (/^[=+\-@]/.test(trimmed)) {
    return `'${value}`;
  }
  return value;
}
