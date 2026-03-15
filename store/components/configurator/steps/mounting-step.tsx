"use client";

import { cn } from "@/lib/utils";
import { MountingType } from "@/types";
import useConfigurator from "@/hooks/use-configurator";

interface MountingStepProps {
    types: MountingType[];
}

const MountingStep: React.FC<MountingStepProps> = ({ types }) => {
    const { mountingId, setMountingId } = useConfigurator();

    return (
        <div>
            <p
                className="mb-4 text-xs font-medium uppercase tracking-[0.2em] text-[var(--th-text-tertiary)]"
                style={{ fontFamily: "var(--font-barlow)" }}
            >
                Tip montare
            </p>
            <div className="flex flex-wrap gap-3">
                {types.map((type) => {
                    const modifier = Number(type.priceModifier);
                    const isActive = mountingId === type.id;

                    return (
                        <button
                            key={type.id}
                            onClick={() => setMountingId(type.id)}
                            className={cn(
                                "flex flex-col items-center gap-1 px-6 py-3 text-sm transition-all duration-200",
                                isActive
                                    ? "bg-[var(--th-btn-inverse-bg)] text-[var(--th-btn-inverse-text)]"
                                    : "border border-[var(--th-border-strong)] text-[var(--th-text-tertiary)] hover:border-[var(--th-text-muted)] hover:text-[rgb(var(--th-text))]"
                            )}
                            style={{ fontFamily: "var(--font-barlow)" }}
                        >
                            <span className="font-medium">{type.name}</span>
                            {modifier > 0 && (
                                <span
                                    className={cn(
                                        "text-xs",
                                        isActive
                                            ? "opacity-70"
                                            : "text-[var(--color-accent-light)]"
                                    )}
                                >
                                    +{modifier} RON
                                </span>
                            )}
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default MountingStep;
