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
}

const ProductCard: React.FC<ProductCardProps> = ({ data }) => {
    const cart = useCart();
    const previewModal = usePreviewModal();
    const router = useRouter();

    const handleClick = () => {
        router.push(`/product/${data?.id}`)
    }

    const onPreview: MouseEventHandler<HTMLButtonElement> = (event) => {
        event.stopPropagation();
        previewModal.onOpen(data);
    }

    const onAddToCart: MouseEventHandler<HTMLButtonElement> = (event) => {
        event.stopPropagation();
        cart.addItem({ ...data, selectedColorId: data.colors[0]?.id ?? null });
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
                <div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/20" />

                {/* Action buttons */}
                <div className="absolute bottom-4 right-4 flex gap-2 opacity-0 transition-all duration-300 group-hover:opacity-100">
                    <button
                        onClick={onPreview}
                        className="flex size-10 items-center justify-center rounded-full border border-[var(--th-border)] bg-[var(--th-overlay)] backdrop-blur-sm transition hover:scale-110 hover:border-[var(--color-accent-light)] hover:bg-[var(--color-accent-light)]/10"
                        aria-label={`Previzualizare ${data.name}`}
                    >
                        <Expand size={16} className="text-[rgb(var(--th-text))]" />
                    </button>
                    <button
                        onClick={onAddToCart}
                        className="flex size-10 items-center justify-center rounded-full border border-[var(--th-border)] bg-[var(--th-overlay)] backdrop-blur-sm transition hover:scale-110 hover:border-[var(--color-accent-light)] hover:bg-[var(--color-accent-light)]/10"
                        aria-label={`Adaugă ${data.name} în coș`}
                    >
                        <ShoppingCart size={16} className="text-[rgb(var(--th-text))]" />
                    </button>
                </div>
            </div>

            {/* Meta */}
            <div className="mt-4">
                <p className="text-xs uppercase tracking-[0.15em] text-[var(--th-text-muted)]">
                    {data.category?.name}
                </p>
                <h3
                    className="mt-1 text-base font-medium text-[var(--th-text-secondary)]"
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
