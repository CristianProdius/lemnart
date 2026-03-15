import { format } from 'date-fns'
import prismadb from '@/lib/prismadb'
import { PricingClient } from './_components/client'
import { PricingColumn } from './_components/columns'

const PricingPage = async ({ params }: { params: Promise<{ storeId: string }> }) => {
    const { storeId } = await params;
    const priceTiers = await prismadb.priceTier.findMany({
        where: { storeId },
        include: { style: true, color: true },
        orderBy: { createdAt: 'desc' }
    })

    const formattedPriceTiers: PricingColumn[] = priceTiers.map(item => ({
        id: item.id,
        styleName: item.style.name,
        colorName: item.color?.name || 'All',
        sizeRange: `${item.minWidth}-${item.maxWidth} x ${item.minHeight}-${item.maxHeight} cm`,
        basePrice: parseFloat(String(item.basePrice)),
        pricePerSection: parseFloat(String(item.pricePerSection)),
        createdAt: format(item.createdAt, "MMMM do, yyyy"),
    }));

    return (
        <div className="space-y-4">
            <PricingClient data={formattedPriceTiers} />
        </div>
    )
}

export default PricingPage;
