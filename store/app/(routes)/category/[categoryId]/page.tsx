import getCategory from "@/actions/get-category";
import getColors from "@/actions/get-colors";
import getProducts from "@/actions/get-products";
import getSizes from "@/actions/get-sizes";
import CategoryHero from "./components/category-hero";
import Filter from "./components/filter";
import ProductGrid from "./components/product-grid";
import MobileFilters from "./components/mobile-filters";
import CategorySchema from "@/components/schema/category-schema";
import type { Metadata } from "next";

export const revalidate = 3600;

type Params = Promise<{ categoryId: string }>
type SearchParams = Promise<{ colorId: string, sizeId: string }>

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
    const { categoryId } = await params;
    const isAll = categoryId === "all";

    if (isAll) {
        return {
            title: "Toate Produsele — Mascare Calorifere",
            description: "Descoperă întreaga colecție de mascare calorifere din lemn masiv LemnArt. Filtrează după dimensiune și culoare.",
            alternates: { canonical: "/category/all" },
        };
    }

    const category = await getCategory(categoryId);
    const name = category?.name || "Colecție";

    return {
        title: `Colecția ${name} — Mascare Calorifere`,
        description: `Explorează mascările calorifere din colecția ${name}. Lemn masiv, design premium, montaj inclus.`,
        alternates: { canonical: `/category/${categoryId}` },
    };
}

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
            <CategorySchema category={category} products={products} isAll={isAll} />
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
