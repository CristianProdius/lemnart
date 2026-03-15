import prismadb from "@/lib/prismadb";
import { PricingForm } from "./_components/pricing-form";

const PriceTierPage = async ({ params }: { params: Promise<{ storeId: string; tierId: string }> }) => {
    const { storeId, tierId } = await params
    const priceTier = await prismadb.priceTier.findUnique({ where: { id: tierId } });

    const styles = await prismadb.configStyle.findMany({
        where: { storeId },
        orderBy: { name: 'asc' }
    });

    const colors = await prismadb.color.findMany({
        where: { storeId },
        orderBy: { name: 'asc' }
    });

    return (
        <div className="space-y-4">
            <PricingForm initialData={priceTier} styles={styles} colors={colors} />
        </div>
    )
}

export default PriceTierPage;
