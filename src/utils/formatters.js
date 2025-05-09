/**
 * Utility functions for formatting data
 */

/**
 * Format a number as currency
 * @param {number} value - The value to format
 * @param {string} [currency='USD'] - The currency code
 * @param {string} [locale='en-US'] - The locale
 * @returns {string} The formatted currency string
 */
export const formatCurrency = (value, currency = 'USD', locale = 'en-US') => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency
  }).format(value);
};

/**
 * Format a number with thousands separators
 * @param {number} value - The value to format
 * @param {string} [locale='en-US'] - The locale
 * @returns {string} The formatted number string
 */
export const formatNumber = (value, locale = 'en-US') => {
  return new Intl.NumberFormat(locale).format(value);
};

/**
 * Format a number as a percentage
 * @param {number} value - The value to format (0-100)
 * @param {number} [minimumFractionDigits=1] - The minimum number of fraction digits
 * @param {number} [maximumFractionDigits=1] - The maximum number of fraction digits
 * @param {string} [locale='en-US'] - The locale
 * @returns {string} The formatted percentage string
 */
export const formatPercent = (value, minimumFractionDigits = 1, maximumFractionDigits = 1, locale = 'en-US') => {
  return new Intl.NumberFormat(locale, {
    style: 'percent',
    minimumFractionDigits,
    maximumFractionDigits
  }).format(value / 100);
};

/**
 * Format a date
 * @param {string|Date} date - The date to format
 * @param {string} [format='medium'] - The format to use (short, medium, long, full)
 * @param {string} [locale='en-US'] - The locale
 * @returns {string} The formatted date string
 */
export const formatDate = (date, format = 'medium', locale = 'en-US') => {
  if (!date) return 'N/A';

  try {
    const dateObj = date instanceof Date ? date : new Date(date);

    return new Intl.DateTimeFormat(locale, {
      dateStyle: format
    }).format(dateObj);
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Invalid Date';
  }
};

/**
 * Format a date and time
 * @param {string|Date} dateTime - The date and time to format
 * @param {string} [locale='en-US'] - The locale
 * @returns {string} The formatted date and time string
 */
export const formatDateTime = (dateTime, locale = 'en-US') => {
  if (!dateTime) return 'N/A';

  try {
    const dateObj = dateTime instanceof Date ? dateTime : new Date(dateTime);

    return dateObj.toLocaleString(locale);
  } catch (error) {
    console.error('Error formatting date time:', error);
    return 'Invalid Date';
  }
};
