import getProduct from "@/actions/get-product";
import getProducts from "@/actions/get-products";
import ProductList from "@/components/product-list";
import ProductSchema from "@/components/schema/product-schema";
import Breadcrumb from "@/components/ui/breadcrumb";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ProductDetail from "./_components/product-detail";

type Params = Promise<{ productId: string }>

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
    const { productId } = await params;
    const product = await getProduct(productId);

    if (!product) return { title: "Produs negăsit" };

    const colorNames = product.colors.map((c) => c.name).join(", ") || "diverse";
    const title = `${product.name} — Mascare Calorifer`;
    const description = `${product.name} — mascare calorifer din lemn masiv. Dimensiune: ${product.size?.value}. Culori: ${colorNames}. Design premium, montaj inclus.`;
    const imageUrl = product.images?.[0]?.url;

    return {
        title,
        description,
        openGraph: {
            title,
            description,
            images: imageUrl ? [{ url: imageUrl }] : [],
            type: "website",
        },
        alternates: {
            canonical: `/product/${productId}`,
        },
    };
}

const ProductPage = async ({ params }: { params: Params }) => {
    const { productId } = await params;
    const product = await getProduct(productId);
    if (!product) notFound();

    const suggestProducts = await getProducts({ categoryId: product.category?.id });

    return (
        <div className="bg-[var(--th-surface)]">
            <ProductSchema product={product} />
            {/* Product section */}
            <div className="mx-auto max-w-7xl px-6 py-12 md:py-20">
                {/* Breadcrumb */}
                <Breadcrumb
                    className="mb-10"
                    items={[
                        { label: "Acasă", href: "/" },
                        { label: product.category?.name ?? "", href: `/category/${product.category?.id}` },
                        { label: product.name },
                    ]}
                />

                <ProductDetail product={product} />

                {/* Divider */}
                <div className="my-16 h-px bg-[var(--th-border)] md:my-24" />

                {/* Related products */}
                <ProductList title="Produse Similare" items={suggestProducts} />
            </div>
        </div>
    );
}

export default ProductPage;
