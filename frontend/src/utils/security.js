/**
 * Security utilities for the application
 * Provides functions for CSRF protection, XSS prevention, and other security measures
 */

/**
 * Generate a CSRF token
 * @returns {string} The generated CSRF token
 */
export function generateCSRFToken() {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
}

/**
 * Store the CSRF token in localStorage
 * @param {string} token - The CSRF token to store
 */
export function storeCSRFToken(token) {
  localStorage.setItem('csrf_token', token);
}

/**
 * Get the stored CSRF token
 * @returns {string|null} The stored CSRF token or null if not found
 */
export function getCSRFToken() {
  return localStorage.getItem('csrf_token');
}

/**
 * Add CSRF token to request headers
 * @param {Object} headers - The headers object to add the token to
 * @returns {Object} The updated headers object
 */
export function addCSRFTokenToHeaders(headers = {}) {
  const token = getCSRFToken();
  if (token) {
    headers['X-CSRF-Token'] = token;
  }
  return headers;
}

/**
 * Sanitize a string to prevent XSS attacks
 * @param {string} str - The string to sanitize
 * @returns {string} The sanitized string
 */
export function sanitizeString(str) {
  if (!str) return '';
  
  // Create a temporary element
  const temp = document.createElement('div');
  // Set the innerHTML to the string to be sanitized
  temp.textContent = str;
  // Return the sanitized string
  return temp.innerHTML;
}

/**
 * Initialize security measures
 * This should be called when the application starts
 */
export function initializeSecurity() {
  // Generate and store a CSRF token if one doesn't exist
  if (!getCSRFToken()) {
    const token = generateCSRFToken();
    storeCSRFToken(token);
  }
  
  // Add other security initializations here
}

/**
 * Validate the origin of a request
 * @param {string} origin - The origin to validate
 * @param {Array<string>} allowedOrigins - The list of allowed origins
 * @returns {boolean} Whether the origin is allowed
 */
export function validateOrigin(origin, allowedOrigins = []) {
  if (!origin) return false;
  
  // Check if the origin is in the allowed list
  return allowedOrigins.some(allowed => {
    // Exact match
    if (allowed === origin) return true;
    
    // Wildcard match (e.g., *.example.com)
    if (allowed.startsWith('*.')) {
      const domain = allowed.substring(2);
      return origin.endsWith(domain) && origin.includes('.');
    }
    
    return false;
  });
}

/**
 * Create a nonce for use in CSP
 * @returns {string} A random nonce value
 */
export function createNonce() {
  return Math.random().toString(36).substring(2, 15);
}

// Export a default object with all functions
export default {
  generateCSRFToken,
  storeCSRFToken,
  getCSRFToken,
  addCSRFTokenToHeaders,
  sanitizeString,
  initializeSecurity,
  validateOrigin,
  createNonce
};