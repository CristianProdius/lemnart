# Schema.org Structured Data Audit -- LemnArt Store

**Date:** 2026-03-15
**Site:** http://localhost:3002 (LemnArt -- Premium Handmade Wooden Radiator Covers)
**Auditor:** Automated Schema.org Specialist

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Detection Results](#2-detection-results)
3. [Page-by-Page Analysis](#3-page-by-page-analysis)
4. [Missing Schema Opportunities](#4-missing-schema-opportunities)
5. [Recommended JSON-LD Implementations](#5-recommended-json-ld-implementations)
6. [Implementation Priority Matrix](#6-implementation-priority-matrix)
7. [Important Notes on Deprecated Schema](#7-important-notes-on-deprecated-schema)

---

## 1. Executive Summary

**Overall Score: 0/10 -- No structured data detected on any page.**

The LemnArt storefront at `localhost:3002` has ZERO structured data markup across all five audited pages. No JSON-LD, no Microdata, and no RDFa was found in any server-rendered HTML output.

This represents a significant missed opportunity for:
- Rich results in Google Search (product snippets, breadcrumbs, FAQ, articles)
- Knowledge Graph eligibility
- Enhanced visibility in Romanian SERPs
- Voice search compatibility
- Google Merchant Center integration

### Pages Audited

| Page | URL | Existing Schema | Status |
|------|-----|----------------|--------|
| Homepage | `/` | None | FAIL |
| Contact | `/contact` | None | FAIL |
| Blog List | `/blog` | None | FAIL |
| Blog Post | `/blog/de-ce-mascare-calorifere-din-lemn-masiv` | None | FAIL |
| Cart | `/cart` | None | FAIL |

### Additional Page Types Reviewed (source code only)

| Page Type | Route | Existing Schema | Status |
|-----------|-------|----------------|--------|
| Product Detail | `/product/[productId]` | None | FAIL |
| Category Listing | `/category/[categoryId]` | None | FAIL |

---

## 2. Detection Results

### 2.1 JSON-LD Detection

Searched for `<script type="application/ld+json">` in all page outputs.

**Result:** NOT FOUND on any page.

### 2.2 Microdata Detection

Searched for `itemscope`, `itemtype`, `itemprop` attributes in all page outputs.

**Result:** NOT FOUND on any page.

### 2.3 RDFa Detection

Searched for `vocab=`, `typeof=`, `property=` attributes in all page outputs.

**Result:** NOT FOUND on any page.

### 2.4 Open Graph / Twitter Cards

Not within the scope of Schema.org audit, but noted: the site uses Next.js `Metadata` export for basic `<title>` and `<meta name="description">` tags only. No Open Graph or Twitter Card meta tags were detected.

---

## 3. Page-by-Page Analysis

### 3.1 Homepage (`/`)

**Source file:** `/Users/cristian/Development/lemnArt/store/app/(routes)/page.tsx`

**Content detected:**
- Hero section with tagline
- Collections/Categories section
- Process section (manufacturing process)
- Quality section
- Featured Products section
- Testimonials section (3 reviews with 5-star ratings)
- FAQ section (5 questions and answers)
- CTA section

**Existing metadata:**
- Title: "LemnArt -- Mascare Calorifere Premium"
- Description: "Mascare calorifere din lemn masiv, fabricate artizanal. Design premium, materiale naturale, montaj inclus."
- `<html lang="ro">`

**Missing schema opportunities:**
- Organization / LocalBusiness (site-wide)
- WebSite with SearchAction (site-wide)
- WebPage
- FAQPage (5 FAQ items hardcoded in component -- see note in Section 7)
- Review / AggregateRating (3 testimonials)
- BreadcrumbList
- ItemList (for featured products)

### 3.2 Contact Page (`/contact`)

**Source file:** `/Users/cristian/Development/lemnArt/store/app/(routes)/contact/page.tsx`

**Content detected:**
- Visual breadcrumb: "Acasa / Contact"
- Contact info: Phone (+40 700 000 000), Email (contact@lemnart.ro), Location (Bucuresti, Romania)
- Business hours: Mon-Fri 09:00-18:00, Sat 10:00-14:00, Sun Closed
- Contact form (name, email, subject, message)

**Existing metadata:**
- Uses root layout metadata (no page-specific override)

**Missing schema opportunities:**
- ContactPage (WebPage subtype)
- LocalBusiness (with openingHours, telephone, email, address)
- BreadcrumbList

### 3.3 Blog List Page (`/blog`)

**Source file:** `/Users/cristian/Development/lemnArt/store/app/(routes)/blog/page.tsx`

**Content detected:**
- Visual breadcrumb: "Acasa / Blog"
- List of 3 blog posts with titles, excerpts, dates, read times, categories
- Page title and description

**Existing metadata:**
- Title: "Blog -- LemnArt | Ghiduri si Inspiratie pentru Designul Interior"
- Description: "Articole despre mascari calorifere din lemn..."

**Missing schema opportunities:**
- CollectionPage / Blog (WebPage subtype)
- BreadcrumbList
- ItemList (listing blog posts)

### 3.4 Blog Post Page (`/blog/de-ce-mascare-calorifere-din-lemn-masiv`)

**Source file:** `/Users/cristian/Development/lemnArt/store/app/(routes)/blog/[slug]/page.tsx`

**Content detected:**
- Full article with title, author ("Echipa LemnArt", "Artizani"), date ("2026-03-10"), read time ("6 min"), category ("Ghid")
- Cover image: `/blog/mascare-lemn.jpg`
- Rich HTML content with headings, paragraphs, lists, blockquotes
- Previous/next post navigation

**Existing metadata:**
- Title: "De ce mascarile calorifere din lemn masiv sunt investitia perfecta pentru casa ta -- LemnArt Blog"
- Description: (excerpt from blog data)

**Missing schema opportunities:**
- BlogPosting (Article subtype)
- BreadcrumbList
- Organization (as publisher)
- Person/Organization (as author)

### 3.5 Cart Page (`/cart`)

**Source file:** `/Users/cristian/Development/lemnArt/store/app/(routes)/cart/page.tsx`

**Content detected:**
- Visual breadcrumb: "Acasa / Cos de cumparaturi"
- Cart items list (client-side rendered)
- Order summary

**Existing metadata:**
- Uses root layout metadata (no page-specific override)

**Missing schema opportunities:**
- BreadcrumbList (low priority -- cart pages are not indexed)

### 3.6 Product Detail Page (source review only)

**Source file:** `/Users/cristian/Development/lemnArt/store/app/(routes)/product/[productId]/page.tsx`

**Content detected from source:**
- Visual breadcrumb: "Acasa / {Category} / {Product Name}"
- Product name, price, size, color, images (gallery)
- Add to cart button
- Related products section

**Data model (from types.ts):**
- `Product { id, category, name, price, isFeatured, size, color, images }`
- `Category { id, name, billboard }`
- `Size { id, name, value }` / `Color { id, name, value }`

**Missing schema opportunities:**
- Product with Offer (HIGHEST PRIORITY)
- BreadcrumbList
- ImageObject (for gallery)

### 3.7 Category Listing Page (source review only)

**Source file:** `/Users/cristian/Development/lemnArt/store/app/(routes)/category/[categoryId]/page.tsx`

**Content detected from source:**
- Category hero with name and product count
- Filter sidebar (size, color)
- Product grid

**Missing schema opportunities:**
- CollectionPage
- BreadcrumbList
- ItemList (products in category)

---

## 4. Missing Schema Opportunities

### CRITICAL (implement immediately)

| Schema Type | Where | Impact |
|-------------|-------|--------|
| Organization | Site-wide (layout) | Knowledge Graph, brand entity |
| LocalBusiness | Site-wide (layout) | Local pack, Google Maps |
| Product + Offer | Product detail pages | Product rich results |
| BreadcrumbList | All pages | Breadcrumb rich results |
| BlogPosting | Blog post pages | Article rich results |
| WebSite + SearchAction | Site-wide (layout) | Sitelinks search box |

### HIGH PRIORITY

| Schema Type | Where | Impact |
|-------------|-------|--------|
| ItemList | Category pages, featured products | Carousel rich results |
| CollectionPage | Blog list, category pages | Page type signal |
| WebPage | All pages | Page type context |

### MEDIUM PRIORITY

| Schema Type | Where | Impact |
|-------------|-------|--------|
| ContactPage | Contact page | Page type signal |
| Review/AggregateRating | Homepage (testimonials) | Review snippets (requires proof of genuine reviews) |

### NOT RECOMMENDED

| Schema Type | Reason |
|-------------|--------|
| FAQPage | Restricted to government/healthcare authority sites since August 2023. LemnArt is a commercial e-commerce site and would not qualify. The FAQ content is valuable for users but should not use FAQPage schema. |
| HowTo | Rich results removed September 2023. Do not implement. |

---

## 5. Recommended JSON-LD Implementations

### 5.1 Site-Wide: Organization + LocalBusiness + WebSite

**File to add:** Root layout (`/Users/cristian/Development/lemnArt/store/app/layout.tsx`)

This single block covers the business entity, local presence, and site-level search. Place it inside `<head>` or at the top of `<body>`.

```json
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": ["LocalBusiness", "FurnitureStore"],
      "@id": "https://lemnart.ro/#organization",
      "name": "LemnArt",
      "alternateName": "LemnArt - Mascare Calorifere Premium",
      "description": "Mascare calorifere din lemn masiv, fabricate artizanal. Design premium, materiale naturale, montaj inclus.",
      "url": "https://lemnart.ro",
      "logo": {
        "@type": "ImageObject",
        "url": "https://lemnart.ro/logo.png"
      },
      "image": "https://lemnart.ro/og-image.jpg",
      "telephone": "+40700000000",
      "email": "contact@lemnart.ro",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "București",
        "addressCountry": "RO"
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": 44.4268,
        "longitude": 26.1025
      },
      "openingHoursSpecification": [
        {
          "@type": "OpeningHoursSpecification",
          "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
          "opens": "09:00",
          "closes": "18:00"
        },
        {
          "@type": "OpeningHoursSpecification",
          "dayOfWeek": "Saturday",
          "opens": "10:00",
          "closes": "14:00"
        }
      ],
      "priceRange": "$$",
      "currenciesAccepted": "RON",
      "paymentAccepted": "Cash, Credit Card, Bank Transfer",
      "areaServed": {
        "@type": "Country",
        "name": "Romania"
      },
      "sameAs": []
    },
    {
      "@type": "WebSite",
      "@id": "https://lemnart.ro/#website",
      "name": "LemnArt",
      "url": "https://lemnart.ro",
      "publisher": {
        "@id": "https://lemnart.ro/#organization"
      },
      "inLanguage": "ro-RO",
      "potentialAction": {
        "@type": "SearchAction",
        "target": {
          "@type": "EntryPoint",
          "urlTemplate": "https://lemnart.ro/category/all?q={search_term_string}"
        },
        "query-input": "required name=search_term_string"
      }
    }
  ]
}
</script>
```

**Action items before deploying:**
- Replace `https://lemnart.ro` with the actual production domain
- Replace `/logo.png` and `/og-image.jpg` with actual asset paths (absolute URLs)
- Add actual latitude/longitude for the business location
- Add social media profiles to the `sameAs` array (e.g., Instagram, Facebook URLs)
- Update `SearchAction` target URL to match the actual site search implementation (if one exists)

---

### 5.2 Homepage: WebPage

**File to add:** `/Users/cristian/Development/lemnArt/store/app/(routes)/page.tsx`

```json
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "WebPage",
  "@id": "https://lemnart.ro/#webpage",
  "url": "https://lemnart.ro/",
  "name": "LemnArt — Mascare Calorifere Premium",
  "description": "Mascare calorifere din lemn masiv, fabricate artizanal. Design premium, materiale naturale, montaj inclus.",
  "isPartOf": {
    "@id": "https://lemnart.ro/#website"
  },
  "about": {
    "@id": "https://lemnart.ro/#organization"
  },
  "inLanguage": "ro-RO"
}
</script>
```

---

### 5.3 Product Detail Page: Product + Offer + BreadcrumbList

**File to modify:** `/Users/cristian/Development/lemnArt/store/app/(routes)/product/[productId]/page.tsx`

This is the HIGHEST IMPACT schema. Product rich results can show price, availability, images, and ratings directly in search.

```json
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Product",
      "@id": "https://lemnart.ro/product/{productId}#product",
      "name": "{product.name}",
      "image": [
        "{product.images[0].url}",
        "{product.images[1].url}"
      ],
      "description": "Mascare calorifer din lemn masiv — {product.name}. Dimensiune: {product.size.value}. Culoare: {product.color.name}.",
      "sku": "{product.id}",
      "brand": {
        "@type": "Brand",
        "name": "LemnArt"
      },
      "category": "{product.category.name}",
      "color": "{product.color.name}",
      "size": "{product.size.value}",
      "material": "Lemn masiv",
      "offers": {
        "@type": "Offer",
        "url": "https://lemnart.ro/product/{productId}",
        "priceCurrency": "RON",
        "price": "{product.price}",
        "availability": "https://schema.org/InStock",
        "seller": {
          "@id": "https://lemnart.ro/#organization"
        },
        "shippingDetails": {
          "@type": "OfferShippingDetails",
          "shippingDestination": {
            "@type": "DefinedRegion",
            "addressCountry": "RO"
          },
          "deliveryTime": {
            "@type": "ShippingDeliveryTime",
            "handlingTime": {
              "@type": "QuantitativeValue",
              "minValue": 14,
              "maxValue": 21,
              "unitCode": "d"
            }
          }
        }
      }
    },
    {
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Acasă",
          "item": "https://lemnart.ro/"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "{product.category.name}",
          "item": "https://lemnart.ro/category/{product.category.id}"
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": "{product.name}"
        }
      ]
    }
  ]
}
</script>
```

**Implementation as a React component:**

Create a reusable component at `/Users/cristian/Development/lemnArt/store/components/schema/product-schema.tsx`:

```tsx
import { Product } from "@/types"

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://lemnart.ro"

interface ProductSchemaProps {
  product: Product
}

const ProductSchema: React.FC<ProductSchemaProps> = ({ product }) => {
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Product",
        "@id": `${SITE_URL}/product/${product.id}#product`,
        name: product.name,
        image: product.images.map((img) => img.url),
        description: `Mascare calorifer din lemn masiv — ${product.name}. Dimensiune: ${product.size?.value}. Culoare: ${product.color?.name}.`,
        sku: product.id,
        brand: {
          "@type": "Brand",
          name: "LemnArt",
        },
        category: product.category?.name,
        material: "Lemn masiv",
        offers: {
          "@type": "Offer",
          url: `${SITE_URL}/product/${product.id}`,
          priceCurrency: "RON",
          price: product.price,
          availability: "https://schema.org/InStock",
          seller: {
            "@id": `${SITE_URL}/#organization`,
          },
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Acasă",
            item: `${SITE_URL}/`,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: product.category?.name,
            item: `${SITE_URL}/category/${product.category?.id}`,
          },
          {
            "@type": "ListItem",
            position: 3,
            name: product.name,
          },
        ],
      },
    ],
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

export default ProductSchema
```

---

### 5.4 Blog Post Page: BlogPosting + BreadcrumbList

**File to modify:** `/Users/cristian/Development/lemnArt/store/app/(routes)/blog/[slug]/page.tsx`

Create a component at `/Users/cristian/Development/lemnArt/store/components/schema/blog-posting-schema.tsx`:

```tsx
import { BlogPost } from "@/lib/blog-data"

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://lemnart.ro"

interface BlogPostingSchemaProps {
  post: BlogPost
}

const BlogPostingSchema: React.FC<BlogPostingSchemaProps> = ({ post }) => {
  // Strip HTML tags for plain-text description
  const plainContent = post.content.replace(/<[^>]*>/g, "").trim()
  const wordCount = plainContent.split(/\s+/).length

  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BlogPosting",
        "@id": `${SITE_URL}/blog/${post.slug}#article`,
        "headline": post.title,
        "description": post.excerpt,
        "image": `${SITE_URL}${post.coverImage}`,
        "datePublished": post.date,
        "dateModified": post.date,
        "wordCount": wordCount,
        "articleSection": post.category,
        "inLanguage": "ro-RO",
        "author": {
          "@type": "Organization",
          "name": post.author.name,
          "url": SITE_URL,
        },
        "publisher": {
          "@id": `${SITE_URL}/#organization`,
        },
        "mainEntityOfPage": {
          "@type": "WebPage",
          "@id": `${SITE_URL}/blog/${post.slug}`,
        },
        "isPartOf": {
          "@id": `${SITE_URL}/#website`,
        },
      },
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Acasă",
            "item": `${SITE_URL}/`,
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "Blog",
            "item": `${SITE_URL}/blog`,
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": post.title,
          },
        ],
      },
    ],
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

