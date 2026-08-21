import { afterEach, describe, expect, it, vi } from 'vitest';
import { forwardRef, useEffect, useImperativeHandle } from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import ContactForm from './ContactForm';
import * as contactService from '../../services/contactService';
import type { TurnstileWidgetHandle } from './TurnstileWidget';

// The real widget loads Cloudflare's script and waits for a human to solve a
// challenge — neither is meaningful in jsdom. Stand in with something that
// verifies immediately, so these tests exercise ContactForm's own logic
// (validation, submit states, error handling) rather than Turnstile itself.
vi.mock('./TurnstileWidget', () => ({
  default: forwardRef<TurnstileWidgetHandle, { onVerify: (token: string) => void }>(
    function MockTurnstileWidget({ onVerify }, ref) {
      useImperativeHandle(ref, () => ({ reset: () => {} }));
      useEffect(() => { onVerify('test-turnstile-token'); }, [onVerify]);
      return <div data-testid="mock-turnstile" />;
    }
  ),
}));

// ContactForm reads useSearchParams (for the Subject/Message pre-fill —
// see its own comment), which throws outside a Router. `initialPath` lets
// the pre-fill test drive that via a real URL instead of reaching into
// implementation details.
function renderForm(initialPath = '/contact') {
  return render(
    <MemoryRouter initialEntries={[initialPath]}>
      <ContactForm />
    </MemoryRouter>
  );
}

async function fillValidForm(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByLabelText(/full name/i), 'Sabina Koirala');
  await user.type(screen.getByLabelText(/email address/i), 'sabina@example.com');
  await user.selectOptions(screen.getByLabelText(/subject/i), 'general');
  await user.type(screen.getByLabelText(/message/i), 'Hello, I would love to get involved with MNS.');
}

describe('ContactForm', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders every field from the approved design', () => {
    renderForm();
    expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/phone number/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/subject/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/message/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /send message/i })).toBeInTheDocument();
  });

  it('keeps the honeypot field present but hidden from sighted/keyboard users', () => {
    renderForm();
    const honeypot = screen.getByLabelText('Website', { selector: '#website' });
    expect(honeypot).toHaveAttribute('tabIndex', '-1');
    expect(honeypot.parentElement).toHaveAttribute('aria-hidden', 'true');
  });

  it('shows validation errors and does not submit when the form is empty', async () => {
    const submitSpy = vi.spyOn(contactService, 'submitContactForm');
    const user = userEvent.setup();
    renderForm();

    await user.click(screen.getByRole('button', { name: /send message/i }));

    expect(await screen.findByText(/full name is required/i)).toBeInTheDocument();
    expect(screen.getByText(/email address is required/i)).toBeInTheDocument();
    expect(screen.getByText(/please select a subject/i)).toBeInTheDocument();
    expect(screen.getByText(/message is required/i)).toBeInTheDocument();
    expect(submitSpy).not.toHaveBeenCalled();
  });

  it('shows the exact required success copy and clears the form after a confirmed success', async () => {
    vi.spyOn(contactService, 'submitContactForm').mockResolvedValue(undefined);
    const user = userEvent.setup();
    renderForm();

    await fillValidForm(user);
    await user.click(screen.getByRole('button', { name: /send message/i }));

    const status = await screen.findByRole('status');
    expect(status).toHaveTextContent(/thank you for contacting marietta nepali samaj/i);
    expect(status).toHaveTextContent(/your message has been received/i);

    // Form re-renders empty behind a "send another message" flow.
    await user.click(screen.getByRole('button', { name: /send another message/i }));
    expect((screen.getByLabelText(/full name/i) as HTMLInputElement).value).toBe('');
  });

  it('shows the exact required error copy and preserves form values on failure', async () => {
    vi.spyOn(contactService, 'submitContactForm').mockRejectedValue(
      new contactService.ContactSubmissionError('simulated failure')
    );
    const user = userEvent.setup();
    renderForm();

    await fillValidForm(user);
    await user.click(screen.getByRole('button', { name: /send message/i }));

    const alert = await screen.findByRole('alert');
    expect(alert).toHaveTextContent(/we could not send your message right now/i);
    expect(alert).toHaveTextContent(/please try again/i);

    // Values are preserved, not cleared, after failure.
    expect((screen.getByLabelText(/full name/i) as HTMLInputElement).value).toBe('Sabina Koirala');
    expect((screen.getByLabelText(/email address/i) as HTMLInputElement).value).toBe('sabina@example.com');
  });

  it('disables the button and shows "Sending..." while a submission is in flight', async () => {
    let resolveSubmit!: () => void;
    vi.spyOn(contactService, 'submitContactForm').mockReturnValue(
      new Promise(resolve => { resolveSubmit = () => resolve(undefined); })
    );
    const user = userEvent.setup();
    renderForm();

    await fillValidForm(user);
    const button = screen.getByRole('button', { name: /send message/i });
    await user.click(button);

    expect(await screen.findByRole('button', { name: /sending/i })).toBeDisabled();

    resolveSubmit();
    await waitFor(() => expect(screen.getByRole('status')).toBeInTheDocument());
  });

  it('never displays the internal error message thrown by the service', async () => {
    vi.spyOn(contactService, 'submitContactForm').mockRejectedValue(
      new contactService.ContactSubmissionError('Postgres connection refused at 10.0.0.4:5432')
    );
    const user = userEvent.setup();
    renderForm();

    await fillValidForm(user);
    await user.click(screen.getByRole('button', { name: /send message/i }));

    await screen.findByRole('alert');
    expect(screen.queryByText(/postgres/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/10\.0\.0\.4/)).not.toBeInTheDocument();
  });

  it('pre-fills Subject and Message from the URL (e.g. the Tuition & Fees "Enroll & Pay" link)', () => {
    renderForm('/contact?subject=school&message=I%27d%20like%20to%20enroll%20my%20child.');
    expect(screen.getByLabelText(/subject/i)).toHaveValue('school');
    expect(screen.getByLabelText(/message/i)).toHaveValue("I'd like to enroll my child.");
  });

  it('ignores an invalid Subject in the URL rather than pre-filling garbage', () => {
    renderForm('/contact?subject=not-a-real-subject');
    expect(screen.getByLabelText(/subject/i)).toHaveValue('');
  });
});
