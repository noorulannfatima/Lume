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


interface iAppProps {
    channelId: string;
}

export function MessageInputForm({channelId}: iAppProps) {

    const queryClient = useQueryClient();

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
                
                return toast.success("message created successfully");
            },
            onError: () => {
                return toast.error("message created failed");
            },
        })
    );

    function onSubmit(data: CreateMessageSchemaType) {
        createMessageMutation.mutate(data);
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