export default BlogPostingSchema
```

---

### 5.5 Blog List Page: CollectionPage + BreadcrumbList

**File to modify:** `/Users/cristian/Development/lemnArt/store/app/(routes)/blog/page.tsx`

```json
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "CollectionPage",
      "@id": "https://lemnart.ro/blog#webpage",
      "name": "Blog — LemnArt",
      "description": "Articole despre mascări calorifere din lemn, tendințe în design interior, ghiduri de alegere și inspirație pentru casa ta.",
      "url": "https://lemnart.ro/blog",
      "isPartOf": {
        "@id": "https://lemnart.ro/#website"
      },
      "inLanguage": "ro-RO"
    },
    {
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Acasă",
          "item": "https://lemnart.ro/"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Blog"
        }
      ]
    },
    {
      "@type": "ItemList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "url": "https://lemnart.ro/blog/de-ce-mascare-calorifere-din-lemn-masiv"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "url": "https://lemnart.ro/blog/ghid-complet-alegerea-dimensiunii-mascare-calorifer"
        },
        {
          "@type": "ListItem",
          "position": 3,
          "url": "https://lemnart.ro/blog/tendinte-design-interior-2026-materiale-naturale"
        }
      ]
    }
  ]
}
</script>
```

**Dynamic React component version** at `/Users/cristian/Development/lemnArt/store/components/schema/blog-list-schema.tsx`:

```tsx
import { BlogPost } from "@/lib/blog-data"

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://lemnart.ro"

