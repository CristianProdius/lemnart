"use client";

import { useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function ContactInfoFields({ loading }: { loading: boolean }) {
    const { register } = useFormContext();

    return (
        <div className="space-y-4">
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
                    <Label htmlFor="phoneHref">Phone Link</Label>
                    <Input
                        id="phoneHref"
                        disabled={loading}
                        placeholder="tel:+40700000000"
                        {...register("phoneHref")}
                    />
                </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                        id="email"
                        disabled={loading}
                        {...register("email")}
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="emailHref">Email Link</Label>
                    <Input
                        id="emailHref"
                        disabled={loading}
                        placeholder="mailto:contact@lemnart.ro"
                        {...register("emailHref")}
                    />
                </div>
            </div>
            <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                    id="location"
                    disabled={loading}
                    {...register("location")}
                />
            </div>
        </div>
    );
}
