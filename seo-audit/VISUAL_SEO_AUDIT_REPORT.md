# Visual SEO Audit Report -- LemnArt Store

**Date:** 2026-03-15
**URL:** http://localhost:3002
**Tool:** Playwright Chromium (automated screenshots + DOM extraction)
**Viewports tested:** Desktop (1920x1080), Laptop (1366x768), Tablet (768x1024), Mobile (375x812)
**Pages audited:** Homepage, Contact, Blog, Cart

---

## Executive Summary

The LemnArt storefront is a visually polished, dark-themed e-commerce site for artisan radiator covers. The design is elegant with high-quality typography (Instrument Serif + Barlow + Urbanist) and smooth GSAP animations. However, the audit uncovered several **critical SEO and accessibility issues** that will materially harm search engine rankings and user experience, particularly on mobile devices.

**Overall SEO Health Score: 42/100**

| Category | Score | Status |
|----------|-------|--------|
| Heading Hierarchy | 25/100 | CRITICAL |
| Meta Tags & Open Graph | 30/100 | CRITICAL |
| Mobile Responsiveness | 40/100 | CRITICAL |
| Image Optimization | 75/100 | MODERATE |
| Core Web Vitals Indicators | 35/100 | CRITICAL |
| Text Contrast & Readability | 65/100 | NEEDS WORK |
| CTA Visibility & Accessibility | 50/100 | NEEDS WORK |
| Structured Data | 0/100 | CRITICAL |
| Accessibility Fundamentals | 35/100 | CRITICAL |

---

## 1. HEADING HIERARCHY -- Score: 25/100 [CRITICAL]

### Homepage: Missing H1

The homepage has **zero H1 tags**. The hero heading "Artizanatul care iti transforma casa." is rendered as two `<div>` elements (lines 166-196 of `hero.tsx`), not as an `<h1>`. This is the single most important on-page SEO signal for the most important page on the site.

**What search engines see:**
- No H1 at all
- First heading encountered: H2 "Colectiile Noastre" (at y=1272px, far below the fold)
- 7x H2 headings, 20x H3 headings -- but no H1 to anchor the hierarchy

**Other pages:**
- Contact: H1 "Contacteaza-ne" -- present and correct
- Blog: H1 "Blog" -- present and correct
- Cart: H1 "Cos de cumparaturi" -- present and correct

**Issues:**
1. Homepage hero text is `<div>` instead of `<h1>` -- CRITICAL
2. H3 collection names (Clasic, Modern, Rustic, Minimalist) are 72px -- larger than the H2 headings (60px). Visual hierarchy contradicts semantic hierarchy.
3. "SUMAR COMANDA" on the cart page is an H2 at 12px font size -- semantic heading used for visual styling purposes

### Recommendations:
- Wrap the hero heading in an `<h1>` tag instead of the current `<div>` elements
- Ensure visual font sizes align with semantic heading levels (H2 should appear larger than H3)
- Use CSS classes or `<span>` for visual styling instead of misusing heading tags

---

## 2. META TAGS & OPEN GRAPH -- Score: 30/100 [CRITICAL]

### Homepage, Contact, Cart -- Shared default metadata
All three pages use the same root layout metadata:
- **Title:** "LemnArt -- Mascare Calorifere Premium"
- **Description:** "Mascare calorifere din lemn masiv, fabricate artizanal..."

This means:
- Contact page has NO page-specific title (should be "Contact -- LemnArt")
- Cart page has NO page-specific title (should be "Cos de Cumparaturi -- LemnArt")
- Duplicate title tags across 3 of 4 pages

### Blog -- Has custom metadata (good)
- **Title:** "Blog -- LemnArt | Ghiduri si Inspiratie pentru Designul Interior"
- **Description:** Custom and relevant

### Missing across ALL pages:
| Meta Tag | Status |
|----------|--------|
| Canonical URL | NOT SET on any page |
| og:title | NOT SET |
| og:description | NOT SET |
| og:image | NOT SET |
| og:type | NOT SET |
| twitter:card | NOT SET |
| twitter:title | NOT SET |
| meta robots | NOT SET (defaults to index,follow -- acceptable) |
| Structured Data (JSON-LD) | ZERO items on any page |

