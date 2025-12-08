import { UploadDropzone } from "@/lib/uploadthing";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { toast } from "sonner";

interface ImageUploadModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onUploading: (url: string) => void;

}
export function ImageUploadModal({open, onOpenChange, onUploading}: ImageUploadModalProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Upload Image</DialogTitle>
                </DialogHeader>
                <UploadDropzone 
                className="ut-uploading:opacity-50 ut-ready:bg-card
                ut-ready:border-border ut-ready:text-foreground ut-uploading:bg-muted
                ut-label:text-sm ut-label:text-muted-foreground
                ut-allowed-content:text-xs ut-allowed-content:text-muted-foreground
                ut-button:bg-success ut-button:text-success-foreground rounded-lg border"
                appearance={{
                    container: "bg-card",
                    label: "bg-muted-foreground",
                    allowedContent: "text-muted-foreground text-sm",
                    button: "bg-success text-success-foreground hover:bg-success/90",
                    uploadIcon: "text-muted-foreground",
                    
                }}
                endpoint={"imageUploader"}
                onClientUploadComplete={(res) => {
                    const url = res[0].ufsUrl;

                    toast.success("Image uploaded successfully");
                    onUploading(url);
                }}
                onUploadError={(error) => {
                    toast.error(error.message)
                }}
                />
            </DialogContent>
        </Dialog>
    );
}

