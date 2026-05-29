import {describe, expect, it} from 'vitest';
import {
  generateCSRFToken,
  createNonce,
  validateOrigin,
  sanitizeString
} from '../../src/utils/security';

describe('security utils', () => {
  describe('generateCSRFToken', () => {
    it('returns a long hex string', () => {
      const token = generateCSRFToken();
      expect(token).toMatch(/^[0-9a-f]+$/);
      // 32 random bytes -> 64 hex chars
      expect(token).toHaveLength(64);
    });

    it('produces unique values across calls', () => {
      const tokens = new Set(Array.from({length: 100}, () => generateCSRFToken()));
      expect(tokens.size).toBe(100);
    });
  });

  describe('createNonce', () => {
    it('returns a hex string', () => {
      expect(createNonce()).toMatch(/^[0-9a-f]+$/);
    });
  });

  describe('validateOrigin', () => {
    it('matches exact origins', () => {
      expect(validateOrigin('https://app.example.com', ['https://app.example.com'])).toBe(true);
    });

    it('matches true subdomains for wildcards', () => {
      expect(validateOrigin('sub.example.com', ['*.example.com'])).toBe(true);
      expect(validateOrigin('example.com', ['*.example.com'])).toBe(true);
    });

    it('rejects look-alike domains for wildcards', () => {
      // Regression: endsWith('example.com') alone would wrongly accept these.
      expect(validateOrigin('evilexample.com', ['*.example.com'])).toBe(false);
      expect(validateOrigin('notexample.com', ['*.example.com'])).toBe(false);
    });

    it('rejects empty origins', () => {
      expect(validateOrigin('', ['*.example.com'])).toBe(false);
    });
  });

  describe('sanitizeString', () => {
    it('escapes HTML special characters', () => {
      expect(sanitizeString('<script>alert(1)</script>')).not.toContain('<script>');
    });

    it('returns empty string for falsy input', () => {
      expect(sanitizeString('')).toBe('');
    });
  });
});
