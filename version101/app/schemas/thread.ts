// app/schemas/thread.ts
import { z } from 'zod';

export const createThreadReplySchema = z.object({
  messageId: z.string().uuid('Invalid message ID'),
  content: z.string().min(1, 'Content is required').max(10000, 'Content is too long'),
});

export const updateThreadReplySchema = z.object({
  id: z.string().uuid('Invalid thread reply ID'),
  content: z.string().min(1, 'Content is required').max(10000, 'Content is too long'),
});

export const deleteThreadReplySchema = z.object({
  id: z.string().uuid('Invalid thread reply ID'),
});

export const getThreadRepliesSchema = z.object({
  messageId: z.string().uuid('Invalid message ID'),
  limit: z.number().int().min(1).max(100).optional().default(50),
  cursor: z.string().uuid().optional(),
});

export const getThreadReplySchema = z.object({
  id: z.string().uuid('Invalid thread reply ID'),
});

// Types
export type CreateThreadReplyInput = z.infer<typeof createThreadReplySchema>;
export type UpdateThreadReplyInput = z.infer<typeof updateThreadReplySchema>;
export type DeleteThreadReplyInput = z.infer<typeof deleteThreadReplySchema>;
export type GetThreadRepliesInput = z.infer<typeof getThreadRepliesSchema>;
export type GetThreadReplyInput = z.infer<typeof getThreadReplySchema>;