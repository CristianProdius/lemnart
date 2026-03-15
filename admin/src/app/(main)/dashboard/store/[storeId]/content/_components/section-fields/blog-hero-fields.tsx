"use client";

import { useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export function BlogHeroFields({ loading }: { loading: boolean }) {
    const { register } = useFormContext();

    return (
        <div className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="heading">Heading</Label>
                <Input
                    id="heading"
                    disabled={loading}
                    {...register("heading")}
                />
            </div>
            <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                    id="description"
                    disabled={loading}
                    rows={3}
                    {...register("description")}
                />
            </div>
        </div>
    );
}
