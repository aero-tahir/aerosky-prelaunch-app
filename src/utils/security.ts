/**
 * Security and Validation Utilities
 */

/**
 * Sanitizes input text by removing HTML tags and trimming leading/trailing whitespace.
 * Prevents XSS and HTML injection in forms.
 */
export function sanitizeInput(input: string): string {
  if (typeof input !== 'string') return '';
  return input
    .replace(/<[^>]*>/g, '') // Strip HTML tags
    .replace(/[&<>"']/g, (m) => {
      // Escape HTML entities
      switch (m) {
        case '&': return '&amp;';
        case '<': return '&lt;';
        case '>': return '&gt;';
        case '"': return '&quot;';
        case "'": return '&#039;';
        default: return m;
      }
    })
    .trim();
}

/**
 * Validates whether an email has a valid format.
 */
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Check if the honeypot field is filled.
 * Bots typically fill all visible and invisible input fields in forms.
 * @param value The value of the honeypot field.
 * @returns True if it's a bot submission, false otherwise.
 */
export function isBotSubmission(value: string): boolean {
  return typeof value === 'string' && value.length > 0;
}

/**
 * Client-side rate limiting helper using localStorage.
 * Blocks multiple form submissions within a specified interval.
 * @param actionKey Unique name for the action (e.g. 'newsletter_signup', 'aerocaptain_apply')
 * @param minIntervalSeconds The minimum allowed time between submissions (default 10s)
 * @returns True if the request is rate-limited, false otherwise.
 */
export function isRateLimited(actionKey: string, minIntervalSeconds = 10): boolean {
  try {
    const now = Date.now();
    const lastSubmitStr = localStorage.getItem(`last_submit_${actionKey}`);
    
    if (lastSubmitStr) {
      const lastSubmit = parseInt(lastSubmitStr, 10);
      const secondsElapsed = (now - lastSubmit) / 1000;
      
      if (secondsElapsed < minIntervalSeconds) {
        return true;
      }
    }
    
    // Update the timestamp for successful attempts (or let the caller set it)
    localStorage.setItem(`last_submit_${actionKey}`, now.toString());
    return false;
  } catch (e) {
    // Fallback if localStorage is disabled or fails
    return false;
  }
}
