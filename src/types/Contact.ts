/** Payload sent from the browser to POST /api/contact. */
export interface ContactFormPayload {
  fullName: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  sourcePage?: string;
  turnstileToken: string;
  /** Honeypot — real users never fill this in. */
  website?: string;
}

/** JSON body the Worker returns to the browser. Never includes internals. */
export interface ContactSubmitResponse {
  success: boolean;
  message?: string;
}

/** Per-field validation errors, keyed by ContactFormPayload field name. */
export type ContactFormErrors = Partial<
  Record<'fullName' | 'email' | 'phone' | 'subject' | 'message', string>
>;
