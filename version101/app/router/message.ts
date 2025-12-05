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
    summary: "List all messages",
    tags: ["Messages"],
})
.input(z.object({
    channelId: z.string(),
}))
.output(z.array(MessageSchema))
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
    const data = await Message.findAll({
        where: {
            channelId: input.channelId,
        },
        order: [
            ['createdAt', 'DESC']
        ],
        include: [
            {
                model: User,
                as: 'user',
            }
        ]
    });
    return data as any;
});
