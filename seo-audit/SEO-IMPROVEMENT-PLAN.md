# LemnArt SEO Improvement Plan

**Date:** 2026-03-15
**Site:** LemnArt Store (Next.js 15 storefront, port 3002)
**Overall SEO Score: ~35/100 -- Needs significant work before production deployment**

---

## Executive Summary

The LemnArt storefront has a premium visual design but is severely lacking in SEO fundamentals. Three independent audits (visual, schema markup, sitemap/robots) identified **18 critical issues** that must be resolved before production deployment. The site currently has:

- No sitemap.xml
- No robots.txt
- No structured data (JSON-LD) on any page
- No Open Graph or Twitter Card tags
- No canonical URLs
- No H1 on the homepage
- Horizontal scroll overflow on mobile (all pages)
- Missing page-specific metadata on 5 of 7 page types
- No mobile hamburger menu (nav overflows viewport)

---

## Audit Reports Generated

| Report | Path | Summary |
|--------|------|---------|
| Visual SEO Audit | `seo-audit/VISUAL_SEO_AUDIT_REPORT.md` | 42/100 -- heading hierarchy, mobile, CWV, CTA issues |
| Schema Markup Audit | `seo-audit/schema-audit.md` | 0/100 -- zero structured data found, full JSON-LD templates provided |
| Sitemap & Robots Audit | `seo-audit/sitemap-audit.md` | 0/100 -- no sitemap, no robots.txt, missing metadata |
| Screenshots | `seo-audit/screenshots/` | 32 screenshots across 4 pages x 4 viewports |

---

## Phase 1: Critical Foundation (Week 1)

> These issues will prevent the site from ranking at all. Must be fixed before deployment.

### 1.1 Add `<h1>` to Homepage Hero
**File:** `store/components/sections/hero.tsx`
**Issue:** Hero heading uses `<div>` elements. No H1 exists on the homepage.
**Fix:** Wrap the hero text lines in an `<h1>` tag.

### 1.2 Create `app/robots.ts`
**File:** `store/app/robots.ts` (new)
**Issue:** No robots.txt exists (404 at `/robots.txt`).
**Fix:** Create Next.js built-in robots.ts that allows crawling, blocks `/cart` and `/api/`, and references the sitemap.

### 1.3 Create `app/sitemap.ts`
**File:** `store/app/sitemap.ts` (new)
**Issue:** No sitemap.xml exists (404 at `/sitemap.xml`).
**Fix:** Create dynamic sitemap that fetches products, categories, and blog posts. Include static pages (homepage, contact, blog index).

### 1.4 Add `metadataBase` + Open Graph to Root Layout
**File:** `store/app/layout.tsx`
**Issue:** No canonical URLs, no OG tags, no Twitter Cards, no template for page titles.
**Fix:**
- Add `metadataBase: new URL("https://lemnart.ro")`
- Add `title.template: "%s | LemnArt"`
- Add `openGraph` with type, locale, siteName
- Add `twitter` card config
- Add `alternates.canonical: "/"`

### 1.5 Add `NEXT_PUBLIC_SITE_URL` Environment Variable
**File:** `store/.env` + `store/.env.example`
**Issue:** No production domain configured for canonical URLs and sitemap.
**Fix:** Add `NEXT_PUBLIC_SITE_URL=https://lemnart.ro`

### 1.6 Add Page-Specific Metadata to Product Pages
**File:** `store/app/(routes)/product/[productId]/page.tsx`
**Issue:** Product pages inherit the generic root title. No product-specific title, description, or OG image.
**Fix:** Add `generateMetadata` function that fetches product name, category, and first image for title, description, OG tags, and canonical URL.

### 1.7 Add Page-Specific Metadata to Category Pages
**File:** `store/app/(routes)/category/[categoryId]/page.tsx`
**Issue:** Category pages inherit the generic root title.
**Fix:** Add `generateMetadata` function using the category name (handle "all" special case).

### 1.8 Add Metadata to Contact Page
**File:** `store/app/(routes)/contact/page.tsx`
**Issue:** Contact page uses generic root title. Also, it's a client component so metadata must be extracted.
**Fix:** Extract metadata to a layout wrapper or restructure the page to support static `metadata` export.

### 1.9 Add `noindex` to Cart Page
**File:** `store/app/(routes)/cart/page.tsx`
**Issue:** Cart page has no robots directive and could be indexed with empty/user-specific content.
**Fix:** Add `metadata.robots = { index: false, follow: false }`.

