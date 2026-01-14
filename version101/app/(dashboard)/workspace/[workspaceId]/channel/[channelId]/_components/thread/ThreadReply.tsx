import Image from "next/image";

interface ThreadReplyProps {
    message: string;
    sender: string;
    timestamp: string;
    image: string;
}

export function ThreadReply({message, sender, timestamp, image}: ThreadReplyProps) {
    return (
        <div className="flex space-x-3 p-3 hover:bg-muted/30 rounded-lg">
            <Image 
            alt="User Image"
            src={image}
            width={32} 
            height={32} 
            className="size-8 rounded-full shrink-0"
            />
            <div className="flex-1 space-y-1 min-w-0"> 
                        <div className="flex items-center space-x-2">
                            <span className="font-medium text-sm">
                                {sender}
                            </span>
                            <span className="text-xs text-muted-foreground">
                                {new Intl.DateTimeFormat("en-US", {
                                    hour: "numeric",
                                    minute: "numeric",
                                    hour12: true,
                                    month: "short",
                                    day: "numeric",
                                    year: "numeric",
                                }).format(new Date(timestamp))}
                            </span>
                        </div>

                        <p className="text-sm break-words prose dark:prose-invert
                        max-w-none">
                            {message}
                        </p>
                    </div>
            
        </div>
    )
}