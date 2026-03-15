"use client"

import { useState } from 'react'
import * as z from 'zod'
import { ConfigStyle } from "@prisma/client";
import { Heading } from "@/components/ui/heading";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Trash } from "lucide-react";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import axios from 'axios';
import { useParams, useRouter } from 'next/navigation';
import { AlertModal } from '@/components/modals/alert-modal';
import { Checkbox } from '@/components/ui/checkbox';
import FileUpload from '@/components/ui/file-upload';

interface StyleFormProps {
    initialData: ConfigStyle | null;
}

const formSchema = z.object({
    name: z.string().min(1),
    slug: z.string().min(1),
    description: z.string().default(""),
    modelUrl: z.string().default(""),
    previewUrl: z.string().default(""),
    sortOrder: z.coerce.number().int().default(0),
    isActive: z.boolean().default(true).optional(),
})

type StyleFormValues = z.infer<typeof formSchema>;

export const StyleForm: React.FC<StyleFormProps> = ({ initialData }) => {
    const params = useParams();
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const title = initialData ? 'Edit style' : 'Create style'
    const description = initialData ? 'Edit a style' : 'Add a new style'
    const toastMessage = initialData ? 'Style updated.' : 'Style created.'
    const action = initialData ? 'Save changes' : 'Create'

    const form = useForm<StyleFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData ? {
            name: initialData.name,
            slug: initialData.slug,
            description: initialData.description,
            modelUrl: initialData.modelUrl,
            previewUrl: initialData.previewUrl,
            sortOrder: initialData.sortOrder,
            isActive: initialData.isActive,
        } : {
            name: '', slug: '', description: '', modelUrl: '', previewUrl: '', sortOrder: 0, isActive: true,
        }
    });

    const onSubmit = async (data: StyleFormValues) => {
        try {
            setLoading(true);
            if (initialData) {
                await axios.patch(`/api/${params.storeId}/configurator/styles/${params.styleId}`, data)
            } else {
                await axios.post(`/api/${params.storeId}/configurator/styles`, data)
            }
            router.refresh();
            router.push(`/dashboard/store/${params.storeId}/configurator/styles`);
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
            await axios.delete(`/api/${params.storeId}/configurator/styles/${params.styleId}`)
            router.refresh();
            router.push(`/dashboard/store/${params.storeId}/configurator/styles`)
            toast.success("Style deleted.")
        } catch(err) {
            toast.error("Make sure you removed all price tiers using this style first.");
        } finally {
            setLoading(false)
            setOpen(false);
        }
    }

    return (
        <>
            <AlertModal isOpen={open} onClose={() => setOpen(false)} onConfirm={onDelete} loading={loading}/>
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
                        <FormField control={form.control} name="name" render={({field}) => (
                            <FormItem>
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                    <Input disabled={loading} placeholder='Style name' {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}/>
                        <FormField control={form.control} name="slug" render={({field}) => (
                            <FormItem>
                                <FormLabel>Slug</FormLabel>
                                <FormControl>
                                    <Input disabled={loading} placeholder='style-slug' {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}/>
                    </div>
                    <div className='grid grid-cols-2 gap-8'>
                        <FormField control={form.control} name="modelUrl" render={({field}) => (
                            <FormItem>
                                <FormLabel>3D Model (.glb)</FormLabel>
                                <FormControl>
                                    <FileUpload
                                        disabled={loading}
                                        value={field.value}
                                        onChange={(url) => field.onChange(url)}
                                        onRemove={() => field.onChange("")}
                                        accept=".glb,.gltf"
                                        label="Upload 3D model"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}/>
                        <FormField control={form.control} name="previewUrl" render={({field}) => (
                            <FormItem>
                                <FormLabel>Preview Image</FormLabel>
                                <FormControl>
                                    <FileUpload
                                        disabled={loading}
                                        value={field.value}
                                        onChange={(url) => field.onChange(url)}
                                        onRemove={() => field.onChange("")}
                                        accept="image/*"
                                        label="Upload preview image"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}/>
                        <FormField control={form.control} name="sortOrder" render={({field}) => (
                            <FormItem>
                                <FormLabel>Sort Order</FormLabel>
                                <FormControl>
                                    <Input type="number" disabled={loading} placeholder='0' {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}/>
                        <FormField control={form.control} name="isActive" render={({field}) => (
                            <FormItem className='flex flex-row items-start p-4 space-x-3 space-y-0 border rounded-md'>
                                <FormControl>
                                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                </FormControl>
                                <div className='space-y-1 leading-none'>
                                    <FormLabel>Active</FormLabel>
                                    <FormDescription>This style will be visible in the configurator.</FormDescription>
                                </div>
                            </FormItem>
                        )}/>
                    </div>
                    <FormField control={form.control} name="description" render={({field}) => (
                        <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                                <Textarea disabled={loading} placeholder='Style description' {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}/>
                    <Button disabled={loading} className='ml-auto' type='submit'>{action}</Button>
                </form>
            </Form>
        </>
    )
}
