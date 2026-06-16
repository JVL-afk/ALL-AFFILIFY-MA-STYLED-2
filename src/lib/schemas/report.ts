import { z } from 'zod';

export const ReportStatusSchema = z.enum(['draft', 'pending', 'processing', 'completed', 'failed']);
export type ReportStatus = z.infer<typeof ReportStatusSchema>;

export const ReportFormatSchema = z.enum(['PDF', 'Excel', 'CSV']);
export type ReportFormat = z.infer<typeof ReportFormatSchema>;

export const ReportFrequencySchema = z.enum(['manual', 'daily', 'weekly', 'monthly']);
export type ReportFrequency = z.infer<typeof ReportFrequencySchema>;

export const ReportTemplateSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  type: z.string(),
});
export type ReportTemplate = z.infer<typeof ReportTemplateSchema>;

export const ReportSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Report name is required"),
  description: z.string().optional(),
  type: z.string(),
  status: ReportStatusSchema.default('pending'),
  format: ReportFormatSchema,
  frequency: ReportFrequencySchema.default('manual'),
  recipients: z.array(z.string().email()).default([]),
  template: ReportTemplateSchema.optional(),
  fileUrl: z.string().optional(),
  lastGenerated: z.date().optional().nullable(),
  nextScheduled: z.date().optional().nullable(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  userId: z.string().optional(),
  traceContext: z.record(z.string(), z.any()).optional(),
});

export type Report = z.infer<typeof ReportSchema>;
