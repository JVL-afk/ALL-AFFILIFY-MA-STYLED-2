import { logger } from '@/lib/debug-logger';

/**
 * Prompt Injection Shield Service
 * Detects and mitigates adversarial prompts and injection attempts.
 */
export class PromptInjectionShield {
  private static maliciousPatterns = [
    /ignore previous instructions/i,
    /system prompt/i,
    /you are now/i,
    /forget everything/i,
    /new rules/i,
    /sql injection/i,
    /<script>/i,
    /drop table/i,
  ];

  /**
   * Analyze a prompt for injection risks.
   */
  public static analyze(prompt: string): { isSafe: boolean; riskScore: number; reason?: string } {
    let riskScore = 0;
    let detectedPatterns: string[] = [];

    for (const pattern of this.maliciousPatterns) {
      if (pattern.test(prompt)) {
        riskScore += 25;
        detectedPatterns.push(pattern.source);
      }
    }

    // Check for high entropy (potential obfuscation)
    const entropy = this.calculateEntropy(prompt);
    if (entropy > 5.0 && prompt.length > 50) {
      riskScore += 15;
      detectedPatterns.push('high_entropy');
    }

    const isSafe = riskScore < 50;

    if (!isSafe) {
      logger.warn('PromptInjectionShield', 'analyze', 'High risk prompt detected', 'High risk prompt detected', {
        riskScore,
        detectedPatterns,
        promptPreview: prompt.substring(0, 100),
      });
    }

    return {
      isSafe,
      riskScore,
      reason: isSafe ? undefined : `High risk patterns detected: ${detectedPatterns.join(', ')}`,
    };
  }

  /**
   * Calculate Shannon entropy of a string.
   */
  private static calculateEntropy(str: string): number {
    const len = str.length;
    if (len === 0) return 0;
    const frequencies: Record<string, number> = {};
    for (let i = 0; i < len; i++) {
      const char = str[i];
      frequencies[char] = (frequencies[char] || 0) + 1;
    }
    let entropy = 0;
    for (const char in frequencies) {
      const p = frequencies[char] / len;
      entropy -= p * Math.log2(p);
    }
    return entropy;
  }
}
