"use client";

import { useParams, useRouter } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardAction,
} from "@/components/ui/card";
import { ChevronDownIcon, PlusIcon, Settings2, ExternalLink } from "lucide-react";
import { useState } from "react";
import type { VisibilityState } from "@tanstack/react-table";
import { BlogPostsTable } from "./blog-posts-table/table";
import type { BlogPostRow } from "./blog-posts-table/schema";
import { SITE_PAGES } from "@/constants/sections";

const TOGGLEABLE_COLUMNS = [
    { id: "title", label: "Title" },
    { id: "category", label: "Category" },
    { id: "isPublished", label: "Status" },
    { id: "publishedAt", label: "Published Date" },
];

interface ContentTabsProps {
    blogPosts: BlogPostRow[];
}

export function ContentTabs({ blogPosts }: ContentTabsProps) {
    const params = useParams();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState("blog-posts");
    const [columnVisibility, setColumnVisibility] =
        useState<VisibilityState>({});

    const pages = Object.entries(SITE_PAGES).map(([key, page]) => ({
        key,
        label: page.label,
        description: page.description,
        sectionCount: page.sections.length,
    }));

    return (
        <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full flex-col justify-start gap-6"
        >
            <div className="flex items-center justify-between gap-4">
                <TabsList>
                    <TabsTrigger value="blog-posts">
                        Blog Posts
                        {blogPosts.length > 0 && (
                            <Badge variant="secondary" className="ml-2">
                                {blogPosts.length}
                            </Badge>
                        )}
                    </TabsTrigger>
                    <TabsTrigger value="site-pages">
                        Site Pages
                        <Badge variant="secondary" className="ml-2">
                            {pages.length}
                        </Badge>
                    </TabsTrigger>
                </TabsList>

                {activeTab === "blog-posts" && (
                    <div className="flex items-center gap-2">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="sm">
                                    <Settings2 data-icon="inline-start" />
                                    View
                                    <ChevronDownIcon data-icon="inline-end" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-40">
                                <DropdownMenuLabel>
                                    Toggle columns
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                {TOGGLEABLE_COLUMNS.map((col) => (
                                    <DropdownMenuCheckboxItem
                                        key={col.id}
                                        checked={
                                            columnVisibility[col.id] !== false
                                        }
                                        onCheckedChange={(value) =>
                                            setColumnVisibility((prev) => ({
                                                ...prev,
                                                [col.id]: !!value,
                                            }))
                                        }
                                    >
                                        {col.label}
                                    </DropdownMenuCheckboxItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                                router.push(
                                    `/dashboard/store/${params.storeId}/content/blog/new`
                                )
                            }
                        >
                            <PlusIcon data-icon="inline-start" />
                            <span className="hidden lg:inline">Add Post</span>
                        </Button>
                    </div>
                )}
            </div>
            <TabsContent
                value="blog-posts"
                className="relative flex flex-col gap-4 overflow-auto"
            >
                <BlogPostsTable
                    data={blogPosts}
                    columnVisibility={columnVisibility}
                    onColumnVisibilityChange={setColumnVisibility}
                />
            </TabsContent>
            <TabsContent
                value="site-pages"
                className="relative flex flex-col gap-4 overflow-auto"
            >
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {pages.map((page) => (
                        <Card key={page.key} size="sm">
                            <CardHeader>
                                <CardTitle>{page.label}</CardTitle>
                                <CardDescription>
                                    {page.description}
                                </CardDescription>
                                <CardAction>
                                    <Badge variant="secondary">
                                        {page.sectionCount} sections
                                    </Badge>
                                </CardAction>
                            </CardHeader>
                            <div className="px-4 pb-1">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="w-full"
                                    onClick={() =>
                                        router.push(
                                            `/dashboard/store/${params.storeId}/content/pages/${page.key}`
                                        )
                                    }
                                >
                                    <ExternalLink className="mr-2 size-3.5" />
                                    Edit Sections
                                </Button>
                            </div>
                        </Card>
                    ))}
                </div>
            </TabsContent>
        </Tabs>
    );
}
