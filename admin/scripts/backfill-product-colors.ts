// Historical record of the one-time pre-cutover migration.
//
// This script ran ONCE before the storefront PR shipped, populating ProductColor
// from the legacy Product.colorId column and seeding Image.colorId / OrderItem
// color snapshot fields. The Product.colorId column has since been dropped; the
// original implementation no longer compiles. The script is preserved here as
// documentation of what was migrated; do not run it again.
//
// To re-create the script for a fresh environment, restore Product.colorId in
// schema.prisma temporarily, port the original implementation from git history
// (the original lived in commit 69d708e on the feat/product-multi-color-admin
// branch), run with BACKFILL_CONFIRM=yes, then drop Product.colorId again.

throw new Error(
    "backfill-product-colors.ts is a one-time pre-cutover migration that has already run. " +
    "Do not execute this script. See file header for context."
);
