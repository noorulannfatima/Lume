import { requireAuthMiddleware } from "@/middlewares/auth";
import {base} from "@/middlewares/base";
import { requiredWorkspaceMiddleware } from "@/middlewares/workspace";
import Message from "@/models/Message";
import z from "zod";
import { createMessageSchema } from "../schemas/message";
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
.output(z.custom<Message>())

.handler(async ({ input, context, errors }) => {
// verify the channel belogs to the user's orginization
const channel = await Channels.findAll({
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
    // imageUrl: input.imageUrl,
    channelId: input.channelId,
    userId: context.user.id,
    // email: context.user.email!,
    // name: context.user.given_name ?? " author name",
    //avatar: getAvatar(context.user.picture, context.user.email!),
});

return  created;

});
