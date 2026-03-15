import getCategory from "@/actions/get-category";
import getColors from "@/actions/get-colors";
import getProducts from "@/actions/get-products";
import getSizes from "@/actions/get-sizes";
import CategoryHero from "./components/category-hero";
import Filter from "./components/filter";
import ProductGrid from "./components/product-grid";
import MobileFilters from "./components/mobile-filters";

export const revalidate = 0;

type Params = Promise<{ categoryId: string }>
type SearchParams = Promise<{ colorId: string, sizeId: string }>

const CategoryPage = async ({ params, searchParams }: { params: Params, searchParams: SearchParams }) => {
    const { categoryId } = await params;
    const { colorId, sizeId } = await searchParams;

    const isAll = categoryId === "all";

    const products = await getProducts({
        categoryId: isAll ? undefined : categoryId,
        colorId,
        sizeId,
    })
    const sizes = await getSizes();
    const colors = await getColors();
    const category = isAll ? null : await getCategory(categoryId);

    return (
        <div className="bg-[var(--th-surface)]">
            {/* Hero */}
            <CategoryHero
                name={isAll ? "Toate Produsele" : category?.name ?? ""}
                billboard={category?.billboard}
                productCount={products?.length ?? 0}
            />

            {/* Filters + Products */}
            <div className="mx-auto max-w-7xl px-6 py-12 md:py-16">
                {/* Filter bar */}
                <div className="mb-12 flex flex-wrap items-end gap-8 border-b border-[var(--th-border)] pb-8">
                    {/* Mobile trigger */}
                    <MobileFilters sizes={sizes} colors={colors} />
                    {/* Desktop filters */}
                    <div className="hidden items-end gap-8 lg:flex">
                        <Filter valueKey="sizeId" name="Dimensiune" data={sizes} />
                        <div className="mb-2 h-8 w-px bg-[var(--th-border)]" />
                        <Filter valueKey="colorId" name="Culoare" data={colors} />
                    </div>
                </div>

                {/* Product grid */}
                <ProductGrid items={products ?? []} />
            </div>
        </div>
    );
}

export default CategoryPage;