interface BlogListSchemaProps {
  posts: BlogPost[]
}

const BlogListSchema: React.FC<BlogListSchemaProps> = ({ posts }) => {
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": `${SITE_URL}/blog#webpage`,
        name: "Blog — LemnArt",
        description:
          "Articole despre mascări calorifere din lemn, tendințe în design interior, ghiduri de alegere și inspirație pentru casa ta.",
        url: `${SITE_URL}/blog`,
        isPartOf: { "@id": `${SITE_URL}/#website` },
        inLanguage: "ro-RO",
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Acasă",
            item: `${SITE_URL}/`,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Blog",
          },
        ],
      },
      {
        "@type": "ItemList",
        itemListElement: posts.map((post, index) => ({
          "@type": "ListItem",
          position: index + 1,
          url: `${SITE_URL}/blog/${post.slug}`,
        })),
      },
    ],
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

export default BlogListSchema
```

---

### 5.6 Contact Page: ContactPage + LocalBusiness + BreadcrumbList

**File to modify:** `/Users/cristian/Development/lemnArt/store/app/(routes)/contact/page.tsx`

Since this is a client component (`"use client"`), the JSON-LD must be added differently. Consider extracting the contact page metadata to a separate server-rendered wrapper, or injecting the schema via `<Script>` from `next/script`.

```json
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "ContactPage",
      "@id": "https://lemnart.ro/contact#webpage",
      "name": "Contact — LemnArt",
      "description": "Contactează echipa LemnArt pentru informații despre mascare calorifere din lemn masiv, comenzi personalizate sau montaj.",
      "url": "https://lemnart.ro/contact",
      "isPartOf": {
        "@id": "https://lemnart.ro/#website"
      },
      "inLanguage": "ro-RO"
    },
    {
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Acasă",
          "item": "https://lemnart.ro/"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Contact"
        }
      ]
    }
  ]
}
</script>
```

---

### 5.7 Category Page: CollectionPage + BreadcrumbList + ItemList

**File to modify:** `/Users/cristian/Development/lemnArt/store/app/(routes)/category/[categoryId]/page.tsx`

Create a component at `/Users/cristian/Development/lemnArt/store/components/schema/category-schema.tsx`:

```tsx
import { Product, Category } from "@/types"

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://lemnart.ro"

