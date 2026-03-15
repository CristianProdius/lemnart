"use client";

import { useState } from "react";
import * as z from "zod";
import { BlogPost } from "@prisma/client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "sonner";
import {
    Trash,
    ArrowLeft,
    Eye,
    EyeOff,
    Monitor,
    Tablet,
    Smartphone,
} from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { AlertModal } from "@/components/modals/alert-modal";
import ImageUpload from "@/components/ui/image-upload";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import {
    ResizablePanelGroup,
    ResizablePanel,
    ResizableHandle,
} from "@/components/ui/resizable";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { BlogPostPreview } from "./blog-post-preview";

const formSchema = z.object({
    title: z.string().min(1, "Title is required"),
    slug: z
        .string()
        .min(1, "Slug is required")
        .regex(
            /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
            "Slug must be lowercase with hyphens"
        ),
    excerpt: z.string().min(1, "Excerpt is required"),
    content: z.string().min(1, "Content is required"),
    coverImage: z.string().optional(),
    category: z.string().optional(),
    readTime: z.string().optional(),
    authorName: z.string().optional(),
    authorRole: z.string().optional(),
    isPublished: z.boolean().default(false),
    publishedAt: z.string().nullable().optional(),
});

type BlogPostFormValues = z.infer<typeof formSchema>;

interface BlogPostFormProps {
    initialData: BlogPost | null;
    storeUrl: string;
}

