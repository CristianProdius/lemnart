import getProduct from "@/actions/get-product";
import getProducts from "@/actions/get-products";
import Gallery from "@/components/gallery";
import Info from "@/components/info";
import ProductList from "@/components/product-list";

type Params = Promise<{ productId: string }>

const ProductPage = async ({ params }: { params: Params }) => {
    const { productId } = await params;
    const product = await getProduct(productId);
    const suggestProducts = await getProducts({ categoryId: product?.category?.id })

    return (
        <div className="bg-[var(--th-surface)]">
            {/* Product section */}
            <div className="mx-auto max-w-7xl px-6 py-12 md:py-20">
                {/* Breadcrumb */}
                <p
                    className="mb-10 text-xs font-medium uppercase tracking-[0.3em] text-[var(--color-accent-light)]"
                    style={{ fontFamily: "var(--font-barlow)" }}
                >
                    Acasă
                    <span className="mx-2 text-[var(--th-text-muted)]">/</span>
                    {product?.category?.name}
                    <span className="mx-2 text-[var(--th-text-muted)]">/</span>
                    <span className="text-[var(--th-text-tertiary)]">{product.name}</span>
                </p>

                <div className="lg:grid lg:grid-cols-2 lg:items-start lg:gap-x-16">
                    {/* Gallery */}
                    <Gallery images={product.images} />
                    <div className="mt-10 lg:mt-0">
                        {/* Info */}
                        <Info data={product} />
                    </div>
                </div>

                {/* Divider */}
                <div className="my-16 h-px bg-[var(--th-border)] md:my-24" />

                {/* Related products */}
                <ProductList title="Produse Similare" items={suggestProducts} />
            </div>
        </div>
    );
}

export default ProductPage;