### Recommendations:
- Add page-specific metadata exports to Contact and Cart page components
- Add Open Graph meta tags to the root layout (at minimum og:title, og:description, og:image, og:type)
- Add Twitter Card meta tags
- Set canonical URLs on all pages
- Add JSON-LD structured data: Organization, LocalBusiness, BreadcrumbList, Product schemas

---

## 3. MOBILE RESPONSIVENESS -- Score: 40/100 [CRITICAL]

### Horizontal Scroll Overflow -- ALL pages on mobile

Every single page at 375px viewport width has a horizontal scroll issue:
- **Body width: 488px vs viewport: 375px** (113px overflow)

This is detected on Homepage, Contact, Blog, and Cart at mobile width. This is a **Core Web Vitals CLS penalty** and a significant usability problem. Users will see unwanted horizontal scrolling.

**Root cause investigation:** The navigation bar at mobile width renders all category links (Clasic, Modern, Rustic, Minimalist) horizontally without wrapping or a hamburger menu. At 375px, the nav items plus the cart button exceed the viewport width, pushing the body to 488px.

From `navbar.tsx` and `main-nav.tsx`:
- The nav uses `flex items-center mx-6 space-x-4` with no overflow handling
- No hamburger menu exists for mobile
- The "Solicita Oferta" CTA is hidden on mobile (`hidden md:inline-flex`) but the nav links remain

### "Solicita Oferta" CTA -- invisible on mobile
The primary CTA button renders at **0x0 pixels** on mobile (it has `hidden md:inline-flex`). This means mobile users have no visible way to request a quote from the navbar.

### Navigation accessibility on mobile
- No hamburger menu
- No mobile nav drawer
- Category links overflow the viewport
- Touch targets for nav links are small text links without adequate padding

### Recommendations:
- Implement a hamburger menu for viewport widths below 768px
- Add `overflow-x: hidden` to the body/html as a safety net
- Wrap nav items or move them into a collapsible drawer on mobile
- Ensure the "Solicita Oferta" CTA or equivalent is accessible on mobile (could be in the mobile menu)

---

## 4. IMAGE OPTIMIZATION -- Score: 75/100 [MODERATE]

### Positive findings:
- All 10 images on the homepage have `alt` attributes set
- Alt text is descriptive (e.g., "Masca Minimalista Cerc", "Masca Rustica Stejar")
- All images use `loading="lazy"` -- correct for below-the-fold images
- Images are served through Next.js Image optimization (`/_next/image`)

### Issues:
- Collection images (Clasic, Modern, Rustic, Minimalist) have negative rect positions (x=-152, y=-190), suggesting they are clipped/hidden elements that may still be downloaded
- Alt text is generic single-word for collection images ("Clasic", "Modern") -- should be more descriptive
- No images exist on Contact, Blog, or Cart pages -- blog articles would benefit from featured images
- The hero video has no poster image specified in the component call (`posterSrc` is not passed)

### Recommendations:
- Add a `posterSrc` to the Hero component for the homepage -- this provides a static image while the video loads
- Make collection image alt text more descriptive (e.g., "Masca calorifer stil clasic din lemn masiv")
- Consider adding featured images to blog article listings

---

## 5. CORE WEB VITALS INDICATORS -- Score: 35/100 [CRITICAL]

### LCP (Largest Contentful Paint) -- HIGH RISK

**Desktop LCP candidate:** The `<video>` element covering the full viewport (area: 2,073,600px2). Video as LCP element is problematic because:
- Video files are large and take time to decode
- The hero video (`/hero-bg.mp4`) loads with `preload="metadata"`, meaning the full video streams after page load
- No poster image is specified, so the first frame must be decoded before anything appears
- GSAP animation starts the video at `scale: 1.2` with opacity animation, adding render delay

