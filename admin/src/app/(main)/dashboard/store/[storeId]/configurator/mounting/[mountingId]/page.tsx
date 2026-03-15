import prismadb from "@/lib/prismadb";
import { MountingForm } from "./_components/mounting-form";

const MountingTypePage = async ({ params }: { params: Promise<{ mountingId: string }> }) => {
    const { mountingId } = await params
    const mountingType = await prismadb.mountingType.findUnique({ where: { id: mountingId } });

    return (
        <div className="space-y-4">
            <MountingForm initialData={mountingType} />
        </div>
    )
}

export default MountingTypePage;
