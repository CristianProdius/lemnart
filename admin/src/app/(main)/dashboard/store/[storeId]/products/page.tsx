import { format } from 'date-fns'
import prismadb from '@/lib/prismadb'
import { ProductsTabs } from './_components/products-tabs'
import { ProductColumn } from './_components/columns'
import { CategoryColumn } from '../categories/_components/columns'
import { BillboardColumn } from '../billboards/_components/columns'
import { SizeColumn } from '../sizes/_components/columns'
import { ColorColumn } from '../colors/_components/columns'
import { formatter } from '@/lib/utils'

const ProductsPage = async ({ params }: { params: Promise<{ storeId: string }> }) => {
    const { storeId } = await params;

    const [products, categories, billboards, sizes, colors] = await Promise.all([
        prismadb.product.findMany({
            where: { storeId },
            include: {
                category: true,
                size: true,
                productColors: { include: { color: true } },
            },
            orderBy: { createdAt: 'desc' }
        }),
        prismadb.category.findMany({
            where: { storeId },
            include: { billboard: true },
            orderBy: { createdAt: 'desc' }
        }),
        prismadb.billboard.findMany({
            where: { storeId },
            orderBy: { createdAt: 'desc' }
        }),
        prismadb.size.findMany({
            where: { storeId },
            orderBy: { createdAt: 'desc' }
        }),
        prismadb.color.findMany({
            where: { storeId },
            orderBy: { createdAt: 'desc' }
        }),
    ]);

    const formattedProducts: ProductColumn[] = products.map(item => ({
        id: item.id,
        name: item.name,
        isFeatured: item.isFeatured,
        isArchived: item.isArchived,
        price: formatter.format(Number(item.price)),
        category: item.category.name,
        size: item.size.name,
        colors: item.productColors.map((pc) => ({ name: pc.color.name, value: pc.color.value })),
        createdAt: format(item.createdAt, "MMMM do, yyyy"),
    }));

    const formattedCategories: CategoryColumn[] = categories.map(item => ({
        id: item.id,
        name: item.name,
        billboardLabel: item.billboard.label,
        createdAt: format(item.createdAt, "MMMM do, yyyy"),
    }));

    const formattedBillboards: BillboardColumn[] = billboards.map(item => ({
        id: item.id,
        label: item.label,
        createdAt: format(item.createdAt, "MMMM do, yyyy"),
    }));

    const formattedSizes: SizeColumn[] = sizes.map(item => ({
        id: item.id,
        name: item.name,
        value: item.value,
        createdAt: format(item.createdAt, "MMMM do, yyyy"),
    }));

    const formattedColors: ColorColumn[] = colors.map(item => ({
        id: item.id,
        name: item.name,
        value: item.value,
        createdAt: format(item.createdAt, "MMMM do, yyyy"),
    }));

    return (
        <div className="space-y-4">
            <ProductsTabs
                products={formattedProducts}
                categories={formattedCategories}
                billboards={formattedBillboards}
                sizes={formattedSizes}
                colors={formattedColors}
            />
        </div>
    )
}

export default ProductsPage;
