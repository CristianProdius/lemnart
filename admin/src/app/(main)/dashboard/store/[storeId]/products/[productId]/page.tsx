import prismadb from "@/lib/prismadb";
import { ProductForm } from "./_components/product-form";

const ProductPage = async ({ params }: { params: Promise<{ productId: string, storeId: string }> }) => {
    const { storeId, productId } = await params;

    const product = await prismadb.product.findUnique({
        where: { id: productId },
        include: {
            images: { include: { color: true } },
            productColors: { include: { color: true } },
        },
    });

    const initialData = product
        ? {
            ...product,
            colors: product.productColors.map((pc) => pc.color),
            images: product.images.map((img) => ({ id: img.id, url: img.url, colorId: img.colorId })),
        }
        : null;

    const categories = await prismadb.category.findMany({ where: { storeId } })
    const sizes = await prismadb.size.findMany({ where: { storeId } })
    const colors = await prismadb.color.findMany({ where: { storeId } })

    return (
        <div className="space-y-4">
            <ProductForm initialData={initialData} colors={colors} sizes={sizes} categories={categories} />
        </div>
    )
}

export default ProductPage;
