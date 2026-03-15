"use client";

import { useEffect, useRef, useCallback } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { cn } from "@/lib/utils";

interface BlogPostPreviewProps {
    breakpoint: "desktop" | "tablet" | "mobile";
    storeUrl: string;
}

export function BlogPostPreview({ breakpoint, storeUrl }: BlogPostPreviewProps) {
    const iframeRef = useRef<HTMLIFrameElement>(null);
    const readyRef = useRef(false);
    const { control } = useFormContext();

    const title = useWatch({ control, name: "title" });
    const excerpt = useWatch({ control, name: "excerpt" });
    const content = useWatch({ control, name: "content" });
    const category = useWatch({ control, name: "category" });
    const readTime = useWatch({ control, name: "readTime" });
    const authorName = useWatch({ control, name: "authorName" });
    const coverImage = useWatch({ control, name: "coverImage" });
    const publishedAt = useWatch({ control, name: "publishedAt" });

    const sendUpdate = useCallback(() => {
        if (!iframeRef.current?.contentWindow || !readyRef.current) return;
        iframeRef.current.contentWindow.postMessage(
            {
                type: "BLOG_PREVIEW_UPDATE",
                payload: {
                    title,
                    excerpt,
                    content,
                    category,
                    readTime,
                    authorName,
                    coverImage,
                    publishedAt,
                },
            },
            storeUrl
        );
    }, [title, excerpt, content, category, readTime, authorName, coverImage, publishedAt, storeUrl]);

    // Listen for the iframe to signal it's ready
    useEffect(() => {
        const handleMessage = (event: MessageEvent) => {
            if (event.data?.type === "BLOG_PREVIEW_READY") {
                readyRef.current = true;
                sendUpdate();
            }
        };
        window.addEventListener("message", handleMessage);
        return () => window.removeEventListener("message", handleMessage);
    }, [sendUpdate]);

    // Send updates whenever form values change
    useEffect(() => {
        sendUpdate();
    }, [sendUpdate]);

    return (
        <div className="flex h-full items-start justify-center overflow-auto bg-muted/30 p-4">
            <iframe
                ref={iframeRef}
                src={`${storeUrl}/blog/preview`}
                title="Blog post preview"
                className={cn(
                    "h-full rounded-md border bg-white shadow-sm",
                    breakpoint === "mobile" && "w-[375px]",
                    breakpoint === "tablet" && "w-[768px]",
                    breakpoint === "desktop" && "w-full"
                )}
            />
        </div>
    );
}
