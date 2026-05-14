// ONE-TIME PRE-CUTOVER MIGRATION. Do NOT re-run after admins start tagging images.
//
// This script copies the legacy Product.colorId into ProductColor and seeds
// Image.colorId / OrderItem color snapshots from it. After the storefront PR
// ships, Image.colorId = null is a LEGITIMATE value (a "generic" image that
// applies to all colors) — re-running this script would overwrite those nulls
// with whatever Product.colorId still happens to hold, AND the strict null
// invariant at the bottom would then mask the data destruction by passing.
//
// To run intentionally (only valid before any admin has saved a generic image):
//   BACKFILL_CONFIRM=yes npx tsx scripts/backfill-product-colors.ts

import prismadb from "../src/lib/prismadb";

if (process.env.BACKFILL_CONFIRM !== "yes") {
    console.error(
        "[BACKFILL] Refusing to run without BACKFILL_CONFIRM=yes. " +
        "This is a one-time pre-cutover migration; running it after admins start " +
        "tagging images as generic will overwrite legitimate null colorIds. " +
        "Read the file header before re-running."
    );
    process.exit(1);
}

async function main() {
    console.log("[BACKFILL] Starting product-color + image-color + order-item-color backfill");

    const products = await prismadb.product.findMany({
        select: { id: true, colorId: true, color: { select: { id: true, name: true, value: true } } },
    });
    console.log(`[BACKFILL] Found ${products.length} products`);

    let pcCreated = 0;
    let imgUpdated = 0;
    let oiUpdated = 0;

    for (const p of products) {
        await prismadb.productColor.upsert({
            where: { productId_colorId: { productId: p.id, colorId: p.colorId } },
            create: { productId: p.id, colorId: p.colorId },
            update: {},
        });
        pcCreated++;

        const imgRes = await prismadb.image.updateMany({
            where: { productId: p.id, colorId: null },
            data: { colorId: p.colorId },
        });
        imgUpdated += imgRes.count;

        const oiRes = await prismadb.orderItem.updateMany({
            where: { productId: p.id, colorId: null },
            data: {
                colorId: p.colorId,
                colorName: p.color.name,
                colorValue: p.color.value,
            },
        });
        oiUpdated += oiRes.count;
    }

    const productCount = await prismadb.product.count();
    const productsWithoutColors = await prismadb.product.count({
        where: { productColors: { none: {} } },
    });
    const imageNullCount = await prismadb.image.count({ where: { colorId: null } });
    const orderItemCount = await prismadb.orderItem.count();
    const orderItemNullCount = await prismadb.orderItem.count({ where: { colorId: null } });

    console.log("[BACKFILL] Summary:");
    console.log(`  ProductColor upserts: ${pcCreated}`);
    console.log(`  Image rows updated: ${imgUpdated}`);
    console.log(`  OrderItem rows updated: ${oiUpdated}`);
    console.log(`  Products: ${productCount}, products without any ProductColor: ${productsWithoutColors}`);
    console.log(`  Images with null colorId: ${imageNullCount}`);
    console.log(`  OrderItems: ${orderItemCount}, OrderItems with null colorId: ${orderItemNullCount}`);

    if (productsWithoutColors > 0) {
        throw new Error(`FAIL: ${productsWithoutColors} products have no ProductColor row.`);
    }
    if (imageNullCount > 0) {
        throw new Error(`FAIL: ${imageNullCount} images still have null colorId. Likely orphaned (productId points to a deleted product).`);
    }
    if (orderItemNullCount > 0) {
        throw new Error(`FAIL: ${orderItemNullCount} order items still have null colorId.`);
    }

    console.log("[BACKFILL] OK. All invariants satisfied.");
}

main()
    .catch((e) => {
        console.error("[BACKFILL] FAILED", e);
        process.exit(1);
    })
    .finally(async () => {
        await prismadb.$disconnect();
    });
