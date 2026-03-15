"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";
import { ConfigStyle } from "@/types";
import useConfigurator from "@/hooks/use-configurator";

interface StyleStepProps {
    styles: ConfigStyle[];
}

const StyleStep: React.FC<StyleStepProps> = ({ styles }) => {
    const { styleId, setStyleId } = useConfigurator();

    return (
        <div>
            <p
                className="mb-4 text-xs font-medium uppercase tracking-[0.2em] text-[var(--th-text-tertiary)]"
                style={{ fontFamily: "var(--font-barlow)" }}
            >
                Alege stilul
            </p>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {styles.map((style) => (
                    <button
                        key={style.id}
                        onClick={() => setStyleId(style.id)}
                        className={cn(
                            "group flex flex-col overflow-hidden text-left transition-all duration-200",
                            styleId === style.id
                                ? "border-2 border-[var(--color-accent-light)] bg-[var(--th-btn-inverse-bg)]"
                                : "border border-[var(--th-border-strong)] hover:border-[var(--th-text-muted)]"
                        )}
                    >
                        {style.previewUrl && (
                            <div className="relative aspect-[4/3] w-full overflow-hidden bg-[var(--th-bg-secondary)]">
                                <Image
                                    src={style.previewUrl}
                                    alt={style.name}
                                    fill
                                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                                />
                            </div>
                        )}
                        <div className="flex flex-col gap-1 p-4">
                            <span
                                className={cn(
                                    "text-sm font-medium",
                                    styleId === style.id
                                        ? "text-[var(--th-btn-inverse-text)]"
                                        : "text-[rgb(var(--th-text))]"
                                )}
                                style={{ fontFamily: "var(--font-barlow)" }}
                            >
                                {style.name}
                            </span>
                            {style.description && (
                                <span
                                    className={cn(
                                        "text-xs leading-relaxed",
                                        styleId === style.id
                                            ? "text-[var(--th-btn-inverse-text)]/70"
                                            : "text-[var(--th-text-tertiary)]"
                                    )}
                                    style={{ fontFamily: "var(--font-barlow)" }}
                                >
                                    {style.description}
                                </span>
                            )}
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default StyleStep;
