import { format } from 'date-fns'
import prismadb from '@/lib/prismadb'
import { BillboardClient } from './_components/client'
import { BillboardColumn } from './_components/columns'

const BillboardsPage = async ({ params }: { params: Promise<{ storeId: string }> }) => {
    const { storeId } = await params;
    const billboards = await prismadb.billboard.findMany({
        where: { storeId },
        orderBy: { createdAt: 'desc' }
    })

    const formattedBillboards: BillboardColumn[] = billboards.map(item => ({
        id: item.id,
        label: item.label,
        createdAt: format(item.createdAt, "MMMM do, yyyy"),
    }));

    return (
        <div className="space-y-4">
            <BillboardClient data={formattedBillboards} />
        </div>
    )
}

export default BillboardsPage;