**Mobile LCP candidate:** Same video element (area: 304,500px2), which is even worse on mobile:
- `disableOnMobile` is set to `false` in the Hero component call, meaning mobile devices download and play the full video
- Mobile networks have higher latency and lower bandwidth
- Video autoplay on mobile can consume significant data

### CLS (Cumulative Layout Shift) -- HIGH RISK

- Horizontal overflow on mobile (488px vs 375px) causes layout instability
- GSAP animations apply `y: 80`, `opacity: 0`, `filter: blur(8px)` transforms during page load -- elements snap into position after JavaScript loads
- Font loading: 23 font faces loaded, with fallback fonts (`Barlow Fallback`, `Instrument Serif Fallback`, `Urbanist Fallback`) visible on mobile -- font swap causes text reflow
- NavbarActions returns `null` during SSR (`isMounted` check), then renders client-side -- causes layout shift in the navbar

### FID/INP -- MODERATE RISK

- Heavy GSAP + ScrollTrigger JavaScript on the homepage
- Multiple scroll-triggered animations throughout the page
- 23 font faces loaded (many variants)

### Recommendations:
- Pass `disableOnMobile={true}` (or remove `disableOnMobile={false}`) and provide a static poster image for mobile
- Add a poster image to the video for immediate visual content
- Add `font-display: swap` or `optional` to font loading (Next.js font config)
- Remove the `isMounted` guard in NavbarActions or use CSS-based visibility instead
- Pre-render the hero content server-side without relying on GSAP for initial visibility (start elements visible, then enhance with animation)

---

## 6. TEXT CONTRAST & READABILITY -- Score: 65/100 [NEEDS WORK]

### Positive:
- Body base font size is 16px -- meets minimum readability threshold
- Dark background with light text provides generally good contrast
- Heading typography (Instrument Serif italic) is elegant and readable at large sizes

### Issues:

**Hero subtitle text:**
- Class: `text-white/70` (white at 70% opacity on dark background with video behind it)
- The subtitle "Mascare calorifere din lemn masiv, create manual..." overlaps with the product image on desktop, reducing legibility
- The 50% black overlay (`bg-black/50`) helps but the video content underneath still causes variable contrast

**Secondary text throughout:**
- Multiple instances of `text-[var(--th-text-tertiary)]` and `text-[var(--th-text-muted)]` -- these appear as very low contrast gray text on the dark background
- Blog post descriptions and dates use muted colors that may fail WCAG AA contrast ratio (4.5:1 minimum)

**Contact page:**
- Form labels use muted text colors
- The "Inchis" (Closed) text for Sunday hours is in a very light gray

**Cart page:**
- "COSUL ESTE GOL" and "Adaugati produse pentru a continua" use low-contrast muted text

### Recommendations:
- Audit all text colors against the background using WCAG AA contrast checker
- Increase subtitle opacity to at least `text-white/80` or use a stronger overlay
- Ensure form labels meet 4.5:1 contrast ratio minimum
- Consider adding a subtle text-shadow to hero text for improved legibility over video

---

## 7. FONT LOADING PERFORMANCE -- Score: 55/100 [NEEDS WORK]

### Font inventory:
- **Instrument Serif** (italic, weight 400) -- used for headings
- **Barlow** (weights 400, 500, 600, 700) -- used for UI text and CTAs
- **Urbanist** -- used as body font
- **Geist** and **Geist Mono** -- loaded by Next.js but appear unused (status: unloaded)

### Issues:
- **23 total font face entries** -- excessive for a storefront
- On mobile, fallback fonts are visibly loaded (`Barlow Fallback: loaded`, `Instrument Serif Fallback: loaded`), confirming FOUT (Flash of Unstyled Text) occurs
- `__nextjs-Geist` and `__nextjs-Geist Mono` are loaded but never used -- dead weight
- Barlow loads 4 weights -- verify all are actually used; reducing to 2-3 would improve load time

### Recommendations:
- Remove unused Geist/Geist Mono font imports if they come from a template
- Reduce Barlow weight variants to only those actually used
- Consider using `font-display: optional` for secondary fonts to prevent CLS
- Preload the primary heading font (Instrument Serif) via `<link rel="preload">`

