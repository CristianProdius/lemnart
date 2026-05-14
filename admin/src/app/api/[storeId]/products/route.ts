import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prismadb from "@/lib/prismadb";

export async function POST(
    req: Request,
    { params }: { params: Promise<{ storeId: string }> }
) {
    try {
        const session = await auth.api.getSession({ headers: req.headers });
        const userId = session?.user?.id;
        const body = await req.json();

        const {
            name,
            price,
            categoryId,
            colorId,
            sizeId,
            images,
            isFeatured,
            isArchived
        } = body;

        const { storeId } = await params;

        if (!userId) {
            return new NextResponse("Unauthenticated", { status: 401 });
        }

        if (!name) {
            return new NextResponse("Name is required", { status: 400});
        }

        if (!price) return new NextResponse("Price is required", { status: 400});

        if (!categoryId) return new NextResponse("Category id is required", { status: 400});

        if (!colorId) return new NextResponse("Color id is required", { status: 400});

        if (!sizeId) return new NextResponse("Size id is required", { status: 400});

        if (!images || !images.length) {
            return new NextResponse("Image is required", { status: 400});
        }

        if (!storeId) {
            return new NextResponse("Store Id is required", { status: 400});
        }

        const storeByUserId = await prismadb.store.findFirst({
            where: {
                id: storeId,
                userId
            }
        })

        if (!storeByUserId) {
            return new NextResponse("Unauthorized", { status: 403 });
        }

        const product = await prismadb.product.create({
            data : {
                name,
                images: {
                    createMany: {
                        data: [
                            ...images.map((image: { url:string }) => image)
                        ]
                    }
                },
                price,
                isFeatured,
                isArchived,
                categoryId,
                sizeId,
                colorId,
                storeId: storeId
            }
        })

        return NextResponse.json(product);

    } catch (err) {
        console.log(`[PRODUCTS_POST] ${err}`);
        return new NextResponse(`Internal error`, { status: 500})
    }
}

export async function GET(
    req: Request,
    { params }: { params: Promise<{ storeId: string }> }
) {
    try {
        const { storeId } = await params;
        const { searchParams } = new URL(req.url);
        const categoryId = searchParams.get('categoryId') || undefined;
        const sizeId = searchParams.get('sizeId') || undefined;
        const colorId = searchParams.get('colorId') || undefined;
        const isFeatured = searchParams.get('isFeatured');

        if (!storeId) {
            return new NextResponse("Store Id is required", { status: 400 });
        }

        const products = await prismadb.product.findMany({
            where: {
                storeId,
                categoryId,
                sizeId,
                isFeatured: isFeatured ? true : undefined,
                isArchived: false,
                ...(colorId ? { productColors: { some: { colorId } } } : {}),
            },
            include: {
                images: { include: { color: true } },
                category: true,
                size: true,
                productColors: { include: { color: true } },
            },
            orderBy: { createdAt: 'desc' },
        });

        const projected = products.map(({ productColors, ...p }) => {
            const colors = productColors.map((pc) => pc.color);
            return {
                ...p,
                colors,
                color: colors[0] ?? null, // legacy compat — removed once storefront no longer reads it
            };
        });

        return NextResponse.json(projected);

    } catch (err) {
        console.log('[PRODUCTS_GET]', err);
        return new NextResponse('Internal error', { status: 500 });
    }
}
