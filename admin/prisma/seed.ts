import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const storeId = 'da911c75-62a2-4064-8f09-d94503f0900d'

async function main() {
  console.log('[SEED] Starting LemnArt Decor seed...')

  // Clean existing data (reverse dependency order)
  // Do NOT delete stores or users — preserves auth
  await prisma.orderItem.deleteMany()
  await prisma.order.deleteMany()
  await prisma.image.deleteMany()
  await prisma.product.deleteMany()
  await prisma.category.deleteMany()
  await prisma.billboard.deleteMany()
  await prisma.size.deleteMany()
  await prisma.color.deleteMany()

  console.log('[SEED] Cleaned existing data')

  // ── Billboards ──────────────────────────────────────────────

  const heroBoard = await prisma.billboard.create({
    data: {
      storeId,
      label: 'Atelier de Design — Artă în fiecare detaliu',
      imageUrl: 'billboards/hero.webp',
    },
  })

  const clasicBoard = await prisma.billboard.create({
    data: {
      storeId,
      label: 'Colecția Clasic — Eleganță atemporală',
      imageUrl: 'billboards/clasic.webp',
    },
  })

  const modernBoard = await prisma.billboard.create({
    data: {
      storeId,
      label: 'Colecția Modern — Linii curate, design contemporan',
      imageUrl: 'billboards/modern.webp',
    },
  })

  const rusticBoard = await prisma.billboard.create({
    data: {
      storeId,
      label: 'Colecția Rustic — Căldura lemnului natural',
      imageUrl: 'billboards/rustic.webp',
    },
  })

  const minimalistBoard = await prisma.billboard.create({
    data: {
      storeId,
      label: 'Colecția Minimalist — Simplitate rafinată',
      imageUrl: 'billboards/minimalist.webp',
    },
  })

  console.log('[SEED] Created 5 billboards')

  // ── Categories ──────────────────────────────────────────────

  const clasic = await prisma.category.create({
    data: {
      storeId,
      billboardId: clasicBoard.id,
      name: 'Clasic',
    },
  })

  const modern = await prisma.category.create({
    data: {
      storeId,
      billboardId: modernBoard.id,
      name: 'Modern',
    },
  })

  const rustic = await prisma.category.create({
    data: {
      storeId,
      billboardId: rusticBoard.id,
      name: 'Rustic',
    },
  })

  const minimalist = await prisma.category.create({
    data: {
      storeId,
      billboardId: minimalistBoard.id,
      name: 'Minimalist',
    },
  })

  console.log('[SEED] Created 4 categories')

  // ── Sizes ───────────────────────────────────────────────────

  const sizes = await Promise.all(
    [
      { name: '60×40', value: '60x40' },
      { name: '80×60', value: '80x60' },
      { name: '100×60', value: '100x60' },
      { name: '120×60', value: '120x60' },
      { name: '140×60', value: '140x60' },
      { name: '160×60', value: '160x60' },
    ].map((s) => prisma.size.create({ data: { ...s, storeId } }))
  )

  console.log('[SEED] Created 6 sizes')

  // ── Colors ──────────────────────────────────────────────────

  const colors = await Promise.all(
    [
      { name: 'Alb Mat', value: '#FFFFFF' },
      { name: 'Alb Lucios', value: '#FAFAFA' },
      { name: 'Negru Mat', value: '#1A1A1A' },
      { name: 'Gri Antracit', value: '#36454F' },
      { name: 'Auriu Metalic', value: '#D4AF37' },
      { name: 'Argintiu', value: '#C0C0C0' },
      { name: 'Bej Nisip', value: '#C2B280' },
      { name: 'Verde Olive', value: '#556B2F' },
    ].map((c) => prisma.color.create({ data: { ...c, storeId } }))
  )

  // Index references for readability
  const [albMat, albLucios, negruMat, griAntracit, auriuMetalic, argintiu, bejNisip, verdeOlive] = colors
  const [s60x40, s80x60, s100x60, s120x60, s140x60, s160x60] = sizes

  console.log('[SEED] Created 8 colors')

  // ── Products ────────────────────────────────────────────────

  // Clasic Collection
  await prisma.product.create({
    data: {
      storeId,
      categoryId: clasic.id,
      name: 'Mască Clasică Baroc',
      price: 5200,
      isFeatured: true,
      isArchived: false,
      sizeId: s100x60.id,
      colorId: auriuMetalic.id,
      images: {
        create: [
          { url: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=800&h=800&fit=crop' },
          { url: 'https://images.unsplash.com/photo-1618220179428-22790b461013?w=800&h=800&fit=crop' },
        ],
      },
    },
  })

  await prisma.product.create({
    data: {
      storeId,
      categoryId: clasic.id,
      name: 'Mască Clasică Versailles',
      price: 6500,
      isFeatured: true,
      isArchived: false,
      sizeId: s120x60.id,
      colorId: argintiu.id,
      images: {
        create: [
          { url: 'https://images.unsplash.com/photo-1615529328331-f8917597711f?w=800&h=800&fit=crop' },
          { url: 'https://images.unsplash.com/photo-1600585152220-90363fe7e115?w=800&h=800&fit=crop' },
        ],
      },
    },
  })

  await prisma.product.create({
    data: {
      storeId,
      categoryId: clasic.id,
      name: 'Mască Clasică Regal',
      price: 7800,
      isFeatured: false,
      isArchived: false,
      sizeId: s140x60.id,
      colorId: albMat.id,
      images: {
        create: [
          { url: 'https://images.unsplash.com/photo-1617325247661-675ab4b64ae2?w=800&h=800&fit=crop' },
          { url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=800&fit=crop' },
        ],
      },
    },
  })

  await prisma.product.create({
    data: {
      storeId,
      categoryId: clasic.id,
      name: 'Mască Clasică Imperial',
      price: 8000,
      isFeatured: false,
      isArchived: false,
      sizeId: s160x60.id,
      colorId: albLucios.id,
      images: {
        create: [
          { url: 'https://images.unsplash.com/photo-1631679706909-1844bbd07221?w=800&h=800&fit=crop' },
          { url: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&h=800&fit=crop' },
        ],
      },
    },
  })

  console.log('[SEED] Created 4 Clasic products')

  // Modern Collection
  await prisma.product.create({
    data: {
      storeId,
      categoryId: modern.id,
      name: 'Mască Modernă Geometrică',
      price: 4800,
      isFeatured: true,
      isArchived: false,
      sizeId: s80x60.id,
      colorId: negruMat.id,
      images: {
        create: [
          { url: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800&h=800&fit=crop' },
          { url: 'https://images.unsplash.com/photo-1618219908412-a29a1bb7b86e?w=800&h=800&fit=crop' },
        ],
      },
    },
  })

  await prisma.product.create({
    data: {
      storeId,
      categoryId: modern.id,
      name: 'Mască Modernă Hexagon',
      price: 5500,
      isFeatured: true,
      isArchived: false,
      sizeId: s100x60.id,
      colorId: griAntracit.id,
      images: {
        create: [
          { url: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=800&h=800&fit=crop' },
          { url: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800&h=800&fit=crop' },
        ],
      },
    },
  })

  await prisma.product.create({
    data: {
      storeId,
      categoryId: modern.id,
      name: 'Mască Modernă Cuburi',
      price: 6200,
      isFeatured: false,
      isArchived: false,
      sizeId: s120x60.id,
      colorId: albMat.id,
      images: {
        create: [
          { url: 'https://images.unsplash.com/photo-1617104678098-de229db51175?w=800&h=800&fit=crop' },
          { url: 'https://images.unsplash.com/photo-1600573472550-8090b5e0745e?w=800&h=800&fit=crop' },
        ],
      },
    },
  })

  await prisma.product.create({
    data: {
      storeId,
      categoryId: modern.id,
      name: 'Mască Modernă Linii',
      price: 7200,
      isFeatured: false,
      isArchived: false,
      sizeId: s140x60.id,
      colorId: negruMat.id,
      images: {
        create: [
          { url: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800&h=800&fit=crop' },
          { url: 'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800&h=800&fit=crop' },
        ],
      },
    },
  })

  console.log('[SEED] Created 4 Modern products')

  // Rustic Collection
  await prisma.product.create({
    data: {
      storeId,
      categoryId: rustic.id,
      name: 'Mască Rustică Stejar',
      price: 4500,
      isFeatured: true,
      isArchived: false,
      sizeId: s80x60.id,
      colorId: bejNisip.id,
      images: {
        create: [
          { url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=800&fit=crop' },
          { url: 'https://images.unsplash.com/photo-1616046229478-9901c5536a45?w=800&h=800&fit=crop' },
        ],
      },
    },
  })

  await prisma.product.create({
    data: {
      storeId,
      categoryId: rustic.id,
      name: 'Mască Rustică Nuc',
      price: 5000,
      isFeatured: false,
      isArchived: false,
      sizeId: s100x60.id,
      colorId: verdeOlive.id,
      images: {
        create: [
          { url: 'https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=800&h=800&fit=crop' },
          { url: 'https://images.unsplash.com/photo-1615876234886-fd9a39fda97f?w=800&h=800&fit=crop' },
        ],
      },
    },
  })

  await prisma.product.create({
    data: {
      storeId,
      categoryId: rustic.id,
      name: 'Mască Rustică Frunze',
      price: 6800,
      isFeatured: false,
      isArchived: false,
      sizeId: s120x60.id,
      colorId: bejNisip.id,
      images: {
        create: [
          { url: 'https://images.unsplash.com/photo-1600607687644-c7171b42498f?w=800&h=800&fit=crop' },
          { url: 'https://images.unsplash.com/photo-1616486029423-aaa4789e8c9a?w=800&h=800&fit=crop' },
        ],
      },
    },
  })

  await prisma.product.create({
    data: {
      storeId,
      categoryId: rustic.id,
      name: 'Mască Rustică Ramuri',
      price: 7500,
      isFeatured: false,
      isArchived: false,
      sizeId: s140x60.id,
      colorId: albMat.id,
      images: {
        create: [
          { url: 'https://images.unsplash.com/photo-1600585153490-76fb20a32601?w=800&h=800&fit=crop' },
          { url: 'https://images.unsplash.com/photo-1631679706909-1844bbd07221?w=800&h=800&fit=crop' },
        ],
      },
    },
  })

  console.log('[SEED] Created 4 Rustic products')

  // Minimalist Collection
  await prisma.product.create({
    data: {
      storeId,
      categoryId: minimalist.id,
      name: 'Mască Minimalistă Val',
      price: 4200,
      isFeatured: true,
      isArchived: false,
      sizeId: s60x40.id,
      colorId: albMat.id,
      images: {
        create: [
          { url: 'https://images.unsplash.com/photo-1600121848594-d8644e57abab?w=800&h=800&fit=crop' },
          { url: 'https://images.unsplash.com/photo-1617325247661-675ab4b64ae2?w=800&h=800&fit=crop' },
        ],
      },
    },
  })

  await prisma.product.create({
    data: {
      storeId,
      categoryId: minimalist.id,
      name: 'Mască Minimalistă Cerc',
      price: 5800,
      isFeatured: true,
      isArchived: false,
      sizeId: s80x60.id,
      colorId: negruMat.id,
      images: {
        create: [
          { url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=800&fit=crop' },
          { url: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=800&h=800&fit=crop' },
        ],
      },
    },
  })

  await prisma.product.create({
    data: {
      storeId,
      categoryId: minimalist.id,
      name: 'Mască Minimalistă Flux',
      price: 6200,
      isFeatured: false,
      isArchived: false,
      sizeId: s100x60.id,
      colorId: griAntracit.id,
      images: {
        create: [
          { url: 'https://images.unsplash.com/photo-1618219908412-a29a1bb7b86e?w=800&h=800&fit=crop' },
          { url: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800&h=800&fit=crop' },
        ],
      },
    },
  })

  await prisma.product.create({
    data: {
      storeId,
      categoryId: minimalist.id,
      name: 'Mască Minimalistă Zen',
      price: 7000,
      isFeatured: false,
      isArchived: false,
      sizeId: s120x60.id,
      colorId: albLucios.id,
      images: {
        create: [
          { url: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=800&h=800&fit=crop' },
          { url: 'https://images.unsplash.com/photo-1615529328331-f8917597711f?w=800&h=800&fit=crop' },
        ],
      },
    },
  })

  console.log('[SEED] Created 4 Minimalist products')

  // ── Summary ─────────────────────────────────────────────────

  const billboardCount = await prisma.billboard.count({ where: { storeId } })
  const categoryCount = await prisma.category.count({ where: { storeId } })
  const sizeCount = await prisma.size.count({ where: { storeId } })
  const colorCount = await prisma.color.count({ where: { storeId } })
  const productCount = await prisma.product.count({ where: { storeId } })
  const imageCount = await prisma.image.count()

  console.log('\n[SEED] ✅ LemnArt Decor seed complete!')
  console.log(`  Billboards: ${billboardCount}`)
  console.log(`  Categories: ${categoryCount}`)
  console.log(`  Sizes:      ${sizeCount}`)
  console.log(`  Colors:     ${colorCount}`)
  console.log(`  Products:   ${productCount}`)
  console.log(`  Images:     ${imageCount}`)
}

main()
  .catch((e) => {
    console.error('[SEED] Error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
