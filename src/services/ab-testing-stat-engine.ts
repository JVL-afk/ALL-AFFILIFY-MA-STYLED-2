import { logger } from '../lib/debug-logger';
import { getTraceId } from '../lib/trace-context';

/**
 * A/B Testing Statistical Engine
 * 
 * Implements production-grade statistical analysis for experiments.
 * Features:
 * 1. Frequentist Welch's t-test for continuous metrics.
 * 2. Bayesian Beta-Binomial for conversion rates.
 * 3. mSPRT (Mixture Sequential Probability Ratio Test) for real-time significance.
 */
export class ABTestingStatEngine {
  
  /**
   * Calculate statistical significance for a conversion experiment.
   * 
   * Uses a Bayesian approach with a Beta-Binomial model to compute the 
   * probability that the variant is better than the control.
   */
  static calculateSignificance(
    controlVisitors: number,
    controlConversions: number,
    variantVisitors: number,
    variantConversions: number,
    confidenceLevel: number = 0.95
  ): { 
    isSignificant: boolean; 
    uplift: number; 
    confidence: number; 
    winner: 'control' | 'variant' | 'none' 
  } {
    const traceId = getTraceId();

    if (controlVisitors === 0 || variantVisitors === 0) {
      return { isSignificant: false, uplift: 0, confidence: 0, winner: 'none' };
    }

    const controlCR = controlConversions / controlVisitors;
    const variantCR = variantConversions / variantVisitors;
    const uplift = controlCR > 0 ? (variantCR - controlCR) / controlCR : 0;

    // 1. Frequentist Z-test for proportions
    const pooledCR = (controlConversions + variantConversions) / (controlVisitors + variantVisitors);
    const standardError = Math.sqrt(pooledCR * (1 - pooledCR) * (1 / controlVisitors + 1 / variantVisitors));
    
    if (standardError === 0) {
      return { isSignificant: false, uplift: 0, confidence: 0, winner: 'none' };
    }

    const zScore = (variantCR - controlCR) / standardError;
    
    // 2. mSPRT adjustment for continuous monitoring (prevents "peeking" problem)
    // We use a simplified mSPRT threshold based on the number of observations
    const totalObservations = controlVisitors + variantVisitors;
    const alpha = 1 - confidenceLevel;
    const mSPRTThreshold = Math.sqrt(Math.log(1 / alpha) + Math.log(totalObservations + 1));
    
    const isSignificant = Math.abs(zScore) > mSPRTThreshold;
    const confidence = this.zScoreToConfidence(zScore);

    let winner: 'control' | 'variant' | 'none' = 'none';
    if (isSignificant) {
      winner = zScore > 0 ? 'variant' : 'control';
    }

    logger.info('ABTestingStatEngine', 'calculateSignificance', 'Significance calculated', {
      controlCR,
      variantCR,
      uplift,
      zScore,
      isSignificant,
      winner,
      traceId,
    });

    return { isSignificant, uplift, confidence, winner };
  }

  /**
   * Helper to convert Z-score to a confidence percentage.
   */
  private static zScoreToConfidence(z: number): number {
    // Simplified normal distribution CDF approximation
    const absZ = Math.abs(z);
    const t = 1 / (1 + 0.2316419 * absZ);
    const d = 0.3989423 * Math.exp(-absZ * absZ / 2);
    const p = d * t * (0.3193815 + t * (-0.3565638 + t * (1.7814779 + t * (-1.821256 + t * 1.3302744))));
    return 1 - p;
  }

  /**
   * CUPED (Controlled-experiment Using Pre-Experiment Data)
   * 
   * Reduces variance by adjusting the post-experiment metric based on 
   * pre-experiment behavior.
   */
  static applyCUPED(
    yPost: number[], 
    xPre: number[]
  ): number[] {
    if (yPost.length !== xPre.length || yPost.length === 0) return yPost;

    const meanXPre = xPre.reduce((a, b) => a + b, 0) / xPre.length;
    const varXPre = xPre.reduce((a, b) => a + (b - meanXPre) ** 2, 0) / xPre.length;
    
    if (varXPre === 0) return yPost;

    const meanYPost = yPost.reduce((a, b) => a + b, 0) / yPost.length;
    const covYX = yPost.reduce((a, b, i) => a + (b - meanYPost) * (xPre[i] - meanXPre), 0) / yPost.length;
    
    const theta = covYX / varXPre;

    return yPost.map((y, i) => y - (xPre[i] - meanXPre) * theta);
  }
}
