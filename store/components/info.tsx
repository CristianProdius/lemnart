"use client"

import { Product } from "@/types";
import Currency from "@/components/ui/currency";
import { ShoppingCart } from "lucide-react";
import useCart from "@/hooks/use-cart";

interface InfoProps {
    data: Product;
}

const Info: React.FC<InfoProps> = ({ data }) => {
    const cart = useCart();

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
                className="mt-4 text-4xl text-white md:text-5xl"
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
            <div className="my-8 h-px bg-white/10" />

            {/* Specs */}
            <div className="space-y-5">
                <div className="flex items-center gap-x-4">
                    <span
                        className="text-xs font-medium uppercase tracking-[0.2em] text-white/40"
                        style={{ fontFamily: "var(--font-barlow)" }}
                    >
                        Dimensiune
                    </span>
                    <span
                        className="text-sm text-white/80"
                        style={{ fontFamily: "var(--font-barlow)" }}
                    >
                        {data?.size?.value}
                    </span>
                </div>
                <div className="flex items-center gap-x-4">
                    <span
                        className="text-xs font-medium uppercase tracking-[0.2em] text-white/40"
                        style={{ fontFamily: "var(--font-barlow)" }}
                    >
                        Culoare
                    </span>
                    <div className="flex items-center gap-2">
                        <span
                            className="h-5 w-5 rounded-full border border-white/20"
                            style={{ backgroundColor: data?.color?.value }}
                        />
                        <span
                            className="text-sm text-white/80"
                            style={{ fontFamily: "var(--font-barlow)" }}
                        >
                            {data?.color?.name}
                        </span>
                    </div>
                </div>
            </div>

            {/* Add to cart */}
            <button
                onClick={() => cart.addItem(data)}
                className="mt-10 flex w-full items-center justify-center gap-3 bg-[var(--color-accent-light)] px-8 py-4 text-sm font-semibold text-[#1A1A1A] transition-all duration-200 hover:bg-[var(--color-accent)] sm:w-auto"
                style={{ fontFamily: "var(--font-barlow)" }}
            >
                Adaugă în coș
                <ShoppingCart size={18} />
            </button>
        </div>
    );
}

export default Info;
