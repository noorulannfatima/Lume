import { RichTextEditor } from "@/components/rich-text-editor/Editor";
import { ImageUploadModal } from "@/components/rich-text-editor/ImageUploadModel";
import { Button } from "@/components/ui/button";
import { useAttachmentUploadType } from "@/hooks/use-attachment-upload";
import { ImageIcon, Send } from "lucide-react";
import { AttachmentChip } from "./AttachmentChip";


interface iAppProps {
    value: string;
    onChange: (next: string) => void;
    onSubmit: () => void;
    isSubmitting?: boolean; // this could be undefined or optional
    upload: useAttachmentUploadType;
}

export function MessageComponser({value, onChange, onSubmit, isSubmitting, upload}: iAppProps) {
    return (
        <>
        <RichTextEditor
        field={{ value, onChange}}
        sendButton={
        <Button 
        type="button" 
        size="sm" 
        onClick={onSubmit} 
        disabled={isSubmitting}
        >
            <Send className="size-4 mr-1"/>
                Send
        </Button>
        }
        footerLeft={
           upload.stagedUrl ? (
             <AttachmentChip 
             url={upload.stagedUrl}
             onRemove={upload.clear}/>
           ) : (
             <Button onClick={() => upload.setOpen(true)} type="button" size="sm" variant="outline">
                  <ImageIcon className="size-4 mr-1"/>
                  Attach
            </Button>
           )
        }
        />

        <ImageUploadModal 
        onUploading={(url) => upload.onUploaded(url)} 
        open={upload.isOpen} 
        onOpenChange={upload.setOpen}
        />
        </>
    )
}