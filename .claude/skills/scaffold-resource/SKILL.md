---
name: scaffold-resource
description: Scaffold a full CRUD resource (model, API routes, pages, form, data table)
user_invocable: true
arguments:
  - name: resource
    description: "Resource name in singular form (e.g. 'size', 'color', 'tag')"
    required: true
  - name: fields
    description: "Comma-separated field definitions: name:type (e.g. 'name:string,value:string'). Defaults to 'name:string,value:string'"
    required: false
---

# Scaffold a Full CRUD Resource

Generate all files for a new CRUD resource following the lemnArt admin project conventions.

## Inputs

- `$ARGUMENTS.resource` — singular resource name (e.g. `tag`, `material`)
- `$ARGUMENTS.fields` — comma-separated `name:type` pairs (default: `name:string,value:string`)

## Naming Conventions

Derive these from the resource name (example: resource = `tag`):

| Token | Value |
|---|---|
| `resource` | `tag` |
| `Resource` | `Tag` |
| `RESOURCE` | `TAG` |
| `resources` | `tags` |
| `Resources` | `Tags` |
| `RESOURCES` | `TAGS` |
| `resourceId` | `tagId` |

## Files to Create

### 1. Add Prisma Model — `admin/prisma/schema.prisma`

Add the model to the existing schema. Follow this pattern:

```prisma
model Resource {
  id        String    @id @default(uuid())
  storeId   String // Foreign Key to Store
  store     Store     @relation("StoreToResource", fields: [storeId], references: [id])
  // ... fields from $ARGUMENTS.fields ...
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt

  @@index([storeId])
}
```

Also add the relation to the `Store` model:

```prisma
resources   Resource[]  @relation("StoreToResource")
```

Map field types: `string` -> `String`, `number` -> `Int`, `decimal` -> `Decimal`, `boolean` -> `Boolean`.

### 2. Collection API Route — `admin/app/api/[storeId]/<resources>/route.ts`

```typescript
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prismadb from "@/lib/prismadb";

export async function POST(
    req: Request,
    { params }: { params: Promise<{ storeId: string }> }
) {
    try {
        const session = await auth.api.getSession({ headers: req.headers });
        const userId = session?.user?.id;
        const body = await req.json();
        const { storeId } = await params;

        const { /* destructure fields */ } = body;

        if (!userId) {
            return new NextResponse("Unauthenticated", { status: 401 });
        }

        // Validate each required field
        // if (!fieldName) { return new NextResponse("Field is required", { status: 400 }); }

        if (!storeId) {
            return new NextResponse("Store Id is required", { status: 400});
        }

        const storeByUserId = await prismadb.store.findFirst({
            where: { id: storeId, userId }
        })

        if (!storeByUserId) {
            return new NextResponse("Unauthorized", { status: 403 });
        }

        const resource = await prismadb.resource.create({
            data: {
                // ...fields,
                storeId: storeId
            }
        })

        return NextResponse.json(resource);

    } catch (err) {
        console.log(`[RESOURCES_POST] ${err}`);
        return new NextResponse(`Internal error`, { status: 500})
    }
}

export async function GET(
    req: Request,
    { params }: { params: Promise<{ storeId: string }> }
) {
    try {
        const { storeId } = await params;
        if (!storeId) {
            return new NextResponse("Store Id is required", { status: 400});
        }

        const resources = await prismadb.resource.findMany({
            where: { storeId: storeId }
        })

        return NextResponse.json(resources);

    } catch (err) {
        console.log(`[RESOURCES_GET] ${err}`);
        return new NextResponse(`Internal error`, { status: 500})
    }
}
```

### 3. Detail API Route — `admin/app/api/[storeId]/<resources>/[<resourceId>]/route.ts`

