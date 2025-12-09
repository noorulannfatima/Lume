'use client';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { getAvatar } from "@/utils/get-avatar";
import { orpc } from "@/lib/orpc";
import { useSuspenseQuery } from "@tanstack/react-query";
import { CreditCard, LogOut, User } from "lucide-react";
import { signOut } from "next-auth/react";
import { useState } from "react";
import { AccountSettings } from "./AccountSettings";
import { Billing } from "./Billing";


export function UserNav() {
    const {
        data: {user},
    } = useSuspenseQuery(orpc.workspace.list.queryOptions({
        input: {},
    }));
    
    const [accountSettingsOpen, setAccountSettingsOpen] = useState(false);
    const [billingOpen, setBillingOpen] = useState(false);

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                    variant={"outline"}
                    size={"icon"}
                    className="size-12 rounded-xl hover:rounded-lg transition-all duration-200
                    bg-bacground/50 border-border/50 hover:bg-accent hover:text-accent-foreground">
                        <Avatar>
                            <AvatarImage 
                            src={getAvatar(user.image, user.email!)} 
                            alt="User Image"
                            className="object-cover"
                            />
                            <AvatarFallback> 
                                {user.name?.slice(0,2).toUpperCase()}
                            </AvatarFallback>

                        </Avatar>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                align="end"
                side="right"
                sideOffset={8}
                className="w-[200px]"
                >
                    <DropdownMenuLabel className="font-normal flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                        <Avatar className="relative size-8 rounded-lg">
                            <AvatarImage 
                            src={getAvatar(user.image, user.email!)} 
                            // added ! mark as email will never be null in this case
                            alt="User Image"
                            className="object-cover"
                            />
                            <AvatarFallback> 
                                {/* added ? mark as given_name can be null */}
                                {user.name?.slice(0,2).toUpperCase()}
                            </AvatarFallback>

                        </Avatar>
                        <div className="grid flex-1 text-left text-sm leading-tight">
                            <p className="truncate font-medium">{user.name}</p>
                            <p className="text-muted-foreground truncate text-sm">{user.email}</p>
                        </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator/>
                    <DropdownMenuGroup>
                        <DropdownMenuItem onClick={() => setAccountSettingsOpen(true)}>
                            <User/>
                            Account
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setBillingOpen(true)}>
                            <CreditCard/>
                            Billing
                        </DropdownMenuItem>
                        <DropdownMenuSeparator/>
                        <DropdownMenuItem onClick={() => signOut()}>
                            <LogOut/>
                            Log out
                        </DropdownMenuItem>
                    </DropdownMenuGroup>
                </DropdownMenuContent>
                    
            </DropdownMenu>

            {/* Account Settings Dialog */}
            <AccountSettings 
                open={accountSettingsOpen} 
                onOpenChange={setAccountSettingsOpen}
                user={user}
            />

            {/* Billing Dialog */}
            <Billing 
                open={billingOpen}
                onOpenChange={setBillingOpen}
            />
        </>
    )
}