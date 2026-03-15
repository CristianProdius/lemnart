import prismadb from "@/lib/prismadb";
import { AccessoryForm } from "./_components/accessory-form";

const AccessoryPage = async ({ params }: { params: Promise<{ accessoryId: string }> }) => {
    const { accessoryId } = await params
    const accessory = await prismadb.configAccessory.findUnique({ where: { id: accessoryId } });

    return (
        <div className="space-y-4">
            <AccessoryForm initialData={accessory} />
        </div>
    )
}

export default AccessoryPage;
