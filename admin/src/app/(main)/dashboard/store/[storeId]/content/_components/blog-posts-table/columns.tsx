"use client";
"use no memo";

import { useSortable } from "@dnd-kit/sortable";
import type { ColumnDef, Row } from "@tanstack/react-table";
import { flexRender } from "@tanstack/react-table";
import {
    CircleCheckIcon,
    EllipsisVerticalIcon,
    GripVerticalIcon,
    LoaderIcon,
    ExternalLink,
} from "lucide-react";
import { format } from "date-fns";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { TableCell, TableRow } from "@/components/ui/table";
import { useIsMobile } from "@/hooks/use-mobile";

import type { BlogPostRow } from "./schema";

function DragHandle({ id }: { id: string }) {
    const { attributes, listeners } = useSortable({ id });

    return (
        <Button
            {...attributes}
            {...listeners}
            variant="ghost"
            size="icon"
            className="size-7 text-muted-foreground hover:bg-transparent"
        >
            <GripVerticalIcon />
            <span className="sr-only">Drag to reorder</span>
        </Button>
    );
}

function BlogPostDetailViewer({ item }: { item: BlogPostRow }) {
    const isMobile = useIsMobile();

    return (
        <Drawer direction={isMobile ? "bottom" : "right"}>
            <DrawerTrigger asChild>
                <Button
                    variant="link"
                    className="w-fit px-0 text-left text-foreground"
                >
                    {item.title}
                </Button>
            </DrawerTrigger>
            <DrawerContent>
                <DrawerHeader className="gap-1">
                    <DrawerTitle>{item.title}</DrawerTitle>
                    <DrawerDescription>/{item.slug}</DrawerDescription>
                </DrawerHeader>
                <div className="flex flex-col gap-4 overflow-y-auto px-4 text-sm">
                    {item.coverImage && (
                        <div className="overflow-hidden rounded-lg border">
                            <img
                                src={item.coverImage}
                                alt={item.title}
                                className="aspect-video w-full object-cover"
                            />
                        </div>
                    )}
                    <Separator />
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-xs text-muted-foreground">Status</p>
                            <Badge
                                variant="outline"
                                className="mt-1 px-1.5 text-muted-foreground"
                            >
                                {item.isPublished ? (
                                    <CircleCheckIcon className="fill-green-500 stroke-primary-foreground dark:fill-green-600" />
                                ) : (
                                    <LoaderIcon />
                                )}
                                {item.isPublished ? "Published" : "Draft"}
                            </Badge>
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground">Category</p>
                            <p className="mt-1 font-medium">
                                {item.category || "—"}
                            </p>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-xs text-muted-foreground">Author</p>
                            <p className="mt-1 font-medium">
                                {item.authorName || "—"}
                            </p>
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground">
                                Read Time
                            </p>
                            <p className="mt-1 font-medium">
                                {item.readTime || "—"}
                            </p>
                        </div>
                    </div>
                    <Separator />
                    <div>
                        <p className="text-xs text-muted-foreground">Excerpt</p>
                        <p className="mt-1 text-muted-foreground">{item.excerpt}</p>
                    </div>
                </div>
                <DrawerFooter>
                    <DrawerClose asChild>
                        <Button variant="outline">Close</Button>
                    </DrawerClose>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    );
}

export const blogPostColumns: ColumnDef<BlogPostRow>[] = [
    {
        id: "drag",
        header: () => null,
        cell: ({ row }) => <DragHandle id={row.original.id} />,
        enableSorting: false,
        enableHiding: false,
    },
    {
        id: "select",
        header: ({ table }) => (
            <div className="flex items-center justify-center">
                <Checkbox
                    checked={
                        table.getIsAllPageRowsSelected() ||
                        (table.getIsSomePageRowsSelected() && "indeterminate")
                    }
                    onCheckedChange={(value) =>
                        table.toggleAllPageRowsSelected(!!value)
                    }
                    aria-label="Select all"
                />
            </div>
        ),
        cell: ({ row }) => (
            <div className="flex items-center justify-center">
                <Checkbox
                    checked={row.getIsSelected()}
                    onCheckedChange={(value) => row.toggleSelected(!!value)}
                    aria-label="Select row"
                />
            </div>
        ),
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: "title",
        header: "Title",
        cell: ({ row }) => <BlogPostDetailViewer item={row.original} />,
        enableHiding: false,
    },
    {
        accessorKey: "category",
        header: "Category",
        cell: ({ row }) => (
            <div className="w-32">
                {row.original.category ? (
                    <Badge
                        variant="outline"
                        className="px-1.5 text-muted-foreground"
                    >
                        {row.original.category}
                    </Badge>
                ) : (
                    <span className="text-muted-foreground">—</span>
                )}
            </div>
        ),
    },
    {
        accessorKey: "isPublished",
        header: "Status",
        cell: ({ row }) => (
            <Badge variant="outline" className="px-1.5 text-muted-foreground">
                {row.original.isPublished ? (
                    <CircleCheckIcon className="fill-green-500 stroke-primary-foreground dark:fill-green-600" />
                ) : (
                    <LoaderIcon />
                )}
                {row.original.isPublished ? "Published" : "Draft"}
            </Badge>
        ),
    },
    {
        accessorKey: "publishedAt",
        header: "Published Date",
        cell: ({ row }) => (
            <span className="text-muted-foreground">
                {row.original.publishedAt
                    ? format(new Date(row.original.publishedAt), "MMM d, yyyy")
                    : "—"}
            </span>
        ),
    },
    {
        id: "actions",
        cell: ({ row, table }) => {
            const meta = table.options.meta as {
                onEdit?: (id: string) => void;
                onDelete?: (ids: string[]) => void;
            } | undefined;

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="ghost"
                            className="flex size-8 text-muted-foreground data-[state=open]:bg-muted"
                            size="icon"
                        >
                            <EllipsisVerticalIcon />
                            <span className="sr-only">Open menu</span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-32">
                        <DropdownMenuItem
                            onClick={() => meta?.onEdit?.(row.original.id)}
                        >
                            <ExternalLink className="mr-2 h-4 w-4" />
                            Edit
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            variant="destructive"
                            onClick={() => meta?.onDelete?.([row.original.id])}
                        >
                            Delete
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
        enableSorting: false,
    },
];

export function DraggableBlogPostRow({ row }: { row: Row<BlogPostRow> }) {
    const { transform, transition, setNodeRef, isDragging } = useSortable({
        id: row.original.id,
    });

    return (
        <TableRow
            ref={setNodeRef}
            data-state={row.getIsSelected() && "selected"}
            data-dragging={isDragging}
            className="relative z-0 data-[dragging=true]:z-10 data-[dragging=true]:opacity-80"
            style={{
                transform: transform
                    ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
                    : undefined,
                transition,
            }}
        >
            {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
            ))}
        </TableRow>
    );
}