```typescript
import prismadb from "@/lib/prismadb";
import { auth } from "@/lib/auth";
import { NextResponse } from "next/server"

export async function GET (
    req: Request,
    { params }: { params: Promise<{ resourceId: string }>}
) {
    try {
        const { resourceId } = await params;
        if(!resourceId) {
            return new NextResponse("Resource id is required", { status: 400 });
        }

        const resource = await prismadb.resource.findUnique({
            where: { id: resourceId }
        })

        return NextResponse.json(resource);
    } catch (err) {
        console.log('[RESOURCE_GET]', err)
        return new NextResponse('Internal error', { status: 500 })
    }
}

export async function PATCH (
    req: Request,
    { params }: { params: Promise<{ storeId: string, resourceId: string }>}
) {
    try {
        const session = await auth.api.getSession({ headers: req.headers });
        const userId = session?.user?.id;
        const body = await req.json();
        const { storeId, resourceId } = await params;

        const { /* destructure fields */ } = body;

        if (!userId) {
            return new NextResponse("Unauthenticated", { status: 401 })
        }

        // Validate each required field

        if(!resourceId) {
            return new NextResponse("Resource id is required", { status: 400 });
        }

        const storeByUserId = await prismadb.store.findFirst({
            where: { id: storeId, userId }
        })

        if (!storeByUserId) {
            return new NextResponse("Unauthorized", { status: 403 });
        }

        const resource = await prismadb.resource.updateMany({
            where: { id: resourceId },
            data: { /* ...fields */ }
        })

        return NextResponse.json(resource);
    } catch (err) {
        console.log('[RESOURCE_PATCH]', err)
        return new NextResponse('Internal error', { status: 500 })
    }
}

export async function DELETE (
    req: Request,
    { params }: { params: Promise<{ storeId: string, resourceId: string }>}
) {
    try {
        const session = await auth.api.getSession({ headers: req.headers });
        const userId = session?.user?.id;
        const { storeId, resourceId } = await params;

        if (!userId) {
            return new NextResponse("Unauthenticated", { status: 401 })
        }

        if(!resourceId) {
            return new NextResponse("Resource id is required", { status: 400 });
        }

        const storeByUserId = await prismadb.store.findFirst({
            where: { id: storeId, userId }
        })

        if (!storeByUserId) {
            return new NextResponse("Unauthorized", { status: 403 });
        }

        const resource = await prismadb.resource.deleteMany({
            where: { id: resourceId }
        })

        return NextResponse.json(resource);
    } catch (err) {
        console.log('[RESOURCE_DELETE]', err)
        return new NextResponse('Internal error', { status: 500 })
    }
}
```

### 4. List Page — `admin/app/(dashboard)/[storeId]/(routes)/<resources>/page.tsx`

```tsx
import { format } from 'date-fns'
import prismadb from '@/lib/prismadb'
import { ResourceClient } from './components/client'
import { ResourceColumn } from './components/columns'

const ResourcesPage = async ({
    params
}: {
    params: Promise<{ storeId: string }>
}) => {
    const { storeId } = await params;
    const resources = await prismadb.resource.findMany({
        where: { storeId: storeId },
        orderBy: { createdAt: 'desc' }
    })

    const formattedResources: ResourceColumn[] = resources.map(item => ({
        id: item.id,
        // ...map each field,
        createdAt: format(item.createdAt, "MMMM do, yyyy"),
    }));

    return (
        <div className="flex-col">
            <div className="flex-1 p-8 pt-6 space-y-4">
                <ResourceClient data={formattedResources} />
            </div>
        </div>
    )
}

export default ResourcesPage;
```

### 5. Detail Page — `admin/app/(dashboard)/[storeId]/(routes)/<resources>/[<resourceId>]/page.tsx`

```tsx
import prismadb from "@/lib/prismadb";
import { ResourceForm } from "./components/resource-form";

const ResourcePage = async ({ params }: { params: Promise<{ resourceId: string }> }) => {
    const { resourceId } = await params;
    const resource = await prismadb.resource.findUnique({
        where: { id: resourceId }
    });

    return (
        <div className="flex-col">
            <div className="flex-1 p-8 pt-6 space-y-4">
                <ResourceForm initialData={resource} />
            </div>
        </div>
    )
}

export default ResourcePage;
```

### 6. Form Component — `admin/app/(dashboard)/[storeId]/(routes)/<resources>/[<resourceId>]/components/<resource>-form.tsx`

