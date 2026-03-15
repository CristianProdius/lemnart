"use client"

import { Product } from "@/types";
import NoResults from "@/components/ui/no-results";
import ProductCard from "@/components/ui/product-card";
import { useStaggerAnimation } from "@/hooks/use-stagger-animation";

interface ProductListProps {
    title: string;
    items: Product[];
}

const ProductList: React.FC<ProductListProps> = ({ title, items }) => {
    const gridRef = useStaggerAnimation<HTMLDivElement>({
        stagger: 0.1,
        y: 30,
    });

    return (
        <div className="space-y-8">
            {title && (
                <h3
                    className="text-2xl font-bold tracking-tight text-[rgb(var(--th-text))] md:text-3xl"
                    style={{ fontFamily: "var(--font-barlow)" }}
                >
                    {title}
                </h3>
            )}
            {items?.length === 0 && <NoResults />}
            <div
                ref={gridRef}
                className="grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
            >
                {items.map(item => (
                    <div key={item.id}>
                        <ProductCard data={item} />
                    </div>
                ))}
            </div>
        </div>
     );
}

export default ProductList;
