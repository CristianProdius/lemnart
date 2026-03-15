# LemnArt Sitemap & Robots.txt Audit Report

**Date:** 2026-03-15
**Site:** http://localhost:3002 (Next.js 15.3.2 storefront)
**Codebase:** `/Users/cristian/Development/lemnArt/store/`

---

## Executive Summary

The LemnArt storefront has **no sitemap.xml** and **no robots.txt** configured. Both endpoints return HTTP 404. There are no sitemap generation files (`app/sitemap.ts`, `next-sitemap` package, or static XML files) anywhere in the codebase. Additionally, no canonical URLs are set on any page, and metadata coverage is incomplete across page types.

**Overall SEO Readiness: CRITICAL -- immediate action required.**

---

## 1. Validation Results

### 1.1 Endpoint Status

| Resource | URL | HTTP Status | Result |
|----------|-----|-------------|--------|
| sitemap.xml | `http://localhost:3002/sitemap.xml` | 404 | **FAIL -- Does not exist** |
| robots.txt | `http://localhost:3002/robots.txt` | 404 | **FAIL -- Does not exist** |

### 1.2 Codebase Search

| Search Target | Location Checked | Found |
|---------------|-----------------|-------|
| `app/sitemap.ts` or `app/sitemap.xml` | `/store/app/` | No |
| Static `sitemap.xml` | `/store/public/` | No |
| `next-sitemap` package | `package.json` dependencies | No |
| `next-sitemap.config.js` | project root | No |
| `app/robots.ts` or `app/robots.txt` | `/store/app/` | No |
| Static `robots.txt` | `/store/public/` | No |

### 1.3 Page-Level Checks

| Page | HTTP Status | Has Metadata (title/desc) | Has Canonical | Has Open Graph |
|------|-------------|---------------------------|---------------|----------------|
| `/` (Homepage) | 200 | Partial (layout-level only) | No | No |
| `/category/all` | 200 | No (inherits layout) | No | No |
| `/category/[categoryId]` | 200 | No (inherits layout) | No | No |
| `/product/[productId]` | 200 | No (inherits layout) | No | No |
| `/blog` | 200 | Yes (title + description) | No | No |
| `/blog/[slug]` | 200 | Yes (dynamic generateMetadata) | No | No |
| `/contact` | 200 | No (inherits layout) | No | No |
| `/cart` | 200 | No (inherits layout) | No | No |

---

## 2. Detailed Findings

### 2.1 CRITICAL: No Sitemap Exists

**Severity: Critical**

Without a sitemap, search engines must discover pages solely through link crawling. This is particularly problematic for:

- **Product pages** (`/product/[productId]`): Dynamic content from the database. Google has no way to discover new products until internal links propagate.
- **Category pages** (`/category/[categoryId]`): Same issue -- database-driven URLs that are invisible to crawlers without a sitemap.
- **Blog posts** (`/blog/[slug]`): While `generateStaticParams` exists for build-time static generation, this only affects Next.js ISR/SSG behavior, not search engine discovery.

### 2.2 CRITICAL: No Robots.txt Exists

**Severity: Critical**

Without `robots.txt`:

- Crawlers have no guidance on what to crawl or avoid.
- No sitemap reference is provided to crawlers.
- Internal/utility routes (if any exist) are not blocked.
- Google Search Console will flag this as a missing resource.

### 2.3 HIGH: No Canonical URLs

**Severity: High**

No `<link rel="canonical">` tags were found on any page. This creates risks for:

- **Category pages with query params**: `/category/[id]?colorId=x&sizeId=y` could be indexed as separate pages, creating massive duplicate content.
- **Trailing slash variations**: `/blog` vs `/blog/` could be treated as separate URLs.
- **Protocol/www variations** once deployed to production.

### 2.4 HIGH: Missing Per-Page Metadata

**Severity: High**

Only 2 out of 7 page types have dedicated metadata:

- `/blog` -- has static `export const metadata` with title and description.
- `/blog/[slug]` -- has dynamic `generateMetadata` function.

Pages missing metadata:
- `/` (Homepage) -- relies only on root layout metadata.
- `/category/[categoryId]` -- no title like "Colectia Clasic -- LemnArt".
- `/product/[productId]` -- no product-specific title or description.
- `/contact` -- no page-specific title.
- `/cart` -- no page-specific title.

### 2.5 MEDIUM: No Open Graph / Twitter Cards

**Severity: Medium**

No Open Graph (`og:title`, `og:description`, `og:image`) or Twitter Card metadata is configured on any page. Shared links on social media will display generic or empty previews.

### 2.6 INFO: Homepage revalidate = 0

**Note:** The homepage sets `export const revalidate = 0`, meaning it re-renders on every request. The category page does the same. This is fine for development but should be reviewed for production (consider ISR with a reasonable revalidation interval for sitemap `lastmod` accuracy).