interface CategorySchemaProps {
  category: Category | null
  products: Product[]
  isAll: boolean
}

const CategorySchema: React.FC<CategorySchemaProps> = ({
  category,
  products,
  isAll,
}) => {
  const categoryName = isAll ? "Toate Produsele" : category?.name ?? ""
  const categoryUrl = isAll
    ? `${SITE_URL}/category/all`
    : `${SITE_URL}/category/${category?.id}`

  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": `${categoryUrl}#webpage`,
        name: `${categoryName} — LemnArt`,
        url: categoryUrl,
        isPartOf: { "@id": `${SITE_URL}/#website` },
        inLanguage: "ro-RO",
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Acasă",
            item: `${SITE_URL}/`,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: categoryName,
          },
        ],
      },
      {
        "@type": "ItemList",
        itemListElement: products.map((product, index) => ({
          "@type": "ListItem",
          position: index + 1,
          url: `${SITE_URL}/product/${product.id}`,
        })),
      },
    ],
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

export default CategorySchema
```

---

### 5.8 Cart Page

The cart page does NOT need structured data. Cart pages are typically:
- Blocked from indexing via `noindex` meta tag or `robots.txt`
- Not relevant for rich results
- Dynamic client-side content

**Recommendation:** Add `<meta name="robots" content="noindex, nofollow" />` to the cart page instead.

---

## 6. Implementation Priority Matrix

### Phase 1 -- Immediate (Week 1)

| Priority | Schema | Page(s) | Rich Result Type | File |
|----------|--------|---------|-------------------|------|
| P0 | Organization + LocalBusiness + WebSite | All (layout) | Knowledge Panel, Sitelinks | `store/app/layout.tsx` |
| P0 | Product + Offer | Product detail | Product snippets | `store/app/(routes)/product/[productId]/page.tsx` |
| P0 | BlogPosting | Blog posts | Article snippets | `store/app/(routes)/blog/[slug]/page.tsx` |
| P0 | BreadcrumbList | All pages | Breadcrumb trails | Each page file |

### Phase 2 -- High Priority (Week 2)

| Priority | Schema | Page(s) | Rich Result Type | File |
|----------|--------|---------|-------------------|------|
| P1 | CollectionPage + ItemList | Category pages | Enhanced listings | `store/app/(routes)/category/[categoryId]/page.tsx` |
| P1 | CollectionPage + ItemList | Blog list | Enhanced listings | `store/app/(routes)/blog/page.tsx` |
| P1 | ContactPage | Contact | Page type signal | `store/app/(routes)/contact/page.tsx` |
| P1 | WebPage | Homepage | Page type signal | `store/app/(routes)/page.tsx` |

### Phase 3 -- Nice to Have (Week 3+)

| Priority | Schema | Page(s) | Note |
|----------|--------|---------|------|
| P2 | AggregateRating on Organization | Layout | Only if you have a verified review collection system |
| P2 | `noindex` on cart | Cart | SEO hygiene, not schema |
| P2 | Open Graph + Twitter Cards | All pages | Not Schema.org but critical for social sharing |

---

## 7. Important Notes on Deprecated Schema

### FAQPage -- DO NOT USE

The homepage has a well-designed FAQ section with 5 questions (defined in `/Users/cristian/Development/lemnArt/store/components/sections/faq.tsx`):

1. "Cat dureaza o comanda personalizata?"
2. "Ce materiale folositi?"
3. "Oferiti montaj?"
4. "Mascarea afecteaza eficienta caloriferului?"
5. "Care este zona de livrare?"

**However, FAQPage schema is RESTRICTED since August 2023.** Google only displays FAQ rich results for government and healthcare authority websites. LemnArt is a commercial e-commerce site and would NOT qualify. Implementing FAQPage schema would:
- Not generate any rich results
- Potentially trigger a manual action if Google views it as an attempt to game the system

**Alternative:** The FAQ content is still valuable for users and for SEO (keyword-rich content on the page). It simply should not be marked up with FAQPage structured data.

### HowTo -- DO NOT USE

The "Process" section on the homepage describes the manufacturing steps. Do NOT mark this up as HowTo schema -- Google removed HowTo rich results in September 2023.

### SpecialAnnouncement -- DO NOT USE

Deprecated July 31, 2025. Not relevant to this site but noted for completeness.

---

## 8. Implementation Architecture Recommendation

### Recommended File Structure

```
store/
  components/
    schema/
      organization-schema.tsx    <-- Site-wide, used in layout.tsx
      product-schema.tsx         <-- Product detail pages
      blog-posting-schema.tsx    <-- Blog post pages
      blog-list-schema.tsx       <-- Blog list page
      category-schema.tsx        <-- Category pages
      breadcrumb-schema.tsx      <-- Reusable breadcrumb component
      contact-page-schema.tsx    <-- Contact page
