"use client"
import { ColumnDef } from '@tanstack/react-table';
import { CellAction } from './cell-action';

export type ProductColumn = {
    id: string
    name: string
    price: string
    size: string
    category: string
    colors: { name: string; value: string }[]
    isFeatured: boolean
    isArchived: boolean
    createdAt: string
}

export const columns: ColumnDef<ProductColumn>[] = [
    { accessorKey: 'name', header: 'Name' },
    { accessorKey: 'isArchived', header: 'Archived' },
    { accessorKey: 'isFeatured', header: 'Featured' },
    { accessorKey: 'price', header: 'Price' },
    { accessorKey: 'category', header: 'Category' },
    { accessorKey: 'size', header: 'Size' },
    {
        accessorKey: 'colors',
        header: 'Colors',
        cell: ({ row }) => (
            <div className='flex items-center gap-2 flex-wrap'>
                {row.original.colors.map((c) => (
                    <div key={c.value} className='flex items-center gap-x-1.5'>
                        <div className='w-4 h-4 border rounded-full' style={{ backgroundColor: c.value }} />
                        <span className='text-xs'>{c.name}</span>
                    </div>
                ))}
            </div>
        )
    },
    { accessorKey: 'createdAt', header: 'Date' },
    { id: 'actions', cell: ({ row }) => <CellAction data={row.original} /> }
]
