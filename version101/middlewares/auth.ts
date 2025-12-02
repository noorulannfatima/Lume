import { base } from "./base";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export const requireAuthMiddleware = base
.$context<{
    session?: {user?: {
        id: string;
        email: string;
        name: string;
        image: string | null;
    }}
}>()
.middleware(async ({context, next}) => {
    // to check if we already have user session
    const session = context.session ?? (await getSession());

    if (!session.user) {
        return redirect("/api/auth/signin");
    }
     
    return next({
        context: {user: session.user},
    });
});

const getSession = async () => {
    const session = await getServerSession(authOptions);

    return {
        user: session?.user,
    };
};