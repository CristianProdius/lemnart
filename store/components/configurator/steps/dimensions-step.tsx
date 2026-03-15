"use client";

import { cn } from "@/lib/utils";
import useConfigurator from "@/hooks/use-configurator";

const LIMITS = {
    width: { min: 40, max: 200 },
    height: { min: 30, max: 120 },
    depth: { min: 10, max: 30 },
} as const;

const DimensionsStep = () => {
    const { width, height, depth, setWidth, setHeight, setDepth } =
        useConfigurator();

    const handleChange = (
        field: "width" | "height" | "depth",
        value: string
    ) => {
        const num = parseInt(value, 10);
        if (isNaN(num)) return;

        const clamped = Math.max(
            LIMITS[field].min,
            Math.min(num, LIMITS[field].max)
        );

        if (field === "width") setWidth(clamped);
        else if (field === "height") setHeight(clamped);
        else setDepth(clamped);
    };

    const fields = [
        {
            label: "Lățime",
            field: "width" as const,
            value: width,
        },
        {
            label: "Înălțime",
            field: "height" as const,
            value: height,
        },
        {
            label: "Adâncime",
            field: "depth" as const,
            value: depth,
        },
    ];

    return (
        <div>
            <p
                className="mb-4 text-xs font-medium uppercase tracking-[0.2em] text-[var(--th-text-tertiary)]"
                style={{ fontFamily: "var(--font-barlow)" }}
            >
                Dimensiuni
            </p>
            <div className="flex flex-col gap-5">
                {fields.map(({ label, field, value }) => (
                    <div key={field}>
                        <label
                            className="mb-2 block text-xs font-medium uppercase tracking-[0.2em] text-[var(--th-text-tertiary)]"
                            style={{ fontFamily: "var(--font-barlow)" }}
                        >
                            {label}
                            <span className="ml-2 normal-case tracking-normal text-[var(--th-text-muted)]">
                                ({LIMITS[field].min}–{LIMITS[field].max} cm)
                            </span>
                        </label>
                        <div className="flex items-center gap-3">
                            <input
                                type="number"
                                min={LIMITS[field].min}
                                max={LIMITS[field].max}
                                value={value}
                                onChange={(e) =>
                                    handleChange(field, e.target.value)
                                }
                                className={cn(
                                    "w-28 border border-[var(--th-border-strong)] bg-transparent px-4 py-2 text-sm text-[rgb(var(--th-text))]",
                                    "outline-none transition-colors duration-200",
                                    "focus:border-[var(--color-accent-light)]"
                                )}
                                style={{ fontFamily: "var(--font-barlow)" }}
                            />
                            <span
                                className="text-sm text-[var(--th-text-tertiary)]"
                                style={{ fontFamily: "var(--font-barlow)" }}
                            >
                                cm
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DimensionsStep;
