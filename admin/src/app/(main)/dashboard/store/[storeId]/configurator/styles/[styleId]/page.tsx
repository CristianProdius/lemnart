import prismadb from "@/lib/prismadb";
import { StyleForm } from "./_components/style-form";

const StylePage = async ({ params }: { params: Promise<{ styleId: string }> }) => {
    const { styleId } = await params
    const style = await prismadb.configStyle.findUnique({ where: { id: styleId } });

    return (
        <div className="space-y-4">
            <StyleForm initialData={style} />
        </div>
    )
}

export default StylePage;
