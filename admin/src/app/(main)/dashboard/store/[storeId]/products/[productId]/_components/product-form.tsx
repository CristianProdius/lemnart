"use client";

import { useState } from "react";

import NextImage from "next/image";
import { useParams, useRouter } from "next/navigation";

import {
  DndContext,
  type DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Category, Color, Product, Size } from "@prisma/client";
import axios from "axios";
import { GripVertical, Trash } from "lucide-react";
import { useFieldArray, useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

import { AlertModal } from "@/components/modals/alert-modal";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Heading } from "@/components/ui/heading";
import ImageUpload from "@/components/ui/image-upload";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

interface ProductFromProps {
  initialData:
    | (Product & {
        colors: Color[];
        images: { id?: string; url: string; colorId: string | null; sortOrder?: number }[];
      })
    | null;
  categories: Category[];
  colors: Color[];
  sizes: Size[];
}

const formSchema = z.object({
  name: z.string().min(1),
  images: z
    .object({
      url: z.string(),
      colorId: z.string().nullable().optional(),
      sortOrder: z.number().int().nonnegative().optional(),
    })
    .array()
    .min(1),
  price: z.coerce.number().min(1),
  categoryId: z.string().min(1),
  colorIds: z.array(z.string().min(1)).min(1, "Pick at least one color"),
  sizeId: z.string().min(1),
  isFeatured: z.boolean().default(false).optional(),
  isArchived: z.boolean().default(false).optional(),
});

type ProductFormValues = z.infer<typeof formSchema>;

