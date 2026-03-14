---
name: scaffold-form
description: Generate a React Hook Form + Zod form component with create/edit mode
user_invocable: true
arguments:
  - name: resource
    description: "Resource name in singular form (e.g. 'size', 'color')"
    required: true
  - name: fields
    description: "Comma-separated field definitions: name:type:label (e.g. 'name:string:Name,value:string:Value'). Defaults to 'name:string:Name,value:string:Value'"
    required: false
---

# Scaffold Form Component

Generate a form component following the lemnArt admin pattern with React Hook Form, Zod validation, create/edit mode, and delete support.

## Inputs

- `$ARGUMENTS.resource` — singular resource name (e.g. `tag`)
- `$ARGUMENTS.fields` — comma-separated `name:type:label` triples (default: `name:string:Name,value:string:Value`)

## Output Path

`admin/app/(dashboard)/[storeId]/(routes)/<resources>/[<resourceId>]/components/<resource>-form.tsx`

## Template

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
    // For each field:
    // name: z.string().min(1),
    // For boolean fields: z.boolean().default(false)
    // For number fields: z.coerce.number().min(0)
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
            // default empty values for each field
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
                        {/* FormField for each field */}
                    </div>
                    <Button disabled={loading} className='ml-auto' type='submit'>{action}</Button>
                </form>
            </Form>
        </>
    )
}
```

## FormField Patterns

**String field:**
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

**Boolean field (checkbox):**
```tsx
<FormField
    control={form.control}
    name="fieldName"
    render={({field}) => (
        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
            <FormControl>
                <Checkbox checked={field.value} onCheckedChange={field.onChange} />
            </FormControl>
            <div className="space-y-1 leading-none">
                <FormLabel>Field Label</FormLabel>
            </div>
        </FormItem>
    )}
/>
```

**Image upload field:**
```tsx
<FormField
    control={form.control}
    name="imageUrl"
    render={({field}) => (
        <FormItem>
            <FormLabel>Image</FormLabel>
            <FormControl>
                <ImageUpload
                    value={field.value ? [field.value] : []}
                    disabled={loading}
                    onChange={(url) => field.onChange(url)}
                    onRemove={() => field.onChange("")}
                />
            </FormControl>
            <FormMessage />
        </FormItem>
    )}
/>
```

## Instructions

1. Ask the user for the resource name and fields if not provided.
2. Derive naming variants (singular, plural, PascalCase, camelCase).
3. Replace all placeholder tokens with actual names.
4. Generate a Zod schema entry and FormField for each field based on its type.
5. Set appropriate default values: `''` for strings, `false` for booleans, `0` for numbers.
6. Create the file at the correct path.
