import { KindeOrganization } from "@kinde-oss/kinde-auth-nextjs";
import { base } from "../middlewares/base";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

export const requiredWorkspaceMiddleware = base
.$context<{
    workspace?: KindeOrganization<unknown | null>;
}>()
.middleware(async ({context, next, errors }) => {
    // to check if we already have user session
    const workspace = context.workspace ?? (await getWorkspace());

    if (!workspace) {
        throw errors.FORBIDDEN();
    }
     
    return next({
        context: {workspace},
    });
});

const getWorkspace = async () => {
    const {getUserOrganizations} = getKindeServerSession();
    const organizations = await getUserOrganizations();
    const firstOrg = organizations?.orgs?.[0];

    if (!firstOrg) {
        return null;
    }

    return {
        ...firstOrg,
        orgCode: firstOrg.code,
    } as unknown as KindeOrganization<unknown>;
};