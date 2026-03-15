import { format } from 'date-fns'
import prismadb from '@/lib/prismadb'
import { VentilationClient } from './_components/client'
import { VentilationColumn } from './_components/columns'

const VentilationPage = async ({ params }: { params: Promise<{ storeId: string }> }) => {
    const { storeId } = await params;
    const patterns = await prismadb.ventilationPattern.findMany({
        where: { storeId },
        orderBy: { createdAt: 'desc' }
    })

    const formattedPatterns: VentilationColumn[] = patterns.map(item => ({
        id: item.id,
        name: item.name,
        slug: item.slug,
        priceModifier: parseFloat(String(item.priceModifier)),
        isActive: item.isActive,
        createdAt: format(item.createdAt, "MMMM do, yyyy"),
    }));

    return (
        <div className="space-y-4">
            <VentilationClient data={formattedPatterns} />
        </div>
    )
}

export default VentilationPage;
