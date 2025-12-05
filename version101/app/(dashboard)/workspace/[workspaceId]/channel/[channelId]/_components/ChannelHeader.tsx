'use client'
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { orpc } from "@/lib/orpc";

export function ChannelHeader() {
    const { channelId } = useParams<{ channelId: string }>();
    
    const { data: channel } = useQuery(orpc.channel.get.queryOptions({
        input: {
            channelId: channelId,
        }
    }));

    return (
        <div className="flex items-center justify-between h-14 px-4 border-b">
            <h1># {channel?.name || 'Loading...'}</h1>

            <div className="flex items-center space-x-2">
                <ThemeToggle/>
            </div>

        </div>
    )
    
}