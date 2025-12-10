import { requireAuthMiddleware } from "@/middlewares/auth";
import { base } from "@/middlewares/base";
import { requiredWorkspaceMiddleware } from "@/middlewares/workspace";
import { inviteMemberSchema } from "../schemas/member";
import { UserSchema } from "../schemas/message";
import { User, WorkspaceMember } from "@/models";
import z from "zod";


export const inviteMember = base
.use(requireAuthMiddleware)
.use(requiredWorkspaceMiddleware)
.route({
    method: "POST",
    path: "/workspace/members/invite",
    summary: "Invite a member to a workspace",
    tags: ["Members"],
})
.input(inviteMemberSchema)
.output(UserSchema)

// our logic
.handler(async ({ input, context, errors }) => {
    console.log("[DEBUG] inviteMember called");
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

    try {
        const created = await User.create({
            name: input.name,
            email: input.email,
            workspaceId: input.workspaceId,
        });
        console.log("[DEBUG] User created:", created.id);
        
        await created.reload({
            include: [
                {
                    model: Workspace,
                    as: 'workspace',
                }
            ]
        });

        return created as any;
    } catch (error) {
        console.error("[DEBUG] Database creation error:", error);
        throw error;
    }
});


export const listMembers = base
.use(requireAuthMiddleware)
.use(requiredWorkspaceMiddleware)
.route({
    method: "GET",
    path: "/workspace/members",
    summary: "List members of a workspace",
    tags: ["Members"],
})
.input(z.void())
.output(UserSchema.array())
.handler(async ({ context, errors }) => {
    try {
        const members = await WorkspaceMember.findAll({
            where: {
                workspaceId: context.workspace.id,
            },
            include: [
                {
                    model: User,
                    as: 'user',
                }
            ]
        });

        if(!members) {
            throw errors.NOT_FOUND({
                message: "Members not found",
            });
        }
        return members as any;
        
    } catch (error) {
        console.error("[DEBUG] Database fetch error:", error);
        throw error;
    }
});