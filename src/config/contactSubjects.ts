/**
 * Central source of truth for the Contact form's Subject dropdown.
 *
 * Preserves the option values/labels that already existed in the form
 * (src/pages/Contact/index.tsx) before this file existed — do not silently
 * change these without updating the visible form, since the Worker
 * validates incoming submissions against this exact list.
 */
export const contactSubjects = [
  { value: 'general', label: 'General Inquiry' },
  { value: 'membership', label: 'Membership' },
  { value: 'school', label: 'Nepali School' },
  { value: 'events', label: 'Events' },
  { value: 'donation', label: 'Donation' },
  { value: 'volunteer', label: 'Volunteering' },
  { value: 'other', label: 'Other' },
] as const;

export type ContactSubjectValue = (typeof contactSubjects)[number]['value'];

export const contactSubjectValues: readonly string[] = contactSubjects.map(s => s.value);

export function isValidContactSubject(value: string): value is ContactSubjectValue {
  return contactSubjectValues.includes(value);
}
