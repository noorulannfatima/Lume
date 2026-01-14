import { Button } from "@/components/ui/button";
import { MessageSquare, X } from "lucide-react";
import Image from "next/image";
import { ThreadReply } from "./ThreadReply";
import { ThreadReplyForm } from "./ThreadReplyForm";

const messages = [
    {
        id: 1,
        content: "Hello",
        sender: "User",
        image: "null",
        timestamp: "2022-01-01T00:00:00Z",
    }
]

export function ThreadSidebar() {
    return (
        <div className="w-[30rem] border-l flex flex-col h-full">
            {/* Header */}
            <div className="border-b h-14 px-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <MessageSquare className="size-4"/>
                    <span>Thread</span>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="icon">
                        <X className="size-4"/>
                    </Button>
                </div>
            </div>
          {/* Main Content */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-4 border-b bg-muted/20">
                <div className="flex space-x-3">
                    <Image
                    src={messages[0].image} 
                    alt="User"
                    width={32}
                    height={32} 
                    className="size-8 rounded-full shrink-0"
                    />
                    <div className="flex-1 space-y-1 min-w-0"> 
                        <div className="flex items-center space-x-2">
                            <span className="font-medium text-sm">
                                {messages[0].sender}
                            </span>
                            <span className="text-xs text-muted-foreground">
                                {new Intl.DateTimeFormat("en-US", {
                                    hour: "numeric",
                                    minute: "numeric",
                                    hour12: true,
                                    month: "short",
                                    day: "numeric",
                                    year: "numeric",
                                }).format(new Date(messages[0].timestamp))}
                            </span>
                        </div>

                        <p className="text-sm break-words prose dark:prose-invert
                        max-w-none">
                            {messages[0].content}
                        </p>
                    </div>
                </div>
            </div>
            {/* Thread replies */}
            <div className="p-2">
                <p className="text-sm text-muted-foreground mb-3 px-2"> 
                {messages.length} replies
                </p>

                <div className="space-y-1">
                    {messages.map((reply) => (
                        <ThreadReply
                        key={reply.id}
                        message={reply.content}
                        sender={reply.sender}
                        timestamp={reply.timestamp}
                        image={reply.image}
                        />
                    ))}

                </div>
            </div>

          </div>

          {/* Thread reply form */}
          <div className="border-t p-4">
            <ThreadReplyForm threadId="ivjvjirej"/>
          </div>
        </div>
    )
}