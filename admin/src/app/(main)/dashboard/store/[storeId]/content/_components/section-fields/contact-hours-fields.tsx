"use client";

import { useFormContext, useFieldArray } from "react-hook-form";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function ContactHoursFields({ loading }: { loading: boolean }) {
    const { register, control } = useFormContext();
    const { fields, append, remove } = useFieldArray({
        control,
        name: "rows",
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
                            Row {index + 1}
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
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor={`rows.${index}.label`}>
                                Label
                            </Label>
                            <Input
                                id={`rows.${index}.label`}
                                disabled={loading}
                                placeholder="Luni – Vineri"
                                {...register(`rows.${index}.label`)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor={`rows.${index}.value`}>
                                Value
                            </Label>
                            <Input
                                id={`rows.${index}.value`}
                                disabled={loading}
                                placeholder="09:00 – 18:00"
                                {...register(`rows.${index}.value`)}
                            />
                        </div>
                    </div>
                </div>
            ))}
            <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => append({ label: "", value: "" })}
            >
                <Plus className="mr-2 h-4 w-4" />
                Add Row
            </Button>
        </div>
    );
}
