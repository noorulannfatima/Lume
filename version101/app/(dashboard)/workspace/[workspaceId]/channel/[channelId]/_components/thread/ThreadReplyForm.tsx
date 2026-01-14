'use client'
import { createMessageSchema, CreateMessageSchemaType } from "@/app/schemas/message";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, useForm } from "react-hook-form";
import { useParams } from "next/navigation";
import { FormControl, FormField, FormItem,  } from "@/components/ui/form";
import { useAttachmentUpload } from "@/hooks/use-attachment-upload";
import { useState } from "react";
import { MessageComponser } from "../message/MessageComponser";
import { useMutation } from "@tanstack/react-query";
import { orpc } from "@/lib/orpc";

interface ThreadReplyFormProps {
    threadId: string;
}

export function ThreadReplyForm({threadId}: ThreadReplyFormProps) {

    const {channelId, workspaceId} = useParams<{channelId: string, workspaceId: string}>();

    const upload = useAttachmentUpload();
    const [editorKey, setEditorKey] = useState(0);
    
    const form = useForm<CreateMessageSchemaType>({
        resolver: zodResolver(createMessageSchema),
        defaultValues: {
            content: "",
            imageUrl: "",
        }
    })

    const createMessageMutation = useMutation(
       orpc.message.create.mutationOptions({
        onSuccess: () => {
            form.reset({ channelId, workspaceId, content: "", imageUrl: "" });
            upload.clear()
            setEditorKey((prev) => prev + 1);
        },
        onError: (error) => {
            console.error("Error creating message:", error);
        }
       })
    )

function onSubmit(data: CreateMessageSchemaType) {

    createMessageMutation.mutate({
        ...data,
        imageUrl: upload.stagedUrl ?? "",
        channelId,
        workspaceId,
        threadId,
    })
    
}

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <FormField
                control={form.control}
                name="content"
                render={({field}) => (
                    <FormItem>
                        <FormControl>
                            <MessageComponser
                           value={field.value ?? ""}
                           onChange={field.onChange}
                           upload={upload}
                           key={editorKey} // needed to reset the editor when the form is reset
                           onSubmit={form.handleSubmit(onSubmit)}
                            />
                        </FormControl>
                    </FormItem>
                )
            }
                />
            </form>
        </Form>
    )
}