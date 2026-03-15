import { NextResponse } from "next/server";
import prismadb from "@/lib/prismadb";

export async function GET(
    req: Request,
    { params }: { params: Promise<{ storeId: string }> }
) {
    try {
        const { storeId } = await params;

        if (!storeId) {
            return new NextResponse("Store Id is required", { status: 400 });
        }

        const siteContents = await prismadb.siteContent.findMany({
            where: { storeId },
            orderBy: { updatedAt: "desc" },
        });

        return NextResponse.json(siteContents);
    } catch (err) {
        console.log("[SITE_CONTENT_GET]", err);
        return new NextResponse("Internal error", { status: 500 });
    }
}
