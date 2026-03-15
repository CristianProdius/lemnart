"use client";

import { cn } from "@/lib/utils";
import { Color } from "@/types";
import useConfigurator from "@/hooks/use-configurator";

interface ColorStepProps {
    colors: Color[];
}

const ColorStep: React.FC<ColorStepProps> = ({ colors }) => {
    const { colorId, setColorId } = useConfigurator();

    return (
        <div>
            <p
                className="mb-4 text-xs font-medium uppercase tracking-[0.2em] text-[var(--th-text-tertiary)]"
                style={{ fontFamily: "var(--font-barlow)" }}
            >
                Alege culoarea
            </p>
            <div className="flex flex-wrap gap-4">
                {colors.map((color) => (
                    <button
                        key={color.id}
                        onClick={() => setColorId(color.id)}
                        className="group flex flex-col items-center gap-2"
                    >
                        <span
                            className={cn(
                                "flex h-12 w-12 items-center justify-center rounded-full transition-all duration-200",
                                colorId === color.id
                                    ? "ring-2 ring-[var(--color-accent-light)] ring-offset-2 ring-offset-[var(--th-bg)]"
                                    : "ring-1 ring-[var(--th-border-strong)] group-hover:ring-[var(--th-text-muted)]"
                            )}
                        >
                            <span
                                className="h-10 w-10 rounded-full border border-black/10"
                                style={{ backgroundColor: color.value }}
                            />
                        </span>
                        <span
                            className={cn(
                                "text-xs transition-colors duration-200",
                                colorId === color.id
                                    ? "font-medium text-[var(--color-accent-light)]"
                                    : "text-[var(--th-text-tertiary)] group-hover:text-[rgb(var(--th-text))]"
                            )}
                            style={{ fontFamily: "var(--font-barlow)" }}
                        >
                            {color.name}
                        </span>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default ColorStep;
