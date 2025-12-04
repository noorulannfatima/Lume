"use client";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/utils/utils";
import { Hash } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { orpc } from "@/lib/orpc";
import { useQuery, useSuspenseQuery } from "@tanstack/react-query";

function ChannelList() {
    // Fetch channels using React Query
    const { 
    data: {channels, isLoading, error} 
    } = useSuspenseQuery(orpc.channel.list.queryOptions());
    const {workspaceId, channelId} = useParams<{
        workspaceId: string;
        channelId: string;
    }>();

    if (isLoading) {
        return (
            <div className="space-y-0.5 py-1">
                <div className="px-2 py-1 text-sm text-muted-foreground">
                    Loading channels...
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="space-y-0.5 py-1">
                <div className="px-2 py-1 text-sm text-destructive">
                    Failed to load channels
                </div>
            </div>
        );
    }

    if (!channels || channels.length === 0) {
        return (
            <div className="space-y-0.5 py-1">
                <div className="px-2 py-1 text-sm text-muted-foreground">
                    No channels yet
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-0.5 py-1">
            {channels.map((channel: { id: string; name: string; 
            description: string | null; isPrivate: boolean; 
            createdAt: Date }) => {
                const isActive = channel.id === channelId;

                return(
                    <Link 
                    className={buttonVariants({
                        variant: "ghost",
                        className: cn(
                            "w-full justify-start px-2 py-1 h-7 text-muted-foreground hover:text-accent-foreground hover:bg-accent",
                             isActive && "bg-accent text-accent-foreground"
                        ),
                    })}
                    key={channel.id} 
                    href={`/workspace/${workspaceId}/channel/${channel.id}`}
                >
                    <Hash className="size-4"/>
                    <span className="truncate">{channel.name}</span>
                </Link>
                )
            })}
        </div>
    );
}

export { ChannelList };