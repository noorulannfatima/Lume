// User profile update schema using zod
import { z } from "zod"

export const userUpdateSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters").max(50, "Name must be at most 50 characters").optional(),
    status: z.enum(['online', 'away', 'offline']).optional(),
    statusText: z.string().max(100, "Status text must be at most 100 characters").nullable().optional(),
    timezone: z.string().optional(),
})

export type UserUpdateSchemaType = z.infer<typeof userUpdateSchema>
