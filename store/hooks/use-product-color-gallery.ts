import { useState, useMemo } from "react";
import { Product } from "@/types";

export function useProductColorGallery(product: Product) {
    const initial = product.colors[0]?.id ?? null;
    const [selectedColorId, setSelectedColorId] = useState<string | null>(initial);

    const displayImages = useMemo(() => {
        const filtered = product.images.filter(
            (img) => img.colorId === selectedColorId || img.colorId === null
        );
        return filtered.length > 0 ? filtered : product.images;
    }, [product.images, selectedColorId]);

    return { selectedColorId, setSelectedColorId, displayImages };
}
