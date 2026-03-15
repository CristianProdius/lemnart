"use client";

import * as React from "react";

import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  type SortingState,
  useReactTable,
} from "@tanstack/react-table";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { OrderLedgerData, OrderLedgerRow } from "@/lib/analytics";
import { cn, formatCurrency } from "@/lib/utils";

const ledgerColumns: ColumnDef<OrderLedgerRow>[] = [
  {
    accessorKey: "id",
    header: "Order ID",
    cell: ({ row }) => (
      <span className="font-medium text-xs">
        {row.original.id.slice(0, 8)}...
      </span>
    ),
  },
  {
    accessorKey: "products",
    header: "Products",
    cell: ({ row }) => (
      <div className="max-w-44 truncate text-xs">{row.original.products}</div>
    ),
  },
  {
    accessorKey: "customer",
    header: "Customer",
    cell: ({ row }) => (
      <span className="text-xs">{row.original.customer}</span>
    ),
  },
  {
    accessorKey: "address",
    header: "Address",
    cell: ({ row }) => (
      <div className="max-w-36 truncate text-xs">{row.original.address}</div>
    ),
  },
  {
    accessorKey: "total",
    header: "Total",
    cell: ({ row }) => (
      <span className="text-xs tabular-nums">
        {formatCurrency(row.original.total)}
      </span>
    ),
  },
  {
    accessorKey: "isPaid",
    header: "Status",
    cell: ({ row }) => (
      <Badge
        variant="outline"
        className={cn(
          "text-[10px] uppercase",
          row.original.isPaid
            ? "border-emerald-500/35 bg-emerald-500/10 text-emerald-700"
            : "border-amber-500/35 bg-amber-500/10 text-amber-700"
        )}
      >
        {row.original.isPaid ? "Paid" : "Pending"}
      </Badge>
    ),
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <div className="flex justify-end">
        <Button
          variant="ghost"
          size="sm"
          className="-mr-2 h-8 px-2 text-xs"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Date
        </Button>
      </div>
    ),
    cell: ({ row }) => (
      <div className="text-right text-xs tabular-nums">
        {row.original.createdAt}
      </div>
    ),
    sortingFn: (rowA, rowB) => {
      return (
        new Date(rowA.original.createdAtRaw).getTime() -
        new Date(rowB.original.createdAtRaw).getTime()
      );
    },
  },
];

interface AnalyticsOrdersLedgerProps {
  data: OrderLedgerData;
}

export function AnalyticsOrdersLedger({ data }: AnalyticsOrdersLedgerProps) {
  const [sorting, setSorting] = React.useState<SortingState>([
    { id: "createdAt", desc: true },
  ]);

  const table = useReactTable({
    data: data.orders,
    columns: ledgerColumns,
    getRowId: (row) => row.id,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <Card className="shadow-xs">
      <CardHeader>
        <CardTitle>Orders Ledger</CardTitle>
        <CardDescription>
          All orders with products, status, and customer info.
        </CardDescription>
        <CardAction>
          <Badge variant="outline" className="font-medium tabular-nums">
            {data.summary.total} Orders
          </Badge>
        </CardAction>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="grid gap-3 rounded-lg border bg-muted/20 p-3 text-sm sm:grid-cols-4 sm:divide-x sm:divide-border/60">
          <LedgerStat
            label="Total orders"
            value={String(data.summary.total)}
            detail="All time"
          />
          <LedgerStat
            label="Paid"
            value={String(data.summary.paid)}
            detail="Completed payments"
          />
          <LedgerStat
            label="Pending"
            value={String(data.summary.pending)}
            detail="Awaiting payment"
          />
          <LedgerStat
            label="Total revenue"
            value={formatCurrency(data.summary.totalRevenue, {
              noDecimals: true,
            })}
            detail="From paid orders"
          />
        </div>

        <div className="overflow-hidden rounded-lg border">
          <Table>
            <TableHeader className="bg-muted/30">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows.length > 0 ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={ledgerColumns.length}
                    className="h-24 text-center text-muted-foreground"
                  >
                    No orders yet
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}

function LedgerStat({
  label,
  value,
  detail,
}: {
  label: string;
  value: string;
  detail: string;
}) {
  return (
    <div className="flex flex-col gap-1 px-0 sm:px-3 last:sm:pr-0 first:sm:pl-0">
      <p className="text-muted-foreground text-xs">{label}</p>
      <p className="font-semibold text-base tabular-nums">{value}</p>
      <p className="text-muted-foreground text-xs">{detail}</p>
    </div>
  );
}
