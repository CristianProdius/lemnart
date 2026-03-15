"use client"

import { useState } from 'react'
import * as z from 'zod'
import { PriceTier, ConfigStyle, Color } from "@prisma/client";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface PricingFormProps {
    initialData: PriceTier | null;
    styles: ConfigStyle[];
    colors: Color[];
}

const formSchema = z.object({
    styleId: z.string().min(1),
    colorId: z.string().optional(),
    minWidth: z.coerce.number().int().min(1),
    maxWidth: z.coerce.number().int().min(1),
    minHeight: z.coerce.number().int().min(1),
    maxHeight: z.coerce.number().int().min(1),
    basePrice: z.coerce.number().min(0),
    pricePerSection: z.coerce.number().min(0).default(0),
})

type PricingFormValues = z.infer<typeof formSchema>;

export const PricingForm: React.FC<PricingFormProps> = ({ initialData, styles, colors }) => {
    const params = useParams();
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const title = initialData ? 'Edit price tier' : 'Create price tier'
    const description = initialData ? 'Edit a price tier' : 'Add a new price tier'
    const toastMessage = initialData ? 'Price tier updated.' : 'Price tier created.'
    const action = initialData ? 'Save changes' : 'Create'

    const form = useForm<PricingFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData ? {
            styleId: initialData.styleId,
            colorId: initialData.colorId || undefined,
            minWidth: initialData.minWidth,
            maxWidth: initialData.maxWidth,
            minHeight: initialData.minHeight,
            maxHeight: initialData.maxHeight,
            basePrice: parseFloat(String(initialData.basePrice)),
            pricePerSection: parseFloat(String(initialData.pricePerSection)),
        } : {
            styleId: '', colorId: undefined, minWidth: 0, maxWidth: 0, minHeight: 0, maxHeight: 0, basePrice: 0, pricePerSection: 0,
        }
    });

    const onSubmit = async (data: PricingFormValues) => {
        try {
            setLoading(true);
            const payload = {
                ...data,
                colorId: data.colorId || null,
            };
            if (initialData) {
                await axios.patch(`/api/${params.storeId}/configurator/pricing/${params.tierId}`, payload)
            } else {
                await axios.post(`/api/${params.storeId}/configurator/pricing`, payload)
            }
            router.refresh();
            router.push(`/dashboard/store/${params.storeId}/configurator/pricing`);
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
            await axios.delete(`/api/${params.storeId}/configurator/pricing/${params.tierId}`)
            router.refresh();
            router.push(`/dashboard/store/${params.storeId}/configurator/pricing`)
            toast.success("Price tier deleted.")
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
                        <FormField control={form.control} name="styleId" render={({field}) => (
                            <FormItem>
                                <FormLabel>Style</FormLabel>
                                <Select disabled={loading} onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                                    <FormControl><SelectTrigger><SelectValue defaultValue={field.value} placeholder='Select a style' /></SelectTrigger></FormControl>
                                    <SelectContent>
                                        {styles.map(style => (<SelectItem key={style.id} value={style.id}>{style.name}</SelectItem>))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}/>
                        <FormField control={form.control} name="colorId" render={({field}) => (
                            <FormItem>
                                <FormLabel>Color (optional)</FormLabel>
                                <Select disabled={loading} onValueChange={(value) => field.onChange(value === "none" ? undefined : value)} value={field.value || "none"} defaultValue={field.value || "none"}>
                                    <FormControl><SelectTrigger><SelectValue placeholder='All colors' /></SelectTrigger></FormControl>
                                    <SelectContent>
                                        <SelectItem value="none">All colors</SelectItem>
                                        {colors.map(color => (<SelectItem key={color.id} value={color.id}>{color.name}</SelectItem>))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}/>
                        <FormField control={form.control} name="minWidth" render={({field}) => (
                            <FormItem>
                                <FormLabel>Min Width (cm)</FormLabel>
                                <FormControl>
                                    <Input type="number" disabled={loading} placeholder='0' {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}/>
                        <FormField control={form.control} name="maxWidth" render={({field}) => (
                            <FormItem>
                                <FormLabel>Max Width (cm)</FormLabel>
                                <FormControl>
                                    <Input type="number" disabled={loading} placeholder='0' {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}/>
                        <FormField control={form.control} name="minHeight" render={({field}) => (
                            <FormItem>
                                <FormLabel>Min Height (cm)</FormLabel>
                                <FormControl>
                                    <Input type="number" disabled={loading} placeholder='0' {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}/>
                        <FormField control={form.control} name="maxHeight" render={({field}) => (
                            <FormItem>
                                <FormLabel>Max Height (cm)</FormLabel>
                                <FormControl>
                                    <Input type="number" disabled={loading} placeholder='0' {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}/>
                        <FormField control={form.control} name="basePrice" render={({field}) => (
                            <FormItem>
                                <FormLabel>Base Price</FormLabel>
                                <FormControl>
                                    <Input type="number" disabled={loading} placeholder='0' {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}/>
                        <FormField control={form.control} name="pricePerSection" render={({field}) => (
                            <FormItem>
                                <FormLabel>Price Per Section</FormLabel>
                                <FormControl>
                                    <Input type="number" disabled={loading} placeholder='0' {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}/>
                    </div>
                    <Button disabled={loading} className='ml-auto' type='submit'>{action}</Button>
                </form>
            </Form>
        </>
    )
}
