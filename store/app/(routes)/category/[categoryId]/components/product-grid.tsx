"use client"

import { Product } from "@/types"
import ProductCard from "@/components/ui/product-card"
import { useStaggerAnimation } from "@/hooks/use-stagger-animation"

interface ProductGridProps {
    items: Product[]
}

const ProductGrid: React.FC<ProductGridProps> = ({ items }) => {
    const gridRef = useStaggerAnimation<HTMLDivElement>({
        stagger: 0.08,
        y: 40,
        start: "top 90%",
    })

    if (items.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-center">
                <p
                    className="text-xs font-medium uppercase tracking-[0.3em] text-[var(--th-text-muted)]"
                    style={{ fontFamily: "var(--font-barlow)" }}
                >
                    Nu s-au găsit rezultate
                </p>
                <p className="mt-3 text-sm text-[var(--th-text-muted)]">
                    Încercați să modificați filtrele.
                </p>
            </div>
        )
    }

    return (
        <div
            ref={gridRef}
            className="grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
        >
            {items.map((item) => (
                <div key={item.id}>
                    <ProductCard data={item} />
                </div>
            ))}
        </div>
    )
}

export default ProductGrid
