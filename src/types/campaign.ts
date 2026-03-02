import { z } from 'zod';

export const EmailCampaignSchema = z.object({
  name: z.string().min(1, "Campaign name is required").max(255, "Campaign name cannot exceed 255 characters"),
  subject: z.string().min(1, "Subject line is required").max(255, "Subject line cannot exceed 255 characters"),
  type: z.enum(["newsletter", "promotional", "automated"], { required_error: "Campaign type is required" }),
  htmlContent: z.string().max(1024 * 1024, "HTML content cannot exceed 1MB").optional(), // Optional for initial creation
  textContent: z.string().max(1024 * 1024, "Text content cannot exceed 1MB").optional(), // Optional for initial creation
  scheduledAt: z.preprocess((arg) => (typeof arg === 'string' || arg instanceof Date) ? new Date(arg) : undefined, z.date().optional()),
  tags: z.array(z.string().max(50, "Tag cannot exceed 50 characters")).max(10, "Cannot have more than 10 tags").optional(),
  segmentId: z.string().optional(), // Assuming segmentId is a string representation of ObjectId
});

export type EmailCampaignCreation = z.infer<typeof EmailCampaignSchema>;
Schema>;
>;
>;
>;
