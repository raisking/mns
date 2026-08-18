import { useRef, useState } from 'react';
import { contactSubjects } from '../../config/contactSubjects';
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

const initialForm: FormData = { name: '', email: '', phone: '', subject: '', message: '', website: '' };

const TURNSTILE_SITE_KEY = import.meta.env.VITE_TURNSTILE_SITE_KEY as string | undefined;

export default function ContactForm() {
  const [form, setForm] = useState<FormData>(initialForm);
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
      setForm(initialForm);
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
      setForm(initialForm);
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
      <div className="bg-green-50 border border-green-200 rounded-2xl p-8 text-center" role="status">
        <h3 className="font-bold text-green-800 text-lg mb-2">Message Sent!</h3>
        <p className="text-green-700">
          Thank you for contacting Marietta Nepali Samaj.
          <br />
          Your message has been received. We will get back to you as soon as possible.
        </p>
        <button
          onClick={() => setSubmitted(false)}
          className="mt-4 text-sm text-green-600 hover:underline"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      {submitFailed && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-700" role="alert">
          We could not send your message right now.
          <br />
          Please try again.
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

      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1.5">
            Full Name <span className="text-saffron">*</span>
          </label>
          <input
            id="name" name="name" type="text" required
            value={form.name} onChange={handleChange}
            aria-invalid={Boolean(errors.fullName)}
            aria-describedby={errors.fullName ? 'name-error' : undefined}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-saffron focus:border-transparent transition"
            placeholder="Your name"
          />
          {errors.fullName && (
            <p id="name-error" className="mt-1.5 text-xs text-saffron">{errors.fullName}</p>
          )}
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">
            Email Address <span className="text-saffron">*</span>
          </label>
          <input
            id="email" name="email" type="email" required
            value={form.email} onChange={handleChange}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? 'email-error' : undefined}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-saffron focus:border-transparent transition"
            placeholder="your@email.com"
          />
          {errors.email && (
            <p id="email-error" className="mt-1.5 text-xs text-saffron">{errors.email}</p>
          )}
        </div>
      </div>

      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1.5">
          Phone Number <span className="text-gray-400">(optional)</span>
        </label>
        <input
          id="phone" name="phone" type="tel"
          value={form.phone} onChange={handleChange}
          aria-invalid={Boolean(errors.phone)}
          aria-describedby={errors.phone ? 'phone-error' : undefined}
          className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-saffron focus:border-transparent transition"
          placeholder="+1 (555) 000-0000"
        />
        {errors.phone && (
          <p id="phone-error" className="mt-1.5 text-xs text-saffron">{errors.phone}</p>
        )}
      </div>

      <div>
        <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1.5">
          Subject <span className="text-saffron">*</span>
        </label>
        <select
          id="subject" name="subject" required
          value={form.subject} onChange={handleChange}
          aria-invalid={Boolean(errors.subject)}
          aria-describedby={errors.subject ? 'subject-error' : undefined}
          className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-saffron focus:border-transparent transition bg-white"
        >
          <option value="">Select a subject</option>
          {contactSubjects.map(subject => (
            <option key={subject.value} value={subject.value}>{subject.label}</option>
          ))}
        </select>
        {errors.subject && (
          <p id="subject-error" className="mt-1.5 text-xs text-saffron">{errors.subject}</p>
        )}
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1.5">
          Message <span className="text-saffron">*</span>
        </label>
        <textarea
          id="message" name="message" required rows={5}
          value={form.message} onChange={handleChange}
          aria-invalid={Boolean(errors.message)}
          aria-describedby={errors.message ? 'message-error' : undefined}
          className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-saffron focus:border-transparent transition resize-none"
          placeholder="How can we help you?"
        />
        {errors.message && (
          <p id="message-error" className="mt-1.5 text-xs text-saffron">{errors.message}</p>
        )}
      </div>

      {TURNSTILE_SITE_KEY && (
        <div>
          <TurnstileWidget
            ref={turnstileRef}
            siteKey={TURNSTILE_SITE_KEY}
            onVerify={token => { setTurnstileToken(token); setTurnstileError(false); }}
            onExpire={() => setTurnstileToken('')}
            onError={() => setTurnstileError(true)}
          />
          {turnstileError && (
            <p className="mt-1.5 text-xs text-saffron" role="alert">
              Please complete the verification challenge.
            </p>
          )}
        </div>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="w-full py-3.5 bg-indigo hover:bg-indigo-dark disabled:opacity-60 text-white font-bold rounded-full transition-all not-disabled:hover:-translate-y-0.5 not-disabled:hover:shadow-md not-disabled:active:translate-y-0"
      >
        {submitting ? 'Sending...' : 'Send Message'}
      </button>
    </form>
  );
}
