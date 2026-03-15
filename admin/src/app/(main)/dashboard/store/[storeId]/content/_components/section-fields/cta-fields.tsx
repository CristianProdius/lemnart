"use client";

import { useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export function CTAFields({ loading }: { loading: boolean }) {
    const { register } = useFormContext();

    return (
        <div className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="marqueeText">Marquee Text</Label>
                <Input
                    id="marqueeText"
                    disabled={loading}
                    {...register("marqueeText")}
                />
            </div>
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
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="buttonLabel">Button Label</Label>
                    <Input
                        id="buttonLabel"
                        disabled={loading}
                        {...register("buttonLabel")}
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="buttonHref">Button Link</Label>
                    <Input
                        id="buttonHref"
                        disabled={loading}
                        {...register("buttonHref")}
                    />
                </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                        id="phone"
                        disabled={loading}
                        {...register("phone")}
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                        id="email"
                        disabled={loading}
                        {...register("email")}
                    />
                </div>
            </div>
        </div>
    );
}
