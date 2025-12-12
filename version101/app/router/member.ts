import { requireAuthMiddleware } from "@/middlewares/auth";
import { base } from "@/middlewares/base";
import { requiredWorkspaceMiddleware } from "@/middlewares/workspace";
import { inviteMemberSchema } from "../schemas/member";
import { UserSchema } from "../schemas/message";
import { User, WorkspaceMember, Workspace } from "@/models";
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

    // verify requester is member of the workspace
    const requesterMembership = await WorkspaceMember.findOne({
        where: {
            userId: context.user.id,
            workspaceId: context.workspace.id,
        },
    });

    if (!requesterMembership) {
        throw errors.FORBIDDEN({
            message: "You are not a member of this workspace",
        });
    }

    try {
        // 1. Find or create the user
        let user = await User.findOne({ where: { email: input.email } });

        if (!user) {
            user = await User.create({
                name: input.name,
                email: input.email,
            });
            console.log("[DEBUG] User created:", user.id);
        } else {
            console.log("[DEBUG] User found:", user.id);
        }

        // 2. Check if already a member
        const existingMembership = await WorkspaceMember.findOne({
            where: {
                userId: user.id,
                workspaceId: context.workspace.id,
            },
        });

        if (existingMembership) {
            // Already a member, just return the user
            return user;
        }

        // 3. Add to workspace
        await WorkspaceMember.create({
            userId: user.id,
            workspaceId: context.workspace.id,
            role: 'member', // Default role
        });

        return user;
    } catch (error) {
        console.error("[DEBUG] Invite member error:", error);
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
        return members.map((m: any) => m.user) as any;
        
    } catch (error) {
        console.error("[DEBUG] Database fetch error:", error);
        throw error;
    }
});