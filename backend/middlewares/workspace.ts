import { base } from "./base";
import { Workspace, WorkspaceMember } from "@backend/models";

interface WorkspaceContext {
    id: string;
    name: string;
}

export const requiredWorkspaceMiddleware = base
.$context<{
    user?: {
        id: string;
        email: string;
        name: string;
        image: string | null;
    };
    workspace?: WorkspaceContext | null;
}>()
.middleware(async ({context, next, errors }) => {
    // to check if we already have user session
    const workspace = context.workspace ?? (await getWorkspace(context.user?.id));

    if (!workspace) {
        throw errors.FORBIDDEN();
    }
     
    return next({
        context: {workspace},
    });
});

const getWorkspace = async (userId?: string) => {
    if (!userId) return null;

    const membership = await WorkspaceMember.findOne({
        where: { userId },
        include: [{
            model: Workspace,
            as: 'workspace',
        }],
        order: [['createdAt', 'ASC']],
    });

    if (!membership) {
        return null;
    }

    const workspace = membership.get('workspace') as any;

    return {
        id: workspace.id,
        name: workspace.name,
    } as WorkspaceContext;
};