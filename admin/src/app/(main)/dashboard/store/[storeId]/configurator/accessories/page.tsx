import { format } from 'date-fns'
import prismadb from '@/lib/prismadb'
import { AccessoryClient } from './_components/client'
import { AccessoryColumn } from './_components/columns'

const AccessoriesPage = async ({ params }: { params: Promise<{ storeId: string }> }) => {
    const { storeId } = await params;
    const accessories = await prismadb.configAccessory.findMany({
        where: { storeId },
        orderBy: { createdAt: 'desc' }
    })

    const formattedAccessories: AccessoryColumn[] = accessories.map(item => ({
        id: item.id,
        name: item.name,
        slug: item.slug,
        price: parseFloat(String(item.price)),
        isActive: item.isActive,
        createdAt: format(item.createdAt, "MMMM do, yyyy"),
    }));

    return (
        <div className="space-y-4">
            <AccessoryClient data={formattedAccessories} />
        </div>
    )
}

export default AccessoriesPage;
