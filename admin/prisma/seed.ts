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

  const geometricBoard = await prisma.billboard.create({
    data: {
      storeId,
      label: 'Arhitectură Geometrică — Linii curate, impact vizual maxim',
      imageUrl: 'billboards/geometric.webp',
    },
  })

  const floralBoard = await prisma.billboard.create({
    data: {
      storeId,
      label: 'Eleganță Florală — Peste 50 de variații stilistice',
      imageUrl: 'billboards/floral.webp',
    },
  })

  const abstractBoard = await prisma.billboard.create({
    data: {
      storeId,
      label: 'Seria Abstractă — Design contemporan, minimalism pur',
      imageUrl: 'billboards/abstract.webp',
    },
  })

  const prestigioBoard = await prisma.billboard.create({
    data: {
      storeId,
      label: 'Colecția Prestigio — Clasic și Complex',
      imageUrl: 'billboards/prestigio.webp',
    },
  })

  console.log('[SEED] Created 5 billboards')

  // ── Categories ──────────────────────────────────────────────

  const geometric = await prisma.category.create({
    data: {
      storeId,
      billboardId: geometricBoard.id,
      name: 'Geometric',
    },
  })

  const floral = await prisma.category.create({
    data: {
      storeId,
      billboardId: floralBoard.id,
      name: 'Floral',
    },
  })

  const abstract = await prisma.category.create({
    data: {
      storeId,
      billboardId: abstractBoard.id,
      name: 'Abstract',
    },
  })

  const prestigio = await prisma.category.create({
    data: {
      storeId,
      billboardId: prestigioBoard.id,
      name: 'Prestigio',
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

  // Geometric Collection
  await prisma.product.create({
    data: {
      storeId,
      categoryId: geometric.id,
      name: 'Mască Geometrică Diamant',
      price: 5200,
      isFeatured: true,
      isArchived: false,
      sizeId: s100x60.id,
      colorId: albMat.id,
      images: {
        create: [
          { url: 'products/geometric-diamant-1.webp' },
          { url: 'products/geometric-diamant-2.webp' },
        ],
      },
    },
  })

  await prisma.product.create({
    data: {
      storeId,
      categoryId: geometric.id,
      name: 'Mască Geometrică Hexagon',
      price: 4800,
      isFeatured: true,
      isArchived: false,
      sizeId: s80x60.id,
      colorId: albMat.id,
      images: {
        create: [
          { url: 'products/geometric-hexagon-1.webp' },
          { url: 'products/geometric-hexagon-2.webp' },
        ],
      },
    },
  })

  await prisma.product.create({
    data: {
      storeId,
      categoryId: geometric.id,
      name: 'Mască Geometrică Cuburi',
      price: 6500,
      isFeatured: false,
      isArchived: false,
      sizeId: s120x60.id,
      colorId: griAntracit.id,
      images: {
        create: [
          { url: 'products/geometric-cuburi-1.webp' },
          { url: 'products/geometric-cuburi-2.webp' },
        ],
      },
    },
  })

  await prisma.product.create({
    data: {
      storeId,
      categoryId: geometric.id,
      name: 'Mască Geometrică Linii',
      price: 7200,
      isFeatured: false,
      isArchived: false,
      sizeId: s140x60.id,
      colorId: negruMat.id,
      images: {
        create: [
          { url: 'products/geometric-linii-1.webp' },
          { url: 'products/geometric-linii-2.webp' },
        ],
      },
    },
  })

  console.log('[SEED] Created 4 Geometric products')

  // Floral Collection
  await prisma.product.create({
    data: {
      storeId,
      categoryId: floral.id,
      name: 'Mască Florală Trandafir',
      price: 5500,
      isFeatured: true,
      isArchived: false,
      sizeId: s100x60.id,
      colorId: albLucios.id,
      images: {
        create: [
          { url: 'products/floral-trandafir-1.webp' },
          { url: 'products/floral-trandafir-2.webp' },
        ],
      },
    },
  })

  await prisma.product.create({
    data: {
      storeId,
      categoryId: floral.id,
      name: 'Mască Florală Crin',
      price: 5000,
      isFeatured: true,
      isArchived: false,
      sizeId: s80x60.id,
      colorId: bejNisip.id,
      images: {
        create: [
          { url: 'products/floral-crin-1.webp' },
          { url: 'products/floral-crin-2.webp' },
        ],
      },
    },
  })

  await prisma.product.create({
    data: {
      storeId,
      categoryId: floral.id,
      name: 'Mască Florală Frunze',
      price: 6800,
      isFeatured: false,
      isArchived: false,
      sizeId: s120x60.id,
      colorId: verdeOlive.id,
      images: {
        create: [
          { url: 'products/floral-frunze-1.webp' },
          { url: 'products/floral-frunze-2.webp' },
        ],
      },
    },
  })

  await prisma.product.create({
    data: {
      storeId,
      categoryId: floral.id,
      name: 'Mască Florală Bujor',
      price: 7500,
      isFeatured: false,
      isArchived: false,
      sizeId: s140x60.id,
      colorId: albMat.id,
      images: {
        create: [
          { url: 'products/floral-bujor-1.webp' },
          { url: 'products/floral-bujor-2.webp' },
        ],
      },
    },
  })

  console.log('[SEED] Created 4 Floral products')

  // Abstract Collection
  await prisma.product.create({
    data: {
      storeId,
      categoryId: abstract.id,
      name: 'Mască Abstractă Val',
      price: 4500,
      isFeatured: true,
      isArchived: false,
      sizeId: s80x60.id,
      colorId: albMat.id,
      images: {
        create: [
          { url: 'products/abstract-val-1.webp' },
          { url: 'products/abstract-val-2.webp' },
        ],
      },
    },
  })

  await prisma.product.create({
    data: {
      storeId,
      categoryId: abstract.id,
      name: 'Mască Abstractă Cerc',
      price: 5800,
      isFeatured: false,
      isArchived: false,
      sizeId: s100x60.id,
      colorId: negruMat.id,
      images: {
        create: [
          { url: 'products/abstract-cerc-1.webp' },
          { url: 'products/abstract-cerc-2.webp' },
        ],
      },
    },
  })

  await prisma.product.create({
    data: {
      storeId,
      categoryId: abstract.id,
      name: 'Mască Abstractă Flux',
      price: 6200,
      isFeatured: true,
      isArchived: false,
      sizeId: s120x60.id,
      colorId: griAntracit.id,
      images: {
        create: [
          { url: 'products/abstract-flux-1.webp' },
          { url: 'products/abstract-flux-2.webp' },
        ],
      },
    },
  })

  await prisma.product.create({
    data: {
      storeId,
      categoryId: abstract.id,
      name: 'Mască Abstractă Zen',
      price: 7000,
      isFeatured: false,
      isArchived: false,
      sizeId: s140x60.id,
      colorId: albLucios.id,
      images: {
        create: [
          { url: 'products/abstract-zen-1.webp' },
          { url: 'products/abstract-zen-2.webp' },
        ],
      },
    },
  })

  console.log('[SEED] Created 4 Abstract products')

  // Prestigio Collection
  await prisma.product.create({
    data: {
      storeId,
      categoryId: prestigio.id,
      name: 'Mască Prestigio Baroc',
      price: 6500,
      isFeatured: true,
      isArchived: false,
      sizeId: s100x60.id,
      colorId: auriuMetalic.id,
      images: {
        create: [
          { url: 'products/prestigio-baroc-1.webp' },
          { url: 'products/prestigio-baroc-2.webp' },
        ],
      },
    },
  })

  await prisma.product.create({
    data: {
      storeId,
      categoryId: prestigio.id,
      name: 'Mască Prestigio Versailles',
      price: 7800,
      isFeatured: true,
      isArchived: false,
      sizeId: s120x60.id,
      colorId: argintiu.id,
      images: {
        create: [
          { url: 'products/prestigio-versailles-1.webp' },
          { url: 'products/prestigio-versailles-2.webp' },
        ],
      },
    },
  })

  await prisma.product.create({
    data: {
      storeId,
      categoryId: prestigio.id,
      name: 'Mască Prestigio Regal',
      price: 8000,
      isFeatured: false,
      isArchived: false,
      sizeId: s140x60.id,
      colorId: auriuMetalic.id,
      images: {
        create: [
          { url: 'products/prestigio-regal-1.webp' },
          { url: 'products/prestigio-regal-2.webp' },
        ],
      },
    },
  })

  await prisma.product.create({
    data: {
      storeId,
      categoryId: prestigio.id,
      name: 'Mască Prestigio Imperial',
      price: 7200,
      isFeatured: false,
      isArchived: false,
      sizeId: s160x60.id,
      colorId: albMat.id,
      images: {
        create: [
          { url: 'products/prestigio-imperial-1.webp' },
          { url: 'products/prestigio-imperial-2.webp' },
        ],
      },
    },
  })

  console.log('[SEED] Created 4 Prestigio products')

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