export const BlogPostForm: React.FC<BlogPostFormProps> = ({ initialData, storeUrl }) => {
    const params = useParams();
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showPreview, setShowPreview] = useState(false);
    const [breakpoint, setBreakpoint] = useState<
        "desktop" | "tablet" | "mobile"
    >("desktop");

    const isEditing = !!initialData;
    const toastMessage = isEditing ? "Post updated." : "Post created.";

    const form = useForm<BlogPostFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData
            ? {
                  title: initialData.title,
                  slug: initialData.slug,
                  excerpt: initialData.excerpt,
                  content: initialData.content,
                  coverImage: initialData.coverImage || "",
                  category: initialData.category || "",
                  readTime: initialData.readTime || "",
                  authorName: initialData.authorName || "",
                  authorRole: initialData.authorRole || "",
                  isPublished: initialData.isPublished,
                  publishedAt: initialData.publishedAt
                      ? new Date(initialData.publishedAt)
                            .toISOString()
                            .split("T")[0]
                      : null,
              }
            : {
                  title: "",
                  slug: "",
                  excerpt: "",
                  content: "",
                  coverImage: "",
                  category: "",
                  readTime: "",
                  authorName: "",
                  authorRole: "",
                  isPublished: false,
                  publishedAt: null,
              },
    });

    const generateSlug = (title: string) => {
        return title
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/[^a-z0-9\s-]/g, "")
            .replace(/\s+/g, "-")
            .replace(/-+/g, "-")
            .replace(/^-|-$/g, "");
    };

    const onSubmit = async (data: BlogPostFormValues) => {
        try {
            setLoading(true);
            const payload = {
                ...data,
                publishedAt: data.publishedAt
                    ? new Date(data.publishedAt).toISOString()
                    : null,
            };
            if (isEditing) {
                await axios.patch(
                    `/api/${params.storeId}/blog-posts/${params.blogPostId}`,
                    payload
                );
            } else {
                await axios.post(
                    `/api/${params.storeId}/blog-posts`,
                    payload
                );
            }
            router.refresh();
            router.push(`/dashboard/store/${params.storeId}`);
            toast.success(toastMessage);
        } catch {
            toast.error("Something went wrong.");
        } finally {
            setLoading(false);
        }
    };

    const onDelete = async () => {
        try {
            setLoading(true);
            await axios.delete(
                `/api/${params.storeId}/blog-posts/${params.blogPostId}`
            );
            router.refresh();
            router.push(`/dashboard/store/${params.storeId}`);
            toast.success("Post deleted.");
        } catch {
            toast.error("Something went wrong.");
        } finally {
            setLoading(false);
            setOpen(false);
        }
    };

    const formContent = (
        <ScrollArea className="h-full">
            <div
                className={cn(
                    "space-y-6 p-6",
                    !showPreview && "mx-auto max-w-5xl"
                )}
            >
                {showPreview ? (
                    /* ── Stacked layout when preview is open ── */
                    <div className="space-y-6">
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Title</FormLabel>
                                    <FormControl>
                                        <Input
                                            disabled={loading}
                                            placeholder="Post title"
                                            {...field}
                                            onChange={(e) => {
                                                field.onChange(e);
                                                if (!isEditing) {
                                                    form.setValue(
                                                        "slug",
                                                        generateSlug(
                                                            e.target.value
                                                        )
                                                    );
                                                }
                                            }}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="slug"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Slug</FormLabel>
                                        <FormControl>
                                            <Input
                                                disabled={loading}
                                                placeholder="post-url-slug"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="category"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Category</FormLabel>
                                        <FormControl>
                                            <Input
                                                disabled={loading}
                                                placeholder="e.g., Ghid"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="excerpt"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Excerpt</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            disabled={loading}
                                            placeholder="Brief summary of the post..."
                                            rows={2}
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="content"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Content</FormLabel>
                                    <FormControl>
                                        <RichTextEditor
                                            value={field.value}
                                            onChange={field.onChange}
                                            disabled={loading}
                                            placeholder="Write your blog post content..."
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Collapsed settings */}
                        <Separator />
                        <div className="space-y-4">
                            <h3 className="text-sm font-medium text-muted-foreground">
                                Settings
                            </h3>
                            <div className="grid grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="coverImage"
                                    render={({ field }) => (
                                        <FormItem className="col-span-2">
                                            <FormLabel>Cover Image</FormLabel>
                                            <FormControl>
                                                <ImageUpload
                                                    value={
                                                        field.value
                                                            ? [field.value]
                                                            : []
                                                    }
                                                    disabled={loading}
                                                    onChange={(url) =>
                                                        field.onChange(url)
                                                    }
                                                    onRemove={() =>
                                                        field.onChange("")
                                                    }
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="readTime"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Read Time</FormLabel>
                                            <FormControl>
                                                <Input
                                                    disabled={loading}
                                                    placeholder="e.g., 6 min"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="publishedAt"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Publish Date</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="date"
                                                    disabled={loading}
                                                    value={field.value || ""}
                                                    onChange={(e) =>
                                                        field.onChange(
                                                            e.target.value ||
                                                                null
                                                        )
                                                    }
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="authorName"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Author Name</FormLabel>
                                            <FormControl>
                                                <Input
                                                    disabled={loading}
                                                    placeholder="Author name"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="authorRole"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Author Role</FormLabel>
                                            <FormControl>
                                                <Input
                                                    disabled={loading}
                                                    placeholder="Author role"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>
                    </div>
                ) : (
                    /* ── Two-column layout when preview is hidden ── */
                    <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                        {/* Main content — 2/3 */}
                        <div className="space-y-6 lg:col-span-2">
                            <FormField
                                control={form.control}
                                name="title"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Title</FormLabel>
                                        <FormControl>
                                            <Input
                                                disabled={loading}
                                                placeholder="Post title"
                                                {...field}
                                                onChange={(e) => {
                                                    field.onChange(e);
                                                    if (!isEditing) {
                                                        form.setValue(
                                                            "slug",
                                                            generateSlug(
                                                                e.target.value
                                                            )
                                                        );
                                                    }
                                                }}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="slug"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Slug</FormLabel>
                                        <FormControl>
                                            <Input
                                                disabled={loading}
                                                placeholder="post-url-slug"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormDescription>
                                            URL-friendly identifier.
                                            Auto-generated from title.
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="excerpt"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Excerpt</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                disabled={loading}
                                                placeholder="Brief summary of the post..."
                                                rows={3}
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="content"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Content</FormLabel>
                                        <FormControl>
                                            <RichTextEditor
                                                value={field.value}
                                                onChange={field.onChange}
                                                disabled={loading}
                                                placeholder="Write your blog post content..."
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        {/* Sidebar — 1/3 */}
                        <div className="space-y-5">
                            {/* Status card */}
                            <div className="rounded-lg border bg-card p-5 shadow-sm">
                                <h3 className="mb-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                    Status
                                </h3>
                                <FormField
                                    control={form.control}
                                    name="isPublished"
                                    render={({ field }) => (
                                        <FormItem className="flex items-center justify-between">
                                            <div className="space-y-0.5">
                                                <FormLabel className="text-sm">
                                                    Published
                                                </FormLabel>
                                                <FormDescription className="text-xs">
                                                    Visible on the store
                                                </FormDescription>
                                            </div>
                                            <FormControl>
                                                <Switch
                                                    checked={field.value}
                                                    onCheckedChange={
                                                        field.onChange
                                                    }
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="publishedAt"
                                    render={({ field }) => (
                                        <FormItem className="mt-4">
                                            <FormLabel className="text-sm">
                                                Publish Date
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="date"
                                                    disabled={loading}
                                                    value={field.value || ""}
                                                    onChange={(e) =>
                                                        field.onChange(
                                                            e.target.value ||
                                                                null
                                                        )
                                                    }
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            {/* Cover Image card */}
                            <div className="rounded-lg border bg-card p-5 shadow-sm">
                                <h3 className="mb-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                    Cover Image
                                </h3>
                                <FormField
                                    control={form.control}
                                    name="coverImage"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <ImageUpload
                                                    value={
                                                        field.value
                                                            ? [field.value]
                                                            : []
                                                    }
                                                    disabled={loading}
                                                    onChange={(url) =>
                                                        field.onChange(url)
                                                    }
                                                    onRemove={() =>
                                                        field.onChange("")
                                                    }
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            {/* Metadata card */}
                            <div className="rounded-lg border bg-card p-5 shadow-sm">
                                <h3 className="mb-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                    Metadata
                                </h3>
                                <div className="space-y-4">
                                    <FormField
                                        control={form.control}
                                        name="category"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-sm">
                                                    Category
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        disabled={loading}
                                                        placeholder="e.g., Ghid"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="readTime"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-sm">
                                                    Read Time
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        disabled={loading}
                                                        placeholder="e.g., 6 min"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>

                            {/* Author card */}
                            <div className="rounded-lg border bg-card p-5 shadow-sm">
                                <h3 className="mb-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                    Author
                                </h3>
                                <div className="space-y-4">
                                    <FormField
                                        control={form.control}
                                        name="authorName"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-sm">
                                                    Name
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        disabled={loading}
                                                        placeholder="Author name"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="authorRole"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-sm">
                                                    Role
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        disabled={loading}
                                                        placeholder="Author role"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>

                            {/* Submit button */}
                            <Button
                                disabled={loading}
                                type="submit"
                                className="w-full"
                            >
                                {isEditing ? "Save changes" : "Create post"}
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </ScrollArea>
    );

    return (
        <>
            <AlertModal
                isOpen={open}
                onClose={() => setOpen(false)}
                onConfirm={onDelete}
                loading={loading}
            />
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="flex h-[calc(100dvh-8rem)] flex-col"
                >
                    {/* ── Header ── */}
                    <div className="flex shrink-0 items-center justify-between border-b pb-4">
                        <div className="flex items-center gap-3">
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="size-8"
                                asChild
                            >
                                <Link
                                    href={`/dashboard/store/${params.storeId}`}
                                >
                                    <ArrowLeft className="size-4" />
                                    <span className="sr-only">Back</span>
                                </Link>
                            </Button>
                            <Separator
                                orientation="vertical"
                                className="h-5"
                            />
                            <div>
                                <div className="flex items-center gap-2">
                                    <h2 className="text-lg font-semibold">
                                        {isEditing
                                            ? "Edit post"
                                            : "New post"}
                                    </h2>
                                    <Badge
                                        variant={
                                            form.watch("isPublished")
                                                ? "default"
                                                : "secondary"
                                        }
                                    >
                                        {form.watch("isPublished")
                                            ? "Published"
                                            : "Draft"}
                                    </Badge>
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    {isEditing
                                        ? "Make changes to your blog post"
                                        : "Create a new blog post for your store"}
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
                                            variant={
                                                showPreview
                                                    ? "secondary"
                                                    : "ghost"
                                            }
                                            size="sm"
                                            onClick={() =>
                                                setShowPreview(!showPreview)
                                            }
                                            aria-label={
                                                showPreview
                                                    ? "Hide preview"
                                                    : "Show preview"
                                            }
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
                                        {showPreview
                                            ? "Hide live preview"
                                            : "Show live preview"}
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>

                            <Separator
                                orientation="vertical"
                                className="h-5"
                            />

                            {/* Save */}
                            {showPreview && (
                                <Button
                                    disabled={loading}
                                    type="submit"
                                    size="sm"
                                >
                                    {isEditing ? "Save changes" : "Create post"}
                                </Button>
                            )}

                            {/* Delete */}
                            {isEditing && (
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                className="size-8 text-destructive hover:bg-destructive/10 hover:text-destructive"
                                                onClick={() => setOpen(true)}
                                                disabled={loading}
                                                aria-label="Delete post"
                                            >
                                                <Trash className="size-4" />
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            Delete post
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            )}
                        </div>
                    </div>

                    {/* ── Body ── */}
                    <div className="min-h-0 flex-1">
                        {showPreview ? (
                            <ResizablePanelGroup
                                orientation="horizontal"
                                className="h-full"
                            >
                                {/* Editor panel */}
                                <ResizablePanel
                                    defaultSize={50}
                                    minSize={30}
                                >
                                    {formContent}
                                </ResizablePanel>

                                <ResizableHandle withHandle />

                                {/* Preview panel */}
                                <ResizablePanel
                                    defaultSize={50}
                                    minSize={25}
                                >
                                    <div className="flex h-full flex-col">
                                        {/* Preview toolbar */}
                                        <div className="flex shrink-0 items-center justify-between border-b px-4 py-2">
                                            <span className="text-xs font-medium text-muted-foreground">
                                                Live Preview
                                            </span>
                                            <ToggleGroup
                                                type="single"
                                                value={breakpoint}
                                                onValueChange={(v) => {
                                                    if (v)
                                                        setBreakpoint(
                                                            v as typeof breakpoint
                                                        );
                                                }}
                                                variant="outline"
                                                size="sm"
                                            >
                                                <ToggleGroupItem
                                                    value="desktop"
                                                    aria-label="Desktop preview"
                                                >
                                                    <Monitor className="size-3.5" />
                                                </ToggleGroupItem>
                                                <ToggleGroupItem
                                                    value="tablet"
                                                    aria-label="Tablet preview"
                                                >
                                                    <Tablet className="size-3.5" />
                                                </ToggleGroupItem>
                                                <ToggleGroupItem
                                                    value="mobile"
                                                    aria-label="Mobile preview"
                                                >
                                                    <Smartphone className="size-3.5" />
                                                </ToggleGroupItem>
                                            </ToggleGroup>
                                        </div>

                                        {/* Preview content */}
                                        <div className="min-h-0 flex-1 bg-muted/30">
                                            <BlogPostPreview
                                                breakpoint={breakpoint}
                                                storeUrl={storeUrl}
                                            />
                                        </div>
                                    </div>
                                </ResizablePanel>
                            </ResizablePanelGroup>
                        ) : (
                            formContent
                        )}
                    </div>
                </form>
            </Form>
        </>
    );
};
