import { requireAuthMiddleware } from "@/middlewares/auth";
import {base} from "@/middlewares/base";
import { requiredWorkspaceMiddleware } from "@/middlewares/workspace";
import Message from "@/models/Message";
import User from "@/models/User";
import z from "zod";
import { createMessageSchema, MessageSchema } from "../schemas/message";
import { Channels, WorkspaceMember } from "@/models";
import { getAvatar } from "@/utils/get-avatar";

export const createMessage = base
.use(requireAuthMiddleware)
// .use(requiredWorkspaceMiddleware)
.route({
    method: "POST",
    path: "/messages",
    summary: "Create a message",
    tags: ["Messages"],
})
.input(createMessageSchema)
.output(MessageSchema)

.handler(async ({ input, context, errors }) => {
    console.log("[DEBUG] createMessage called");
    console.log("[DEBUG] Input:", JSON.stringify(input, null, 2));
    console.log("[DEBUG] User ID:", context.user.id);

    // verify user is member of the workspace
    const member = await WorkspaceMember.findOne({
        where: {
            userId: context.user.id,
            workspaceId: input.workspaceId,
        },
    });
    console.log("[DEBUG] WorkspaceMember found:", !!member);

    if (!member) {
        console.error("[DEBUG] User is not a member of the workspace");
        throw errors.FORBIDDEN({
            message: "You are not a member of this workspace",
        });
    }

    // verify the channel belogs to the user's orginization
    const channel = await Channels.findOne({
        where: {
            id: input.channelId,
            workspaceId: input.workspaceId,
        },
    });
    console.log("[DEBUG] Channel found:", !!channel);

    if(!channel) {
        console.error("[DEBUG] Channel not found or does not belong to workspace");
        throw errors.NOT_FOUND({
            message: "Channel not found",
        });
    }

    try {
        const created = await Message.create({
            content: input.content,
            attachments: input.imageUrl ? { url: input.imageUrl } : null,
            channelId: input.channelId,
            userId: context.user.id,
        });
        console.log("[DEBUG] Message created:", created.id);
        
        await created.reload({
            include: [
                {
                    model: User,
                    as: 'user',
                }
            ]
        });

        return created as any;
    } catch (error) {
        console.error("[DEBUG] Database creation error:", error);
        throw error;
    }

});


export const listMessages = base
.use(requireAuthMiddleware)
// .use(requiredWorkspaceMiddleware)
.route({
    method: "GET",
    path: "/messages",
    summary: "List all messages with cursor pagination",
    tags: ["Messages"],
})
.input(z.object({ 
    workspaceId: z.string(),
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
            workspaceId: input.workspaceId,
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
    // If a cursor is present, we fetch messages OLDER than the cursor (created before the cursor timestamp)
    if (input.cursor) {
        whereClause.createdAt = {
            [Op.lt]: new Date(input.cursor),
        };
    }

    // Fetch limit + 1 to determine if there are more messages
    // We fetch one extra item to check if there's a next page without a separate count query
    const data = await Message.findAll({
        where: whereClause,
        order: [
            ['createdAt', 'DESC'] // Sort by newest first to get the latest messages
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
    
    // Remove the extra message if we have more (it was just for the check)
    const messages = hasMore ? data.slice(0, input.limit) : data;
    
    // Get the next cursor (createdAt of the last message in this page)
    // This timestamp will be used as the 'cursor' for the next request to fetch older messages
    const nextCursor = messages.length > 0 ? messages[messages.length - 1].createdAt.toISOString() : null;

    return {
        messages: messages as any,
        nextCursor,
        hasMore,
    };
});