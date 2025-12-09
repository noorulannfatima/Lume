import z from "zod";//
import { requireAuthMiddleware } from "@/middlewares/auth";
import { base } from "@/middlewares/base";
import { requiredWorkspaceMiddleware } from "@/middlewares/workspace";
import { ChannelNameSchema } from "@/app/schemas/channel";
import { Channels } from "@/models";

export const listChannels = base
.use(requireAuthMiddleware)
// .use(requiredWorkspaceMiddleware)
.route({
    method: "GET",
    path: "/channels",
    summary: "Get all channels in a workspace",
    tags: ["Channels"],
})
.input(z.object({
    workspaceId: z.string(),
}))
.output(z.array(z.object({
    id: z.string(),
    name: z.string(),
    description: z.string().nullable(),
    isPrivate: z.boolean(),
    createdAt: z.date(),
})))
.handler(async ({ context, input }) => {
    try {
        const channels = await Channels.findAll({
            where: {
                workspaceId: input.workspaceId,
            },
            order: [['createdAt', 'ASC']],
        });

        return channels.map(channel => ({
            id: channel.id,
            name: channel.name,
            description: channel.description,
            isPrivate: channel.isPrivate,
            createdAt: channel.createdAt,
        }));
    } catch (error: any) {
        console.error('Error fetching channels:', error);
        throw context.errors.INTERNAL_SERVER_ERROR({
            message: "Failed to fetch channels",
        });
    }
});

export const createChannel = base
.use(requireAuthMiddleware)
// .use(requiredWorkspaceMiddleware)

.route({
    method: "POST",
    path: "/channels",
    summary: "Create a new channel",
    tags: ["Channels"],
}).input(ChannelNameSchema.extend({
    workspaceId: z.string(),
}))
.output(z.object({
    channelId: z.string(),
    channelName: z.string(),
}))
.handler(async ({input, errors, context}) => {
    try {
        // Create the channel
        const channel = await Channels.create({
            name: input.name,
            workspaceId: input.workspaceId,
            createdById: context.user.id,
            isPrivate: false,
        });

        return {
            channelId: channel.id,
            channelName: channel.name,
        };
    } catch (error: any) {
        console.error('Error creating channel:', error);
        
        // Handle unique constraint violation (duplicate channel name in workspace)
        if (error.name === 'SequelizeUniqueConstraintError') {
            throw errors.FORBIDDEN({
                message: "A channel with this name already exists in this workspace",
            });
        }
        
        throw errors.FORBIDDEN({
            message: "Failed to create channel",
        });
    }
});

export const getChannel = base
.use(requireAuthMiddleware)
// .use(requiredWorkspaceMiddleware)
.route({
    method: "GET",
    path: "/channels/:channelId",
    summary: "Get a single channel by ID",
    tags: ["Channels"],
})
.input(z.object({
    channelId: z.string(),
    workspaceId: z.string(),
}))
.output(z.object({
    id: z.string(),
    name: z.string(),
    description: z.string().nullable(),
    isPrivate: z.boolean(),
    workspaceId: z.string(),
    createdAt: z.date(),
}))
.handler(async ({ input, context, errors }) => {
    const channel = await Channels.findOne({
        where: {
            id: input.channelId,
            workspaceId: input.workspaceId,
        },
    });

    if (!channel) {
        throw errors.NOT_FOUND({
            message: "Channel not found",
        });
    }

    return {
        id: channel.id,
        name: channel.name,
        description: channel.description,
        isPrivate: channel.isPrivate,
        workspaceId: channel.workspaceId,
        createdAt: channel.createdAt,
    };
});
