"use client"
import { ColumnDef } from '@tanstack/react-table';
import { CellAction } from './cell-action';

export type StyleColumn = {
    id: string
    name: string
    slug: string
    isActive: boolean
    sortOrder: number
    createdAt: string
}

export const columns: ColumnDef<StyleColumn>[] = [
    { accessorKey: 'name', header: 'Name' },
    { accessorKey: 'slug', header: 'Slug' },
    {
        accessorKey: 'isActive',
        header: 'Active',
        cell: ({ row }) => (
            <span className={row.original.isActive ? 'text-green-600' : 'text-red-600'}>
                {row.original.isActive ? 'Yes' : 'No'}
            </span>
        )
    },
    { accessorKey: 'sortOrder', header: 'Sort Order' },
    { accessorKey: 'createdAt', header: 'Date' },
    { id: 'actions', cell: ({ row }) => <CellAction data={row.original} /> }
]
