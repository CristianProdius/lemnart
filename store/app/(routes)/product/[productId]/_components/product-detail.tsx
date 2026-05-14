"use client";

import { Product } from "@/types";
import Gallery from "@/components/gallery";
import Info from "@/components/info";
import { useProductColorGallery } from "@/hooks/use-product-color-gallery";

interface ProductDetailProps {
    product: Product;
}

const ProductDetail: React.FC<ProductDetailProps> = ({ product }) => {
    const { selectedColorId, setSelectedColorId, displayImages } = useProductColorGallery(product);

    return (
        <div className="lg:grid lg:grid-cols-2 lg:items-start lg:gap-x-16">
            <Gallery key={`${product.id}:${selectedColorId ?? "__all__"}`} images={displayImages} productName={product.name} />
            <div className="mt-10 lg:mt-0">
                <Info
                    data={product}
                    selectedColorId={selectedColorId}
                    onSelectColor={setSelectedColorId}
                />
            </div>
        </div>
    );
};

export default ProductDetail;
