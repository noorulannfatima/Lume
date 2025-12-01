import arcjet, { detectBot, shield } from "@backend/lib/arcjet"
import { base } from "../base";
// User type is now from NextAuth session


const buildStandartAj = () => 
   arcjet.withRule(
    shield({
        mode: "LIVE",
    })
   ).withRule(
    detectBot({
        mode: "LIVE",
        allow: [
            'CATEGORY:SEARCH_ENGINE',
            'CATEGORY:PREVIEW',
            'CATEGORY:MONITOR',

        ],

    })
   );



export const standardSecuritymiddleware = base
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
        if (decision.reason.isBot()) {
        throw errors.FORBIDDEN ({
            message: "Automated traffic blocked",
        });
    }

    if (decision.reason.isShield()){
        throw errors.FORBIDDEN({
            message: "Request blocked by security policy (WAF",
        });
        }
        throw errors.FORBIDDEN({
            message: "Request blocked",
        });
    }
    return next();
});

