import { format } from 'date-fns'
import prismadb from '@/lib/prismadb'
import { OrderClient } from './_components/client'
import { OrderColumn } from './_components/columns'
import { formatter } from '@/lib/utils'

const OrdersPage = async ({ params }: { params: Promise<{ storeId: string }> }) => {
    const { storeId } = await params;
    const orders = await prismadb.order.findMany({
        where: { storeId },
        include: {
            orderItems: { include: { product: true } },
            configuredItems: true,
        },
        orderBy: { createdAt: 'desc' }
    })

    const formattedOrders: OrderColumn[] = orders.map(item => {
        const productNames = item.orderItems.map((oi) => {
            const base = oi.colorName ? `${oi.product.name} (${oi.colorName})` : oi.product.name;
            return oi.quantity > 1 ? `${base} ×${oi.quantity}` : base;
        });
        const configNames = item.configuredItems.map(
            (ci) => `${ci.styleName} (${ci.width}×${ci.height}cm)`
        );

        const productTotal = item.orderItems.reduce(
            (total, oi) => {
                if (oi.unitPrice == null) {
                    // Should never happen after the OrderItem.unitPrice backfill ran. Log so we notice.
                    console.warn('[ORDERS_PAGE] OrderItem missing unitPrice', { orderId: item.id, orderItemId: oi.id });
                    return total; // skip — better to under-report than to retroactively change with live price
                }
                return total + Number(oi.unitPrice) * oi.quantity;
            },
            0
        );
        const configTotal = item.configuredItems.reduce(
            (total, ci) => total + Number(ci.unitPrice),
            0
        );

        return {
            id: item.id,
            phone: item.phone,
            address: item.address,
            products: [...productNames, ...configNames].join(', '),
            totalPrice: formatter.format(productTotal + configTotal),
            isPaid: item.isPaid,
            createdAt: format(item.createdAt, "MMMM do, yyyy"),
        };
    });

    return (
        <div className="space-y-4">
            <OrderClient data={formattedOrders} />
        </div>
    )
}

export default OrdersPage;
