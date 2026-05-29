/**
 * Security utilities for the application
 * Provides functions for CSRF protection, XSS prevention, and other security measures
 */

/**
 * Return the platform crypto implementation (browser or Node) or throw.
 * @returns {Crypto}
 */
function getCrypto() {
  const cryptoObj = globalThis.crypto;
  if (!cryptoObj || typeof cryptoObj.getRandomValues !== 'function') {
    throw new Error('Secure crypto API is not available in this environment');
  }
  return cryptoObj;
}

/**
 * Generate a hex string backed by cryptographically secure random bytes.
 * @param {number} byteLength - Number of random bytes to generate
 * @returns {string} Hex-encoded random string
 */
function randomHex(byteLength) {
  const bytes = new Uint8Array(byteLength);
  getCrypto().getRandomValues(bytes);
  return Array.from(bytes, b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Generate a CSRF token using a cryptographically secure RNG.
 * @returns {string} The generated CSRF token
 */
export function generateCSRFToken() {
  return randomHex(32);
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
    
    // Wildcard match (e.g., *.example.com) — only match the apex domain or a
    // true subdomain. Using endsWith(domain) alone would also accept
    // look-alike domains such as "evilexample.com", so require a dot boundary.
    if (allowed.startsWith('*.')) {
      const domain = allowed.substring(2);
      return origin === domain || origin.endsWith('.' + domain);
    }
    
    return false;
  });
}

/**
 * Create a nonce for use in CSP
 * @returns {string} A random nonce value
 */
export function createNonce() {
  return randomHex(16);
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