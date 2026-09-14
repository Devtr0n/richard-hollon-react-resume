import { describe, it, expect } from 'vitest';
import { EMAIL_REGEX } from './Contact';

// Property-style fuzz test: EMAIL_REGEX is client-side-only validation (the
// real check happens server-side at Formspree), so this isn't a security
// boundary. Its job here is narrower: never throw, never hang (catastrophic
// backtracking), and stay consistent on a wide variety of inputs including
// unicode, very long strings, and injection-like payloads.

function randomChar() {
  const pools = [
    'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789',
    ' \t\n@.-_+!#$%^&*()[]{}<>"\'\\/',
    '\u00e9\u00fc\u00f1\u4e2d\u6587\ud83d\ude00\u0301\u200b', // accented, CJK, emoji, combining, zero-width
  ];
  const pool = pools[Math.floor(Math.random() * pools.length)];
  return pool[Math.floor(Math.random() * pool.length)];
}

function randomString(maxLength) {
  const length = Math.floor(Math.random() * maxLength);
  let result = '';
  for (let i = 0; i < length; i += 1) {
    result += randomChar();
  }
  return result;
}

describe('Contact EMAIL_REGEX fuzzing', () => {
  it('never throws and always returns a boolean for 500 random fuzzed strings', () => {
    for (let i = 0; i < 500; i += 1) {
      const input = randomString(200);
      let result;
      expect(() => {
        result = EMAIL_REGEX.test(input);
      }).not.toThrow();
      expect(typeof result).toBe('boolean');
    }
  });

  it('does not hang on pathological long inputs (catastrophic backtracking guard)', () => {
    const longLocalPart = 'a'.repeat(50000);
    const start = Date.now();
    const result = EMAIL_REGEX.test(`${longLocalPart}@example.com`);
    expect(Date.now() - start).toBeLessThan(1000);
    expect(result).toBe(true);

    const startInvalid = Date.now();
    const resultInvalid = EMAIL_REGEX.test(`${longLocalPart}!!!`.repeat(5));
    expect(Date.now() - startInvalid).toBeLessThan(1000);
    expect(resultInvalid).toBe(false);
  });

  it('rejects injection-like and markup-like strings', () => {
    const payloads = [
      '"><script>alert(1)</script>',
      "' OR '1'='1",
      '<img src=x onerror=alert(1)>',
      '${7*7}',
      '{{7*7}}',
      'javascript:alert(1)',
      'a@b@c.com',
      '@example.com',
      'name@',
      'name@.com',
      'name@com',
    ];
    for (const payload of payloads) {
      expect(EMAIL_REGEX.test(payload)).toBe(false);
    }
  });

  it('accepts a variety of valid-looking unicode and standard emails', () => {
    const validEmails = [
      'jane.doe@example.com',
      'jane+tag@example.co.uk',
      'j@e.io',
      '\u00fcser@ex\u00e4mple.com',
      '\u4e2d\u6587@example.com',
    ];
    for (const email of validEmails) {
      expect(EMAIL_REGEX.test(email)).toBe(true);
    }
  });
});
