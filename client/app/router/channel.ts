import z from "zod";
import { heavyWriteSecurityMiddleware } from "../middlewares/arcjet/heavy-write";
import { standardSecuritymiddleware } from "../middlewares/arcjet/standard";
import { requireAuthMiddleware } from "../middlewares/auth";
import { base } from "../middlewares/base";
import { requiredWorkspaceMiddleware } from "../middlewares/workspace";
import { ChannelNameSchema } from "../schemas/channel";

export const createChannel = base
.use(requireAuthMiddleware)
.use(requiredWorkspaceMiddleware)
.use(standardSecuritymiddleware)
.use(heavyWriteSecurityMiddleware)
.route({
    method: "POST",
    path: "/channels",
    summary: "Create a new channel",
    tags: ["Channels"],
}).input(ChannelNameSchema)
.output(z.void())
.handler(async ({input, errors, context}) => {
    
});
