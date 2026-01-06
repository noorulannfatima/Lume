"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Image from "next/image";
import { useParams } from "next/navigation";
import { orpc } from "@/lib/orpc";
import { useSuspenseQuery } from "@tanstack/react-query";

export function WorkspaceMembersList() {
    const { workspaceId } = useParams<{ workspaceId: string }>();

    const { data: members } = useSuspenseQuery(
        orpc.workspace.member.list.queryOptions({
            input: { workspaceId },
        })
    );

    return (
        <div className="space-y-0.5 py-1">
            {members.map((member) =>(
                <div 
                className="px-3 py-2 hover:bg-accent cursor-pointer transition-colors flex items-center space-x-3" 
                key={member.id}>
                    <div className="relative">
                        <Avatar className="size-8 relative">
                            {member.image ? (
                                <Image
                                    src={member.image}
                                    alt="User Image"
                                    className="object-cover"
                                    fill
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                />
                            ) : null}
                            <AvatarFallback>
                                {member.name?.charAt(0).toUpperCase()}
                            </AvatarFallback>
                        </Avatar>
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{member.name}</p>
                        <p className="text-xs text-muted-foreground truncate">{member.email}</p>
                    </div>

                </div>
            ))}
        </div>
    );
}