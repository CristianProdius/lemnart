"use client";

import { Product } from "@/types";
import Gallery from "@/components/gallery";
import Info from "@/components/info";
import { useProductColorGallery } from "@/hooks/use-product-color-gallery";

interface ProductGalleryAndInfoProps {
    product: Product;
    layout?: "page" | "modal";
}

const ProductGalleryAndInfo: React.FC<ProductGalleryAndInfoProps> = ({ product, layout = "page" }) => {
    const { selectedColorId, setSelectedColorId, displayImages } = useProductColorGallery(product);

    if (layout === "modal") {
        return (
            <div className="grid w-full grid-cols-1 items-start gap-x-8 gap-y-8 sm:grid-cols-12 lg:gap-x-10">
                <div className="sm:col-span-5">
                    <Gallery key={`${product.id}:${selectedColorId ?? "__all__"}`} images={displayImages} productName={product.name} />
                </div>
                <div className="sm:col-span-7">
                    <Info data={product} selectedColorId={selectedColorId} onSelectColor={setSelectedColorId} />
                </div>
            </div>
        );
    }

    return (
        <div className="lg:grid lg:grid-cols-2 lg:items-start lg:gap-x-16">
            <Gallery key={`${product.id}:${selectedColorId ?? "__all__"}`} images={displayImages} productName={product.name} />
            <div className="mt-10 lg:mt-0">
                <Info data={product} selectedColorId={selectedColorId} onSelectColor={setSelectedColorId} />
            </div>
        </div>
    );
};

export default ProductGalleryAndInfo;