---

## Phase 2: Structured Data (Week 2)

> Rich results drive significantly higher click-through rates. Product schema alone can increase organic clicks by 30-50%.

### 2.1 Site-Wide Organization + LocalBusiness + WebSite Schema
**File:** `store/app/layout.tsx` (or new `store/components/schema/organization-schema.tsx`)
**Impact:** Knowledge Panel, local pack, sitelinks searchbox
**Details:** See `schema-audit.md` section 5.1 for complete JSON-LD template.

### 2.2 Product Schema (Highest Revenue Impact)
**File:** New `store/components/schema/product-schema.tsx`, used in product page
**Impact:** Product rich results with price, availability in search
**Details:** See `schema-audit.md` section 5.3 for React component code.

### 2.3 BlogPosting Schema
**File:** New `store/components/schema/blog-posting-schema.tsx`, used in blog post page
**Impact:** Article rich results with author, date, image
**Details:** See `schema-audit.md` section 5.4 for React component code.

### 2.4 BreadcrumbList Schema (All Pages)
**File:** New `store/components/schema/breadcrumb-schema.tsx`, reusable
**Impact:** Breadcrumb trail in search results
**Fix:** Convert visual breadcrumbs (`<p>` tags) to semantic `<nav>` + `<ol>` + JSON-LD.

### 2.5 Blog List + Category Page Schemas
**Files:** New `store/components/schema/blog-list-schema.tsx` + `store/components/schema/category-schema.tsx`
**Impact:** CollectionPage + ItemList for enhanced listings
**Details:** See `schema-audit.md` sections 5.5 and 5.7.

---

## Phase 3: Mobile & Performance (Week 2-3)

> Google uses mobile-first indexing. Mobile issues directly impact rankings.

### 3.1 Fix Mobile Navigation Overflow
**Files:** `store/components/main-nav.tsx` + `store/components/navbar.tsx`
**Issue:** Nav links overflow viewport at 375px (body becomes 488px wide). No hamburger menu exists.
**Fix:** Implement a hamburger menu / mobile drawer for viewports < 768px. Use `overflow-x: hidden` on `<body>` as a safety net.

### 3.2 Add Video Poster Image + Disable on Mobile
**Files:** `store/app/(routes)/page.tsx` + `store/components/ui/background-video.tsx`
**Issue:** Full MP4 video plays on mobile with no poster fallback. Severely impacts LCP.
**Fix:**
- Change `disableOnMobile={false}` to `disableOnMobile={true}` (or remove the prop to use the component default)
- Add a `posterSrc="/hero-poster.jpg"` with a high-quality still frame
- Create and add the poster image to `store/public/hero-poster.jpg`

### 3.3 Fix Hero CTA Progressive Enhancement
**File:** `store/components/sections/hero.tsx`
**Issue:** Hero CTA starts at `opacity: 0` and `scale: 0.8` via GSAP. Invisible without JS.
**Fix:** Render CTAs visible by default in HTML/CSS. Use GSAP to animate FROM visible (or use CSS `@starting-style` for initial animation).

### 3.4 Add Mobile CTA for "Solicita Oferta"
**File:** `store/components/navbar-actions.tsx`
**Issue:** "Solicita Oferta" button is `hidden md:inline-flex` -- invisible on mobile.
**Fix:** Add the CTA to the mobile hamburger menu, or add a sticky mobile CTA bar.

### 3.5 Fix NavbarActions Hydration Layout Shift
**File:** `store/components/navbar-actions.tsx`
**Issue:** `isMounted` guard returns `null` during SSR, causing layout shift when client hydrates.
**Fix:** Use CSS-based visibility or render a placeholder with the same dimensions during SSR.

---

## Phase 4: Content & Accessibility Polish (Week 3+)

### 4.1 Semantic Breadcrumbs
**Files:** Product, category, blog, contact, cart pages
**Issue:** Breadcrumbs use `<p>` and `<span>` instead of semantic markup.
**Fix:** Create a reusable `<Breadcrumb>` component with `<nav aria-label="Breadcrumb">` + `<ol>` + `<li>`.

### 4.2 Image Alt Text Improvements
**Files:**
- `store/components/gallery/gallery-tab.tsx` -- has `alt=""`
- `store/components/gallery/index.tsx` -- has `alt="Product image"` (generic)
**Fix:** Pass the product name to the gallery and use descriptive alt text: `alt={product.name + " - imagine " + (index + 1)}`.

