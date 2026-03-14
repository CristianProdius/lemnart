---
name: seed-db
description: Generate a Prisma seed script with test data for development
user_invocable: true
arguments:
  - name: models
    description: "Comma-separated model names to seed (e.g. 'store,billboard,category'). Defaults to all models"
    required: false
---

# Generate Database Seed Script

Create a Prisma seed script that populates the database with realistic test data for development.

## Inputs

- `$ARGUMENTS.models` — comma-separated models to seed (default: all — store, billboard, category, size, color, product)

## Output Path

`admin/prisma/seed.ts`

## Template

```typescript
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    // Clean existing data (in reverse dependency order)
    await prisma.orderItem.deleteMany()
    await prisma.order.deleteMany()
    await prisma.image.deleteMany()
    await prisma.product.deleteMany()
    await prisma.category.deleteMany()
    await prisma.billboard.deleteMany()
    await prisma.size.deleteMany()
    await prisma.color.deleteMany()
    // Note: Don't delete stores or users — seed assumes a store already exists
    // or creates one linked to an existing user

    const storeId = 'STORE_ID_HERE' // Replace with actual store ID or prompt user

    // Billboards
    const billboard1 = await prisma.billboard.create({
        data: {
            storeId,
            label: 'Summer Collection',
            imageUrl: 'https://via.placeholder.com/1200x400',
        }
    })

    // Categories
    const category1 = await prisma.category.create({
        data: {
            storeId,
            billboardId: billboard1.id,
            name: 'T-Shirts',
        }
    })

    // Sizes
    const sizes = await Promise.all(
        [
            { name: 'Small', value: 'S' },
            { name: 'Medium', value: 'M' },
            { name: 'Large', value: 'L' },
            { name: 'Extra Large', value: 'XL' },
        ].map(s => prisma.size.create({ data: { ...s, storeId } }))
    )

    // Colors
    const colors = await Promise.all(
        [
            { name: 'Black', value: '#000000' },
            { name: 'White', value: '#FFFFFF' },
            { name: 'Red', value: '#FF0000' },
            { name: 'Blue', value: '#0000FF' },
        ].map(c => prisma.color.create({ data: { ...c, storeId } }))
    )

    // Products
    await prisma.product.create({
        data: {
            storeId,
            categoryId: category1.id,
            name: 'Classic T-Shirt',
            price: 29.99,
            isFeatured: true,
            isArchived: false,
            sizeId: sizes[1].id, // Medium
            colorId: colors[0].id, // Black
            images: {
                create: [
                    { url: 'https://via.placeholder.com/400x400' }
                ]
            }
        }
    })

    console.log('Seed data created successfully')
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
```

## Instructions

1. Ask the user for their store ID (or suggest they check the database / URL).
2. Generate the seed script at `admin/prisma/seed.ts`.
3. If `$ARGUMENTS.models` is provided, only include seed data for those models (respecting dependency order).
4. Add realistic sample data appropriate for an e-commerce store.
5. After creating the file, tell the user to run:
   ```bash
   cd /Users/cristian/Development/lemnArt/admin && npx tsx prisma/seed.ts
   ```
6. Also suggest adding a seed script to `package.json` if not already present:
   ```json
   "prisma": { "seed": "tsx prisma/seed.ts" }
   ```
   Then they can run `npx prisma db seed`.

## Notes

- The seed script deletes existing data in dependency order before inserting.
- It does NOT delete stores or users to avoid breaking auth.
- Adjust placeholder image URLs to real ones if the project has cloud storage configured.
