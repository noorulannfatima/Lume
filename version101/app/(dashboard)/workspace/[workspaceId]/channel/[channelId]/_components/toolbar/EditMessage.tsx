import { updateMessageSchema, UpdateMessageSchemaType, MessageSchemaType } from "@/app/schemas/message";
import { RichTextEditor } from "@/components/rich-text-editor/Editor";
import { Button } from "@/components/ui/button";
import { FormControl, FormField, FormItem, Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient, InfiniteData } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { orpc } from "@/lib/orpc";

interface EditMessageProps {
    message: MessageSchemaType;
    onCancel: () => void;
    onSave: () => void;
}

export function EditMessage({ message, onCancel, onSave }: EditMessageProps) {
    const queryClient = useQueryClient();
    
    // Initialize form with zod resolver and default values from the message
    const form = useForm<UpdateMessageSchemaType>({
        resolver: zodResolver(updateMessageSchema),
        defaultValues: {
            id: message.id,
            content: message.content,
        }
    });

    // Mutation to update the message
    const updateMutation = useMutation(
        orpc.message.update.mutationOptions({
            onSuccess: (updated) => {
                // Type definitions for the infinite query data structure
                type MessagePage = { messages: MessageSchemaType[]; nextCursor: string | null; hasMore: boolean };
                type InfiniteMessages = InfiniteData<MessagePage>;

                // Optimistically update the cache
                queryClient.setQueryData<InfiniteMessages>(
                    ["message.list", message.channelId], // Ensure this key matches the one in MessageList
                    (old) => {
                        if (!old) return old;

                        const updatedMessage = updated.message;

                        const pages = old.pages.map((page) => ({
                            ...page,
                            messages: page.messages.map((m) =>
                                m.id === updatedMessage.id ? { ...m, ...updatedMessage } : m
                            ),
                        }));

                        return {
                            ...old,
                            pages,
                        };
                    }
                );

                toast.success("Message updated successfully");
                onSave();
            },
            onError: (error) => {
                toast.error(error.message);
            },
        })
    );

    function onSubmit(data: UpdateMessageSchemaType) {
        updateMutation.mutate(data);
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <FormField
                    control={form.control}
                    name="content"
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <RichTextEditor
                                    field={field}
                                    sendButton={
                                        <div className="flex items-center gap-4">
                                            <Button
                                                onClick={onCancel}
                                                type="button"
                                                size="sm"
                                                variant="ghost"
                                                disabled={updateMutation.isPending}
                                            >
                                                Cancel
                                            </Button>
                                            <Button
                                                disabled={updateMutation.isPending}
                                                type="submit"
                                                size="sm"
                                                variant="outline"
                                            >
                                                {updateMutation.isPending ? "Saving..." : "Save"}
                                            </Button>
                                        </div>
                                    }
                                />
                            </FormControl>
                        </FormItem>
                    )}
                />
            </form>
        </Form>
    );
}