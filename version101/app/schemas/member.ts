import z from "zod";

export const inviteMemberSchema = z.object({
    name: z.string().min(3).max(50),
    email: z.string(),
});


export type InviteMemberSchemaType = z.infer<typeof inviteMemberSchema>;
