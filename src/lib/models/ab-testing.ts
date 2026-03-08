import { z } from 'zod';
import { ObjectId } from 'mongodb';

/**
 * A/B Testing Domain Model & Data Contracts
 * 
 * This file defines the strict TypeScript interfaces and Zod schemas
 * for the A/B testing engine, ensuring type safety and runtime validation.
 */

export const VariantSchema = z.object({
  id: z.string().uuid().or(z.string().regex(/^[0-9a-fA-F]{24}$/)),
  name: z.string().min(1),
  description: z.string().optional(),
  trafficAllocation: z.number().int().min(0).max(10000), // Basis points (0-100%)
  isControl: z.boolean().default(false),
  metadata: z.record(z.any()).optional(),
});

export type Variant = z.infer<typeof VariantSchema>;

export const ExperimentStatusSchema = z.enum([
  'DRAFT',
  'RUNNING',
  'PAUSED',
  'ROLLBACK',
  'COMPLETED',
]);

export type ExperimentStatus = z.infer<typeof ExperimentStatusSchema>;

export const ExperimentTypeSchema = z.enum([
  'headline',
  'cta',
  'layout',
  'color',
  'image',
  'full-page',
]);

export type ExperimentType = z.infer<typeof ExperimentTypeSchema>;

export const ExperimentSchema = z.object({
  _id: z.instanceof(ObjectId).optional(),
  tenantId: z.instanceof(ObjectId),
  name: z.string().min(1),
  description: z.string().optional(),
  websiteId: z.instanceof(ObjectId),
  websiteName: z.string(),
  status: ExperimentStatusSchema.default('DRAFT'),
  type: ExperimentTypeSchema,
  variants: z.array(VariantSchema).min(2),
  metrics: z.object({
    primaryGoal: z.enum(['clicks', 'conversions', 'revenue', 'signups']),
    confidenceLevel: z.number().min(0).max(1).default(0.95),
    statisticalSignificance: z.boolean().default(false),
    winner: z.string().optional(),
  }),
  schedule: z.object({
    startDate: z.date().optional(),
    endDate: z.date().optional(),
    duration: z.number().int().positive().default(14), // Days
  }),
  conflictGroupId: z.instanceof(ObjectId).optional(),
  version: z.number().int().nonnegative().default(0),
  createdAt: z.date().default(() => new Date()),
  updatedAt: z.date().default(() => new Date()),
});

export type Experiment = z.infer<typeof ExperimentSchema>;

/**
 * Event Schema for Ingestion Pipeline
 */
export const ExperimentEventSchema = z.object({
  eventId: z.string().uuid(),
  tenantId: z.instanceof(ObjectId),
  userId: z.string(),
  anonymousId: z.string().optional(),
  experimentId: z.instanceof(ObjectId),
  variantId: z.string(),
  eventType: z.enum(['exposure', 'conversion']),
  metricName: z.string().optional(),
  metricValue: z.number().optional(),
  timestamp: z.date().default(() => new Date()),
  metadata: z.record(z.any()).optional(),
  traceId: z.string().optional(),
});

export type ExperimentEvent = z.infer<typeof ExperimentEventSchema>;
