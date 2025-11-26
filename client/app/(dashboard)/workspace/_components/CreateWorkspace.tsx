"use client" // it trips js bundels for interactivity - client component
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Plus } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { workspaceSchema } from "@/app/schemas/workspace";

export function CreateWorkspace() {
    const [open, setOpen] = useState(false);

    // 1. Define your form
    const form = useForm({
        resolver: zodResolver(workspaceSchema), // helper function to connect zod with react hook form
        defaultValues: {
            name: "",
        }
    });

    // 2. Define a submit handler
    function onSubmit() {
        console.log("data");
    }
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <Tooltip>
                {/* control state for tooltip (using asChild to pass state to child so that it doesn't trigger as button)*/}
                <TooltipTrigger asChild> 
                    {/* control state for dialog */}
                    <DialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="size-12 rounded-xl border-2 border-dashed border-muted-foreground/50  
                        text-muted-foreground hover:border-muted-foreground hover:text-foreground hover:rounded-lg transition-all duration-200">
                            <Plus className="size-5"/>
                        </Button>
                    </DialogTrigger>
                </TooltipTrigger>
                <TooltipContent side="right">
                    <p> Create Workspace</p>
                </TooltipContent>
            </Tooltip>
            {/* if device is bigger then 640px then max w will be 425px */}
            <DialogContent className="sm:max-w-[425px]"> 
                <DialogHeader>
                    <DialogTitle>Create Workspace</DialogTitle>
                    <DialogDescription>
                        Create a new workspace to organize your projects.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
                        <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                   {/* {... field} will add all the require properties minlength, maxlength etc also 
                                   connect it with react hook form */}
                                    <Input placeholder="My Workspace" {...field}/>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                        />

                        <Button type="submit">
                            Create Workspace
                        </Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}