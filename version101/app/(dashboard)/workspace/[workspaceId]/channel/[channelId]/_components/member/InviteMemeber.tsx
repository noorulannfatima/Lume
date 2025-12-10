import { inviteMemberSchema, InviteMemberSchemaType } from "@/app/schemas/member";
import { Button } from "@/components/ui/button";
import { 
Dialog, 
DialogContent, 
DialogDescription, 
DialogHeader, 
DialogTitle, 
DialogTrigger 
} from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { orpc } from "@/lib/orpc";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { UserPlus } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";




export default function InviteMember() {
    const [open, setOpen] = useState(false);
    const form = useForm({
        resolver: zodResolver(inviteMemberSchema),
        defaultValues: {
            name: '',
            email: '',
        },
    });


    const inviteMutation = useMutation(
        orpc.workspace.member.invite.mutationOptions({
            onSuccess: () => {
              toast.success("Member invited successfully");
              form.reset();
              setOpen(false);
            },
            onError: () => {
              toast.error("Failed to invite member");
            },
        })
    )

    function onSubmit(values: InviteMemberSchemaType) {
        inviteMutation.mutate(values);
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline">
                    <UserPlus/>
                    Invite Member
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add Member</DialogTitle>
                    <DialogDescription>
                        Invite new members to your workspace
                        </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form
                    className="space-y-4"
                    >
                        <FormField
                        name="name"
                        control={form.control}
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="Enter name..." {...field}/>
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                        />
                        <FormField
                        name="email"
                        control={form.control}
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input placeholder="Enter email..." {...field}/>
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                        />

                        <Button type="submit">Send Invite</Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}