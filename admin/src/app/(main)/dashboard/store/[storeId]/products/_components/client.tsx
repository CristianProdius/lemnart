"use client"

import { Button } from "@/components/ui/button"
import { Heading } from "@/components/ui/heading"
import { Separator } from "@/components/ui/separator"
import { Plus } from "lucide-react"
import { useParams, useRouter } from "next/navigation"
import { useMemo, useState } from "react"
import type { ColumnFiltersState } from "@tanstack/react-table"
import { ProductColumn, columns } from "./columns"
import { DataTable } from "@/components/ui/data-table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface ProductClientProps {
    data: ProductColumn[]
}

export const ProductClient: React.FC<ProductClientProps> = ({ data }) => {
    const router = useRouter();
    const params = useParams();

    // Single ColumnFiltersState owned by the parent — both the search input
    // (via DataTable) and the color dropdown mutate cooperatively, neither
    // stomps the other.
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const colorFilter = (columnFilters.find((f) => f.id === "colors")?.value as string) ?? "";

    const setColorFilter = (value: string) => {
        setColumnFilters((prev) => {
            const withoutColors = prev.filter((f) => f.id !== "colors");
            return value ? [...withoutColors, { id: "colors", value }] : withoutColors;
        });
    };

    const distinctColors = useMemo(() => {
        const map = new Map<string, { name: string; value: string }>();
        for (const p of data) for (const c of p.colors) map.set(c.value, c);
        return Array.from(map.values());
    }, [data]);

    return (
        <>
            <div className="flex items-center justify-between">
                <Heading title={`Products (${data?.length})`} description="Manage products for your store"/>
                <Button onClick={() => router.push(`/dashboard/store/${params.storeId}/products/new`)}>
                    <Plus className="w-4 h-4 mr-2" /> Add New
                </Button>
            </div>
            <Separator />
            <div className="flex items-center gap-2">
                <Select value={colorFilter || "__all__"} onValueChange={(v) => setColorFilter(v === "__all__" ? "" : v)}>
                    <SelectTrigger className="w-64">
                        <SelectValue placeholder="Filter by color" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="__all__">All colors</SelectItem>
                        {distinctColors.map((c) => (
                            <SelectItem key={c.value} value={c.value}>
                                <span className="inline-flex items-center gap-2">
                                    <span className="h-3 w-3 rounded-full border" style={{ backgroundColor: c.value }} />
                                    {c.name}
                                </span>
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                {colorFilter && (
                    <Button type="button" variant="ghost" size="sm" onClick={() => setColorFilter("")}>Clear</Button>
                )}
            </div>
            <DataTable
                columns={columns}
                data={data}
                searchKey="name"
                columnFilters={columnFilters}
                onColumnFiltersChange={setColumnFilters}
            />
        </>
    )
}
