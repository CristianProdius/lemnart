# Product Data Specification — LemnArt Decor

Source of truth for all database-seeded data. Maps directly to Prisma models.

**Store ID:** `da911c75-62a2-4064-8f09-d94503f0900d`

---

## Billboards

| # | Variable | Label (Romanian) | Image |
|---|----------|-------------------|-------|
| 1 | `heroBoard` | Atelier de Design — Artă în fiecare detaliu | `billboards/hero.webp` |
| 2 | `geometricBoard` | Arhitectură Geometrică — Linii curate, impact vizual maxim | `billboards/geometric.webp` |
| 3 | `floralBoard` | Eleganță Florală — Peste 50 de variații stilistice | `billboards/floral.webp` |
| 4 | `abstractBoard` | Seria Abstractă — Design contemporan, minimalism pur | `billboards/abstract.webp` |
| 5 | `prestigioBoard` | Colecția Prestigio — Clasic și Complex | `billboards/prestigio.webp` |

**Image convention:** `${MINIO_BUCKET_URL}/billboards/<name>.webp`

---

## Categories

| # | Variable | Name | Billboard |
|---|----------|------|-----------|
| 1 | `geometric` | Geometric | `geometricBoard` |
| 2 | `floral` | Floral | `floralBoard` |
| 3 | `abstract` | Abstract | `abstractBoard` |
| 4 | `prestigio` | Prestigio | `prestigioBoard` |

---

## Sizes

Radiator mask dimensions (width × height in cm).

| # | Name | Value |
|---|------|-------|
| 1 | 60×40 | `60x40` |
| 2 | 80×60 | `80x60` |
| 3 | 100×60 | `100x60` |
| 4 | 120×60 | `120x60` |
| 5 | 140×60 | `140x60` |
| 6 | 160×60 | `160x60` |

---

## Colors

Available paint finishes.

| # | Name (Romanian) | Hex Value |
|---|-----------------|-----------|
| 1 | Alb Mat | `#FFFFFF` |
| 2 | Alb Lucios | `#FAFAFA` |
| 3 | Negru Mat | `#1A1A1A` |
| 4 | Gri Antracit | `#36454F` |
| 5 | Auriu Metalic | `#D4AF37` |
| 6 | Argintiu | `#C0C0C0` |
| 7 | Bej Nisip | `#C2B280` |
| 8 | Verde Olive | `#556B2F` |

---

## Products

### Geometric Collection (4 products)

| # | Name | Price (MDL) | Size | Color | Featured | Archived |
|---|------|-------------|------|-------|----------|----------|
| 1 | Mască Geometrică Diamant | 5,200 | 100×60 | Alb Mat | Yes | No |
| 2 | Mască Geometrică Hexagon | 4,800 | 80×60 | Alb Mat | Yes | No |
| 3 | Mască Geometrică Cuburi | 6,500 | 120×60 | Gri Antracit | No | No |
| 4 | Mască Geometrică Linii | 7,200 | 140×60 | Negru Mat | No | No |

**Images:** 2 per product, `products/geometric-diamant-1.webp`, `products/geometric-diamant-2.webp`, etc.

### Floral Collection (4 products)

| # | Name | Price (MDL) | Size | Color | Featured | Archived |
|---|------|-------------|------|-------|----------|----------|
| 5 | Mască Florală Trandafir | 5,500 | 100×60 | Alb Lucios | Yes | No |
| 6 | Mască Florală Crin | 5,000 | 80×60 | Bej Nisip | Yes | No |
| 7 | Mască Florală Frunze | 6,800 | 120×60 | Verde Olive | No | No |
| 8 | Mască Florală Bujor | 7,500 | 140×60 | Alb Mat | No | No |

**Images:** 2 per product, `products/floral-trandafir-1.webp`, `products/floral-trandafir-2.webp`, etc.

### Abstract Collection (4 products)

| # | Name | Price (MDL) | Size | Color | Featured | Archived |
|---|------|-------------|------|-------|----------|----------|
| 9 | Mască Abstractă Val | 4,500 | 80×60 | Alb Mat | Yes | No |
| 10 | Mască Abstractă Cerc | 5,800 | 100×60 | Negru Mat | No | No |
| 11 | Mască Abstractă Flux | 6,200 | 120×60 | Gri Antracit | Yes | No |
| 12 | Mască Abstractă Zen | 7,000 | 140×60 | Alb Lucios | No | No |

**Images:** 2 per product, `products/abstract-val-1.webp`, `products/abstract-val-2.webp`, etc.

### Prestigio Collection (4 products)

| # | Name | Price (MDL) | Size | Color | Featured | Archived |
|---|------|-------------|------|-------|----------|----------|
| 13 | Mască Prestigio Baroc | 6,500 | 100×60 | Auriu Metalic | Yes | No |
| 14 | Mască Prestigio Versailles | 7,800 | 120×60 | Argintiu | Yes | No |
| 15 | Mască Prestigio Regal | 8,000 | 140×60 | Auriu Metalic | No | No |
| 16 | Mască Prestigio Imperial | 7,200 | 160×60 | Alb Mat | No | No |

**Images:** 2 per product, `products/prestigio-baroc-1.webp`, `products/prestigio-baroc-2.webp`, etc.

---

## Summary

| Resource | Count |
|----------|-------|
| Billboards | 5 |
| Categories | 4 |
| Sizes | 6 |
| Colors | 8 |
| Products | 16 |
| Images | 32 (2 per product) |

**Price range:** 4,500 – 8,000 MDL
**Featured products:** 8 (2 per category)