---

## 8. VIDEO BACKGROUND IMPACT ON MOBILE -- Score: 40/100 [CRITICAL]

### Current behavior:
- The Hero component passes `disableOnMobile={false}`, overriding the default `disableOnMobile={true}` in BackgroundVideo
- This means the full MP4 video plays on mobile devices, consuming bandwidth and battery
- No `posterSrc` is provided, so there is no static fallback image

### Performance impact:
- Video file size is unknown but likely several MB
- On 3G/4G connections, the video will take 5-15 seconds to start playing
- During loading, users see a blank/black area behind the text
- Video autoplay with `muted` and `playsInline` is correct for mobile compatibility, but the bandwidth cost is significant

### Recommendations:
- Change `disableOnMobile` to `true` (which is the component's default)
- Provide a high-quality poster image (`posterSrc`) for both mobile fallback and initial desktop loading
- Consider using a WebM format alongside MP4 for better compression
- Add `preload="none"` on mobile and `preload="auto"` on desktop

---

## 9. CTA VISIBILITY & ACCESSIBILITY -- Score: 50/100 [NEEDS WORK]

### Homepage CTAs:

**Above the fold (desktop):**
- "Solicita Oferta" button in navbar -- visible (162x46px) -- GOOD
- Cart icon with count -- visible (68x38px) -- GOOD
- Hero CTA "Descopera Colectia" -- rendered by GSAP animation starting at `opacity: 0` and `scale: 0.8`, so it is NOT visible in the initial static render. Search engine crawlers and users with JavaScript disabled will not see it.

**Above the fold (mobile):**
- "Solicita Oferta" -- HIDDEN (0x0px, uses `hidden md:inline-flex`) -- PROBLEM
- Cart icon -- visible (68x38px) -- GOOD
- Hero CTA "Descopera Colectia" -- same GSAP issue as desktop

**Below the fold:**
- Multiple CTA buttons with empty text (34x34px arrow buttons in product carousel) -- no accessible labels
- Product cards appear to have arrow-only navigation buttons without text content

### Contact page:
- "Trimite mesajul" button -- visible on desktop (186x52px) -- GOOD
- On mobile, "Trimite mesajul" falls below the fold -- acceptable for form pages

### Cart page:
- "Finalizeaza comanda" button -- visible on all viewports -- GOOD

### Accessibility issues:
- 6+ buttons with empty text content ("") at 34x34px -- below the 48x48px minimum touch target
- No skip navigation link (`hasSkipLink: false` on all pages)
- Hero CTA links use `<a>` tags with `href` -- good for SEO but initial `opacity: 0` from GSAP is problematic

### Recommendations:
- Add `aria-label` to all icon-only buttons (carousel arrows, etc.)
- Increase touch targets to minimum 48x48px
- Add a skip navigation link for accessibility
- Render hero CTAs visible by default, then enhance with animation (progressive enhancement)
- Add a mobile-visible CTA for requesting quotes (in a mobile menu or as a sticky bottom bar)

---

## 10. STRUCTURED DATA -- Score: 0/100 [CRITICAL]

Zero JSON-LD structured data found on any page. This is a major missed opportunity.

### Recommended structured data:

**Homepage:**
- `Organization` schema with name, logo, contact info
- `WebSite` schema with search action
- `LocalBusiness` schema (since there is a physical location in Bucharest)

**Product pages (not audited but should have):**
- `Product` schema with name, image, price, availability

**Blog:**
- `Article` or `BlogPosting` schema for each post
- `BreadcrumbList` schema

**Contact:**
- `LocalBusiness` schema with address, phone, hours
- `BreadcrumbList` schema

**All pages:**
- `BreadcrumbList` (breadcrumbs are already rendered visually -- "ACASA / CONTACT" etc.)

---

## 11. ADDITIONAL FINDINGS

### Breadcrumbs
- Visual breadcrumbs exist on Contact, Blog, and Cart (e.g., "ACASA / CONTACT")
- These use `<p>` and `<span>` elements instead of semantic `<nav>` with `<ol>`/`<li>`
- No BreadcrumbList structured data

### Language
- `lang="ro"` is correctly set on the `<html>` element -- GOOD
- Content is consistently in Romanian -- GOOD

### Footer links
- Footer contains important links (Acasa, Colectii, Contact, Termeni si Conditii, Confidentialitate, Politica de Retur)
- Contact information is duplicated in footer -- GOOD for SEO

### Page-specific title tags
| Page | Title | Unique? |
|------|-------|---------|
| Homepage | LemnArt -- Mascare Calorifere Premium | Shared |
| Contact | LemnArt -- Mascare Calorifere Premium | Shared (PROBLEM) |
| Blog | Blog -- LemnArt / Ghiduri si Inspiratie... | Unique (GOOD) |
| Cart | LemnArt -- Mascare Calorifere Premium | Shared (PROBLEM) |

### Currency display
- Cart shows "$0.00" -- this appears to be in USD, but the site is Romanian. Should display in RON (lei) or EUR.

---

## Priority Action Items

### P0 -- Critical (fix immediately)
1. **Add H1 to homepage** -- Change hero heading `<div>` to `<h1>` in `hero.tsx`
2. **Fix mobile horizontal overflow** -- Implement hamburger menu in navbar for mobile viewports
3. **Add page-specific title tags** to Contact and Cart pages
4. **Add Open Graph meta tags** (og:title, og:description, og:image) to root layout
5. **Add canonical URLs** to all pages

### P1 -- High Priority (fix within 1 week)
6. **Add JSON-LD structured data** -- at minimum Organization and BreadcrumbList
7. **Add poster image to hero video** and set `disableOnMobile={true}`
8. **Fix CTA animation** -- render hero CTA visible by default, animate as enhancement
9. **Add mobile-accessible CTA** for "Solicita Oferta"
10. **Add `aria-label` to all icon-only buttons** and increase touch targets to 48px

### P2 -- Medium Priority (fix within 2 weeks)
11. **Audit and fix text contrast ratios** across all muted text
12. **Remove unused font families** (Geist, Geist Mono)
13. **Semantic breadcrumbs** with `<nav>` + `<ol>` + structured data
14. **Fix NavbarActions hydration layout shift** (remove isMounted guard)
15. **Fix currency display** from USD to RON/EUR

### P3 -- Nice to Have
16. Add Twitter Card meta tags
17. Add blog featured images
18. Improve collection image alt text
19. Add skip navigation link
20. Reduce font weight variants

---

## Screenshots Reference

All screenshots are saved at:
`/Users/cristian/Development/lemnArt/seo-audit/screenshots/`

| File | Description |
|------|-------------|
| `homepage_desktop.png` | Homepage above-the-fold at 1920x1080 |
| `homepage_mobile.png` | Homepage above-the-fold at 375x812 (2x DPR) |
| `homepage_tablet.png` | Homepage above-the-fold at 768x1024 |
| `homepage_laptop.png` | Homepage above-the-fold at 1366x768 |
| `homepage_desktop_full.png` | Homepage full page at 1920x1080 |
| `homepage_mobile_full.png` | Homepage full page at 375x812 |
| `contact_desktop.png` | Contact above-the-fold at 1920x1080 |
| `contact_mobile.png` | Contact above-the-fold at 375x812 |
| `contact_tablet.png` | Contact above-the-fold at 768x1024 |
| `blog_desktop.png` | Blog above-the-fold at 1920x1080 |
| `blog_mobile.png` | Blog above-the-fold at 375x812 |
| `blog_tablet.png` | Blog above-the-fold at 768x1024 |
| `cart_desktop.png` | Cart above-the-fold at 1920x1080 |
| `cart_mobile.png` | Cart above-the-fold at 375x812 |
| `cart_tablet.png` | Cart above-the-fold at 768x1024 |
| `*_full.png` variants | Full-page scrolled captures for each |

Raw audit data: `/Users/cristian/Development/lemnArt/seo-audit/audit_data.json`
