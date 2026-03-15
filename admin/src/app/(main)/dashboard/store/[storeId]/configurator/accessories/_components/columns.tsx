"use client"
import { ColumnDef } from '@tanstack/react-table';
import { CellAction } from './cell-action';

export type AccessoryColumn = {
    id: string
    name: string
    slug: string
    price: number
    isActive: boolean
    createdAt: string
}

export const columns: ColumnDef<AccessoryColumn>[] = [
    { accessorKey: 'name', header: 'Name' },
    { accessorKey: 'slug', header: 'Slug' },
    { accessorKey: 'price', header: 'Price' },
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
