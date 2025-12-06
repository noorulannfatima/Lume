"use client"
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { userUpdateSchema, UserUpdateSchemaType } from "@/app/schemas/user";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { orpc } from "@/lib/orpc";
import { toast } from "sonner";
import { isDefinedError } from "@orpc/client";
import { Label } from "@/components/ui/label";

interface AccountSettingsProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    user: {
        id: string;
        email: string;
        name: string | null;
        image: string | null;
        status?: 'online' | 'away' | 'offline';
        statusText?: string | null;
        timezone?: string | null;
    };
}

export function AccountSettings({ open, onOpenChange, user }: AccountSettingsProps) {
    const queryClient = useQueryClient();

    // Define the form with default values from user data
    const form = useForm<UserUpdateSchemaType>({
        resolver: zodResolver(userUpdateSchema),
        defaultValues: {
            name: user.name || "",
            status: user.status || 'online',
            statusText: user.statusText || "",
            timezone: user.timezone || "",
        }
    });

    // Mutation for updating user profile
    const updateUserMutation = useMutation(
        orpc.user.update.mutationOptions({
            onSuccess: (updatedUser) => {
                toast.success("Profile updated successfully");

                // Invalidate workspace list query to refresh user data
                queryClient.invalidateQueries({
                    queryKey: orpc.workspace.list.queryKey(),
                });

                form.reset({
                    name: updatedUser.name || "",
                    status: updatedUser.status,
                    statusText: updatedUser.statusText || "",
                    timezone: updatedUser.timezone || "",
                });
                onOpenChange(false);
            },
            onError: (error) => {
                if (isDefinedError(error)) {
                    toast.error(error.message);
                    return;
                }
                toast.error("Failed to update profile, try again");
            },
        })
    );

    // Submit handler
    function onSubmit(values: UserUpdateSchemaType) {
        updateUserMutation.mutate(values);
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[525px]">
                <DialogHeader>
                    <DialogTitle>Account Settings</DialogTitle>
                    <DialogDescription>
                        Update your profile information and preferences.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
                        {/* Email - Read Only */}
                        <div className="space-y-2">
                            <Label>Email</Label>
                            <Input 
                                value={user.email} 
                                disabled 
                                className="bg-muted"
                            />
                            <p className="text-muted-foreground text-xs">
                                Your email address cannot be changed
                            </p>
                        </div>

                        {/* Name Field */}
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Display Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="John Doe" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Status Field */}
                        <FormField
                            control={form.control}
                            name="status"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Status</FormLabel>
                                    <FormControl>
                                        <select 
                                            {...field}
                                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                        >
                                            <option value="online">🟢 Online</option>
                                            <option value="away">🟡 Away</option>
                                            <option value="offline">⚫ Offline</option>
                                        </select>
                                    </FormControl>
                                    <FormDescription>
                                        Set your current availability status
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Status Text Field */}
                        <FormField
                            control={form.control}
                            name="statusText"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Status Message</FormLabel>
                                    <FormControl>
                                        <Input 
                                            placeholder="Working on the new feature" 
                                            {...field}
                                            value={field.value || ""}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        Share what you're working on (optional)
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Timezone Field */}
                        <FormField
                            control={form.control}
                            name="timezone"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Timezone</FormLabel>
                                    <FormControl>
                                        <Input 
                                            placeholder="America/New_York" 
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        Your timezone (e.g., America/New_York, Europe/London)
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Submit Button */}
                        <div className="flex gap-2 justify-end">
                            <Button 
                                type="button" 
                                variant="outline" 
                                onClick={() => onOpenChange(false)}
                            >
                                Cancel
                            </Button>
                            <Button 
                                disabled={updateUserMutation.isPending} 
                                type="submit"
                            >
                                {updateUserMutation.isPending 
                                    ? "Saving..." 
                                    : "Save Changes"}
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
