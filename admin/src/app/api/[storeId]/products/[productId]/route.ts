import prismadb from "@/lib/prismadb";
import { auth } from "@/lib/auth";
import { NextResponse } from "next/server"

class ValidationError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'ValidationError';
    }
}

export async function GET (
    req: Request,
    { params }: { params: Promise<{ productId: string }>}
) {
    try {
        const { productId } = await params;

        if(!productId) {
            return new NextResponse("Product id is required", { status: 400 });
        }

        const product = await prismadb.product.findUnique({
            where: { id: productId },
            include: {
                images: { include: { color: true } },
                category: true,
                size: true,
                productColors: { include: { color: true } },
            },
        });

        if (!product) return NextResponse.json(null);

        const { productColors, ...rest } = product;
        return NextResponse.json({
            ...rest,
            colors: productColors.map((pc) => pc.color),
        });
    } catch (err) {
        console.log('[PRODUCT_GET]', err)
        return new NextResponse('Internal error', { status: 500 })
    }
}

export async function PATCH (
    req: Request,
    { params }: { params: Promise<{ storeId: string, productId: string }>}
) {
    try {
        const session = await auth.api.getSession({ headers: req.headers });
        const userId = session?.user?.id;
        const body = await req.json();
        const { storeId, productId } = await params;
        const { name, price, categoryId, colorIds, sizeId, images, isFeatured, isArchived } = body;

        if (!userId) return new NextResponse("Unauthenticated", { status: 401 });
        if (!name) return new NextResponse("Name is required", { status: 400 });
        if (!price) return new NextResponse("Price is required", { status: 400 });
        if (!categoryId) return new NextResponse("Category id is required", { status: 400 });
        if (!sizeId) return new NextResponse("Size id is required", { status: 400 });
        if (!Array.isArray(colorIds) || colorIds.length === 0) return new NextResponse("At least one color is required", { status: 400 });
        if (!Array.isArray(images) || images.length === 0) return new NextResponse("Image is required", { status: 400 });
        if (!productId) return new NextResponse("Product id is required", { status: 400 });

        const storeByUserId = await prismadb.store.findFirst({ where: { id: storeId, userId } });
        if (!storeByUserId) return new NextResponse("Unauthorized", { status: 403 });

        const owned = await prismadb.product.findFirst({ where: { id: productId, storeId }, select: { id: true } });
        if (!owned) return new NextResponse("Not found", { status: 404 });

        const uniqueColorIds: string[] = [...new Set<string>(colorIds)];
        const colorIdSet = new Set<string>(uniqueColorIds);
        const sanitizedImages = images.map((img: { url: string; colorId?: string | null }) => ({
            url: img.url,
            colorId: img.colorId && colorIdSet.has(img.colorId) ? img.colorId : null,
        }));

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

            await tx.image.deleteMany({ where: { productId } });
            await tx.productColor.deleteMany({ where: { productId } });
            await tx.product.update({
                where: { id: productId },
                // Do NOT mutate storeId on update — would let a user move a product into their store.
                data: {
                    name,
                    price,
                    isFeatured,
                    isArchived,
                    categoryId,
                    sizeId,
                    colorId: uniqueColorIds[0], // legacy column kept in sync until final cleanup
                },
            });
            await tx.image.createMany({ data: sanitizedImages.map((img: { url: string; colorId: string | null }) => ({ ...img, productId })) });
            await tx.productColor.createMany({ data: uniqueColorIds.map((cid) => ({ productId, colorId: cid })) });
            return tx.product.findUnique({ where: { id: productId } });
        });

        return NextResponse.json(product);
    } catch (err) {
        if (err instanceof ValidationError) return new NextResponse(err.message, { status: 400 });
        console.log('[PRODUCT_PATCH]', err)
        return new NextResponse('Internal error', { status: 500 })
    }
}

//// Delete Method

export async function DELETE (
    req: Request,
    { params }: { params: Promise<{ storeId: string, productId: string }>}
) {
    try {
        const session = await auth.api.getSession({ headers: req.headers });
        const userId = session?.user?.id;
        const { storeId, productId } = await params;

        if (!userId) return new NextResponse("Unauthenticated", { status: 401 });
        if (!productId) return new NextResponse("Product id is required", { status: 400 });

        const storeByUserId = await prismadb.store.findFirst({ where: { id: storeId, userId } });
        if (!storeByUserId) return new NextResponse("Unauthorized", { status: 403 });

        const result = await prismadb.product.deleteMany({ where: { id: productId, storeId } });
        if (result.count === 0) return new NextResponse("Not found", { status: 404 });

        return NextResponse.json(result);
    } catch (err) {
        console.log('[PRODUCT_DELETE]', err)
        return new NextResponse('Internal error', { status: 500 })
    }
}
