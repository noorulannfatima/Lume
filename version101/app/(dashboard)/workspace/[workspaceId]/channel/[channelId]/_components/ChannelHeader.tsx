'use client'
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { orpc } from "@/lib/orpc";
import InviteMember from "./member/InviteMemeber";
import { MembersOverview } from "./member/MembersOverview";


interface ChannelHeaderProps {
    channelName: string | undefined;
}
export function ChannelHeader({channelName}: ChannelHeaderProps) {
    const { channelId } = useParams<{ channelId: string }>();
    
    return (
        <div className="flex items-center justify-between h-14 px-4 border-b">
            <h1>#{channelName || 'Loading...'}</h1>

            <div className="flex items-center space-x-3">
                <MembersOverview/>
                <InviteMember/>
                <ThemeToggle/>
            </div>

        </div>
    )
    
}