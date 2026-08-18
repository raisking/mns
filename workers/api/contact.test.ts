import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { handleContactRequest, type Env } from './contact';

const ALLOWED_ORIGIN = 'https://mariettanepalisamaj.org';

const baseEnv: Env = {
  GOOGLE_APPS_SCRIPT_URL: 'https://script.google.com/macros/s/fake/exec',
  CONTACT_FORM_SECRET: 'test-shared-secret',
  TURNSTILE_SECRET_KEY: 'test-turnstile-secret',
  ALLOWED_ORIGIN,
};

const validPayload = {
  fullName: 'Sabina Koirala',
  email: 'sabina@example.com',
  phone: '+1 (555) 123-4567',
  subject: 'general',
  message: 'Hello, I would like to learn more about MNS programs.',
  sourcePage: 'https://mariettanepalisamaj.org/contact',
  turnstileToken: 'valid-token',
  website: '', // honeypot, empty for real submissions
};

function makeRequest(body: unknown, init: { method?: string; origin?: string | null; rawBody?: string; headers?: Record<string, string> } = {}): Request {
  const headers = new Headers(init.headers ?? {});
  if (init.origin !== null) {
    headers.set('Origin', init.origin ?? ALLOWED_ORIGIN);
  }
  if (!headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }
  const method = init.method ?? 'POST';
  const canHaveBody = method !== 'GET' && method !== 'HEAD';
  return new Request('https://mariettanepalisamaj.org/api/contact', {
    method,
    headers,
    body: canHaveBody ? (init.rawBody ?? JSON.stringify(body)) : undefined,
  });
}

/** Mocks the two outbound calls the Worker makes: Turnstile siteverify, then Apps Script. */
function mockUpstream(options: { turnstileOk?: boolean; appsScriptOk?: boolean; appsScriptThrows?: boolean } = {}) {
  const { turnstileOk = true, appsScriptOk = true, appsScriptThrows = false } = options;
  const calls: { url: string; init?: RequestInit }[] = [];

  const fetchMock = vi.fn(async (url: string | URL | Request, init?: RequestInit) => {
    const urlStr = typeof url === 'string' ? url : url.toString();
    calls.push({ url: urlStr, init });

    if (urlStr.includes('siteverify')) {
      return new Response(JSON.stringify({ success: turnstileOk }), { status: 200 });
    }
    if (urlStr.includes('script.google.com')) {
      if (appsScriptThrows) throw new Error('network down');
      return new Response(JSON.stringify({ success: appsScriptOk }), {
        status: appsScriptOk ? 200 : 500,
      });
    }
    throw new Error(`Unexpected fetch to ${urlStr}`);
  });

  vi.stubGlobal('fetch', fetchMock);
  return calls;
}

