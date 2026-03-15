import { format } from 'date-fns'
import prismadb from '@/lib/prismadb'
import { MountingClient } from './_components/client'
import { MountingColumn } from './_components/columns'

const MountingPage = async ({ params }: { params: Promise<{ storeId: string }> }) => {
    const { storeId } = await params;
    const mountingTypes = await prismadb.mountingType.findMany({
        where: { storeId },
        orderBy: { createdAt: 'desc' }
    })

    const formattedMountingTypes: MountingColumn[] = mountingTypes.map(item => ({
        id: item.id,
        name: item.name,
        slug: item.slug,
        priceModifier: parseFloat(String(item.priceModifier)),
        isActive: item.isActive,
        createdAt: format(item.createdAt, "MMMM do, yyyy"),
    }));

    return (
        <div className="space-y-4">
            <MountingClient data={formattedMountingTypes} />
        </div>
    )
}

export default MountingPage;
