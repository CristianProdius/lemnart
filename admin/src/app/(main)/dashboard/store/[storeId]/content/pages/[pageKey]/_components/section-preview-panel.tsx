"use client";

import { useEffect, useRef, useCallback } from "react";
import { useWatch, type UseFormReturn, type FieldValues } from "react-hook-form";
import { cn } from "@/lib/utils";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyForm = UseFormReturn<FieldValues, any, any>;

interface PagePreviewPanelProps {
    pageKey: string;
    sectionKeys: string[];
    forms: Record<string, AnyForm>;
    expandedSection: string;
    breakpoint: "desktop" | "tablet" | "mobile";
    storeUrl: string;
}

function useAllSectionValues(
    sectionKeys: string[],
    forms: Record<string, AnyForm>
) {
    const watched: Record<string, unknown> = {};
    for (const key of sectionKeys) {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        watched[key] = useWatch({ control: forms[key].control });
    }
    return watched;
}

export function PagePreviewPanel({
    pageKey,
    sectionKeys,
    forms,
    expandedSection,
    breakpoint,
    storeUrl,
}: PagePreviewPanelProps) {
    const iframeRef = useRef<HTMLIFrameElement>(null);
    const readyRef = useRef(false);
    const debounceRef = useRef<ReturnType<typeof setTimeout>>(null);
    const prevExpandedRef = useRef(expandedSection);

    const allValues = useAllSectionValues(sectionKeys, forms);

    const sendUpdate = useCallback(
        (scrollTo?: string) => {
            if (!iframeRef.current?.contentWindow || !readyRef.current) return;
            iframeRef.current.contentWindow.postMessage(
                {
                    type: "PAGE_PREVIEW_UPDATE",
                    payload: { sections: allValues, scrollTo },
                },
                storeUrl
            );
        },
        [allValues, storeUrl]
    );

    // Send scroll command when expanded section changes
    useEffect(() => {
        if (expandedSection && expandedSection !== prevExpandedRef.current) {
            if (iframeRef.current?.contentWindow && readyRef.current) {
                iframeRef.current.contentWindow.postMessage(
                    {
                        type: "PAGE_PREVIEW_SCROLL_TO",
                        payload: { sectionKey: expandedSection },
                    },
                    storeUrl
                );
            }
        }
        prevExpandedRef.current = expandedSection;
    }, [expandedSection, storeUrl]);

    // Listen for iframe ready
    useEffect(() => {
        const handleMessage = (event: MessageEvent) => {
            if (event.origin !== storeUrl) return;
            if (event.data?.type === "PAGE_PREVIEW_READY") {
                readyRef.current = true;
                sendUpdate(expandedSection || undefined);
            }
        };
        window.addEventListener("message", handleMessage);
        return () => window.removeEventListener("message", handleMessage);
    }, [sendUpdate, storeUrl, expandedSection]);

    // Debounced update on form value changes
    useEffect(() => {
        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => {
            sendUpdate();
        }, 150);
        return () => {
            if (debounceRef.current) clearTimeout(debounceRef.current);
        };
    }, [sendUpdate]);

    return (
        <div className="flex h-full items-start justify-center overflow-auto bg-muted/30 p-4">
            <iframe
                ref={iframeRef}
                src={`${storeUrl}/preview/page?pageKey=${pageKey}`}
                title="Full page preview"
                allow="autoplay"
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
