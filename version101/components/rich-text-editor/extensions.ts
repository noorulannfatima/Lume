import StarterKit from "@tiptap/starter-kit";
import TextAlign from "@tiptap/extension-text-align";
import { all, createLowlight } from "lowlight";
import CodeBlock from "@tiptap/extension-code-block-lowlight";

// create a lowlight instance with all languages loaded
const lowlight = createLowlight(all)

export const baseExtensions = [
    
        StarterKit.configure({
                codeBlock: false,
            }),
            // only heading and paragraph
            TextAlign.configure({
                types: ["heading", "paragraph"],
            }),
            CodeBlock
];