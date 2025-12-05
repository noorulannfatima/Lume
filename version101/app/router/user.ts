// User profile update API route
import { z } from "zod";
import { base } from '@/middlewares/base';
import { requireAuthMiddleware } from '@/middlewares/auth';
import { userUpdateSchema } from '@/app/schemas/user';
import { User } from '@/models';

export const updateUser = base
    .use(requireAuthMiddleware)
    .route({
        method: 'PATCH',
        path: '/user',
        summary: 'Update user profile',
        tags: ['User']
    })
    .input(userUpdateSchema)
    .output(
        z.object({
            id: z.string(),
            email: z.string(),
            name: z.string().nullable(),
            image: z.string().nullable(),
            status: z.enum(['online', 'away', 'offline']),
            statusText: z.string().nullable(),
            timezone: z.string().nullable(),
        })
    )
    .handler(async ({ context, errors, input }) => {
        try {
            const user = await User.findByPk(context.user.id);

            if (!user) {
                throw errors.NOT_FOUND({
                    message: "User not found",
                });
            }

            // Update user fields if provided
            if (input.name !== undefined) user.name = input.name;
            if (input.status !== undefined) user.status = input.status;
            if (input.statusText !== undefined) user.statusText = input.statusText;
            if (input.timezone !== undefined) user.timezone = input.timezone;

            await user.save();

            return {
                id: user.id,
                email: user.email,
                name: user.name,
                image: user.image,
                status: user.status,
                statusText: user.statusText,
                timezone: user.timezone,
            };
        } catch (error) {
            console.error('Error updating user:', error);
            throw errors.INTERNAL_SERVER_ERROR({
                message: "Failed to update user profile",
            });
        }
    });
