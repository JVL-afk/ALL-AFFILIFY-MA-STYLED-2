// src/lib/content-brain/types.ts

import { LucideIcon } from 'lucide-react';

/**
 * Defines the core structure for the Affiliate Content Brain's persistent context.
 * This is the AFFILIFY version of Ghostwriter's "Campaign DNA."
 */
export interface AffiliateContentDNA {
  // 1. Affiliate Profile (Brand Voice & Style)
  affiliateId: string;
  brandVoice: 'professional' | 'casual' | 'expert' | 'witty' | 'inspirational';
  targetAudience: string; // e.g., "Beginner affiliate marketers interested in tech gadgets"
  uniqueSellingProposition: string; // The affiliate's unique angle/value
  
  // 2. Product Intelligence (The "What")
  promotedProductId: string; // ID of the product being promoted
  productName: string;
  productUVP: string; // Product's Unique Value Proposition
  productPainPoints: string[]; // Problems the product solves
  deepScrapeData: Record<string, any>; // Structured data from the deep scrape engine
  
  // 3. Market Context (The "Where")
  primaryKeywords: string[]; // High-converting keywords for the campaign
  secondaryKeywords: string[]; // LSI terms for SEO
  competitorAnalysisSummary: string; // Summary of competitor content/angles
  
  // 4. Content History (Self-Learning)
  contentHistoryIds: string[]; // IDs of previously generated content pieces
  performanceMetrics: Record<string, number>; // CTR, Conversion Rate data for past content
}

/**
 * Defines a specialized AI Agent for content generation.
 * This is the AFFILIFY version of Ghostwriter's "Agents."
 */
export interface ContentAgent {
  id: string;
  name: string;
  description: string;
  icon: LucideIcon;
  promptTemplate: string; // The Mega-Prompt for the LLM
  outputFormat: 'markdown' | 'html' | 'json';
  requiredDNAFields: (keyof AffiliateContentDNA)[];
}

/**
 * Defines a content workflow sequence.
 * This is the AFFILIFY version of Ghostwriter's "Flows."
 */
export interface ContentFlow {
  id: string;
  name: string;
  description: string;
  steps: {
    agentId: string;
    inputSource: 'user' | 'previous_step' | 'dna';
    outputTarget: 'docOS' | 'next_step' | 'database';
  }[];
}

/**
 * Defines the structure for a generated content piece.
 */
export interface GeneratedContent {
  id: string;
  sessionId: string;
  dnaSnapshot: AffiliateContentDNA;
  agentUsed: string;
  title: string;
  content: string;
  format: 'markdown' | 'html' | 'json';
  plagiarismScore: number; // 0-100, lower is better
  aiDetectionScore: number; // 0-100, lower is better
  seoScore: number; // 0-100
  createdAt: Date;
}
