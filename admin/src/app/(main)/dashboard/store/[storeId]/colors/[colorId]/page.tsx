import prismadb from "@/lib/prismadb";
import { ColorForm } from "./_components/color-form";

const ColorPage = async ({ params }: { params: Promise<{ colorId: string }> }) => {
    const { colorId } = await params
    const color = await prismadb.color.findUnique({ where: { id: colorId } });

    return (
        <div className="space-y-4">
            <ColorForm initialData={color} />
        </div>
    )
}

export default ColorPage;
