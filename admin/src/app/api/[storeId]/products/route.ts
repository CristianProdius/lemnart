import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prismadb from "@/lib/prismadb";
import { ValidationError } from "@/lib/errors";

export async function POST(
    req: Request,
    { params }: { params: Promise<{ storeId: string }> }
) {
    try {
        const session = await auth.api.getSession({ headers: req.headers });
        const userId = session?.user?.id;
        const body = await req.json();

        const { name, price, categoryId, colorIds, sizeId, images, isFeatured, isArchived } = body;
        const { storeId } = await params;

        if (!userId) return new NextResponse("Unauthenticated", { status: 401 });
        if (!name) return new NextResponse("Name is required", { status: 400 });
        if (!price) return new NextResponse("Price is required", { status: 400 });
        if (!categoryId) return new NextResponse("Category id is required", { status: 400 });
        if (!sizeId) return new NextResponse("Size id is required", { status: 400 });
        if (!Array.isArray(colorIds) || colorIds.length === 0) return new NextResponse("At least one color is required", { status: 400 });
        if (!Array.isArray(images) || images.length === 0) return new NextResponse("Image is required", { status: 400 });
        if (!storeId) return new NextResponse("Store Id is required", { status: 400 });

        const storeByUserId = await prismadb.store.findFirst({ where: { id: storeId, userId } });
        if (!storeByUserId) return new NextResponse("Unauthorized", { status: 403 });

        const uniqueColorIds: string[] = [...new Set<string>(colorIds)];
        const colorIdSet = new Set<string>(uniqueColorIds);
        const sanitizedImages = images.map((img: { url: string; colorId?: string | null }) => ({
            url: img.url,
            colorId: img.colorId && colorIdSet.has(img.colorId) ? img.colorId : null,
        }));

        // Validation + write inside a single transaction — closes the TOCTOU window
        // (relationMode = "prisma" gives no DB FK enforcement).
        const product = await prismadb.$transaction(async (tx) => {
            const [categoryOk, sizeOk, ownedColors] = await Promise.all([
                tx.category.count({ where: { id: categoryId, storeId } }),
                tx.size.count({ where: { id: sizeId, storeId } }),
                tx.color.findMany({ where: { id: { in: uniqueColorIds }, storeId }, select: { id: true } }),
            ]);
            if (categoryOk === 0) throw new ValidationError("Category not found in this store");
            if (sizeOk === 0) throw new ValidationError("Size not found in this store");
            if (ownedColors.length !== uniqueColorIds.length) {
                throw new ValidationError("One or more colors not found in this store");
            }
            return tx.product.create({
                data: {
                    name,
                    price,
                    isFeatured,
                    isArchived,
                    categoryId,
                    sizeId,
                    storeId,
                    images: { createMany: { data: sanitizedImages } },
                    productColors: { createMany: { data: uniqueColorIds.map((cid) => ({ colorId: cid })) } },
                },
            });
        });

        return NextResponse.json(product);
    } catch (err) {
        if (err instanceof ValidationError) return new NextResponse(err.message, { status: 400 });
        console.log('[PRODUCTS_POST]', err);
        return new NextResponse('Internal error', { status: 500 });
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

        const projected = products.map(({ productColors, ...p }) => ({
            ...p,
            colors: productColors.map((pc) => pc.color),
        }));

        return NextResponse.json(projected);

    } catch (err) {
        console.log('[PRODUCTS_GET]', err);
        return new NextResponse('Internal error', { status: 500 });
    }
}
