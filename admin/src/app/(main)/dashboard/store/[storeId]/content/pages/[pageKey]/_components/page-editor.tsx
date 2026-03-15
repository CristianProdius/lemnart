"use client";

import { useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { useForm, FormProvider } from "react-hook-form";
import axios from "axios";
import { toast } from "sonner";
import {
    ArrowLeft,
    Eye,
    EyeOff,
    Monitor,
    Tablet,
    Smartphone,
    Save,
    RotateCcw,
} from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
    ResizablePanelGroup,
    ResizablePanel,
    ResizableHandle,
} from "@/components/ui/resizable";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { AlertModal } from "@/components/modals/alert-modal";
import { SECTION_LABELS, SECTION_DEFAULTS } from "@/constants/sections";
import type { PageKey } from "@/constants/sections";
import { SECTION_FIELD_MAP } from "../../../_components/section-fields";
import { PagePreviewPanel } from "./section-preview-panel";

interface PageEditorProps {
    pageKey: PageKey;
    pageLabel: string;
    sectionKeys: string[];
    sectionsData: Record<string, {
        data: Record<string, unknown>;
        isCustomized: boolean;
    }>;
    storeUrl: string;
}

function useSectionForms(
    sectionKeys: string[],
    sectionsData: PageEditorProps["sectionsData"]
) {
    const forms: Record<string, ReturnType<typeof useForm>> = {};
    for (const key of sectionKeys) {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        forms[key] = useForm({
            defaultValues: sectionsData[key].data as Record<string, unknown>,
        });
    }
    return forms;
}

