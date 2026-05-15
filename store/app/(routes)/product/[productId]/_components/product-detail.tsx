"use client";

import { Product } from "@/types";
import ProductGalleryAndInfo from "@/components/product-gallery-and-info";

interface ProductDetailProps {
    product: Product;
}

const ProductDetail: React.FC<ProductDetailProps> = ({ product }) => (
    <ProductGalleryAndInfo product={product} layout="page" />
);

export default ProductDetail;
