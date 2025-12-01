import { buttonVariants } from "@frontend/components/ui/button";
import { cn } from "@shared/utils";
import { Hash, Link } from "lucide-react";

const channels = [
    {
        id: 1,
        name: "channel 1"
    },
    {
        id: 2,
        name: "channel 2"
    },
    {
        id: 3,
        name: "channel 3"
    },
];


function ChannelList() {
    return <div className="space-y-0.5 py-1">
        {channels.map((channel) => (
            <Link 
            className={buttonVariants({
                variant: "ghost",
                className: cn(
                    "w-full justify-start px-2 py-1 h-7 text-muted-foreground hover:text-accent-foreground hover:bg-accent"
                ),
            })}
            key={channel.id} href={`/workspace/${channel.id}`}>
                <Hash className="size-4"/>

                <span className="truncate">{channel.name}</span>
            </Link>
            ))}
    </div>;
}

export { ChannelList };