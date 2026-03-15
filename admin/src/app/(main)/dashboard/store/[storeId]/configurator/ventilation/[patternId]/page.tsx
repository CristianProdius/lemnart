import prismadb from "@/lib/prismadb";
import { VentilationForm } from "./_components/ventilation-form";

const VentilationPatternPage = async ({ params }: { params: Promise<{ patternId: string }> }) => {
    const { patternId } = await params
    const pattern = await prismadb.ventilationPattern.findUnique({ where: { id: patternId } });

    return (
        <div className="space-y-4">
            <VentilationForm initialData={pattern} />
        </div>
    )
}

export default VentilationPatternPage;