---

## 3. Page Inventory

### 3.1 Static Pages (known at build time)

| Page | Path | Should Be in Sitemap |
|------|------|---------------------|
| Homepage | `/` | Yes |
| All Products | `/category/all` | Yes |
| Blog Index | `/blog` | Yes |
| Contact | `/contact` | Yes |
| Cart | `/cart` | **No** (user-specific, no indexable content) |

### 3.2 Static Blog Posts (from `/store/lib/blog-data.ts`)

| Slug | Path | Should Be in Sitemap |
|------|------|---------------------|
| `de-ce-mascare-calorifere-din-lemn-masiv` | `/blog/de-ce-mascare-calorifere-din-lemn-masiv` | Yes |
| `ghid-complet-alegerea-dimensiunii-mascare-calorifer` | `/blog/ghid-complet-alegerea-dimensiunii-mascare-calorifer` | Yes |
| `tendinte-design-interior-2026-materiale-naturale` | `/blog/tendinte-design-interior-2026-materiale-naturale` | Yes |

### 3.3 Dynamic Pages (from database via API)

Based on the navbar response, the following categories exist:

| Category | ID | Path |
|----------|----|------|
| Clasic | `be8324a6-6c55-4106-bfd4-1fbe7e8b6a19` | `/category/be8324a6-6c55-4106-bfd4-1fbe7e8b6a19` |
| Modern | `b4bd1e62-6518-4c5a-9dc2-ba5ee03e3831` | `/category/b4bd1e62-6518-4c5a-9dc2-ba5ee03e3831` |
| Rustic | `c392d4d8-010f-4c05-afb3-478e32bc2f42` | `/category/c392d4d8-010f-4c05-afb3-478e32bc2f42` |
| Minimalist | `82bbcb98-0c50-434d-be4a-1a698ae27771` | `/category/82bbcb98-0c50-434d-be4a-1a698ae27771` |

Product pages: Unknown count. Must be fetched dynamically from the admin API.

### 3.4 Pages That Should NOT Be in the Sitemap

| Page | Path | Reason |
|------|------|--------|
| Cart | `/cart` | User-specific, no indexable content |
| Category with filters | `/category/[id]?colorId=x&sizeId=y` | Filtered variants should not be indexed |

---

## 4. Quality Gate Assessment

### 4.1 Location Pages

The site does **not** have location-based pages (e.g., `/bucuresti`, `/cluj`, `/timisoara`). This means:

- No doorway page risk.
- No location page quality gate triggered.

**Status: PASS -- no location pages detected.**

### 4.2 Content Duplication Risk

Category pages with query parameters (`?colorId=...&sizeId=...`) could generate large numbers of crawlable URL variations. Without canonical tags or robots directives, these filter combinations may be indexed as separate pages with duplicate content.

**Risk: MEDIUM -- must be addressed with canonical URLs pointing to the unfiltered category page.**

---

## 5. Recommended Implementation

### 5.1 Recommended Approach: Next.js App Router Built-in (`app/sitemap.ts` + `app/robots.ts`)

Since the project uses Next.js 15 with the App Router, the cleanest approach is to use the **built-in Metadata API** rather than the `next-sitemap` package. Reasons:

1. No additional dependency required.
2. Native support for dynamic sitemaps that fetch from the API.
3. Type-safe with TypeScript.
4. Automatically served at `/sitemap.xml` and `/robots.txt`.

The `next-sitemap` package is better suited for Pages Router projects or very large sites (50,000+ URLs) that need sitemap index splitting. LemnArt is well under this threshold.

### 5.2 Recommended `app/robots.ts`

Create the file at: `/Users/cristian/Development/lemnArt/store/app/robots.ts`

```typescript
import type { MetadataRoute } from "next"

export default function robots(): MetadataRoute.Robots {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://lemnart.ro"

    return {
        rules: [
            {
                userAgent: "*",
                allow: "/",
                disallow: ["/cart", "/api/"],
            },
        ],
        sitemap: `${baseUrl}/sitemap.xml`,
    }
}
```

This will produce:

```
User-agent: *
Allow: /
Disallow: /cart
Disallow: /api/

Sitemap: https://lemnart.ro/sitemap.xml
```

### 5.3 Recommended `app/sitemap.ts`

Create the file at: `/Users/cristian/Development/lemnArt/store/app/sitemap.ts`

