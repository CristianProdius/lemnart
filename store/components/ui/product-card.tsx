"use client"

import { Product } from "@/types";
import Image from "next/image";
import { Expand, ShoppingCart } from "lucide-react";
import Currency from "@/components/ui/currency";
import { useRouter } from "next/navigation";
import usePreviewModal from "@/hooks/use-preview-modal";
import { MouseEventHandler } from 'react';
import useCart from "@/hooks/use-cart";

interface ProductCardProps {
    data: Product;
    variant?: "light" | "dark";
}

const ProductCard: React.FC<ProductCardProps> = ({ data, variant = "light" }) => {
    const cart = useCart();
    const previewModal = usePreviewModal();
    const router = useRouter();
    const isDark = variant === "dark";

    const handleClick = () => {
        router.push(`/product/${data?.id}`)
    }

    const onPreview: MouseEventHandler<HTMLButtonElement> = (event) => {
        event.stopPropagation();
        previewModal.onOpen(data);
    }

    const onAddToCart: MouseEventHandler<HTMLButtonElement> = (event) => {
        event.stopPropagation();
        cart.addItem(data);
    }

    return (
        <div onClick={handleClick} className="group cursor-pointer">
            {/* Image */}
            <div className="relative aspect-[3/4] overflow-hidden bg-[var(--color-muted)]">
                <Image
                    fill
                    src={data?.images?.[0]?.url}
                    alt={data.name}
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />

                {/* Hover overlay */}
                <div className={`absolute inset-0 transition-colors duration-300 ${isDark ? "bg-black/0 group-hover:bg-black/20" : "bg-black/0 group-hover:bg-black/5"}`} />

                {/* Action buttons */}
                <div className="absolute bottom-4 right-4 flex gap-2 opacity-0 transition-all duration-300 group-hover:opacity-100">
                    <button
                        onClick={onPreview}
                        className={`flex h-10 w-10 items-center justify-center rounded-full backdrop-blur-sm transition hover:scale-110 ${isDark ? "bg-white/[0.07] border border-white/10 hover:border-[var(--color-accent-light)] hover:bg-[var(--color-accent-light)]/10" : "bg-white/90 shadow-sm hover:bg-white"}`}
                    >
                        <Expand size={16} className={isDark ? "text-white" : "text-[#1A1A1A]"} />
                    </button>
                    <button
                        onClick={onAddToCart}
                        className={`flex h-10 w-10 items-center justify-center rounded-full backdrop-blur-sm transition hover:scale-110 ${isDark ? "bg-white/[0.07] border border-white/10 hover:border-[var(--color-accent-light)] hover:bg-[var(--color-accent-light)]/10" : "bg-white/90 shadow-sm hover:bg-white"}`}
                    >
                        <ShoppingCart size={16} className={isDark ? "text-white" : "text-[#1A1A1A]"} />
                    </button>
                </div>
            </div>

            {/* Meta */}
            <div className="mt-4">
                <p className={`text-xs uppercase tracking-[0.15em] ${isDark ? "text-white/30" : "text-[#1A1A1A]/40"}`}>
                    {data.category?.name}
                </p>
                <h3
                    className={`mt-1 text-base font-medium ${isDark ? "text-white/90" : "text-[#1A1A1A]"}`}
                    style={{ fontFamily: "var(--font-barlow)" }}
                >
                    {data.name}
                </h3>
                <div className="mt-2 text-sm tabular-nums text-[var(--color-accent-light)]">
                    <Currency value={data?.price} />
                </div>
            </div>
        </div>
    );
}

export default ProductCard;
