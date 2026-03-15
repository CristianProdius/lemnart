"use client"
import { ColumnDef } from '@tanstack/react-table';
import { CellAction } from './cell-action';

export type VentilationColumn = {
    id: string
    name: string
    slug: string
    priceModifier: number
    isActive: boolean
    createdAt: string
}

export const columns: ColumnDef<VentilationColumn>[] = [
    { accessorKey: 'name', header: 'Name' },
    { accessorKey: 'slug', header: 'Slug' },
    { accessorKey: 'priceModifier', header: 'Price Modifier' },
    {
        accessorKey: 'isActive',
        header: 'Active',
        cell: ({ row }) => (
            <span className={row.original.isActive ? 'text-green-600' : 'text-red-600'}>
                {row.original.isActive ? 'Yes' : 'No'}
            </span>
        )
    },
    { accessorKey: 'createdAt', header: 'Date' },
    { id: 'actions', cell: ({ row }) => <CellAction data={row.original} /> }
]