```typescript
import type { MetadataRoute } from "next"
import { getAllBlogPosts } from "@/lib/blog-data"
import getCategories from "@/actions/get-categories"
import getProducts from "@/actions/get-products"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://lemnart.ro"

    // --- Static pages ---
    const staticPages: MetadataRoute.Sitemap = [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: "weekly",
            priority: 1.0,
        },
        {
            url: `${baseUrl}/category/all`,
            lastModified: new Date(),
            changeFrequency: "daily",
            priority: 0.9,
        },
        {
            url: `${baseUrl}/blog`,
            lastModified: new Date(),
            changeFrequency: "weekly",
            priority: 0.8,
        },
        {
            url: `${baseUrl}/contact`,
            lastModified: new Date(),
            changeFrequency: "monthly",
            priority: 0.5,
        },
    ]

    // --- Blog posts (from static data) ---
    const blogPosts = getAllBlogPosts()
    const blogPages: MetadataRoute.Sitemap = blogPosts.map((post) => ({
        url: `${baseUrl}/blog/${post.slug}`,
        lastModified: new Date(post.date),
        changeFrequency: "monthly" as const,
        priority: 0.7,
    }))

    // --- Category pages (from API) ---
    let categoryPages: MetadataRoute.Sitemap = []
    try {
        const categories = await getCategories()
        categoryPages = categories.map((category: { id: string; updatedAt: string }) => ({
            url: `${baseUrl}/category/${category.id}`,
            lastModified: new Date(category.updatedAt),
            changeFrequency: "weekly" as const,
            priority: 0.8,
        }))
    } catch (error) {
        console.log("[SITEMAP_CATEGORIES]", error)
    }

    // --- Product pages (from API) ---
    let productPages: MetadataRoute.Sitemap = []
    try {
        const products = await getProducts({})
        productPages = products.map((product: { id: string; updatedAt: string }) => ({
            url: `${baseUrl}/product/${product.id}`,
            lastModified: new Date(product.updatedAt),
            changeFrequency: "weekly" as const,
            priority: 0.9,
        }))
    } catch (error) {
        console.log("[SITEMAP_PRODUCTS]", error)
    }

    return [
        ...staticPages,
        ...blogPages,
        ...categoryPages,
        ...productPages,
    ]
}
```

**Note on `priority` and `changeFrequency`:** These fields are ignored by Google but are still part of the sitemaps protocol and may be used by other search engines (Bing, Yandex). They are included for completeness but can be omitted.

### 5.4 Recommended Root Layout Metadata Enhancements

Update `/Users/cristian/Development/lemnArt/store/app/layout.tsx` metadata:

```typescript
export const metadata: Metadata = {
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://lemnart.ro"),
    title: {
        default: "LemnArt -- Mascare Calorifere Premium din Lemn Masiv",
        template: "%s | LemnArt",
    },
    description:
        "Mascare calorifere din lemn masiv, fabricate artizanal. Design premium, materiale naturale, montaj inclus.",
    openGraph: {
        type: "website",
        locale: "ro_RO",
        siteName: "LemnArt",
        title: "LemnArt -- Mascare Calorifere Premium din Lemn Masiv",
        description:
            "Mascare calorifere din lemn masiv, fabricate artizanal. Design premium, materiale naturale, montaj inclus.",
    },
    twitter: {
        card: "summary_large_image",
    },
    alternates: {
        canonical: "/",
    },
}
```

The `metadataBase` setting is critical -- it enables Next.js to generate absolute canonical URLs and Open Graph URLs automatically.

### 5.5 Per-Page Metadata Additions Needed

Pages that need `generateMetadata` or static `metadata` exports added:

1. **`/product/[productId]/page.tsx`** -- Add `generateMetadata` that fetches product name, description, and image for title, description, og:image, and canonical.

2. **`/category/[categoryId]/page.tsx`** -- Add `generateMetadata` that fetches category name for title and canonical. Must handle the `all` special case.

3. **`/contact/page.tsx`** -- Add static metadata (title, description, canonical). Since this is a client component (`"use client"`), metadata must be extracted into a separate layout or the component must be restructured.

4. **`/cart/page.tsx`** -- Add `noindex` robots directive. Cart pages should not be indexed.

### 5.6 Environment Variable

Add to `.env`:

```
NEXT_PUBLIC_SITE_URL=https://lemnart.ro
```

This variable should be set to the production domain and is used by both `sitemap.ts` and `robots.ts`.

---

## 6. Recommended `robots.txt` Output

When the recommended `app/robots.ts` is implemented, the output will be:

```
User-agent: *
Allow: /
Disallow: /cart
Disallow: /api/

Sitemap: https://lemnart.ro/sitemap.xml
```

---

## 7. Recommended `sitemap.xml` Template

