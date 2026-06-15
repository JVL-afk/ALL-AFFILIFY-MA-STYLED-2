import { z } from 'zod';

export const ChatRequestSchema = z.object({
  message: z.string().min(1).max(4000),
  sessionId: z.string().optional(),
  history: z.array(z.object({
    role: z.enum(['user', 'model']),
    parts: z.array(z.object({
      text: z.string()
    }))
  })).optional(),
});

export const SessionCreateSchema = z.object({
  title: z.string().min(1).max(100).optional(),
});

export const MessageRatingSchema = z.object({
  messageId: z.string(),
  rating: z.enum(['up', 'down']),
});
