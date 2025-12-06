import { requireAuthMiddleware } from "@/middlewares/auth";
import {base} from "@/middlewares/base";
import { requiredWorkspaceMiddleware } from "@/middlewares/workspace";
import Message from "@/models/Message";
import User from "@/models/User";
import z from "zod";
import { createMessageSchema, MessageSchema } from "../schemas/message";
import { Channels } from "@/models";
import { getAvatar } from "@/utils/get-avatar";

export const createMessage = base
.use(requireAuthMiddleware)
.use(requiredWorkspaceMiddleware)
.route({
    method: "POST",
    path: "/messages",
    summary: "Create a message",
    tags: ["Messages"],
})
.input(createMessageSchema)
.output(MessageSchema)

.handler(async ({ input, context, errors }) => {
// verify the channel belogs to the user's orginization
const channel = await Channels.findOne({
    where: {
        id: input.channelId,
        workspaceId: context.workspace.id,
    },
});

if(!channel) {
    throw errors.NOT_FOUND({
        message: "Channel not found",
    });
}

const created = await Message.create({
    content: input.content,
    attachments: input.imageUrl ? { url: input.imageUrl } : null,
    channelId: input.channelId,
    userId: context.user.id,
});

    await created.reload({
        include: [
            {
                model: User,
                as: 'user',
            }
        ]
    });

    return created as any;

});


export const listMessages = base
.use(requireAuthMiddleware)
.use(requiredWorkspaceMiddleware)
.route({
    method: "GET",
    path: "/messages",
    summary: "List all messages with cursor pagination",
    tags: ["Messages"],
})
.input(z.object({ 
    channelId: z.string(),
    cursor: z.string().optional(),
    limit: z.number().int().min(1).max(100).default(50),
}))
.output(z.object({
    messages: z.array(MessageSchema),
    nextCursor: z.string().nullable(),
    hasMore: z.boolean(),
}))
.handler(async ({ input, context, errors }) => {
    const channel = await Channels.findOne({
        where: {
            id: input.channelId,
            workspaceId: context.workspace.id,
        },
    });
    if(!channel) {
        throw errors.NOT_FOUND({
            message: "Channel not found",
        });
    }

    const { Op } = await import('sequelize');
    
    // Build the where clause
    const whereClause: any = {
        channelId: input.channelId,
    };

    // Add cursor condition if provided
    if (input.cursor) {
        whereClause.id = {
            [Op.lt]: input.cursor,
        };
    }

    // Fetch limit + 1 to determine if there are more messages
    const data = await Message.findAll({
        where: whereClause,
        order: [
            ['id', 'DESC']
        ],
        limit: input.limit + 1,
        include: [
            {
                model: User,
                as: 'user',
            }
        ]
    });

    // Check if there are more messages
    const hasMore = data.length > input.limit;
    
    // Remove the extra message if we have more
    const messages = hasMore ? data.slice(0, input.limit) : data;
    
    // Get the next cursor (ID of the last message in this page)
    const nextCursor = messages.length > 0 ? messages[messages.length - 1].id : null;

    return {
        messages: messages as any,
        nextCursor,
        hasMore,
    };
});