import { SafeContent } from "@/components/rich-text-editor/SafeContent";
import { MessageSchemaType } from "@/app/schemas/message";
import { getAvatar } from "@/utils/get-avatar";
import Image from "next/image";


interface iAppProps {
    message: MessageSchemaType;

}
export function MessageItem ({message}: iAppProps) {
    // Safely parse JSON content with fallback
    const parseContent = () => {
        try {
            if (!message.content || message.content.trim() === '') {
                return { type: 'doc', content: [] };
            }
            return JSON.parse(message.content);
        } catch (error) {
            console.error('Failed to parse message content:', error);
            return { type: 'doc', content: [] };
        }
    };

    // Handle both object format {url: string} and string format
    const getAttachmentUrl = (): string | null => {
        if (!message.attachments) return null;
        
        if (typeof message.attachments === 'string') {
            return message.attachments.trim() || null;
        }
        
        if (typeof message.attachments === 'object' && 'url' in message.attachments) {
            return (message.attachments as any).url || null;
        }
        
        return null;
    };

    const attachmentUrl = getAttachmentUrl();

    // Debug logging
    console.log('📎 Message ID:', message.id, 'Attachments:', message.attachments, 'Type:', typeof message.attachments, 'Extracted URL:', attachmentUrl);

    return (
        <div className="flex space-x-3 relative p-3 rounded-lg group hover:bg-muted/50">
            <Image
            src={getAvatar(message.user.image, message.user.email)} 
            alt="User Avatar"
            width={32}
            height={32}
            className="size-8 rounded-lg"
            />
            <div className="flex-1 space-y-1 min-w-0">
                <div className="flex items-center gap-x-2">
                    <p className="font-medium leading-none">{message.user.name || message.user.email}</p>
                    <p className="text-sm text-muted-foreground leading-none">
                        {new Intl.DateTimeFormat('en-GB', {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                        }).format(message.createdAt)} {"  "}

                        {new Intl.DateTimeFormat('en-GB', {
                            hour12: false,
                            hour: "2-digit",
                            minute: "2-digit",
                        }).format(message.createdAt)}
                    </p>
                </div>

                <SafeContent 
                className="text-sm break-words prose dark:prose-invert 
                max-w-none mark:text-primary"
                content={parseContent()}/>

                {attachmentUrl && (
                    <div className="mt-3">
                        <Image
                        src={attachmentUrl}
                        alt="Message attachment"
                        width={512}
                        height={512}
                        className="rounded-md mx-h-[320px] w-auto object-contain"
                        />
                    </div>
                )}
            </div>
        </div>
    );
} 