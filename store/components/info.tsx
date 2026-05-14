"use client"

import { Product } from "@/types";
import Currency from "@/components/ui/currency";
import { ShoppingCart, Sliders } from "lucide-react";
import useCart from "@/hooks/use-cart";
import Link from "next/link";

interface InfoProps {
    data: Product;
    selectedColorId: string | null;
    onSelectColor: (colorId: string) => void;
}

const Info: React.FC<InfoProps> = ({ data, selectedColorId, onSelectColor }) => {
    const cart = useCart();
    const selectedColor = data.colors.find((c) => c.id === selectedColorId) ?? data.colors[0];

    return (
        <div>
            {/* Category */}
            <p
                className="text-xs font-medium uppercase tracking-[0.3em] text-[var(--color-accent-light)]"
                style={{ fontFamily: "var(--font-barlow)" }}
            >
                {data?.category?.name}
            </p>

            {/* Product name */}
            <h1
                className="mt-4 text-4xl text-[rgb(var(--th-text))] md:text-5xl"
                style={{
                    fontFamily: "var(--font-instrument-serif)",
                    fontStyle: "italic",
                }}
            >
                {data.name}
            </h1>

            {/* Price */}
            <div className="mt-6 text-2xl tabular-nums text-[var(--color-accent-light)]">
                <Currency value={data?.price} />
            </div>

            {/* Divider */}
            <div className="my-8 h-px bg-[var(--th-border)]" />

            {/* Specs */}
            <div className="space-y-5">
                <div className="flex items-center gap-x-4">
                    <span
                        className="text-xs font-medium uppercase tracking-[0.2em] text-[var(--th-text-tertiary)]"
                        style={{ fontFamily: "var(--font-barlow)" }}
                    >
                        Dimensiune
                    </span>
                    <span
                        className="text-sm text-[var(--th-text-secondary)]"
                        style={{ fontFamily: "var(--font-barlow)" }}
                    >
                        {data?.size?.value}
                    </span>
                </div>
                <div className="flex items-center gap-x-4">
                    <span
                        className="text-xs font-medium uppercase tracking-[0.2em] text-[var(--th-text-tertiary)]"
                        style={{ fontFamily: "var(--font-barlow)" }}
                    >
                        Culoare
                    </span>
                    <div className="flex items-center gap-2 flex-wrap">
                        {data.colors.map((color) => {
                            const isActive = color.id === selectedColor?.id;
                            return (
                                <button
                                    key={color.id}
                                    type="button"
                                    onClick={() => onSelectColor(color.id)}
                                    aria-label={`Selectează culoarea ${color.name}`}
                                    aria-pressed={isActive}
                                    className={`flex items-center gap-2 px-2 py-1 rounded-full border transition ${isActive ? "border-[var(--color-accent-light)] bg-[var(--color-accent-light)]/10" : "border-[var(--th-text-muted)] hover:border-[var(--color-accent-light)]"}`}
                                >
                                    <span
                                        className="h-5 w-5 rounded-full border border-[var(--th-text-muted)]"
                                        style={{ backgroundColor: color.value }}
                                    />
                                    <span
                                        className="text-sm text-[var(--th-text-secondary)]"
                                        style={{ fontFamily: "var(--font-barlow)" }}
                                    >
                                        {color.name}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Add to cart */}
            <button
                onClick={() => cart.addItem({ ...data, selectedColorId: selectedColor?.id ?? null })}
                className="mt-10 flex w-full items-center justify-center gap-3 bg-[var(--color-accent-light)] px-8 py-4 text-sm font-semibold text-[var(--th-btn-inverse-text)] transition-all duration-200 hover:bg-[var(--color-accent)] sm:w-auto"
                style={{ fontFamily: "var(--font-barlow)" }}
            >
                Adaugă în coș
                <ShoppingCart size={18} />
            </button>

            {/* Customize */}
            <Link
                href={`/configurator?style=${data?.category?.id}${selectedColor ? `&color=${selectedColor.id}` : ""}`}
                className="mt-4 flex w-full items-center justify-center gap-3 border border-[var(--color-accent-light)] px-8 py-4 text-sm font-semibold text-[var(--color-accent-light)] transition-all duration-200 hover:bg-[var(--color-accent-light)] hover:text-[var(--th-btn-inverse-text)] sm:w-auto"
                style={{ fontFamily: "var(--font-barlow)" }}
            >
                Personalizează
                <Sliders size={18} />
            </Link>
        </div>
    );
}

export default Info;
