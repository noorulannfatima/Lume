"use client";

import { ChannelNameSchema, transformChannelName } from "@/app/schemas/channel";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { orpc } from "@/lib/orpc";
import { toast } from "sonner";
import { isDefinedError } from "@orpc/client";
import { useParams, useRouter } from "next/navigation";


 
 
 export function CreateNewChannel() {
    const [open, setOpen] = useState(false);
    const queryClient = useQueryClient();
    const router = useRouter();
    const {workspaecId} = useParams<{workspaecId: string}>();

    const form = useForm<z.infer<typeof ChannelNameSchema>>({
        resolver: zodResolver(ChannelNameSchema),
        defaultValues: {
            name: "",
        },
    });
  
    const watchedName = form.watch("name");
    const transformedName = watchedName ? transformChannelName(watchedName) : "";

    // Create mutation for channel creation
    const createChannelMutation = useMutation(
        orpc.channel.create.mutationOptions({
            onSuccess: (newChannel) => {
                toast.success(
                    `Channel "${newChannel.channelName}" created successfully`
                );

                // Invalidate queries if needed
                queryClient.invalidateQueries({
                    queryKey: ['channels'],
                });

                form.reset();
                setOpen(false);

                router.push(`/workspace/${workspaecId}/channel/${newChannel.channelId}`);

            },
            onError: (error) => {
                if (isDefinedError(error)) {
                    toast.error(error.message);
                    return;
                }

                toast.error("Failed to create channel, try again");
            },
        })
    );

    // Submit handler
    function onSubmit(values: z.infer<typeof ChannelNameSchema>) {
        createChannelMutation.mutate(values);
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" className="w-full">
                    <Plus className="size-4"/>
                    Add Channel
                    </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Add Channel</DialogTitle>
                    <DialogDescription>
                        Add a new channel to your workspace
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
                        <FormField
                        control={form.control}
                        name="name"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                    <Input placeholder=" My Channel" {...field}/>
                                </FormControl>
                                {transformedName && transformedName !== watchedName && (
                                    <p className="text-sm text-muted-foreground">
                                        Will be created as <code className="bg-muted px-1 py-0.5 rounded text-xs">
                                            {transformedName}
                                            </code>
                                    </p>
                                )}
                                <FormMessage/>
                            </FormItem>
                        )}
                        />
                        <Button type="submit" disabled={createChannelMutation.isPending}>
                            {createChannelMutation.isPending 
                                ? "Creating..." 
                                : "Create new channel"}
                        </Button>
                        
                    </form>

                </Form>
            </DialogContent>
        </Dialog>
    );
 }