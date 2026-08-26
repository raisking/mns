/* Hallmark + minimalist-ui - component: contact form - theme: existing MNS tokens
 * states: default - hover - focus - active - disabled - loading - error - success
 * mobile: single-column at 320/375/414px, no wrapping CTA, no horizontal overflow
 */
import { useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { contactSubjects, isValidContactSubject } from '../../config/contactSubjects';
import { validateContactForm } from '../../utils/contactValidation';
import { submitContactForm } from '../../services/contactService';
import type { ContactFormErrors } from '../../types/Contact';
import TurnstileWidget, { type TurnstileWidgetHandle } from './TurnstileWidget';

interface FormData {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  /** Honeypot — must stay empty. Real visitors never see or fill this field. */
  website: string;
}

const blankForm: FormData = { name: '', email: '', phone: '', subject: '', message: '', website: '' };

const TURNSTILE_SITE_KEY = import.meta.env.VITE_TURNSTILE_SITE_KEY as string | undefined;
const shellClass = 'relative w-full min-w-0 rounded-xl border border-ink/10 bg-white p-4 font-body text-sm sm:p-6 lg:p-8';
const labelClass = 'mb-2 block text-sm font-semibold text-ink';
const controlBaseClass = 'block min-h-12 w-full min-w-0 rounded-md border bg-paper/35 px-3.5 py-3 text-sm text-ink outline outline-2 outline-transparent outline-offset-2 transition-[background-color,border-color,transform] duration-200 placeholder:text-ink-soft/50 hover:bg-paper/55 focus-visible:border-saffron focus-visible:bg-white focus-visible:outline-saffron disabled:cursor-not-allowed disabled:opacity-55 sm:px-4';
const helperClass = 'mt-1.5 min-h-4 text-xs leading-4 text-ink-soft';
const errorClass = 'mt-1.5 min-h-4 text-xs font-semibold leading-4 text-saffron';
const errorControlClass = 'border-saffron bg-saffron/5 pr-10';
const normalControlClass = 'border-ink/15';

export default function ContactForm() {
  // Pre-fills Subject/Message from a link like /contact?subject=school —
  // e.g. the Tuition & Fees "Enroll & Pay" CTA. useState's lazy initializer
  // runs exactly once, on mount, which is exactly what's wanted here — it
  // seeds the starting values without re-running (and fighting whatever
  // the visitor has since typed) on every later re-render.
  const [searchParams] = useSearchParams();
  const [form, setForm] = useState<FormData>(() => {
    const subjectParam = searchParams.get('subject') ?? '';
    const messageParam = searchParams.get('message') ?? '';
    return {
      ...blankForm,
      subject: isValidContactSubject(subjectParam) ? subjectParam : '',
      message: messageParam,
    };
  });
  const [errors, setErrors] = useState<ContactFormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitFailed, setSubmitFailed] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState('');
  const [turnstileError, setTurnstileError] = useState(false);
  const turnstileRef = useRef<TurnstileWidgetHandle>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (name in errors) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return; // belt-and-suspenders against double submission

    // Real visitors never populate the honeypot. Pretend success without
    // hitting the network, rather than tipping off whatever filled it.
    if (form.website.trim() !== '') {
      setSubmitted(true);
      setForm(blankForm);
      return;
    }

    const { valid, errors: fieldErrors } = validateContactForm({
      fullName: form.name,
      email: form.email,
      phone: form.phone,
      subject: form.subject,
      message: form.message,
    });
    setErrors(fieldErrors);

    if (!valid) return;

    if (TURNSTILE_SITE_KEY && !turnstileToken) {
      setTurnstileError(true);
      return;
    }

    setTurnstileError(false);
    setSubmitFailed(false);
    setSubmitting(true);

    try {
      await submitContactForm({
        fullName: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim() || undefined,
        subject: form.subject,
        message: form.message.trim(),
        sourcePage: window.location.href,
        turnstileToken,
        website: form.website,
      });
      setSubmitted(true);
      setForm(blankForm);
    } catch {
      // Never surface err.message — it may carry internal/server detail.
      setSubmitFailed(true);
    } finally {
      setSubmitting(false);
      setTurnstileToken('');
      turnstileRef.current?.reset();
    }
  };

  if (submitted) {
    return (
      <div className="rounded-xl border border-green-200 bg-white p-6 text-center font-body text-sm sm:p-8" role="status">
        <div className="mx-auto mb-4 flex h-11 w-11 items-center justify-center rounded-lg bg-green-50 text-green-700 ring-1 ring-green-200">
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.25} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="mb-2 text-sm font-bold text-ink">Message Sent!</h3>
        <p className="text-sm leading-6 text-ink-soft">
          Thank you for contacting Marietta Nepali Samaj.
          <br />
          Your message has been received. We will get back to you as soon as possible.
        </p>
        <button
          onClick={() => setSubmitted(false)}
          className="mt-5 inline-flex min-h-11 items-center justify-center whitespace-nowrap rounded-md border border-ink/10 bg-paper px-5 text-sm font-bold text-ink transition-[background-color,transform] duration-200 hover:bg-paper-deep active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-saffron"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={shellClass} noValidate>
      {submitFailed && (
        <div className="mb-5 rounded-lg border border-red-200 bg-red-50 p-4 text-sm leading-6 text-red-800" role="alert">
          <p className="font-bold">We could not send your message right now.</p>
          <p>Please try again.</p>
        </div>
      )}

      {/* Honeypot — hidden from sighted and keyboard users; bots that fill
          every field in the DOM will fill this one too. */}
      <div aria-hidden="true" style={{ position: 'absolute', left: '-9999px' }}>
        <label htmlFor="website">Website</label>
        <input
          id="website"
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={form.website}
          onChange={handleChange}
        />
      </div>

      <div className="grid min-w-0 grid-cols-1 gap-y-4 sm:grid-cols-2 sm:gap-x-5">
        <div>
          <label htmlFor="name" className={labelClass}>
            Full Name <span className="text-saffron">*</span>
          </label>
          <div className="relative">
            <input
              id="name" name="name" type="text" required
              value={form.name} onChange={handleChange}
              aria-invalid={Boolean(errors.fullName)}
              aria-describedby={errors.fullName ? 'name-error' : undefined}
              className={`${controlBaseClass} ${errors.fullName ? errorControlClass : normalControlClass}`}
              placeholder="Your name"
            />
            {errors.fullName && <ErrorMark />}
          </div>
          <p id="name-error" className={errors.fullName ? errorClass : helperClass}>{errors.fullName || '\u00A0'}</p>
        </div>
        <div>
          <label htmlFor="email" className={labelClass}>
            Email Address <span className="text-saffron">*</span>
          </label>
          <div className="relative">
            <input
              id="email" name="email" type="email" required
              value={form.email} onChange={handleChange}
              aria-invalid={Boolean(errors.email)}
              aria-describedby={errors.email ? 'email-error' : undefined}
              className={`${controlBaseClass} ${errors.email ? errorControlClass : normalControlClass}`}
              placeholder="your@email.com"
            />
            {errors.email && <ErrorMark />}
          </div>
          <p id="email-error" className={errors.email ? errorClass : helperClass}>{errors.email || '\u00A0'}</p>
        </div>
      </div>

      <div className="mt-1">
        <label htmlFor="phone" className={labelClass}>
          Phone Number <span className="font-medium text-ink-soft">(optional)</span>
        </label>
        <div className="relative">
          <input
            id="phone" name="phone" type="tel"
            value={form.phone} onChange={handleChange}
            aria-invalid={Boolean(errors.phone)}
            aria-describedby={errors.phone ? 'phone-error' : undefined}
            className={`${controlBaseClass} ${errors.phone ? errorControlClass : normalControlClass}`}
            placeholder="+1 (555) 000-0000"
          />
          {errors.phone && <ErrorMark />}
        </div>
        <p id="phone-error" className={errors.phone ? errorClass : helperClass}>{errors.phone || '\u00A0'}</p>
      </div>

      <div className="mt-1">
        <label htmlFor="subject" className={labelClass}>
          Subject <span className="text-saffron">*</span>
        </label>
        <div className="relative">
          <select
            id="subject" name="subject" required
            value={form.subject} onChange={handleChange}
            aria-invalid={Boolean(errors.subject)}
            aria-describedby={errors.subject ? 'subject-error' : undefined}
            className={`${controlBaseClass} appearance-none ${errors.subject ? errorControlClass : normalControlClass}`}
          >
            <option value="">Select a subject</option>
            {contactSubjects.map(subject => (
              <option key={subject.value} value={subject.value}>{subject.label}</option>
            ))}
          </select>
          {errors.subject ? <ErrorMark /> : (
            <svg className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-soft" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 9l6 6 6-6" />
            </svg>
          )}
        </div>
        <p id="subject-error" className={errors.subject ? errorClass : helperClass}>{errors.subject || '\u00A0'}</p>
      </div>

      <div className="mt-1">
        <label htmlFor="message" className={labelClass}>
          Message <span className="text-saffron">*</span>
        </label>
        <div className="relative">
          <textarea
            id="message" name="message" required rows={5}
            value={form.message} onChange={handleChange}
            aria-invalid={Boolean(errors.message)}
            aria-describedby={errors.message ? 'message-error' : undefined}
            className={`${controlBaseClass} min-h-36 resize-y ${errors.message ? errorControlClass : normalControlClass}`}
            placeholder="How can we help you?"
          />
          {errors.message && <ErrorMark />}
        </div>
        <p id="message-error" className={errors.message ? errorClass : helperClass}>{errors.message || '\u00A0'}</p>
      </div>

      {TURNSTILE_SITE_KEY && (
        <div className="mt-1">
          <TurnstileWidget
            ref={turnstileRef}
            siteKey={TURNSTILE_SITE_KEY}
            onVerify={token => { setTurnstileToken(token); setTurnstileError(false); }}
            onExpire={() => setTurnstileToken('')}
            onError={() => setTurnstileError(true)}
          />
          {turnstileError && (
            <p className={errorClass} role="alert">
              Please complete the verification challenge.
            </p>
          )}
        </div>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="mt-3 inline-flex min-h-12 w-full min-w-0 items-center justify-center gap-2 whitespace-nowrap rounded-md bg-ink px-5 text-sm font-bold text-paper transition-[background-color,transform] duration-200 hover:bg-indigo-dark active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-55 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-saffron"
      >
        {submitting && (
          <span className="h-4 w-4 rounded-full border-2 border-paper/35 border-t-paper motion-safe:animate-spin" aria-hidden="true" />
        )}
        {submitting ? 'Sending...' : 'Send Message'}
      </button>
    </form>
  );
}

function ErrorMark() {
  return (
    <svg className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-saffron" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.25} d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
    </svg>
  );
}
