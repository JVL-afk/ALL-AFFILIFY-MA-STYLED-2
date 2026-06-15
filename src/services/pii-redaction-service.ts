import { logger } from '@/lib/debug-logger';

/**
 * PII Redaction Service
 * Detects and masks sensitive information (PII) before sending data to external LLMs.
 */
export class PIIRedactionService {
  private static patterns = {
    creditCard: /\b(?:\d[ -]*?){13,16}\b/g,
    email: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g,
    phone: /\b(?:\+?1[-. ]?)?\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})\b/g,
    ssn: /\b\d{3}-\d{2}-\d{4}\b/g,
    ipv4: /\b(?:\d{1,3}\.){3}\d{1,3}\b/g,
  };

  /**
   * Redact PII from a string.
   */
  public static redact(text: string): string {
    let redactedText = text;

    // Redact Credit Cards
    redactedText = redactedText.replace(this.patterns.creditCard, (match) => {
      if (this.validateLuhn(match.replace(/[- ]/g, ''))) {
        return '[REDACTED_CARD]';
      }
      return match;
    });

    // Redact Emails
    redactedText = redactedText.replace(this.patterns.email, '[REDACTED_EMAIL]');

    // Redact Phones
    redactedText = redactedText.replace(this.patterns.phone, '[REDACTED_PHONE]');

    // Redact SSNs
    redactedText = redactedText.replace(this.patterns.ssn, '[REDACTED_SSN]');

    // Redact IP Addresses
    redactedText = redactedText.replace(this.patterns.ipv4, '[REDACTED_IP]');

    if (redactedText !== text) {
      logger.info('PIIRedactionService', 'redact', 'PII detected and redacted', 'PII detected and redacted', {
        originalLength: text.length,
        redactedLength: redactedText.length,
      });
    }

    return redactedText;
  }

  /**
   * Luhn algorithm for credit card validation.
   */
  private static validateLuhn(cardNumber: string): boolean {
    let sum = 0;
    let shouldDouble = false;
    for (let i = cardNumber.length - 1; i >= 0; i--) {
      let digit = parseInt(cardNumber.charAt(i));
      if (shouldDouble) {
        if ((digit *= 2) > 9) digit -= 9;
      }
      sum += digit;
      shouldDouble = !shouldDouble;
    }
    return sum % 10 === 0;
  }
}
