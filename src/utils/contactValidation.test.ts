import { describe, expect, it } from 'vitest';
import { validateContactForm, sanitizeForSpreadsheet } from './contactValidation';

const validInput = {
  fullName: 'Sabina Koirala',
  email: 'sabina@example.com',
  phone: '+1 (555) 123-4567',
  subject: 'general',
  message: 'Hello, I would like to learn more about MNS programs.',
};

describe('validateContactForm', () => {
  it('accepts a fully valid submission', () => {
    const result = validateContactForm(validInput);
    expect(result.valid).toBe(true);
    expect(result.errors).toEqual({});
  });

  it('accepts a valid submission with phone omitted (optional)', () => {
    const result = validateContactForm({ ...validInput, phone: undefined });
    expect(result.valid).toBe(true);
  });

  it('accepts a valid submission with phone blank', () => {
    const result = validateContactForm({ ...validInput, phone: '' });
    expect(result.valid).toBe(true);
  });

  describe('Full Name', () => {
    it('rejects missing full name', () => {
      const result = validateContactForm({ ...validInput, fullName: '' });
      expect(result.valid).toBe(false);
      expect(result.errors.fullName).toMatch(/required/i);
    });

    it('rejects full name under 2 characters', () => {
      const result = validateContactForm({ ...validInput, fullName: 'A' });
      expect(result.valid).toBe(false);
      expect(result.errors.fullName).toMatch(/at least 2/i);
    });

    it('rejects full name over 100 characters', () => {
      const result = validateContactForm({ ...validInput, fullName: 'A'.repeat(101) });
      expect(result.valid).toBe(false);
      expect(result.errors.fullName).toMatch(/100/);
    });

    it('accepts full name at exactly the boundaries', () => {
      expect(validateContactForm({ ...validInput, fullName: 'Ab' }).valid).toBe(true);
      expect(validateContactForm({ ...validInput, fullName: 'A'.repeat(100) }).valid).toBe(true);
    });
  });

  describe('Email Address', () => {
    it('rejects missing email', () => {
      const result = validateContactForm({ ...validInput, email: '' });
      expect(result.errors.email).toMatch(/required/i);
    });

    it('rejects invalid email format', () => {
      const result = validateContactForm({ ...validInput, email: 'not-an-email' });
      expect(result.errors.email).toMatch(/valid email/i);
    });

    it('rejects email over 254 characters', () => {
      const longEmail = `${'a'.repeat(250)}@b.co`; // > 254 chars
      const result = validateContactForm({ ...validInput, email: longEmail });
      expect(result.errors.email).toMatch(/254/);
    });
  });

  describe('Phone Number', () => {
    it('rejects phone over 30 characters', () => {
      const result = validateContactForm({ ...validInput, phone: '1'.repeat(31) });
      expect(result.errors.phone).toMatch(/30/);
    });

    it('does not restrict phone to a single US format', () => {
      // International format, no leading +1, unusual punctuation — all valid.
      const result = validateContactForm({ ...validInput, phone: '+977-1-4123456' });
      expect(result.valid).toBe(true);
    });
  });

  describe('Subject', () => {
    it('rejects missing subject', () => {
      const result = validateContactForm({ ...validInput, subject: '' });
      expect(result.errors.subject).toMatch(/select a subject/i);
    });

    it('rejects a subject value not in the allowed list', () => {
      const result = validateContactForm({ ...validInput, subject: 'not-a-real-subject' });
      expect(result.errors.subject).toMatch(/valid subject/i);
    });

    it('accepts every allowed subject value', () => {
      for (const subject of ['general', 'membership', 'school', 'events', 'donation', 'volunteer', 'other']) {
        expect(validateContactForm({ ...validInput, subject }).valid).toBe(true);
      }
    });
  });

  describe('Message', () => {
    it('rejects missing message', () => {
      const result = validateContactForm({ ...validInput, message: '' });
      expect(result.errors.message).toMatch(/required/i);
    });

    it('rejects message under 10 characters', () => {
      const result = validateContactForm({ ...validInput, message: 'too short' }); // 9 chars
      expect(result.errors.message).toMatch(/at least 10/i);
    });

    it('rejects message over 5000 characters', () => {
      const result = validateContactForm({ ...validInput, message: 'a'.repeat(5001) });
      expect(result.errors.message).toMatch(/5000/);
    });

    it('accepts message at exactly the boundaries', () => {
      expect(validateContactForm({ ...validInput, message: 'a'.repeat(10) }).valid).toBe(true);
      expect(validateContactForm({ ...validInput, message: 'a'.repeat(5000) }).valid).toBe(true);
    });
  });
});

describe('sanitizeForSpreadsheet', () => {
  it.each([
    ['=SUM(1,2)', "'=SUM(1,2)"],
    ['+123', "'+123"],
    ['-123', "'-123"],
    ['@something', "'@something"],
    ['=IMPORTXML("http://evil.example", "//")', '\'=IMPORTXML("http://evil.example", "//")'],
  ])('prefixes formula-like value %s with an apostrophe', (input, expected) => {
    expect(sanitizeForSpreadsheet(input)).toBe(expected);
  });

  it('leaves ordinary text untouched', () => {
    expect(sanitizeForSpreadsheet('Sabina Koirala')).toBe('Sabina Koirala');
    expect(sanitizeForSpreadsheet('Interested in volunteering!')).toBe('Interested in volunteering!');
  });

  it('treats a value that only starts with a formula trigger after leading whitespace as a formula too', () => {
    expect(sanitizeForSpreadsheet('  =cmd')).toBe("'  =cmd");
  });
});
