import prismadb from "@/lib/prismadb";
import { SizeForm } from "./_components/size-form";

const SizePage = async ({ params }: { params: Promise<{ sizeId: string }> }) => {
    const { sizeId } = await params;
    const size = await prismadb.size.findUnique({ where: { id: sizeId } });

    return (
        <div className="space-y-4">
            <SizeForm initialData={size} />
        </div>
    )
}

export default SizePage;
