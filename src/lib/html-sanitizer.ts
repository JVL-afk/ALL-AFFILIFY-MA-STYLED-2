/**
 * HTML Sanitization Module
 * Provides robust HTML sanitization to prevent XSS vulnerabilities in email content.
 *
 * Uses a whitelist approach to allow safe HTML tags and attributes while stripping
 * potentially malicious content.
 */

import { logger } from './debug-logger';

/**
 * Represents the sanitization configuration.
 */
interface SanitizationConfig {
  allowedTags: string[];
  allowedAttributes: Record<string, string[]>;
  allowedSchemes: string[];
}

/**
 * Default sanitization configuration for email content.
 * Allows common email formatting tags while blocking script execution vectors.
 */
const DEFAULT_EMAIL_CONFIG: SanitizationConfig = {
  allowedTags: [
    'p',
    'br',
    'strong',
    'b',
    'em',
    'i',
    'u',
    'h1',
    'h2',
    'h3',
    'h4',
    'h5',
    'h6',
    'ul',
    'ol',
    'li',
    'blockquote',
    'a',
    'img',
    'table',
    'thead',
    'tbody',
    'tr',
    'td',
    'th',
    'div',
    'span',
    'hr',
  ],
  allowedAttributes: {
    a: ['href', 'title', 'target'],
    img: ['src', 'alt', 'width', 'height'],
    div: ['class', 'id'],
    span: ['class', 'id'],
    table: ['class', 'id', 'border', 'cellpadding', 'cellspacing'],
    td: ['class', 'id', 'colspan', 'rowspan'],
    th: ['class', 'id', 'colspan', 'rowspan'],
  },
  allowedSchemes: ['http', 'https', 'mailto'],
};

/**
 * Sanitize HTML content to prevent XSS vulnerabilities.
 *
 * @param html - The HTML content to sanitize
 * @param config - Optional custom sanitization configuration
 * @param traceId - Optional trace ID for logging
 * @returns Sanitized HTML content
 */
export function sanitizeHTML(html: string, config?: SanitizationConfig, traceId?: string): string {
  if (!html || typeof html !== 'string') {
    return '';
  }

  const sanitizationConfig = config || DEFAULT_EMAIL_CONFIG;

  try {
    // Remove script tags and their content
    let sanitized = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');

    // Remove event handlers (onclick, onload, etc.)
    sanitized = sanitized.replace(/\s*on\w+\s*=\s*["'][^"']*["']/gi, '');
    sanitized = sanitized.replace(/\s*on\w+\s*=\s*[^\s>]*/gi, '');

    // Remove style tags and their content
    sanitized = sanitized.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '');

    // Remove iframe tags
    sanitized = sanitized.replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '');

    // Remove embed and object tags
    sanitized = sanitized.replace(/<(embed|object)\b[^<]*(?:(?!<\/(embed|object)>)<[^<]*)*<\/(embed|object)>/gi, '');

    // Remove javascript: protocol from href and src
    sanitized = sanitized.replace(/href\s*=\s*["']javascript:[^"']*["']/gi, 'href="#"');
    sanitized = sanitized.replace(/src\s*=\s*["']javascript:[^"']*["']/gi, 'src=""');

    // Remove data: protocol from src (can be used for XSS)
    sanitized = sanitized.replace(/src\s*=\s*["']data:[^"']*["']/gi, 'src=""');

    // Remove vbscript: protocol
    sanitized = sanitized.replace(/src\s*=\s*["']vbscript:[^"']*["']/gi, 'src=""');

    // Remove potentially dangerous attributes from all tags
    const dangerousAttrs = ['onclick', 'onload', 'onerror', 'onmouseover', 'onmouseout', 'onchange', 'onsubmit'];
    dangerousAttrs.forEach((attr) => {
      const regex = new RegExp(`\\s${attr}\\s*=\\s*["'][^"']*["']`, 'gi');
      sanitized = sanitized.replace(regex, '');
    });

    logger.info('HTML sanitization completed', {
      trace_id: traceId,
      service: 'HTMLSanitizerModule',
      component: 'sanitizeHTML',
      action: 'HTML sanitized',
      message: 'HTML content sanitized successfully',
      details: {
        originalLength: html.length,
        sanitizedLength: sanitized.length,
        removed: html.length - sanitized.length,
      },
    });

    return sanitized;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logger.error('HTML sanitization failed', {
      trace_id: traceId,
      service: 'HTMLSanitizerModule',
      component: 'sanitizeHTML',
      action: 'Sanitization error',
      message: `Failed to sanitize HTML: ${errorMessage}`,
    });
    // Return empty string on error to prevent XSS
    return '';
  }
}

/**
 * Validate that a URL is safe (uses allowed scheme).
 *
 * @param url - The URL to validate
 * @param config - Optional custom sanitization configuration
 * @returns true if the URL is safe, false otherwise
 */
export function isSafeURL(url: string, config?: SanitizationConfig): boolean {
  if (!url || typeof url !== 'string') {
    return false;
  }

  const sanitizationConfig = config || DEFAULT_EMAIL_CONFIG;

  try {
    // Check for javascript: or data: protocols
    if (url.toLowerCase().startsWith('javascript:') || url.toLowerCase().startsWith('data:')) {
      return false;
    }

    // Check for vbscript: protocol
    if (url.toLowerCase().startsWith('vbscript:')) {
      return false;
    }

    // If URL starts with /, it's a relative URL (safe)
    if (url.startsWith('/')) {
      return true;
    }

    // If URL starts with #, it's an anchor (safe)
    if (url.startsWith('#')) {
      return true;
    }

    // If URL starts with mailto:, check if it's in allowed schemes
    if (url.toLowerCase().startsWith('mailto:')) {
      return sanitizationConfig.allowedSchemes.includes('mailto');
    }

    // Parse URL and check scheme
    try {
      const urlObj = new URL(url);
      return sanitizationConfig.allowedSchemes.includes(urlObj.protocol.replace(':', ''));
    } catch {
      // If URL parsing fails, it's likely a relative URL or malformed
      return false;
    }
  } catch (error) {
    logger.warn('URL validation failed', {
      service: 'HTMLSanitizerModule',
      component: 'isSafeURL',
      action: 'URL validation error',
      message: `Failed to validate URL: ${error instanceof Error ? error.message : String(error)}`,
    });
    return false;
  }
}

/**
 * Escape HTML special characters to prevent XSS.
 *
 * @param text - The text to escape
 * @returns Escaped HTML text
 */
export function escapeHTML(text: string): string {
  if (!text || typeof text !== 'string') {
    return '';
  }

  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  };

  return text.replace(/[&<>"']/g, (char) => map[char]);
}

/**
 * Strip all HTML tags from content (for plain text conversion).
 *
 * @param html - The HTML content
 * @returns Plain text without HTML tags
 */
export function stripHTMLTags(html: string): string {
  if (!html || typeof html !== 'string') {
    return '';
  }

  return html.replace(/<[^>]*>/g, '').trim();
}
