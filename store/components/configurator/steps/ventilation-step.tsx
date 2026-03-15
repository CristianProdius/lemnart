"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";
import { VentilationPattern } from "@/types";
import useConfigurator from "@/hooks/use-configurator";

interface VentilationStepProps {
    patterns: VentilationPattern[];
}

const VentilationStep: React.FC<VentilationStepProps> = ({ patterns }) => {
    const { ventilationId, setVentilationId } = useConfigurator();

    return (
        <div>
            <p
                className="mb-4 text-xs font-medium uppercase tracking-[0.2em] text-[var(--th-text-tertiary)]"
                style={{ fontFamily: "var(--font-barlow)" }}
            >
                Model ventilație
            </p>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {patterns.map((pattern) => {
                    const modifier = Number(pattern.priceModifier);
                    const isActive = ventilationId === pattern.id;

                    return (
                        <button
                            key={pattern.id}
                            onClick={() => setVentilationId(pattern.id)}
                            className={cn(
                                "group flex flex-col overflow-hidden text-left transition-all duration-200",
                                isActive
                                    ? "border-2 border-[var(--color-accent-light)] bg-[var(--th-btn-inverse-bg)]"
                                    : "border border-[var(--th-border-strong)] hover:border-[var(--th-text-muted)]"
                            )}
                        >
                            {pattern.previewUrl && (
                                <div className="relative aspect-[4/3] w-full overflow-hidden bg-[var(--th-bg-secondary)]">
                                    <Image
                                        src={pattern.previewUrl}
                                        alt={pattern.name}
                                        fill
                                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                                    />
                                </div>
                            )}
                            <div className="flex items-center justify-between p-4">
                                <span
                                    className={cn(
                                        "text-sm font-medium",
                                        isActive
                                            ? "text-[var(--th-btn-inverse-text)]"
                                            : "text-[rgb(var(--th-text))]"
                                    )}
                                    style={{ fontFamily: "var(--font-barlow)" }}
                                >
                                    {pattern.name}
                                </span>
                                {modifier > 0 && (
                                    <span
                                        className={cn(
                                            "text-xs",
                                            isActive
                                                ? "text-[var(--th-btn-inverse-text)]/70"
                                                : "text-[var(--color-accent-light)]"
                                        )}
                                        style={{
                                            fontFamily: "var(--font-barlow)",
                                        }}
                                    >
                                        +{modifier} RON
                                    </span>
                                )}
                            </div>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default VentilationStep;
