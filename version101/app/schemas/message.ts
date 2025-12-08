import z from "zod";

export const createMessageSchema = z.object({
    channelId: z.string(),
    content: z.string(),
    imageUrl: z.string().optional(),
});

export const UserSchema = z.object({
    id: z.string(),
    name: z.string().nullable(),
    email: z.string(),
    image: z.string().nullable(),
});

export const MessageSchema = z.object({
    id: z.string(),
    channelId: z.string().nullable(),
    directMessageId: z.string().nullable(),
    threadId: z.string().nullable(),
    userId: z.string(),
    content: z.string(),
    attachments: z.string().nullable(),
    isEdited: z.boolean(),
    isPinned: z.boolean(),
    deletedAt: z.date().nullable(),
    createdAt: z.date(),
    updatedAt: z.date(),
    user: UserSchema,
});

export type MessageSchemaType = z.infer<typeof MessageSchema>;

export type CreateMessageSchemaType = z.infer<typeof createMessageSchema>;