```tsx
"use client"

import { useState } from 'react'
import * as z from 'zod'
import { Resource } from "@prisma/client";
import { Heading } from "@/components/ui/heading";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Trash } from "lucide-react";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { useParams, useRouter } from 'next/navigation';
import { AlertModal } from '@/components/modals/alert-modal';

interface ResourceFormProps {
    initialData: Resource | null;
}

const formSchema = z.object({
    // Add zod validators for each field
    // name: z.string().min(1),
})

type ResourceFormValues = z.infer<typeof formSchema>;

export const ResourceForm: React.FC<ResourceFormProps> = ({ initialData }) => {
    const params = useParams();
    const router = useRouter();

    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const title = initialData ? 'Edit resource' : 'Create resource'
    const description = initialData ? 'Edit a resource' : 'Add a new resource'
    const toastMessage = initialData ? 'Resource updated.' : 'Resource created.'
    const action = initialData ? 'Save changes' : 'Create'

    const form = useForm<ResourceFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData || {
            // default values for each field
        }
    });

    const onSubmit = async (data: ResourceFormValues) => {
        try {
            setLoading(true);
            if (initialData) {
                await axios.patch(`/api/${params.storeId}/resources/${params.resourceId}`, data)
            } else {
                await axios.post(`/api/${params.storeId}/resources`, data)
            }
            router.refresh();
            router.push(`/${params.storeId}/resources`);
            toast.success(toastMessage)
        } catch(err) {
            toast.error("Something went wrong.");
        } finally {
            setLoading(false)
        }
    }

    const onDelete = async () => {
        try {
            setLoading(true);
            await axios.delete(`/api/${params.storeId}/resources/${params.resourceId}`)
            router.refresh();
            router.push(`/${params.storeId}/resources`)
            toast.success("Resource deleted.")
        } catch(err) {
            toast.error("Make sure you removed all dependencies first.");
        } finally {
            setLoading(false)
            setOpen(false);
        }
    }

    return (
        <>
            <AlertModal isOpen={open} onClose={() => setOpen(false)} onConfirm={onDelete} loading={loading} />
            <div className="flex items-center justify-between">
                <Heading title={title} description={description} />
                {initialData && (
                    <Button variant="destructive" size="sm" onClick={() => setOpen(true)} disabled={loading}>
                        <Trash className="w-4 h-4" />
                    </Button>
                )}
            </div>
            <Separator />
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-8">
                    <div className='grid grid-cols-3 gap-8'>
                        {/* Add FormField for each field */}
                    </div>
                    <Button disabled={loading} className='ml-auto' type='submit'>{action}</Button>
                </form>
            </Form>
        </>
    )
}
```

For each field, generate a `<FormField>` block:

```tsx
<FormField
    control={form.control}
    name="fieldName"
    render={({field}) => (
        <FormItem>
            <FormLabel>Field Label</FormLabel>
            <FormControl>
                <Input disabled={loading} placeholder='Field placeholder' {...field} />
            </FormControl>
            <FormMessage />
        </FormItem>
    )}
/>
```

### 7. Columns — `admin/app/(dashboard)/[storeId]/(routes)/<resources>/components/columns.tsx`

```tsx
"use client"
import { ColumnDef } from '@tanstack/react-table';
import { CellAction } from './cell-action';

export type ResourceColumn = {
    id: string
    // ...fields
    createdAt: string
}

export const columns: ColumnDef<ResourceColumn>[] = [
    // One entry per field:
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

### 8. Client — `admin/app/(dashboard)/[storeId]/(routes)/<resources>/components/client.tsx`

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

### 9. Cell Action — `admin/app/(dashboard)/[storeId]/(routes)/<resources>/components/cell-action.tsx`

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

1. Ask the user for the resource name and fields if not provided via arguments.
2. Derive all naming variants (singular, plural, PascalCase, camelCase, UPPER_CASE).
3. Replace all placeholder tokens (`resource`, `Resource`, `resources`, `resourceId`, etc.) with the actual names in every generated file.
4. Add the Prisma model to `admin/prisma/schema.prisma` and the relation to the `Store` model.
5. Create all 8 files listed above with proper content.
6. After generation, suggest running `/db-migrate` and `/add-nav-link`.
