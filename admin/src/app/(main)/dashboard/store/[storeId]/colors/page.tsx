import { format } from 'date-fns'
import prismadb from '@/lib/prismadb'
import { ColorClient } from './_components/client'
import { ColorColumn } from './_components/columns'

const ColorsPage = async ({ params }: { params: Promise<{ storeId: string }> }) => {
    const { storeId } = await params;
    const colors = await prismadb.color.findMany({
        where: { storeId },
        orderBy: { createdAt: 'desc' }
    })

    const formattedColors: ColorColumn[] = colors.map(item => ({
        id: item.id,
        name: item.name,
        value: item.value,
        createdAt: format(item.createdAt, "MMMM do, yyyy"),
    }));

    return (
        <div className="space-y-4">
            <ColorClient data={formattedColors} />
        </div>
    )
}

export default ColorsPage;