### 4.3 Text Contrast Audit
**Issue:** Multiple instances of very low contrast text (`text-[var(--th-text-muted)]`, `text-white/70`).
**Fix:** Audit all muted text against WCAG AA (4.5:1) and increase opacity/brightness as needed.

### 4.4 Button Accessibility
**Issue:** 6+ icon-only buttons (carousel arrows) with empty text, below 48x48px touch target.
**Fix:** Add `aria-label` to all icon-only buttons. Increase touch targets to minimum 48x48px.

### 4.5 Add Skip Navigation Link
**File:** `store/app/layout.tsx`
**Issue:** No skip navigation link exists.
**Fix:** Add `<a href="#main-content" class="sr-only focus:not-sr-only">Salt la continut</a>` at the top of the body.

### 4.6 Remove Unused Font Families
**Files:** `store/app/layout.tsx`, Next.js config
**Issue:** Geist and Geist Mono fonts are loaded but unused.
**Fix:** Remove unused font imports. Consider reducing Barlow weight variants.

### 4.7 Review `revalidate = 0` for Production
**Files:** `store/app/(routes)/page.tsx`, `store/app/(routes)/category/[categoryId]/page.tsx`
**Issue:** `revalidate = 0` forces fresh API calls on every request.
**Fix:** Set a reasonable ISR interval for production (e.g., `revalidate = 3600` for 1 hour).

### 4.8 SEO-Friendly Category URLs
**Issue:** Category URLs use UUIDs (e.g., `/category/be8324a6-...`). Not human-readable.
**Future:** Consider slug-based URLs (e.g., `/category/clasic`). This requires database schema changes.

---

## Implementation Checklist

### Phase 1 -- Critical Foundation
- [x] 1.1 Add H1 to homepage hero
- [x] 1.2 Create `app/robots.ts`
- [x] 1.3 Create `app/sitemap.ts`
- [x] 1.4 Add metadataBase + OG to root layout
- [x] 1.5 Add `NEXT_PUBLIC_SITE_URL` env var
- [x] 1.6 Add `generateMetadata` to product pages
- [x] 1.7 Add `generateMetadata` to category pages
- [x] 1.8 Add metadata to contact page
- [x] 1.9 Add `noindex` to cart page

### Phase 2 -- Structured Data
- [x] 2.1 Organization + LocalBusiness + WebSite schema (layout)
- [x] 2.2 Product + Offer schema
- [x] 2.3 BlogPosting schema
- [x] 2.4 BreadcrumbList schema (all pages)
- [x] 2.5 CollectionPage + ItemList schemas

### Phase 3 -- Mobile & Performance
- [x] 3.1 Fix mobile nav overflow (hamburger menu)
- [x] 3.2 Add video poster + disable video on mobile
- [x] 3.3 Fix hero CTA progressive enhancement
- [x] 3.4 Add mobile CTA visibility
- [x] 3.5 Fix NavbarActions hydration shift

### Phase 4 -- Content & Accessibility
- [x] 4.1 Semantic breadcrumbs
- [x] 4.2 Image alt text improvements
- [ ] 4.3 Text contrast audit (requires visual testing)
- [x] 4.4 Button accessibility (aria-labels, touch targets)
- [x] 4.5 Skip navigation link
- [x] 4.6 Remove unused fonts (none found)
- [x] 4.7 Review revalidate settings
- [ ] 4.8 SEO-friendly category URLs (future — requires DB schema changes)

---

## Post-Deployment

After deploying to production:
1. Submit sitemap to Google Search Console
2. Submit sitemap to Bing Webmaster Tools
3. Validate all structured data with Google Rich Results Test
4. Monitor Core Web Vitals in Search Console
5. Set up Google Analytics 4 with enhanced e-commerce tracking
6. Monitor index coverage and fix any crawl errors

---

## NOT Recommended (Deprecated Schemas)

| Schema | Reason |
|--------|--------|
| FAQPage | Restricted to government/healthcare since Aug 2023. Commercial sites do not qualify. |
| HowTo | Rich results removed Sep 2023. |
| SpecialAnnouncement | Deprecated Jul 2025. |

---

*This plan was generated from three independent audits: Visual (Playwright), Schema (code analysis), and Sitemap (endpoint + codebase analysis).*
