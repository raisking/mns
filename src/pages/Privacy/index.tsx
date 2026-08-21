import { organization } from '../../config/organization';
import PageHero from '../../components/common/PageHero';

// Plain-language draft reflecting what the site actually does today (see
// ContactForm.tsx + workers/api/contact.ts for the real data flow) rather
// than boilerplate legal text — no analytics/tracking claims, no
// tax-exempt/EIN claims, and donations are described as "planned" since
// Stripe isn't wired up yet (Donate/index.tsx's handleDonate is still a
// placeholder pending Phase 1F). This is not legal advice — a real
// lawyer's review is worth getting before treating this as final,
// especially once online payments go live.
export default function Privacy() {
  return (
    <>
      <PageHero
        title="Privacy Policy"
        subtitle="How Marietta Nepali Samaj collects, uses, and protects the information you share with us."
      />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <p className="text-sm text-ink-soft mb-10">Last updated: August 21, 2026</p>

        <div className="space-y-10">
          <section>
            <h2 className="text-xl text-ink mb-3">Overview</h2>
            <p className="text-ink-soft leading-relaxed">
              Marietta Nepali Samaj ("MNS," "we," "us") is a volunteer-run community
              organization for the Nepali diaspora in Marietta, Georgia. This page
              explains what information our website collects, how we use it, and
              the choices you have.
            </p>
          </section>

          <section>
            <h2 className="text-xl text-ink mb-3">Information We Collect</h2>
            <p className="text-ink-soft leading-relaxed mb-3">
              We only collect information you choose to give us. The main way this
              happens is our <a href="/contact" className="text-saffron hover:underline">Contact form</a>,
              which asks for:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-ink-soft leading-relaxed">
              <li>Your full name and email address</li>
              <li>A phone number, if you choose to share one (optional)</li>
              <li>The subject of your message (e.g. general inquiry, membership, volunteering, events)</li>
              <li>The message itself</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl text-ink mb-3">How We Use Your Information</h2>
            <p className="text-ink-soft leading-relaxed">
              We use what you submit only to respond to you — answering a question,
              following up on a volunteer or membership interest, or handling a
              school or event inquiry. We do not sell your information, and we do
              not share it with third parties for marketing purposes. Contact form
              submissions are recorded in a private Google Sheet, accessible only
              to MNS leadership and volunteers who need it to respond to you.
            </p>
          </section>

          <section>
            <h2 className="text-xl text-ink mb-3">Spam Protection</h2>
            <p className="text-ink-soft leading-relaxed">
              Our Contact form uses Cloudflare Turnstile, an automated
              bot-detection check, to keep spam submissions out of our inbox.
              Cloudflare processes some technical information as part of that
              check under its own privacy policy — we don't see or store that
              data ourselves.
            </p>
          </section>

          <section>
            <h2 className="text-xl text-ink mb-3">Donations & Payments</h2>
            <p className="text-ink-soft leading-relaxed">
              MNS is preparing to accept online donations through Stripe, a
              PCI-compliant payment processor. Once that is live, MNS will not
              directly collect or store your card details — Stripe handles that
              on our behalf.
            </p>
          </section>

          <section>
            <h2 className="text-xl text-ink mb-3">Cookies & Tracking</h2>
            <p className="text-ink-soft leading-relaxed">
              This site does not currently use analytics or advertising cookies.
              If that changes, this policy will be updated to reflect it.
            </p>
          </section>

          <section>
            <h2 className="text-xl text-ink mb-3">Children's Privacy</h2>
            <p className="text-ink-soft leading-relaxed">
              Our Nepali School serves children, but this website does not
              knowingly collect information directly from children. Forms on
              this site are meant to be completed by parents, guardians, or
              other adult community members.
            </p>
          </section>

          <section>
            <h2 className="text-xl text-ink mb-3">Your Choices</h2>
            <p className="text-ink-soft leading-relaxed">
              To ask what information we have about you, or to request a
              correction or deletion, email us at{' '}
              {organization.email && (
                <a href={`mailto:${organization.email}`} className="text-saffron hover:underline">
                  {organization.email}
                </a>
              )}.
            </p>
          </section>

          <section>
            <h2 className="text-xl text-ink mb-3">Changes to This Policy</h2>
            <p className="text-ink-soft leading-relaxed">
              We may update this policy as MNS adds new features to the site —
              such as online payments going live. We'll update the date at the
              top of this page whenever that happens.
            </p>
          </section>

          <section>
            <h2 className="text-xl text-ink mb-3">Contact Us</h2>
            <p className="text-ink-soft leading-relaxed">
              Questions about this policy? Reach us at{' '}
              {organization.email && (
                <a href={`mailto:${organization.email}`} className="text-saffron hover:underline">
                  {organization.email}
                </a>
              )}{' '}
              or {organization.address}.
            </p>
          </section>
        </div>
      </div>
    </>
  );
}
