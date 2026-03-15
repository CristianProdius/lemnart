"use client";

import { cn } from "@/lib/utils";
import useConfigurator from "@/hooks/use-configurator";

const MIN_SECTIONS = 1;
const MAX_SECTIONS = 5;

const SectionsStep = () => {
    const { sections, setSections } = useConfigurator();

    const decrement = () => {
        if (sections > MIN_SECTIONS) setSections(sections - 1);
    };

    const increment = () => {
        if (sections < MAX_SECTIONS) setSections(sections + 1);
    };

    return (
        <div>
            <p
                className="mb-4 text-xs font-medium uppercase tracking-[0.2em] text-[var(--th-text-tertiary)]"
                style={{ fontFamily: "var(--font-barlow)" }}
            >
                Număr secțiuni
            </p>
            <div className="flex items-center gap-1">
                <button
                    onClick={decrement}
                    disabled={sections <= MIN_SECTIONS}
                    className={cn(
                        "flex h-12 w-12 items-center justify-center border text-lg transition-all duration-200",
                        sections <= MIN_SECTIONS
                            ? "cursor-not-allowed border-[var(--th-border-strong)] text-[var(--th-text-muted)] opacity-50"
                            : "border-[var(--th-border-strong)] text-[var(--th-text-tertiary)] hover:border-[var(--th-text-muted)] hover:text-[rgb(var(--th-text))]"
                    )}
                    style={{ fontFamily: "var(--font-barlow)" }}
                >
                    &minus;
                </button>
                <div
                    className="flex h-12 w-16 items-center justify-center border border-[var(--th-border-strong)] bg-[var(--th-bg-secondary)] text-lg font-medium text-[rgb(var(--th-text))]"
                    style={{ fontFamily: "var(--font-barlow)" }}
                >
                    {sections}
                </div>
                <button
                    onClick={increment}
                    disabled={sections >= MAX_SECTIONS}
                    className={cn(
                        "flex h-12 w-12 items-center justify-center border text-lg transition-all duration-200",
                        sections >= MAX_SECTIONS
                            ? "cursor-not-allowed border-[var(--th-border-strong)] text-[var(--th-text-muted)] opacity-50"
                            : "border-[var(--th-border-strong)] text-[var(--th-text-tertiary)] hover:border-[var(--th-text-muted)] hover:text-[rgb(var(--th-text))]"
                    )}
                    style={{ fontFamily: "var(--font-barlow)" }}
                >
                    +
                </button>
            </div>
            <p
                className="mt-3 text-xs text-[var(--th-text-muted)]"
                style={{ fontFamily: "var(--font-barlow)" }}
            >
                Minim {MIN_SECTIONS}, maxim {MAX_SECTIONS} secțiuni
            </p>
        </div>
    );
};

export default SectionsStep;