When the recommended `app/sitemap.ts` is implemented, the output (based on current data) will look like:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://lemnart.ro</loc>
    <lastmod>2026-03-15</lastmod>
  </url>
  <url>
    <loc>https://lemnart.ro/category/all</loc>
    <lastmod>2026-03-15</lastmod>
  </url>
  <url>
    <loc>https://lemnart.ro/blog</loc>
    <lastmod>2026-03-15</lastmod>
  </url>
  <url>
    <loc>https://lemnart.ro/contact</loc>
    <lastmod>2026-03-15</lastmod>
  </url>
  <url>
    <loc>https://lemnart.ro/blog/de-ce-mascare-calorifere-din-lemn-masiv</loc>
    <lastmod>2026-03-10</lastmod>
  </url>
  <url>
    <loc>https://lemnart.ro/blog/ghid-complet-alegerea-dimensiunii-mascare-calorifer</loc>
    <lastmod>2026-03-05</lastmod>
  </url>
  <url>
    <loc>https://lemnart.ro/blog/tendinte-design-interior-2026-materiale-naturale</loc>
    <lastmod>2026-02-20</lastmod>
  </url>
  <url>
    <loc>https://lemnart.ro/category/be8324a6-6c55-4106-bfd4-1fbe7e8b6a19</loc>
    <lastmod>2026-03-14</lastmod>
  </url>
  <url>
    <loc>https://lemnart.ro/category/b4bd1e62-6518-4c5a-9dc2-ba5ee03e3831</loc>
    <lastmod>2026-03-14</lastmod>
  </url>
  <url>
    <loc>https://lemnart.ro/category/c392d4d8-010f-4c05-afb3-478e32bc2f42</loc>
    <lastmod>2026-03-14</lastmod>
  </url>
  <url>
    <loc>https://lemnart.ro/category/82bbcb98-0c50-434d-be4a-1a698ae27771</loc>
    <lastmod>2026-03-14</lastmod>
  </url>
  <!-- Product pages would be listed here dynamically -->
</urlset>
```

---

## 8. Validation Checklist Summary

| # | Check | Severity | Status | Action Required |
|---|-------|----------|--------|-----------------|
| 1 | sitemap.xml exists | Critical | FAIL | Create `app/sitemap.ts` |
| 2 | robots.txt exists | Critical | FAIL | Create `app/robots.ts` |
| 3 | Valid XML structure | Critical | N/A | Will be auto-generated by Next.js |
| 4 | URL count < 50,000 | Critical | PASS | Estimated ~20-50 URLs total |
| 5 | All sitemap URLs return 200 | High | N/A | Ensure dynamic fetches are valid |
| 6 | No noindexed URLs in sitemap | High | N/A | Exclude `/cart` |
| 7 | No redirected URLs in sitemap | Medium | N/A | Verify on production |
| 8 | Accurate lastmod dates | Low | N/A | Use `updatedAt` from API, `date` from blog data |
| 9 | No priority/changefreq reliance | Info | N/A | Can include but not relied upon |
| 10 | Canonical URLs configured | High | FAIL | Add `metadataBase` to layout + per-page `alternates.canonical` |
| 11 | Open Graph metadata | Medium | FAIL | Add to layout metadata |
| 12 | Per-page metadata | High | PARTIAL | Only blog pages have metadata; product, category, contact, cart are missing |
| 13 | Cart excluded from indexing | High | FAIL | Add `robots: { index: false }` to cart metadata + `Disallow` in robots.txt |

---

## 9. Priority Action Items

### Immediate (before any production deployment)

1. Create `app/sitemap.ts` with dynamic product/category fetching.
2. Create `app/robots.ts` blocking `/cart` and `/api/`.
3. Add `NEXT_PUBLIC_SITE_URL` environment variable.
4. Add `metadataBase` to root layout for canonical URL generation.

### High Priority (within first sprint)

5. Add `generateMetadata` to `/product/[productId]/page.tsx`.
6. Add `generateMetadata` to `/category/[categoryId]/page.tsx`.
7. Add `noindex` robots directive to `/cart/page.tsx`.
8. Add static metadata to `/contact/page.tsx` (requires refactoring from client component).

### Medium Priority

9. Add Open Graph image generation or default OG images.
10. Consider adding `generateStaticParams` to category and product pages for build-time pre-rendering.
11. Review `revalidate = 0` settings for production ISR strategy.
12. Submit sitemap to Google Search Console after production deployment.

---

## 10. Notes on Category URL Structure

The current category URLs use UUIDs (e.g., `/category/be8324a6-6c55-4106-bfd4-1fbe7e8b6a19`). While functional, this is not ideal for SEO. Consider implementing slug-based URLs (e.g., `/category/clasic`, `/category/modern`) in a future iteration. This would improve:

- URL readability for users and search engines.
- Click-through rates in search results.
- Keyword relevance signals.

This is not a sitemap issue per se, but it affects the quality of URLs that appear in the sitemap.

---

*Report generated on 2026-03-15 by Sitemap Architecture Audit.*
