import arcjet, { slidingWindow } from "@backend/lib/arcjet"
import { base } from "../base";
// User type is now from NextAuth session


const buildStandartAj = () => 
   arcjet.withRule(
    slidingWindow({
        mode: "LIVE",
        interval: "1m",
        max: 180,
    }) 
   );



export const readSecurityMiddleware = base
.$context<{
    request: Request;
    user: {
        id: string;
        email: string;
        name: string;
        image: string | null;
    };
}>()
.middleware(async ({context, next, errors }) => {
    const decision = await buildStandartAj().protect(context.request, {
        userId: context.user.id,
    });

    if (decision.isDenied()) {
        if (decision.reason.isRateLimit()) {
        throw errors.RATE_LIMITED ({
            message: "Too many impactual changes. please slow down.",
        });
    }

        throw errors.FORBIDDEN({
            message: "Request blocked",
        });
    }
    return next();
});

