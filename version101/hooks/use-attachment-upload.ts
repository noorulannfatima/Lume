"use client";

import { useCallback, useMemo, useState } from "react";

export function useAttachmentUpload() {
    const [isOpen, setOpen] = useState(false);
    const [stagedUrl, setStagedUrl] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);

    const onUploaded = useCallback((url: string) => {
        setStagedUrl(url);
        setIsUploading(false);
        setOpen(false);
    }, []); 

    const clear = useCallback(() => {
        setStagedUrl(null);
        setIsUploading(false);
    }, []);  // to delete the attachment

    return useMemo(() => ({
        isOpen,
        setOpen,
        onUploaded,
        stagedUrl,
        isUploading,
        clear
    }), [isOpen, setOpen, onUploaded, stagedUrl, isUploading, clear]);
}

export type useAttachmentUploadType = ReturnType<typeof useAttachmentUpload>