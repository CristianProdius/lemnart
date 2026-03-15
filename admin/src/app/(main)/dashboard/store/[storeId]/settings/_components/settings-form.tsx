"use client"

import { useState } from 'react'
import * as z from 'zod'
import { Store } from "@prisma/client";
import { Heading } from "@/components/ui/heading";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Trash } from "lucide-react";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import axios from 'axios';
import { useParams, useRouter } from 'next/navigation';
import { AlertModal } from '@/components/modals/alert-modal';
import { ApiAlert } from '@/components/ui/api-alert';
import { ApiList } from '@/components/ui/api-list';
import { useOrigin } from '@/hooks/use-origin';

interface SettingsFromProps {
    initialData: Store;
}

const formSchema = z.object({
    name: z.string().min(1),
})

type SettingsFormValues = z.infer<typeof formSchema>;

export const SettingsForm: React.FC<SettingsFromProps> = ({ initialData }) => {
    const params = useParams();
    const router = useRouter();
    const origin = useOrigin();
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const form = useForm<SettingsFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData,
    });

    const onSubmit = async (data: SettingsFormValues) => {
        try {
            setLoading(true);
            await axios.patch(`/api/stores/${params.storeId}`, data)
            router.refresh();
            toast.success("Store updated.")
        } catch(err) {
            toast.error("Something went wrong.");
        } finally {
            setLoading(false)
        }
    }

    const onDelete = async () => {
        try {
            setLoading(true);
            await axios.delete(`/api/stores/${params.storeId}`)
            router.refresh();
            router.push("/dashboard")
            toast.success("Store deleted.")
        } catch(err) {
            toast.error("Make sure you removed all products and categories first.");
        } finally {
            setLoading(false)
            setOpen(false);
        }
    }

    return (
        <>
            <AlertModal isOpen={open} onClose={() => setOpen(false)} onConfirm={onDelete} loading={loading}/>
            <div className="flex items-center justify-between">
                <Heading title="Settings" description="Manage Store preferences" />
                <Button variant="destructive" size="sm" onClick={() => setOpen(true)} disabled={loading}>
                    <Trash className="w-4 h-4" />
                </Button>
            </div>
            <Separator />
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-8">
                    <div className='grid grid-cols-3 gap-8'>
                        <FormField control={form.control} name="name" render={({field}) => (
                            <FormItem>
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                    <Input disabled={loading} placeholder='Store name' {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}/>
                    </div>
                    <Button disabled={loading} className='ml-auto' type='submit'>Save Changes</Button>
                </form>
            </Form>
            <Separator />
            <ApiAlert title="NEXT_PUBLIC_API_URL" description={`${origin}/api/${params.storeId}`} variant='public'/>
            <Separator />
            <Heading title="API Reference" description="API endpoints for all store resources" />
            <Separator />
            <div className="space-y-4">
                <h3 className="text-sm font-medium">Products</h3>
                <ApiList entityName="products" entityIdName="productId" />
            </div>
            <div className="space-y-4">
                <h3 className="text-sm font-medium">Categories</h3>
                <ApiList entityName="categories" entityIdName="categoryId" />
            </div>
            <div className="space-y-4">
                <h3 className="text-sm font-medium">Sizes</h3>
                <ApiList entityName="sizes" entityIdName="sizeId" />
            </div>
            <div className="space-y-4">
                <h3 className="text-sm font-medium">Colors</h3>
                <ApiList entityName="colors" entityIdName="colorId" />
            </div>
            <div className="space-y-4">
                <h3 className="text-sm font-medium">Billboards</h3>
                <ApiList entityName="billboards" entityIdName="billboardId" />
            </div>
        </>
    )
}
