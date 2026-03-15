import { NextResponse } from "next/server";
import prismadb from "@/lib/prismadb";

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization"
};

export async function OPTIONS() {
    return NextResponse.json({}, { headers: corsHeaders });
}

export async function GET(
    req: Request,
    { params }: { params: Promise<{ storeId: string }> }
) {
    try {
        const { storeId } = await params;

        if (!storeId) {
            return new NextResponse("Store Id is required", { status: 400, headers: corsHeaders });
        }

        const [styles, colors, ventilationPatterns, mountingTypes, accessories, priceTiers] = await Promise.all([
            prismadb.configStyle.findMany({
                where: {
                    storeId: storeId,
                    isActive: true
                },
                orderBy: {
                    sortOrder: 'asc'
                }
            }),
            prismadb.color.findMany({
                where: {
                    storeId: storeId
                }
            }),
            prismadb.ventilationPattern.findMany({
                where: {
                    storeId: storeId,
                    isActive: true
                },
                orderBy: {
                    sortOrder: 'asc'
                }
            }),
            prismadb.mountingType.findMany({
                where: {
                    storeId: storeId,
                    isActive: true
                },
                orderBy: {
                    sortOrder: 'asc'
                }
            }),
            prismadb.configAccessory.findMany({
                where: {
                    storeId: storeId,
                    isActive: true
                },
                orderBy: {
                    sortOrder: 'asc'
                }
            }),
            prismadb.priceTier.findMany({
                where: {
                    storeId: storeId
                },
                include: {
                    style: {
                        select: {
                            name: true
                        }
                    },
                    color: {
                        select: {
                            name: true
                        }
                    }
                }
            })
        ]);

        return NextResponse.json({
            styles,
            colors,
            ventilationPatterns,
            mountingTypes,
            accessories,
            priceTiers
        }, { headers: corsHeaders });

    } catch (err) {
        console.log(`[CONFIGURATOR_OPTIONS_GET] ${err}`);
        return new NextResponse(`Internal error`, { status: 500, headers: corsHeaders })
    }
}
