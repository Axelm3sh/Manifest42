import {useI18n} from 'vue-i18n';

export function useFormatters() {
  const { t } = useI18n();

  /**
   * Format a number with the specified number of decimal places
   * @param {number} value - The number to format
   * @param {number} decimals - The number of decimal places
   * @returns {string} The formatted number
   */
  const formatNumber = (value, decimals = 0) => {
    if (value === undefined || value === null) return '';
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    }).format(value);
  };

  /**
   * Format a number as a percentage
   * @param {number} value - The number to format (0-1)
   * @param {number} decimals - The number of decimal places
   * @returns {string} The formatted percentage
   */
  const formatPercent = (value, decimals = 1) => {
    if (value === undefined || value === null) return '';
    return new Intl.NumberFormat('en-US', {
      style: 'percent',
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    }).format(value);
  };

  /**
   * Format a number as currency
   * @param {number} value - The number to format
   * @param {string} currency - The currency code
   * @returns {string} The formatted currency
   */
  const formatCurrency = (value, currency = 'USD') => {
    if (value === undefined || value === null) return '';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(value);
  };

  /**
   * Format a date string
   * @param {string} dateString - The date string to format
   * @returns {string} The formatted date
   */
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  /**
   * Format a date and time string
   * @param {string} dateString - The date string to format
   * @returns {string} The formatted date and time
   */
  const formatDateTime = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  /**
   * Sanitize a string to prevent XSS
   * @param {string} str - The string to sanitize
   * @returns {string} The sanitized string
   */
  const sanitize = (str) => {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  };

  return {
    formatNumber,
    formatPercent,
    formatCurrency,
    formatDate,
    formatDateTime,
    sanitize
  };
}