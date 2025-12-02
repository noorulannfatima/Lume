import { os } from "@orpc/server";

export const base = os.$context().errors({
    RATE_LIMITED: {
        message: "You are being rate limited",
    },
    UNAUTHORIZED: {
        message: "You are unauthorized",
    },
    FORBIDDEN: {
        message: "This is forbidden",
    },
    NOT_FOUND: {
        message: "This is not found",
    },
    INTERNAL_SERVER_ERROR: {
        message: "Internal server error",
    },
    BAD_REQUEST: {
        message: "Bad request",
    },
    UNPROCESSABLE_ENTITY: {
        message: "Unprocessable entity",
    },
});