export const ProductForm: React.FC<ProductFromProps> = ({ initialData, categories, colors, sizes }) => {
  const params = useParams();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const title = initialData ? "Edit product" : "Create product";
  const description = initialData ? "Edit a product" : "Add a new product";
  const toastMessage = initialData ? "Product updated." : "Product created.";
  const action = initialData ? "Save changes" : "Create";

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData
      ? {
          name: initialData.name,
          images: initialData.images.map((i, idx) => ({
            url: i.url,
            colorId: i.colorId ?? null,
            sortOrder: i.sortOrder ?? idx,
          })),
          price: parseFloat(String(initialData.price)),
          categoryId: initialData.categoryId,
          colorIds: initialData.colors.map((c) => c.id),
          sizeId: initialData.sizeId,
          isFeatured: initialData.isFeatured,
          isArchived: initialData.isArchived,
        }
      : {
          name: "",
          images: [],
          price: 0,
          categoryId: "",
          colorIds: [],
          sizeId: "",
          isFeatured: false,
          isArchived: false,
        },
  });

  // Hooks at component scope (not inside FormField render — Rules of Hooks).
  const selectedColorIds = useWatch({ control: form.control, name: "colorIds" }) ?? [];
  const imagesArray = useFieldArray({ control: form.control, name: "images" });

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIdx = imagesArray.fields.findIndex((f) => f.id === active.id);
    const newIdx = imagesArray.fields.findIndex((f) => f.id === over.id);
    if (oldIdx === -1 || newIdx === -1) return;
    imagesArray.move(oldIdx, newIdx);
    // Re-sequence sortOrder via path-based setValue so we don't regenerate field IDs.
    const moved = arrayMove(imagesArray.fields, oldIdx, newIdx);
    moved.forEach((_, i) => form.setValue(`images.${i}.sortOrder`, i, { shouldDirty: true }));
  };

  const clearImageTagsForColor = (removedColorId: string) => {
    form.getValues("images").forEach((img, idx) => {
      if (img.colorId === removedColorId) {
        form.setValue(`images.${idx}.colorId`, null, { shouldDirty: true });
      }
    });
  };

  const onSubmit = async (data: ProductFormValues) => {
    try {
      setLoading(true);
      if (initialData) {
        const payload = {
          ...data,
          expectedUpdatedAt:
            initialData.updatedAt instanceof Date
              ? initialData.updatedAt.toISOString()
              : initialData.updatedAt,
        };
        await axios.patch(`/api/${params.storeId}/products/${params.productId}`, payload);
      } else {
        await axios.post(`/api/${params.storeId}/products`, data);
      }
      router.refresh();
      router.push(`/dashboard/store/${params.storeId}/products`);
      toast.success(toastMessage);
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.status === 409) {
        toast.error("Acest produs a fost modificat în alt tab. Reîncarcă pagina și reîncearcă.");
      } else if (axios.isAxiosError(err) && err.response?.status === 428) {
        toast.error("Sesiune expirată. Reîncarcă pagina și reîncearcă.");
      } else {
        toast.error("Something went wrong.");
      }
    } finally {
      setLoading(false);
    }
  };

  const onDelete = async () => {
    try {
      setLoading(true);
      await axios.delete(`/api/${params.storeId}/products/${params.productId}`);
      router.refresh();
      router.push(`/dashboard/store/${params.storeId}/products`);
      toast.success("Product deleted.");
    } catch {
      toast.error("Something Went Wrong.");
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  const selectedColors = colors.filter((c) => selectedColorIds.includes(c.id));

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
          <FormField
            control={form.control}
            name="images"
            render={() => (
              <FormItem>
                <FormLabel>Images</FormLabel>
                <FormControl>
                  <ImageUpload
                    value={imagesArray.fields.map((f) => f.url)}
                    disabled={loading}
                    onChange={(url) =>
                      imagesArray.append({ url, colorId: null, sortOrder: imagesArray.fields.length })
                    }
                    onRemove={(url) => {
                      const idx = imagesArray.fields.findIndex((f) => f.url === url);
                      if (idx === -1) return;
                      imagesArray.remove(idx);
                      // Re-sequence remaining sortOrders so they stay 0..N-1.
                      queueMicrotask(() => {
                        form.getValues("images").forEach((_, i) => {
                          form.setValue(`images.${i}.sortOrder`, i, { shouldDirty: true });
                        });
                      });
                    }}
                  />
                </FormControl>
                {imagesArray.fields.length > 0 && (
                  <div className="mt-4 space-y-2">
                    <p className="text-sm text-muted-foreground">
                      Drag the grip handle to reorder. Tag each image with the color it represents (or leave as
                      &quot;Generic&quot; to show for all colors):
                    </p>
                    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                      <SortableContext
                        items={imagesArray.fields.map((f) => f.id)}
                        strategy={verticalListSortingStrategy}
                      >
                        <div className="grid grid-cols-1 gap-2">
                          {imagesArray.fields.map((field, idx) => (
                            <SortableImageRow
                              key={field.id}
                              id={field.id}
                              url={field.url}
                              colorId={field.colorId ?? null}
                              idx={idx}
                              selectedColors={selectedColors}
                              onColorChange={(newColorId) =>
                                form.setValue(`images.${idx}.colorId`, newColorId, { shouldDirty: true })
                              }
                            />
                          ))}
                        </div>
                      </SortableContext>
                    </DndContext>
                  </div>
                )}
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="colorIds"
            render={() => (
              <FormItem>
                <FormLabel>Colors</FormLabel>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                  {colors.map((color) => {
                    const checked = selectedColorIds.includes(color.id);
                    const checkboxId = `color-checkbox-${color.id}`;
                    return (
                      <label
                        key={color.id}
                        htmlFor={checkboxId}
                        className="flex items-center gap-2 border rounded-md p-2 cursor-pointer hover:bg-accent"
                      >
                        <Checkbox
                          id={checkboxId}
                          checked={checked}
                          onCheckedChange={(value) => {
                            const current = form.getValues("colorIds");
                            if (value) {
                              form.setValue("colorIds", [...current, color.id], {
                                shouldDirty: true,
                                shouldValidate: true,
                              });
                            } else {
                              form.setValue(
                                "colorIds",
                                current.filter((id) => id !== color.id),
                                { shouldDirty: true, shouldValidate: true },
                              );
                              clearImageTagsForColor(color.id);
                            }
                          }}
                        />
                        <span className="h-4 w-4 rounded-full border" style={{ backgroundColor: color.value }} />
                        <span className="text-sm">{color.name}</span>
                      </label>
                    );
                  })}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input disabled={loading} placeholder="Product Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price</FormLabel>
                  <FormControl>
                    <Input type="number" disabled={loading} placeholder="Product Price" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select
                    disabled={loading}
                    onValueChange={field.onChange}
                    value={field.value}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue defaultValue={field.value} placeholder="Select a Category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="sizeId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Size</FormLabel>
                  <Select
                    disabled={loading}
                    onValueChange={field.onChange}
                    value={field.value}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue defaultValue={field.value} placeholder="Select a size" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {sizes.map((size) => (
                        <SelectItem key={size.id} value={size.id}>
                          {size.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="isFeatured"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start p-4 space-x-3 space-y-0 border rounded-md">
                  <FormControl>
                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Featured</FormLabel>
                    <FormDescription>The product will appear on the home page.</FormDescription>
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="isArchived"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start p-4 space-x-3 space-y-0 border rounded-md">
                  <FormControl>
                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Archived</FormLabel>
                    <FormDescription>The product will not appear anywhere in the store.</FormDescription>
                  </div>
                </FormItem>
              )}
            />
          </div>
          <Button disabled={loading} className="ml-auto" type="submit">
            {action}
          </Button>
        </form>
      </Form>
    </>
  );
};

interface SortableImageRowProps {
  id: string;
  url: string;
  colorId: string | null;
  idx: number;
  selectedColors: Color[];
  onColorChange: (newColorId: string | null) => void;
}

const SortableImageRow: React.FC<SortableImageRowProps> = ({ id, url, colorId, idx, selectedColors, onColorChange }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };
  return (
    <div ref={setNodeRef} style={style} className="flex items-center gap-3 border rounded-md p-2 bg-background">
      <button
        type="button"
        {...attributes}
        {...listeners}
        aria-label={`Mută poza ${idx + 1}`}
        className="cursor-grab touch-none p-1 text-muted-foreground hover:text-foreground"
      >
        <GripVertical className="h-4 w-4" />
      </button>
      <div className="relative w-12 h-12 rounded overflow-hidden bg-muted shrink-0">
        <NextImage fill className="object-cover" alt="thumb" src={url} />
      </div>
      <Select
        value={colorId ?? "__generic__"}
        onValueChange={(val) => onColorChange(val === "__generic__" ? null : val)}
      >
        <SelectTrigger className="flex-1">
          <SelectValue placeholder="Select color" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="__generic__">Generic (all colors)</SelectItem>
          {selectedColors.map((c) => (
            <SelectItem key={c.id} value={c.id}>
              <span className="inline-flex items-center gap-2">
                <span className="h-3 w-3 rounded-full border" style={{ backgroundColor: c.value }} />
                {c.name}
              </span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
