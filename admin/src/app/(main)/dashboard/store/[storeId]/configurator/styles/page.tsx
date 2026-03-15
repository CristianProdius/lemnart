import { format } from 'date-fns'
import prismadb from '@/lib/prismadb'
import { StyleClient } from './_components/client'
import { StyleColumn } from './_components/columns'

const StylesPage = async ({ params }: { params: Promise<{ storeId: string }> }) => {
    const { storeId } = await params;
    const styles = await prismadb.configStyle.findMany({
        where: { storeId },
        orderBy: { createdAt: 'desc' }
    })

    const formattedStyles: StyleColumn[] = styles.map(item => ({
        id: item.id,
        name: item.name,
        slug: item.slug,
        isActive: item.isActive,
        sortOrder: item.sortOrder,
        createdAt: format(item.createdAt, "MMMM do, yyyy"),
    }));

    return (
        <div className="space-y-4">
            <StyleClient data={formattedStyles} />
        </div>
    )
}

export default StylesPage;
