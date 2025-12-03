"use client"
import { useEditor, EditorContent } from "@tiptap/react"
import { editorExtensions } from "./extensions"
import {MenuBar} from "./MenuBar";

export function RichTextEditor() {
    const editor = useEditor({
        immediatelyRender: false,
        extensions: editorExtensions,
        editorProps: {
            attributes: {
                class: "max-w-none min-h-[125px] focus:outline-none p-4 prose dark:prose-invert marker:text-primary !w-full !max-w-none "
            },
        },
    });
//
    return (
        <div className="flex flex-col relative w-full border-input 
        rounded-lg overflow-hidden dark:bg-input/30">
            <MenuBar editor={editor}/>
            <EditorContent 
            editor={editor}
            className="max-h-[200px] overflow-y-auto"
            />
        </div>
    )
}
    