```

### Key Implementation Details

1. **All schema components should be server components** (no `"use client"` directive) so JSON-LD renders in the initial HTML that search engines crawl.

2. **Use an environment variable** for the site URL:
   ```
   NEXT_PUBLIC_SITE_URL=https://lemnart.ro
   ```

3. **Place `<script type="application/ld+json">` tags** via `dangerouslySetInnerHTML` in server components. This ensures they appear in the server-rendered HTML.

4. **For client components** (like the Contact page), either:
   - Wrap them in a server component that includes the schema
   - Or use Next.js `<Script>` component with `strategy="beforeInteractive"`

5. **Validate all implementations** using:
   - Google Rich Results Test: https://search.google.com/test/rich-results
   - Schema.org Validator: https://validator.schema.org/
   - Google Search Console (after deployment)

---

## 9. Validation Checklist Template

Use this checklist for each schema block after implementation:

- [ ] `@context` is `"https://schema.org"` (not http)
- [ ] `@type` is valid and not deprecated
- [ ] All required properties present for the type
- [ ] All recommended properties included where data is available
- [ ] No placeholder text (e.g., `[Business Name]`, `{variable}`)
- [ ] All URLs are absolute (start with `https://`)
- [ ] All dates are ISO 8601 format (YYYY-MM-DD or full datetime)
- [ ] Price values are numeric strings without currency symbols
- [ ] `priceCurrency` uses ISO 4217 code (`RON`)
- [ ] `availability` uses full Schema.org URL (`https://schema.org/InStock`)
- [ ] Image URLs are absolute and accessible
- [ ] No circular references or orphaned `@id` references
- [ ] Passes Google Rich Results Test without errors
- [ ] Passes Schema.org Validator without errors

---

*End of audit report.*
