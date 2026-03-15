"use client";

import { useFormContext, useFieldArray } from "react-hook-form";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export function TestimonialsFields({ loading }: { loading: boolean }) {
    const { register, control } = useFormContext();
    const { fields, append, remove } = useFieldArray({
        control,
        name: "items",
    });

    return (
        <div className="space-y-4">
            {fields.map((field, index) => (
                <div
                    key={field.id}
                    className="rounded-lg border p-4 space-y-3"
                >
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">
                            Testimonial {index + 1}
                        </span>
                        {fields.length > 1 && (
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => remove(index)}
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        )}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor={`items.${index}.quote`}>Quote</Label>
                        <Textarea
                            id={`items.${index}.quote`}
                            disabled={loading}
                            rows={3}
                            {...register(`items.${index}.quote`)}
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor={`items.${index}.name`}>Name</Label>
                            <Input
                                id={`items.${index}.name`}
                                disabled={loading}
                                {...register(`items.${index}.name`)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor={`items.${index}.location`}>
                                Location
                            </Label>
                            <Input
                                id={`items.${index}.location`}
                                disabled={loading}
                                {...register(`items.${index}.location`)}
                            />
                        </div>
                    </div>
                </div>
            ))}
            <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() =>
                    append({ quote: "", name: "", location: "" })
                }
            >
                <Plus className="mr-2 h-4 w-4" />
                Add Testimonial
            </Button>
        </div>
    );
}