export function PageEditor({
    pageKey,
    pageLabel,
    sectionKeys,
    sectionsData,
    storeUrl,
}: PageEditorProps) {
    const params = useParams();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [showPreview, setShowPreview] = useState(false);
    const [breakpoint, setBreakpoint] = useState<"desktop" | "tablet" | "mobile">("desktop");
    const [expandedSection, setExpandedSection] = useState<string>("");
    const [resetTarget, setResetTarget] = useState<string | null>(null);
    const [customizedState, setCustomizedState] = useState<Record<string, boolean>>(
        () => Object.fromEntries(sectionKeys.map((k) => [k, sectionsData[k].isCustomized]))
    );

    const forms = useSectionForms(sectionKeys, sectionsData);

    const saveSingle = useCallback(
        async (sectionKey: string) => {
            const form = forms[sectionKey];
            const data = form.getValues();
            const label = SECTION_LABELS[sectionKey] || sectionKey;
            try {
                setLoading(true);
                await axios.put(
                    `/api/${params.storeId}/site-content/${sectionKey}`,
                    { value: data }
                );
                setCustomizedState((prev) => ({ ...prev, [sectionKey]: true }));
                toast.success(`${label} section saved.`);
            } catch {
                toast.error(`Failed to save ${label}.`);
            } finally {
                setLoading(false);
            }
        },
        [forms, params.storeId]
    );

    const resetSingle = useCallback(
        async (sectionKey: string) => {
            const label = SECTION_LABELS[sectionKey] || sectionKey;
            try {
                setLoading(true);
                await axios.delete(
                    `/api/${params.storeId}/site-content/${sectionKey}`
                );
                const defaults = SECTION_DEFAULTS[sectionKey] ?? {};
                forms[sectionKey].reset(defaults);
                setCustomizedState((prev) => ({ ...prev, [sectionKey]: false }));
                toast.success(`${label} section reset to defaults.`);
            } catch {
                toast.error(`Failed to reset ${label}.`);
            } finally {
                setLoading(false);
                setResetTarget(null);
            }
        },
        [forms, params.storeId]
    );

    const saveAll = useCallback(async () => {
        const dirtyKeys = sectionKeys.filter(
            (key) => forms[key].formState.isDirty
        );
        if (dirtyKeys.length === 0) {
            toast.info("No changes to save.");
            return;
        }
        try {
            setLoading(true);
            await Promise.all(
                dirtyKeys.map((key) =>
                    axios.put(
                        `/api/${params.storeId}/site-content/${key}`,
                        { value: forms[key].getValues() }
                    )
                )
            );
            setCustomizedState((prev) => {
                const next = { ...prev };
                for (const key of dirtyKeys) next[key] = true;
                return next;
            });
            toast.success(`Saved ${dirtyKeys.length} section${dirtyKeys.length > 1 ? "s" : ""}.`);
        } catch {
            toast.error("Failed to save some sections.");
        } finally {
            setLoading(false);
        }
    }, [forms, sectionKeys, params.storeId]);

    const accordionContent = (
        <ScrollArea className="h-full">
            <div className="p-6">
                <Accordion
                    type="single"
                    collapsible
                    value={expandedSection}
                    onValueChange={setExpandedSection}
                >
                    {sectionKeys.map((key) => {
                        const label = SECTION_LABELS[key] || key;
                        const FieldComponent = SECTION_FIELD_MAP[key];
                        const form = forms[key];
                        const isCustomized = customizedState[key];

                        return (
                            <AccordionItem
                                key={key}
                                value={key}
                                className="rounded-lg border px-4 mb-3 last:mb-0"
                            >
                                <AccordionTrigger className="hover:no-underline">
                                    <div className="flex items-center gap-3">
                                        <span className="font-medium">
                                            {label}
                                        </span>
                                        <Badge
                                            variant={isCustomized ? "default" : "outline"}
                                            className="px-1.5 text-muted-foreground"
                                        >
                                            {isCustomized ? "Customized" : "Default"}
                                        </Badge>
                                    </div>
                                </AccordionTrigger>
                                <AccordionContent>
                                    <FormProvider {...form}>
                                        <div className="space-y-4 pt-2">
                                            {FieldComponent && (
                                                <FieldComponent loading={loading} />
                                            )}
                                            <Separator />
                                            <div className="flex items-center justify-end gap-2">
                                                {isCustomized && (
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => setResetTarget(key)}
                                                        disabled={loading}
                                                        className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                                                    >
                                                        <RotateCcw className="mr-1.5 size-3.5" />
                                                        Reset
                                                    </Button>
                                                )}
                                                <Button
                                                    type="button"
                                                    size="sm"
                                                    onClick={() => saveSingle(key)}
                                                    disabled={loading}
                                                >
                                                    <Save className="mr-1.5 size-3.5" />
                                                    Save
                                                </Button>
                                            </div>
                                        </div>
                                    </FormProvider>
                                </AccordionContent>
                            </AccordionItem>
                        );
                    })}
                </Accordion>
            </div>
        </ScrollArea>
    );

    return (
        <>
            <AlertModal
                isOpen={!!resetTarget}
                onClose={() => setResetTarget(null)}
                onConfirm={() => resetTarget && resetSingle(resetTarget)}
                loading={loading}
            />
            <div className="flex h-[calc(100dvh-8rem)] flex-col">
                {/* ── Header ── */}
                <div className="flex shrink-0 items-center justify-between border-b px-6 pb-4">
                    <div className="flex items-center gap-3">
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="size-8"
                            asChild
                        >
                            <Link href={`/dashboard/store/${params.storeId}/content`}>
                                <ArrowLeft className="size-4" />
                                <span className="sr-only">Back</span>
                            </Link>
                        </Button>
                        <Separator orientation="vertical" className="h-5" />
                        <div>
                            <h2 className="text-lg font-semibold">{pageLabel}</h2>
                            <p className="text-xs text-muted-foreground">
                                Edit all sections for this page.
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        {/* Preview toggle */}
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        type="button"
                                        variant={showPreview ? "secondary" : "ghost"}
                                        size="sm"
                                        onClick={() => setShowPreview(!showPreview)}
                                        aria-label={showPreview ? "Hide preview" : "Show preview"}
                                    >
                                        {showPreview ? (
                                            <EyeOff className="mr-1.5 size-4" />
                                        ) : (
                                            <Eye className="mr-1.5 size-4" />
                                        )}
                                        Preview
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    {showPreview ? "Hide live preview" : "Show live preview"}
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>

                        <Separator orientation="vertical" className="h-5" />

                        {/* Save All */}
                        <Button
                            type="button"
                            size="sm"
                            onClick={saveAll}
                            disabled={loading}
                        >
                            <Save className="mr-1.5 size-4" />
                            Save All
                        </Button>
                    </div>
                </div>

                {/* ── Body ── */}
                <div className="min-h-0 flex-1">
                    {showPreview ? (
                        <ResizablePanelGroup orientation="horizontal" className="h-full">
                            <ResizablePanel defaultSize={50} minSize={30}>
                                {accordionContent}
                            </ResizablePanel>

                            <ResizableHandle withHandle />

                            <ResizablePanel defaultSize={50} minSize={25}>
                                <div className="flex h-full flex-col">
                                    {/* Preview toolbar */}
                                    <div className="flex shrink-0 items-center justify-between border-b px-4 py-2">
                                        <span className="text-xs font-medium text-muted-foreground">
                                            Live Preview — Full Page
                                        </span>
                                        <ToggleGroup
                                            type="single"
                                            value={breakpoint}
                                            onValueChange={(v) => {
                                                if (v) setBreakpoint(v as typeof breakpoint);
                                            }}
                                            variant="outline"
                                            size="sm"
                                        >
                                            <ToggleGroupItem value="desktop" aria-label="Desktop preview">
                                                <Monitor className="size-3.5" />
                                            </ToggleGroupItem>
                                            <ToggleGroupItem value="tablet" aria-label="Tablet preview">
                                                <Tablet className="size-3.5" />
                                            </ToggleGroupItem>
                                            <ToggleGroupItem value="mobile" aria-label="Mobile preview">
                                                <Smartphone className="size-3.5" />
                                            </ToggleGroupItem>
                                        </ToggleGroup>
                                    </div>

                                    {/* Preview content */}
                                    <div className="min-h-0 flex-1 bg-muted/30">
                                        <PagePreviewPanel
                                            sectionKeys={sectionKeys}
                                            forms={forms}
                                            expandedSection={expandedSection}
                                            breakpoint={breakpoint}
                                            storeUrl={storeUrl}
                                        />
                                    </div>
                                </div>
                            </ResizablePanel>
                        </ResizablePanelGroup>
                    ) : (
                        accordionContent
                    )}
                </div>
            </div>
        </>
    );
}
