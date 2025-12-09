'use client'
import { createMessageSchema, CreateMessageSchemaType, MessageSchemaType } from "@/app/schemas/message"
import { 
    Form, 
    FormControl, 
    FormField, 
    FormItem, 
    FormMessage } from "@/components/ui/form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { MessageComponser } from "./MessageComponser"
import { toast } from "sonner"
import { orpc } from "@/lib/orpc"
import { InfiniteData, useMutation, useQueryClient } from "@tanstack/react-query"
import { useState } from "react"
import { useAttachmentUpload } from "@/hooks/use-attachment-upload"
interface User {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
}

interface iAppProps {
    channelId: string;
    workspaceId: string;
    user: User
}

type MessagePage = {messages: MessageSchemaType[]; nextCursor: string | undefined};
type InfiniteMessages = InfiniteData<MessagePage>; // generic type



export function MessageInputForm({channelId, workspaceId, user}: iAppProps) {

    const queryClient = useQueryClient();
    const [editorKey, setEditorKey] = useState(0);
    const upload = useAttachmentUpload();

    const form = useForm<CreateMessageSchemaType>({
        resolver: zodResolver(createMessageSchema),
        defaultValues: {
            channelId: channelId,
            workspaceId: workspaceId,
            content: "",
        },
    });



    const createMessageMutation = useMutation(
        orpc.message.create.mutationOptions({

            onMutate: async (data) => {
                await queryClient.cancelQueries({
                    queryKey: ['message.list', channelId],
                });
                const previousMessages = queryClient.getQueryData<InfiniteMessages>([
                    "message.list", 
                    channelId,
                ]);

                const tempId = `optimistic-${crypto.randomUUID()}`;

                const optimisticMessage: MessageSchemaType = {
                    id: tempId,
                    content: data.content,
                    attachments: data.imageUrl ? { url: data.imageUrl } : null,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    userId: user.id,
                    channelId: channelId,
                    directMessageId: null,
                    threadId: null,
                    isEdited: false,
                    isPinned: false,
                    deletedAt: null,
                    user: {
                        id: user.id,
                        name: user.name || "User",
                        email: user.email || "",
                        image: user.image || null,
                    }
                };
                // Update the cache with the new optimistic message
                queryClient.setQueryData<InfiniteMessages>([
                    "message.list",
                    channelId,
                ], (oldData) => {
                    // Case 1: No existing data in cache
                    if (!oldData){ 
                        return {
                            pages: [
                                {
                                    messages: [optimisticMessage],
                                    nextCursor: undefined,
                                }
                            ],
                            pageParams: [undefined], // undefined is used as a placeholder for the first page
                        } satisfies InfiniteMessages;
                    } 
                    
                    // Case 2: Existing data in cache
                    // Get the first page (newest messages)
                    const firstPage = oldData.pages[0] ?? {
                        messages: [],
                        nextCursor: undefined,
                    };

                    // Add the optimistic message to the beginning of the first page
                    const updatedFirstPage: MessagePage = {
                        ...firstPage,
                        messages: [optimisticMessage, ...firstPage.messages],
                    };

                    // Return the new data structure with the updated first page
                    return {
                        ...oldData,
                        pages: [
                            updatedFirstPage,
                            ...oldData.pages.slice(1), // Keep other pages unchanged
                        ],
                    };
                });

             return {
                previousMessages,
                tempId,
             }   
            },


            onSuccess: () => {
                queryClient.invalidateQueries({
                    queryKey: ['message.list', channelId],
                });
                
                // reset react hook form
                form.reset({channelId: channelId, workspaceId: workspaceId, content: ""});
                setEditorKey((k) => k + 1);
                upload.clear(); // Clear the uploaded attachment state

                return toast.success("message created successfully");
            },
            onError: (err, _variables, context) => {
                if(context?.previousMessages){
                    queryClient.setQueryData(
                        ["message.list",channelId, ],
                         context.previousMessages
                        );
                }
                console.error("Message creation failed:", err);
                return toast.error(err.message || "message creation failed");
            },
        })
    );

    function onSubmit(data: CreateMessageSchemaType) {
        console.log('🚀 Submitting message with imageUrl:', upload.stagedUrl);
        createMessageMutation.mutate({
            ...data,
            workspaceId,
            channelId,
            imageUrl: upload.stagedUrl ?? undefined,
        });
    }

   return(
    <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
            control={form.control}
            name="content"
            render={({field}) => (
                <FormItem>
                    <FormControl>
                        <MessageComponser
                        value={field.value || ""}
                        onChange={field.onChange}
                        onSubmit={() => onSubmit(form.getValues())}
                        isSubmitting={createMessageMutation.isPending}
                        key={editorKey}
                        upload={upload}
                        />
                    </FormControl>
                    <FormMessage/>
                </FormItem>
            )}
            />
        </form>
    </Form>
   )
}