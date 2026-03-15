"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import { useCallback } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    Bold,
    Italic,
    Heading2,
    Heading3,
    List,
    ListOrdered,
    Quote,
    Link as LinkIcon,
    Undo,
    Redo,
} from "lucide-react";

interface RichTextEditorProps {
    value: string;
    onChange: (value: string) => void;
    disabled?: boolean;
    placeholder?: string;
}

export function RichTextEditor({
    value,
    onChange,
    disabled = false,
    placeholder = "Start writing...",
}: RichTextEditorProps) {
    const editor = useEditor({
        immediatelyRender: false,
        extensions: [
            StarterKit.configure({
                heading: { levels: [2, 3] },
            }),
            Link.configure({
                openOnClick: false,
                HTMLAttributes: { rel: "noopener noreferrer", target: "_blank" },
            }),
            Image,
            Placeholder.configure({ placeholder }),
        ],
        content: value,
        editable: !disabled,
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
        editorProps: {
            attributes: {
                class: "prose prose-sm max-w-none min-h-[300px] p-4 focus:outline-none dark:prose-invert",
            },
        },
    });

    const setLink = useCallback(() => {
        if (!editor) return;
        const previousUrl = editor.getAttributes("link").href;
        const url = window.prompt("URL", previousUrl);
        if (url === null) return;
        if (url === "") {
            editor.chain().focus().extendMarkRange("link").unsetLink().run();
            return;
        }
        editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
    }, [editor]);

    if (!editor) return null;

    return (
        <div className={cn("rounded-md border", disabled && "opacity-50")}>
            {/* Toolbar */}
            <div className="flex flex-wrap gap-1 border-b p-2">
                <Button
                    type="button"
                    variant={editor.isActive("bold") ? "secondary" : "ghost"}
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    disabled={disabled}
                >
                    <Bold className="h-4 w-4" />
                </Button>
                <Button
                    type="button"
                    variant={editor.isActive("italic") ? "secondary" : "ghost"}
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    disabled={disabled}
                >
                    <Italic className="h-4 w-4" />
                </Button>
                <Button
                    type="button"
                    variant={editor.isActive("heading", { level: 2 }) ? "secondary" : "ghost"}
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                    disabled={disabled}
                >
                    <Heading2 className="h-4 w-4" />
                </Button>
                <Button
                    type="button"
                    variant={editor.isActive("heading", { level: 3 }) ? "secondary" : "ghost"}
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                    disabled={disabled}
                >
                    <Heading3 className="h-4 w-4" />
                </Button>
                <Button
                    type="button"
                    variant={editor.isActive("bulletList") ? "secondary" : "ghost"}
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    disabled={disabled}
                >
                    <List className="h-4 w-4" />
                </Button>
                <Button
                    type="button"
                    variant={editor.isActive("orderedList") ? "secondary" : "ghost"}
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                    disabled={disabled}
                >
                    <ListOrdered className="h-4 w-4" />
                </Button>
                <Button
                    type="button"
                    variant={editor.isActive("blockquote") ? "secondary" : "ghost"}
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => editor.chain().focus().toggleBlockquote().run()}
                    disabled={disabled}
                >
                    <Quote className="h-4 w-4" />
                </Button>
                <Button
                    type="button"
                    variant={editor.isActive("link") ? "secondary" : "ghost"}
                    size="icon"
                    className="h-8 w-8"
                    onClick={setLink}
                    disabled={disabled}
                >
                    <LinkIcon className="h-4 w-4" />
                </Button>

                <div className="ml-auto flex gap-1">
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => editor.chain().focus().undo().run()}
                        disabled={disabled || !editor.can().undo()}
                    >
                        <Undo className="h-4 w-4" />
                    </Button>
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => editor.chain().focus().redo().run()}
                        disabled={disabled || !editor.can().redo()}
                    >
                        <Redo className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            {/* Editor */}
            <EditorContent editor={editor} />
        </div>
    );
}
