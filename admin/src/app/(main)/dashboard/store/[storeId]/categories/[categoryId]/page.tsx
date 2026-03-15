import prismadb from "@/lib/prismadb";
import { CategoryForm } from "./_components/category-form";

const CategoryPage = async ({ params }: { params: Promise<{ categoryId: string, storeId: string }> }) => {
    const { categoryId, storeId } = await params;
    const category = await prismadb.category.findUnique({ where: { id: categoryId } });
    const billboards = await prismadb.billboard.findMany({ where: { storeId } });

    return (
        <div className="space-y-4">
            <CategoryForm billboards={billboards} initialData={category} />
        </div>
    )
}

export default CategoryPage;
