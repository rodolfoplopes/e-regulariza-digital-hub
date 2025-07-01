
import DOMPurify from 'dompurify';

/**
 * Sanitize HTML content to prevent XSS attacks
 * @param dirty - The potentially unsafe HTML string
 * @returns Clean, safe HTML string
 */
export const sanitizeHTML = (dirty: string): string => {
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'br', 'ul', 'ol', 'li'],
    ALLOWED_ATTR: ['href', 'target'],
    ALLOW_DATA_ATTR: false,
  });
};

/**
 * Sanitize plain text input by removing any HTML tags
 * @param input - The input string
 * @returns Clean text string without HTML
 */
export const sanitizeText = (input: string): string => {
  return DOMPurify.sanitize(input, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] });
};

/**
 * Sanitize user input for database storage
 * @param input - The input string
 * @returns Trimmed and sanitized string
 */
export const sanitizeForStorage = (input: string): string => {
  return sanitizeText(input.trim());
};
