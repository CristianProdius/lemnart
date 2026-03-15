"use client";

import { useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export function HeroFields({ loading }: { loading: boolean }) {
    const { register } = useFormContext();

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="headingLine1">Heading Line 1</Label>
                    <Input
                        id="headingLine1"
                        disabled={loading}
                        {...register("headingLine1")}
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="headingLine2">Heading Line 2</Label>
                    <Input
                        id="headingLine2"
                        disabled={loading}
                        {...register("headingLine2")}
                    />
                </div>
            </div>
            <div className="space-y-2">
                <Label htmlFor="subtitle">Subtitle</Label>
                <Textarea
                    id="subtitle"
                    disabled={loading}
                    rows={3}
                    {...register("subtitle")}
                />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="ctaLabel">CTA Label</Label>
                    <Input
                        id="ctaLabel"
                        disabled={loading}
                        {...register("ctaLabel")}
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="ctaHref">CTA Link</Label>
                    <Input
                        id="ctaHref"
                        disabled={loading}
                        {...register("ctaHref")}
                    />
                </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="secondaryLabel">Secondary Label</Label>
                    <Input
                        id="secondaryLabel"
                        disabled={loading}
                        {...register("secondaryLabel")}
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="secondaryHref">Secondary Link</Label>
                    <Input
                        id="secondaryHref"
                        disabled={loading}
                        {...register("secondaryHref")}
                    />
                </div>
            </div>
            <div className="space-y-2">
                <Label htmlFor="videoSrc">Video Source</Label>
                <Input
                    id="videoSrc"
                    disabled={loading}
                    {...register("videoSrc")}
                />
            </div>
        </div>
    );
}
