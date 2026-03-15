import { format } from 'date-fns'
import prismadb from '@/lib/prismadb'
import { SizeClient } from './_components/client'
import { SizeColumn } from './_components/columns'

const SizesPage = async ({ params }: { params: Promise<{ storeId: string }> }) => {
    const { storeId } = await params;
    const sizes = await prismadb.size.findMany({
        where: { storeId },
        orderBy: { createdAt: 'desc' }
    })

    const formattedSizes: SizeColumn[] = sizes.map(item => ({
        id: item.id,
        name: item.name,
        value: item.value,
        createdAt: format(item.createdAt, "MMMM do, yyyy"),
    }));

    return (
        <div className="space-y-4">
            <SizeClient data={formattedSizes} />
        </div>
    )
}

export default SizesPage;
