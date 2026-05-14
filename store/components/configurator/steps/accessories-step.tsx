"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";
import { ConfigAccessory } from "@/types";
import useConfigurator from "@/hooks/use-configurator";

interface AccessoriesStepProps {
    accessories: ConfigAccessory[];
}

const AccessoriesStep: React.FC<AccessoriesStepProps> = ({ accessories }) => {
    const { accessoryIds, toggleAccessory } = useConfigurator();

    if (accessories.length === 0) {
        return (
            <div>
                <p
                    className="mb-4 text-xs font-medium uppercase tracking-[0.2em] text-[var(--th-text-tertiary)]"
                    style={{ fontFamily: "var(--font-barlow)" }}
                >
                    Accesorii
                </p>
                <p
                    className="text-sm text-[var(--th-text-muted)]"
                    style={{ fontFamily: "var(--font-barlow)" }}
                >
                    Nu sunt accesorii disponibile.
                </p>
            </div>
        );
    }

    return (
        <div>
            <p
                className="mb-4 text-xs font-medium uppercase tracking-[0.2em] text-[var(--th-text-tertiary)]"
                style={{ fontFamily: "var(--font-barlow)" }}
            >
                Accesorii
            </p>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {accessories.map((accessory) => {
                    const isSelected = accessoryIds.includes(accessory.id);
                    const price = Number(accessory.price);

                    return (
                        <button
                            key={accessory.id}
                            onClick={() => toggleAccessory(accessory.id)}
                            className={cn(
                                "group relative flex flex-col overflow-hidden text-left transition-all duration-200",
                                isSelected
                                    ? "border-2 border-[var(--color-accent-light)] bg-[var(--th-btn-inverse-bg)]"
                                    : "border border-[var(--th-border-strong)] hover:border-[var(--th-text-muted)]"
                            )}
                        >
                            {/* Checkbox indicator */}
                            <div
                                className={cn(
                                    "absolute right-3 top-3 z-10 flex h-5 w-5 items-center justify-center border transition-all duration-200",
                                    isSelected
                                        ? "border-[var(--color-accent-light)] bg-[var(--color-accent-light)]"
                                        : "border-[var(--th-border-strong)] bg-transparent"
                                )}
                            >
                                {isSelected && (
                                    <svg
                                        className="h-3 w-3 text-[var(--th-btn-inverse-text)]"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        strokeWidth={3}
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M5 13l4 4L19 7"
                                        />
                                    </svg>
                                )}
                            </div>

                            {accessory.previewUrl && (
                                <div className="relative aspect-[4/3] w-full overflow-hidden bg-[var(--th-bg-secondary)]">
                                    <Image
                                        src={accessory.previewUrl}
                                        alt={accessory.name}
                                        fill
                                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                                    />
                                </div>
                            )}
                            <div className="flex items-center justify-between p-4">
                                <span
                                    className={cn(
                                        "text-sm font-medium",
                                        isSelected
                                            ? "text-[var(--th-btn-inverse-text)]"
                                            : "text-[rgb(var(--th-text))]"
                                    )}
                                    style={{ fontFamily: "var(--font-barlow)" }}
                                >
                                    {accessory.name}
                                </span>
                                <span
                                    className={cn(
                                        "text-xs",
                                        isSelected
                                            ? "text-[var(--th-btn-inverse-text)]/70"
                                            : "text-[var(--color-accent-light)]"
                                    )}
                                    style={{ fontFamily: "var(--font-barlow)" }}
                                >
                                    +{price} RON
                                </span>
                            </div>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default AccessoriesStep;
