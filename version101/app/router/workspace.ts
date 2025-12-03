// procedures are just like action. They get data like create workspace, get workspace etc
import {z} from "zod";
import { base } from '@/middlewares/base';
import { requireAuthMiddleware } from '@/middlewares/auth';
import { requiredWorkspaceMiddleware } from '@/middlewares/workspace';
import { workspaceSchema } from '@/app/schemas/workspace';

import { Workspace, WorkspaceMember } from '@/models';

export const listWorkspaces = base
.use(requireAuthMiddleware)
.use(requiredWorkspaceMiddleware)

.route({
    method: 'GET',
    path: '/workspace',
    summary: 'List all workspaces',
    tags: ['Workspace']
})
.input(z.void())
.output(
    z.object({
    workspaces: z.array(
        z.object({
            id: z.string(),
            name: z.string(),
            avatar: z.string(),
        })
    ),
    user: z.object({
        id: z.string(),
        email: z.string(),
        name: z.string(),
        image: z.string().nullable(),
    }),
    currentWorkspace: z.object({
        id: z.string(),
        name: z.string(),
    }),
})
)
.handler(async ({context, errors }) => {
    // Fetch all workspaces for the current user
    const memberships = await WorkspaceMember.findAll({
        where: { userId: context.user.id },
        include: [{
            model: Workspace,
            as: 'workspace',
        }],
    });

    if (!memberships || memberships.length === 0) {
        throw errors.FORBIDDEN();
    }

    const workspaces = memberships.map((membership) => {
        const workspace = membership.get('workspace') as any;
        return {
            id: workspace.id,
            name: workspace.name ?? "My Workspace",
            avatar: workspace.name?.charAt(0) ?? "M",
        };
    });

    return {
        workspaces,
        user: context.user,
        currentWorkspace: context.workspace,
    };
});

// -----
 export const createWorkspace = base
.use(requireAuthMiddleware)
.use(requiredWorkspaceMiddleware)
.route({
    method: 'POST',
    path: '/workspace',
    summary: 'Create a new workspace',
    tags: ['workspace']
})
.input(workspaceSchema)
.output(
    z.object({
    workspaceId: z.string(),
    workspaceName: z.string(),
    })
    )
.handler(async ({context, errors, input }) => {
    try {
        // Generate base slug from workspace name
        let slug = input.name
            .toLowerCase()
            .trim()
            .replace(/[^\w\s-]/g, '') // Remove special characters
            .replace(/\s+/g, '-') // Replace spaces with hyphens
            .replace(/-+/g, '-'); // Replace multiple hyphens with single hyphen

        // Check if slug already exists and append random suffix if needed
        const existingWorkspace = await Workspace.findOne({ where: { slug } });
        if (existingWorkspace) {
            const randomSuffix = Math.random().toString(36).substring(2, 8);
            slug = `${slug}-${randomSuffix}`;
        }

        // Create the workspace
        const workspace = await Workspace.create({
            name: input.name,
            slug: slug,
        });

        // Add the current user as an admin of the workspace
        await WorkspaceMember.create({
            userId: context.user.id,
            workspaceId: workspace.id,
            role: 'admin',
        });

        return {
            workspaceId: workspace.id,
            workspaceName: workspace.name,
        };
    } catch (error) {
        console.error('Error creating workspace:', error);
        throw errors.FORBIDDEN({
            message: "Failed to create workspace",
        });
    }
});