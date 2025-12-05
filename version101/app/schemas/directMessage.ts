// app/schemas/directMessage.ts
import { z } from 'zod';

export const createDMConversationSchema = z.object({
  workspaceId: z.string().uuid('Invalid workspace ID'),
  participantIds: z.array(z.string().uuid('Invalid user ID')).min(1, 'At least one participant required'),
  isGroup: z.boolean().optional().default(false),
  name: z.string().min(1).max(255).optional(),
});

export const getDMConversationsSchema = z.object({
  workspaceId: z.string().uuid('Invalid workspace ID'),
  limit: z.number().int().min(1).max(100).optional().default(50),
  cursor: z.string().uuid().optional(),
});

export const getDMConversationSchema = z.object({
  id: z.string().uuid('Invalid conversation ID'),
});

export const updateDMConversationSchema = z.object({
  id: z.string().uuid('Invalid conversation ID'),
  name: z.string().min(1).max(255).optional(),
});

export const addParticipantSchema = z.object({
  conversationId: z.string().uuid('Invalid conversation ID'),
  userId: z.string().uuid('Invalid user ID'),
});

export const removeParticipantSchema = z.object({
  conversationId: z.string().uuid('Invalid conversation ID'),
  userId: z.string().uuid('Invalid user ID'),
});

export const sendDMMessageSchema = z.object({
  conversationId: z.string().uuid('Invalid conversation ID'),
  content: z.string().min(1, 'Content is required').max(10000, 'Content is too long'),
});

export const getDMMessagesSchema = z.object({
  conversationId: z.string().uuid('Invalid conversation ID'),
  limit: z.number().int().min(1).max(100).optional().default(50),
  cursor: z.string().uuid().optional(),
});

export const markDMAsReadSchema = z.object({
  conversationId: z.string().uuid('Invalid conversation ID'),
});

export const getOrCreateDMConversationSchema = z.object({
  workspaceId: z.string().uuid('Invalid workspace ID'),
  userId: z.string().uuid('Invalid user ID'),
});

// Types
export type CreateDMConversationInput = z.infer<typeof createDMConversationSchema>;
export type GetDMConversationsInput = z.infer<typeof getDMConversationsSchema>;
export type GetDMConversationInput = z.infer<typeof getDMConversationSchema>;
export type UpdateDMConversationInput = z.infer<typeof updateDMConversationSchema>;
export type AddParticipantInput = z.infer<typeof addParticipantSchema>;
export type RemoveParticipantInput = z.infer<typeof removeParticipantSchema>;
export type SendDMMessageInput = z.infer<typeof sendDMMessageSchema>;
export type GetDMMessagesInput = z.infer<typeof getDMMessagesSchema>;
export type MarkDMAsReadInput = z.infer<typeof markDMAsReadSchema>;
export type GetOrCreateDMConversationInput = z.infer<typeof getOrCreateDMConversationSchema>;