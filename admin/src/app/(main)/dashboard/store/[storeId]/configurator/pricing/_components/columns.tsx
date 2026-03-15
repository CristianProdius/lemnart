"use client"
import { ColumnDef } from '@tanstack/react-table';
import { CellAction } from './cell-action';

export type PricingColumn = {
    id: string
    styleName: string
    colorName: string
    sizeRange: string
    basePrice: number
    pricePerSection: number
    createdAt: string
}

export const columns: ColumnDef<PricingColumn>[] = [
    { accessorKey: 'styleName', header: 'Style' },
    { accessorKey: 'colorName', header: 'Color' },
    { accessorKey: 'sizeRange', header: 'Size Range' },
    { accessorKey: 'basePrice', header: 'Base Price' },
    { accessorKey: 'pricePerSection', header: 'Price / Section' },
    { accessorKey: 'createdAt', header: 'Date' },
    { id: 'actions', cell: ({ row }) => <CellAction data={row.original} /> }
]
