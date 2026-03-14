---
name: scaffold-data-table
description: Generate a data table list view with columns, client wrapper, and cell actions
user_invocable: true
arguments:
  - name: resource
    description: "Resource name in singular form (e.g. 'size', 'color')"
    required: true
  - name: fields
    description: "Comma-separated field definitions: name:label (e.g. 'name:Name,value:Value'). Defaults to 'name:Name,value:Value'"
    required: false
---

# Scaffold Data Table

Generate the list view components for a resource: columns, client, and cell-action.

## Inputs

- `$ARGUMENTS.resource` — singular resource name (e.g. `tag`)
- `$ARGUMENTS.fields` — comma-separated `name:label` pairs (default: `name:Name,value:Value`)

## Files to Create

### 1. Columns — `admin/app/(dashboard)/[storeId]/(routes)/<resources>/components/columns.tsx`

```tsx
"use client"
import { ColumnDef } from '@tanstack/react-table';
import { CellAction } from './cell-action';

export type ResourceColumn = {
    id: string
    // ...one property per field (all strings for display)
    createdAt: string
}

export const columns: ColumnDef<ResourceColumn>[] = [
    // One column per field:
    // { accessorKey: 'fieldName', header: 'Field Label' },
    {
        accessorKey: 'createdAt',
        header: 'Date',
    },
    {
        id: 'actions',
        cell: ({ row }) => <CellAction data={row.original} />
    }
]
```

### 2. Client — `admin/app/(dashboard)/[storeId]/(routes)/<resources>/components/client.tsx`

```tsx
"use client"

import { Button } from "@/components/ui/button"
import { Heading } from "@/components/ui/heading"
import { Separator } from "@/components/ui/separator"
import { Plus } from "lucide-react"
import { useParams, useRouter } from "next/navigation"
import { ResourceColumn, columns } from "./columns"
import { DataTable } from "@/components/ui/data-table"
import { ApiList } from "@/components/ui/api-list"

interface ResourceClientProps {
    data: ResourceColumn[]
}

export const ResourceClient: React.FC<ResourceClientProps> = ({ data }) => {
    const router = useRouter();
    const params = useParams();
    return (
        <>
            <div className="flex items-center justify-between">
                <Heading
                    title={`Resources (${data?.length})`}
                    description="Manage resources for your store"/>
                <Button onClick={() => router.push(`/${params.storeId}/resources/new`)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add New
                </Button>
            </div>
            <Separator />
            <DataTable columns={columns} data={data} searchKey="name" />
            <Heading title="API" description="API calls for Resources" />
            <Separator />
            <ApiList entityName="resources" entityIdName="resourceId" />
        </>
    )
}
```

### 3. Cell Action — `admin/app/(dashboard)/[storeId]/(routes)/<resources>/components/cell-action.tsx`

```tsx
"use client"

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ResourceColumn } from "./columns"
import { Button } from "@/components/ui/button"
import { Copy, Edit, MoreHorizontal, Trash } from "lucide-react"
import { toast } from "react-hot-toast"
import { useRouter, useParams } from "next/navigation"
import { useState } from "react"
import axios from "axios"
import { AlertModal } from "@/components/modals/alert-modal"

interface CellActionProps {
    data: ResourceColumn
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);

    const router = useRouter();
    const params = useParams();

    const onCopy = (id: string) => {
        navigator.clipboard.writeText(id);
        toast.success('Resource Id copied to the clipboard.')
    }

    const onDelete = async () => {
        try {
            setLoading(true);
            await axios.delete(`/api/${params.storeId}/resources/${data.id}`)
            router.refresh();
            toast.success("Resource deleted successfully.")
        } catch {
            toast.error('Error deleting');
        } finally {
            setLoading(false);
            setOpen(false);
        }
    }

    return (
        <>
            <AlertModal isOpen={open} onClose={() => setOpen(false)} onConfirm={onDelete} loading={loading}/>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="w-8 h-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="w-4 h-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem onClick={() => onCopy(data.id)}>
                        <Copy className="w-4 h-4 mr-2" />
                        Copy Id
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => router.push(`/${params.storeId}/resources/${data.id}`)}>
                        <Edit className="w-4 h-4 mr-2" />
                        Update
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-red-500" onClick={() => setOpen(true)}>
                        <Trash className="w-4 h-4 mr-2" />
                        Delete
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    )
}
```

## Instructions

1. Ask the user for the resource name and fields if not provided.
2. Derive naming variants (singular, plural, PascalCase).
3. Replace all `resource`/`Resource`/`resources` placeholders with actual names.
4. Generate a column entry for each field.
5. Add each field as a `string` property in the `ResourceColumn` type.
6. Use the first field name as the `searchKey` in the DataTable.
7. Create all 3 files.