describe('handleContactRequest', () => {
  beforeEach(() => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it('accepts a fully valid submission and forwards it to Apps Script', async () => {
    const calls = mockUpstream();
    const res = await handleContactRequest(makeRequest(validPayload), baseEnv);

    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json).toEqual({ success: true });

    const appsScriptCall = calls.find(c => c.url.includes('script.google.com'));
    expect(appsScriptCall).toBeDefined();
    const sentBody = JSON.parse(appsScriptCall!.init!.body as string);
    expect(sentBody.secret).toBe('test-shared-secret');
    expect(sentBody.fullName).toBe('Sabina Koirala');
    expect(sentBody.email).toBe('sabina@example.com');
  });

  it('rejects non-POST methods', async () => {
    mockUpstream();
    const res = await handleContactRequest(makeRequest(validPayload, { method: 'GET' }), baseEnv);
    expect(res.status).toBe(405);
    expect((await res.json())).toEqual({ success: false });
  });

  it('rejects a mismatched origin', async () => {
    mockUpstream();
    const res = await handleContactRequest(
      makeRequest(validPayload, { origin: 'https://evil.example' }),
      baseEnv
    );
    expect(res.status).toBe(403);
  });

  it('rejects a request with neither Origin nor Referer', async () => {
    mockUpstream();
    const res = await handleContactRequest(makeRequest(validPayload, { origin: null }), baseEnv);
    expect(res.status).toBe(403);
  });

  it('falls back to a matching Referer when Origin is absent (same-origin proxies do not always send Origin)', async () => {
    mockUpstream();
    const res = await handleContactRequest(
      makeRequest(validPayload, {
        origin: null,
        headers: { Referer: `${ALLOWED_ORIGIN}/contact` },
      }),
      baseEnv
    );
    expect(res.status).toBe(200);
  });

  it('rejects a mismatched Referer when Origin is absent', async () => {
    mockUpstream();
    const res = await handleContactRequest(
      makeRequest(validPayload, {
        origin: null,
        headers: { Referer: 'https://evil.example/contact' },
      }),
      baseEnv
    );
    expect(res.status).toBe(403);
  });

  it('rejects an oversized body', async () => {
    mockUpstream();
    const res = await handleContactRequest(
      makeRequest(validPayload, {
        rawBody: JSON.stringify({ ...validPayload, message: 'a'.repeat(100_000) }),
      }),
      baseEnv
    );
    expect(res.status).toBe(413);
  });

  it('rejects an oversized body reported via Content-Length even before reading it', async () => {
    mockUpstream();
    const res = await handleContactRequest(
      makeRequest(validPayload, { headers: { 'Content-Length': '999999' } }),
      baseEnv
    );
    expect(res.status).toBe(413);
  });

  it('rejects malformed JSON', async () => {
    mockUpstream();
    const res = await handleContactRequest(
      makeRequest(null, { rawBody: '{not valid json' }),
      baseEnv
    );
    expect(res.status).toBe(400);
  });

  it('silently accepts (without forwarding) when the honeypot is filled', async () => {
    const calls = mockUpstream();
    const res = await handleContactRequest(
      makeRequest({ ...validPayload, website: 'http://spammer.example' }),
      baseEnv
    );
    expect(res.status).toBe(200);
    expect((await res.json())).toEqual({ success: true });
    expect(calls.find(c => c.url.includes('script.google.com'))).toBeUndefined();
  });

  describe('field validation', () => {
    it('rejects a missing full name', async () => {
      mockUpstream();
      const res = await handleContactRequest(makeRequest({ ...validPayload, fullName: '' }), baseEnv);
      expect(res.status).toBe(400);
    });

    it('rejects an invalid email', async () => {
      mockUpstream();
      const res = await handleContactRequest(makeRequest({ ...validPayload, email: 'not-an-email' }), baseEnv);
      expect(res.status).toBe(400);
    });

    it('rejects a message under 10 characters', async () => {
      mockUpstream();
      const res = await handleContactRequest(makeRequest({ ...validPayload, message: 'short' }), baseEnv);
      expect(res.status).toBe(400);
    });

    it('rejects a message over 5000 characters', async () => {
      mockUpstream();
      const res = await handleContactRequest(
        makeRequest({ ...validPayload, message: 'a'.repeat(5001) }),
        baseEnv
      );
      expect(res.status).toBe(400);
    });

    it('rejects a subject not in the allowed list', async () => {
      mockUpstream();
      const res = await handleContactRequest(
        makeRequest({ ...validPayload, subject: 'not-a-real-subject' }),
        baseEnv
      );
      expect(res.status).toBe(400);
    });
  });

  describe('Turnstile', () => {
    it('rejects a missing Turnstile token', async () => {
      mockUpstream();
      const res = await handleContactRequest(
        makeRequest({ ...validPayload, turnstileToken: '' }),
        baseEnv
      );
      expect(res.status).toBe(400);
    });

    it('rejects when Turnstile siteverify reports failure', async () => {
      mockUpstream({ turnstileOk: false });
      const res = await handleContactRequest(makeRequest(validPayload), baseEnv);
      expect(res.status).toBe(400);
    });
  });

  describe('spreadsheet formula-injection protection', () => {
    it.each(['=SUM(1,2)', '+123', '-123', '@something'])(
      'sanitizes a %s message before forwarding to Apps Script',
      async formulaLike => {
        const calls = mockUpstream();
        const res = await handleContactRequest(
          makeRequest({ ...validPayload, message: `${formulaLike} rest of message here` }),
          baseEnv
        );
        expect(res.status).toBe(200);

        const appsScriptCall = calls.find(c => c.url.includes('script.google.com'));
        const sentBody = JSON.parse(appsScriptCall!.init!.body as string);
        expect(sentBody.message.startsWith("'")).toBe(true);
        expect(sentBody.message).toBe(`'${formulaLike} rest of message here`);
      }
    );
  });

  describe('backend failures', () => {
    it('returns a safe error when Apps Script is unavailable', async () => {
      mockUpstream({ appsScriptThrows: true });
      const res = await handleContactRequest(makeRequest(validPayload), baseEnv);
      expect(res.status).toBe(502);
      expect((await res.json())).toEqual({ success: false });
    });

    it('returns a safe error when Apps Script reports failure', async () => {
      mockUpstream({ appsScriptOk: false });
      const res = await handleContactRequest(makeRequest(validPayload), baseEnv);
      expect(res.status).toBe(502);
    });

    it('returns a safe error when Apps Script responds with invalid JSON', async () => {
      const fetchMock = vi.fn(async (url: string | URL | Request) => {
        const urlStr = typeof url === 'string' ? url : url.toString();
        if (urlStr.includes('siteverify')) {
          return new Response(JSON.stringify({ success: true }), { status: 200 });
        }
        return new Response('not json', { status: 200 });
      });
      vi.stubGlobal('fetch', fetchMock);

      const res = await handleContactRequest(makeRequest(validPayload), baseEnv);
      expect(res.status).toBe(502);
    });
  });
});
