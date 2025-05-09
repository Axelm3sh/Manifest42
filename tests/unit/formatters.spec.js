import {describe, expect, it} from 'vitest';
import {formatCurrency, formatDate} from '../../src/utils/formatters';

describe('formatters', () => {
  describe('formatCurrency', () => {
    it('formats a number as USD currency by default', () => {
      expect(formatCurrency(1000)).toBe('$1,000.00');
    });

    it('formats a number with specified currency', () => {
      expect(formatCurrency(1000, 'EUR')).toBe('€1,000.00');
    });

    it('formats a number with specified locale', () => {
      // Using fr-FR locale which uses spaces as thousand separators and commas for decimals
      const formatted = formatCurrency(1000, 'EUR', 'fr-FR');
      // Check for key parts of the formatting rather than exact string
      expect(formatted).toContain('1');
      expect(formatted).toContain('000');
      expect(formatted).toContain(',00');
      expect(formatted).toContain('€');
    });

    it('handles zero correctly', () => {
      expect(formatCurrency(0)).toBe('$0.00');
    });

    it('handles negative numbers correctly', () => {
      expect(formatCurrency(-1000)).toBe('-$1,000.00');
    });
  });

  describe('formatDate', () => {
    // Create a fixed date for testing
    const testDate = new Date('2023-05-15T12:00:00Z');

    it('formats a date with medium format by default', () => {
      // The exact format depends on the environment, so we'll check for parts
      const formatted = formatDate(testDate);
      expect(formatted).toContain('2023');
      expect(formatted).toMatch(/May|5/); // Either "May" or "5" depending on locale
    });

    it('formats a date with short format', () => {
      const formatted = formatDate(testDate, 'short');
      expect(formatted.length).toBeLessThan(formatDate(testDate, 'long').length);
    });

    it('formats a date with long format', () => {
      const formatted = formatDate(testDate, 'long');
      expect(formatted.length).toBeGreaterThan(formatDate(testDate, 'short').length);
    });

    it('accepts date string as input', () => {
      const dateStr = '2023-05-15T12:00:00Z';
      const formatted = formatDate(dateStr);
      expect(formatted).toContain('2023');
    });

    it('handles different locales', () => {
      // French format includes month name in French
      const formatted = formatDate(testDate, 'long', 'fr-FR');
      // Check for French month name (mai for May)
      expect(formatted).toContain('mai');
      // Check for year
      expect(formatted).toContain('2023');
    });
  });
});
