import prismadb from "@/lib/prismadb";
import { ProductForm } from "./_components/product-form";

const ProductPage = async ({ params }: { params: Promise<{ productId: string, storeId: string }> }) => {
    const { storeId, productId } = await params;
    const product = await prismadb.product.findUnique({
        where: { id: productId },
        include: { images: true }
    });

    const categories = await prismadb.category.findMany({ where: { storeId } })
    const sizes = await prismadb.size.findMany({ where: { storeId } })
    const colors = await prismadb.color.findMany({ where: { storeId } })

    return (
        <div className="space-y-4">
            <ProductForm initialData={product} colors={colors} sizes={sizes} categories={categories} />
        </div>
    )
}

export default ProductPage;
