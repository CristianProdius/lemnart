"use client";

import { useFormContext, useFieldArray } from "react-hook-form";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export function ProcessFields({ loading }: { loading: boolean }) {
    const { register, control } = useFormContext();
    const { fields, append, remove } = useFieldArray({
        control,
        name: "steps",
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
                            Step {index + 1}
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
                    <div className="grid grid-cols-4 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor={`steps.${index}.number`}>
                                Number
                            </Label>
                            <Input
                                id={`steps.${index}.number`}
                                disabled={loading}
                                {...register(`steps.${index}.number`)}
                            />
                        </div>
                        <div className="col-span-3 space-y-2">
                            <Label htmlFor={`steps.${index}.title`}>
                                Title
                            </Label>
                            <Input
                                id={`steps.${index}.title`}
                                disabled={loading}
                                {...register(`steps.${index}.title`)}
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor={`steps.${index}.description`}>
                            Description
                        </Label>
                        <Textarea
                            id={`steps.${index}.description`}
                            disabled={loading}
                            rows={2}
                            {...register(`steps.${index}.description`)}
                        />
                    </div>
                </div>
            ))}
            <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() =>
                    append({
                        number: String(fields.length + 1).padStart(2, "0"),
                        title: "",
                        description: "",
                    })
                }
            >
                <Plus className="mr-2 h-4 w-4" />
                Add Step
            </Button>
        </div>
    );
}
