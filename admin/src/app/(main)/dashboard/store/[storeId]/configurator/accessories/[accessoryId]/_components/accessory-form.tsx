"use client"

import { useState } from 'react'
import * as z from 'zod'
import { ConfigAccessory } from "@prisma/client";
import { Heading } from "@/components/ui/heading";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Trash } from "lucide-react";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import axios from 'axios';
import { useParams, useRouter } from 'next/navigation';
import { AlertModal } from '@/components/modals/alert-modal';
import { Checkbox } from '@/components/ui/checkbox';

interface AccessoryFormProps {
    initialData: ConfigAccessory | null;
}

const formSchema = z.object({
    name: z.string().min(1),
    slug: z.string().min(1),
    previewUrl: z.string().default(""),
    price: z.coerce.number().default(0),
    sortOrder: z.coerce.number().int().default(0),
    isActive: z.boolean().default(true).optional(),
})

type AccessoryFormValues = z.infer<typeof formSchema>;

export const AccessoryForm: React.FC<AccessoryFormProps> = ({ initialData }) => {
    const params = useParams();
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const title = initialData ? 'Edit accessory' : 'Create accessory'
    const description = initialData ? 'Edit an accessory' : 'Add a new accessory'
    const toastMessage = initialData ? 'Accessory updated.' : 'Accessory created.'
    const action = initialData ? 'Save changes' : 'Create'

    const form = useForm<AccessoryFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData ? {
            name: initialData.name,
            slug: initialData.slug,
            previewUrl: initialData.previewUrl,
            price: parseFloat(String(initialData.price)),
            sortOrder: initialData.sortOrder,
            isActive: initialData.isActive,
        } : {
            name: '', slug: '', previewUrl: '', price: 0, sortOrder: 0, isActive: true,
        }
    });

    const onSubmit = async (data: AccessoryFormValues) => {
        try {
            setLoading(true);
            if (initialData) {
                await axios.patch(`/api/${params.storeId}/configurator/accessories/${params.accessoryId}`, data)
            } else {
                await axios.post(`/api/${params.storeId}/configurator/accessories`, data)
            }
            router.refresh();
            router.push(`/dashboard/store/${params.storeId}/configurator/accessories`);
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
            await axios.delete(`/api/${params.storeId}/configurator/accessories/${params.accessoryId}`)
            router.refresh();
            router.push(`/dashboard/store/${params.storeId}/configurator/accessories`)
            toast.success("Accessory deleted.")
        } catch(err) {
            toast.error("Something went wrong.");
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
                                    <Input disabled={loading} placeholder='Accessory name' {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}/>
                        <FormField control={form.control} name="slug" render={({field}) => (
                            <FormItem>
                                <FormLabel>Slug</FormLabel>
                                <FormControl>
                                    <Input disabled={loading} placeholder='accessory-slug' {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}/>
                        <FormField control={form.control} name="previewUrl" render={({field}) => (
                            <FormItem>
                                <FormLabel>Preview URL</FormLabel>
                                <FormControl>
                                    <Input disabled={loading} placeholder='Preview image URL' {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}/>
                        <FormField control={form.control} name="price" render={({field}) => (
                            <FormItem>
                                <FormLabel>Price</FormLabel>
                                <FormControl>
                                    <Input type="number" disabled={loading} placeholder='0' {...field} />
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
                                    <FormDescription>This accessory will be visible in the configurator.</FormDescription>
                                </div>
                            </FormItem>
                        )}/>
                    </div>
                    <Button disabled={loading} className='ml-auto' type='submit'>{action}</Button>
                </form>
            </Form>
        </>
    )
}
