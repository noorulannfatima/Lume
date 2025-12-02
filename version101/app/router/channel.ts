import z from "zod";//
import { requireAuthMiddleware } from "@/middlewares/auth";
import { base } from "@/middlewares/base";
import { requiredWorkspaceMiddleware } from "@/middlewares/workspace";
import { ChannelNameSchema } from "@/app/schemas/channel";

export const createChannel = base
.use(requireAuthMiddleware)
.use(requiredWorkspaceMiddleware)

.route({
    method: "POST",
    path: "/channels",
    summary: "Create a new channel",
    tags: ["Channels"],
}).input(ChannelNameSchema)
.output(z.void())
.handler(async ({input, errors, context}) => {
    
});
