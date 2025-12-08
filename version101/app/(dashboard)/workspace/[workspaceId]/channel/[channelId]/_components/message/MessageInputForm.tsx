'use client'
import { createMessageSchema, CreateMessageSchemaType } from "@/app/schemas/message"
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
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useState } from "react"
import { useAttachmentUpload } from "@/hooks/use-attachment-upload"


interface iAppProps {
    channelId: string;
}

export function MessageInputForm({channelId}: iAppProps) {

    const queryClient = useQueryClient();
    const [editorKey, setEditorKey] = useState(0);
    const upload = useAttachmentUpload();

    const form = useForm<CreateMessageSchemaType>({
        resolver: zodResolver(createMessageSchema),
        defaultValues: {
            channelId: channelId,
            content: "",
        },
    });



    const createMessageMutation = useMutation(
        orpc.message.create.mutationOptions({
            onSuccess: () => {
                queryClient.invalidateQueries({
                    queryKey: orpc.message.list.key(),
                });
                
                // reset react hook form
                form.reset({channelId: channelId, content: ""});
                setEditorKey((k) => k + 1);
                upload.clear(); // Clear the uploaded attachment state

                return toast.success("message created successfully");
            },
            onError: () => {
                return toast.error("message creation failed");
            },
        })
    );

    function onSubmit(data: CreateMessageSchemaType) {
        console.log('🚀 Submitting message with imageUrl:', upload.stagedUrl);
        createMessageMutation.mutate({
            ...data,
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
}//