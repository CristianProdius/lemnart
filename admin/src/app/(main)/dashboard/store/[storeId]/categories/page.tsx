import { format } from 'date-fns'
import prismadb from '@/lib/prismadb'
import { CategoryClient } from './_components/client'
import { CategoryColumn } from './_components/columns'

const CategoriesPage = async ({ params }: { params: Promise<{ storeId: string }> }) => {
    const { storeId } = await params;
    const categories = await prismadb.category.findMany({
        where: { storeId },
        include: { billboard: true },
        orderBy: { createdAt: 'desc' }
    })

    const formattedCategories: CategoryColumn[] = categories.map(item => ({
        id: item.id,
        name: item.name,
        billboardLabel: item.billboard.label,
        createdAt: format(item.createdAt, "MMMM do, yyyy"),
    }));

    return (
        <div className="space-y-4">
            <CategoryClient data={formattedCategories} />
        </div>
    )
}

export default CategoriesPage;
