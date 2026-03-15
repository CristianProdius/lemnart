"use client";
"use no memo";

import * as React from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "sonner";

import {
    closestCenter,
    DndContext,
    type DragEndEvent,
    KeyboardSensor,
    MouseSensor,
    TouchSensor,
    type UniqueIdentifier,
    useSensor,
    useSensors,
} from "@dnd-kit/core";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import {
    arrayMove,
    SortableContext,
    verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import {
    type ColumnFiltersState,
    flexRender,
    getCoreRowModel,
    getFacetedRowModel,
    getFacetedUniqueValues,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    type SortingState,
    useReactTable,
    type VisibilityState,
} from "@tanstack/react-table";
import {
    ChevronLeftIcon,
    ChevronRightIcon,
    ChevronsLeftIcon,
    ChevronsRightIcon,
    Trash2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { AlertModal } from "@/components/modals/alert-modal";

import { DraggableBlogPostRow, blogPostColumns } from "./columns";
import type { BlogPostRow } from "./schema";

interface BlogPostsTableProps {
    data: BlogPostRow[];
    columnVisibility: VisibilityState;
    onColumnVisibilityChange: React.Dispatch<
        React.SetStateAction<VisibilityState>
    >;
}

export function BlogPostsTable({
    data: initialData,
    columnVisibility,
    onColumnVisibilityChange,
}: BlogPostsTableProps) {
    const params = useParams();
    const router = useRouter();
    const [data, setData] = React.useState(() => initialData);
    const [rowSelection, setRowSelection] = React.useState({});
    const [columnFilters, setColumnFilters] =
        React.useState<ColumnFiltersState>([]);
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [pagination, setPagination] = React.useState({
        pageIndex: 0,
        pageSize: 10,
    });
    const [deleteOpen, setDeleteOpen] = React.useState(false);
    const [deleteIds, setDeleteIds] = React.useState<string[]>([]);
    const [deleteLoading, setDeleteLoading] = React.useState(false);

    const sortableId = React.useId();
    const sensors = useSensors(
        useSensor(MouseSensor, {}),
        useSensor(TouchSensor, {}),
        useSensor(KeyboardSensor, {})
    );

    const dataIds = React.useMemo<UniqueIdentifier[]>(
        () => data.map(({ id }) => id),
        [data]
    );

    const handleEdit = React.useCallback(
        (id: string) => {
            router.push(
                `/dashboard/store/${params.storeId}/content/blog/${id}`
            );
        },
        [router, params.storeId]
    );

    const handleDelete = React.useCallback((ids: string[]) => {
        setDeleteIds(ids);
        setDeleteOpen(true);
    }, []);

    const confirmDelete = async () => {
        try {
            setDeleteLoading(true);
            await Promise.all(
                deleteIds.map((id) =>
                    axios.delete(`/api/${params.storeId}/blog-posts/${id}`)
                )
            );
            setData((prev) => prev.filter((p) => !deleteIds.includes(p.id)));
            setRowSelection({});
            toast.success(`${deleteIds.length} post(s) deleted.`);
        } catch {
            toast.error("Something went wrong.");
        } finally {
            setDeleteLoading(false);
            setDeleteOpen(false);
            setDeleteIds([]);
        }
    };

    const table = useReactTable({
        data,
        columns: blogPostColumns,
        state: {
            sorting,
            columnVisibility,
            rowSelection,
            columnFilters,
            pagination,
        },
        meta: {
            onEdit: handleEdit,
            onDelete: handleDelete,
        },
        getRowId: (row) => row.id,
        enableRowSelection: true,
        onRowSelectionChange: setRowSelection,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        onColumnVisibilityChange: onColumnVisibilityChange,
        onPaginationChange: setPagination,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFacetedRowModel: getFacetedRowModel(),
        getFacetedUniqueValues: getFacetedUniqueValues(),
    });

    async function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event;

        if (active && over && active.id !== over.id) {
            setData((currentData) => {
                const oldIndex = dataIds.indexOf(active.id);
                const newIndex = dataIds.indexOf(over.id);
                const newData = arrayMove(currentData, oldIndex, newIndex);

                const items = newData.map((item, index) => ({
                    id: item.id,
                    sortOrder: index,
                }));
                axios
                    .patch(`/api/${params.storeId}/blog-posts/reorder`, {
                        items,
                    })
                    .catch(() => toast.error("Failed to save order."));

                return newData;
            });
        }
    }

    const selectedRows = table.getFilteredSelectedRowModel().rows;

    return (
        <>
            <AlertModal
                isOpen={deleteOpen}
                onClose={() => setDeleteOpen(false)}
                onConfirm={confirmDelete}
                loading={deleteLoading}
            />
            <div className="flex flex-col gap-4">
                {/* Bulk delete action — only shows when rows are selected */}
                {selectedRows.length > 0 && (
                    <div className="flex items-center gap-2">
                        <Button
                            variant="destructive"
                            size="sm"
                            onClick={() =>
                                handleDelete(
                                    selectedRows.map((r) => r.original.id)
                                )
                            }
                        >
                            <Trash2 className="mr-2 size-4" />
                            Delete ({selectedRows.length})
                        </Button>
                    </div>
                )}

                {/* Table */}
                <div className="overflow-hidden rounded-lg border">
                    <DndContext
                        collisionDetection={closestCenter}
                        modifiers={[restrictToVerticalAxis]}
                        onDragEnd={handleDragEnd}
                        sensors={sensors}
                        id={sortableId}
                    >
                        <Table>
                            <TableHeader className="sticky top-0 z-10 bg-muted">
                                {table
                                    .getHeaderGroups()
                                    .map((headerGroup) => (
                                        <TableRow key={headerGroup.id}>
                                            {headerGroup.headers.map(
                                                (header) => (
                                                    <TableHead
                                                        key={header.id}
                                                        colSpan={
                                                            header.colSpan
                                                        }
                                                    >
                                                        {header.isPlaceholder
                                                            ? null
                                                            : flexRender(
                                                                  header.column
                                                                      .columnDef
                                                                      .header,
                                                                  header.getContext()
                                                              )}
                                                    </TableHead>
                                                )
                                            )}
                                        </TableRow>
                                    ))}
                            </TableHeader>
                            <TableBody className="**:data-[slot=table-cell]:first:w-8">
                                {table.getRowModel().rows.length ? (
                                    <SortableContext
                                        items={dataIds}
                                        strategy={
                                            verticalListSortingStrategy
                                        }
                                    >
                                        {table
                                            .getRowModel()
                                            .rows.map((row) => (
                                                <DraggableBlogPostRow
                                                    key={row.id}
                                                    row={row}
                                                />
                                            ))}
                                    </SortableContext>
                                ) : (
                                    <TableRow>
                                        <TableCell
                                            colSpan={
                                                table.getVisibleLeafColumns()
                                                    .length
                                            }
                                            className="h-24 text-center"
                                        >
                                            No blog posts yet.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </DndContext>
                </div>

                {/* Pagination */}
                <div className="flex items-center justify-between px-4">
                    <div className="hidden flex-1 text-sm text-muted-foreground lg:flex">
                        {table.getFilteredSelectedRowModel().rows.length} of{" "}
                        {table.getFilteredRowModel().rows.length} row(s)
                        selected.
                    </div>
                    <div className="flex w-full items-center gap-8 lg:w-fit">
                        <div className="hidden items-center gap-2 lg:flex">
                            <Label
                                htmlFor="rows-per-page"
                                className="text-sm font-medium"
                            >
                                Rows per page
                            </Label>
                            <Select
                                value={`${table.getState().pagination.pageSize}`}
                                onValueChange={(value) => {
                                    table.setPageSize(Number(value));
                                }}
                            >
                                <SelectTrigger
                                    size="sm"
                                    className="w-20"
                                    id="rows-per-page"
                                >
                                    <SelectValue
                                        placeholder={
                                            table.getState().pagination.pageSize
                                        }
                                    />
                                </SelectTrigger>
                                <SelectContent side="top">
                                    <SelectGroup>
                                        {[10, 20, 30, 40, 50].map(
                                            (pageSize) => (
                                                <SelectItem
                                                    key={pageSize}
                                                    value={`${pageSize}`}
                                                >
                                                    {pageSize}
                                                </SelectItem>
                                            )
                                        )}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex w-fit items-center justify-center text-sm font-medium tabular-nums">
                            Page{" "}
                            {table.getState().pagination.pageIndex + 1} of{" "}
                            {table.getPageCount()}
                        </div>
                        <div className="ml-auto flex items-center gap-2 lg:ml-0">
                            <Button
                                variant="outline"
                                className="hidden size-8 lg:flex"
                                size="icon"
                                onClick={() => table.setPageIndex(0)}
                                disabled={!table.getCanPreviousPage()}
                            >
                                <span className="sr-only">
                                    Go to first page
                                </span>
                                <ChevronsLeftIcon />
                            </Button>
                            <Button
                                variant="outline"
                                className="size-8"
                                size="icon"
                                onClick={() => table.previousPage()}
                                disabled={!table.getCanPreviousPage()}
                            >
                                <span className="sr-only">
                                    Go to previous page
                                </span>
                                <ChevronLeftIcon />
                            </Button>
                            <Button
                                variant="outline"
                                className="size-8"
                                size="icon"
                                onClick={() => table.nextPage()}
                                disabled={!table.getCanNextPage()}
                            >
                                <span className="sr-only">
                                    Go to next page
                                </span>
                                <ChevronRightIcon />
                            </Button>
                            <Button
                                variant="outline"
                                className="hidden size-8 lg:flex"
                                size="icon"
                                onClick={() =>
                                    table.setPageIndex(
                                        table.getPageCount() - 1
                                    )
                                }
                                disabled={!table.getCanNextPage()}
                            >
                                <span className="sr-only">
                                    Go to last page
                                </span>
                                <ChevronsRightIcon />
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
