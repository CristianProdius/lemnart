# Implementation Roadmap — LemnArt Decor

Step-by-step execution plan with task ordering and dependencies.

---

## Phase 1 — Foundation

Core infrastructure changes. Must be done first.

### Task 1.1: Run Seed Script
- **File:** `admin/prisma/seed.ts`
- **Action:** Execute `cd admin && npx tsx prisma/seed.ts`
- **Result:** Database populated with 5 billboards, 4 categories, 6 sizes, 8 colors, 16 products, 32 images
- **Dependencies:** None
- **Verify:** Check admin dashboard shows all seeded data

### Task 1.2: Currency USD → MDL
- **Files:**
  - `store/components/ui/currency.tsx` — change `'en-US'`/`'USD'` to `'ro-MD'`/`'MDL'`
  - `admin/app/api/[storeId]/checkout/route.ts` — change `currency: 'usd'` to `currency: 'mdl'`
- **Dependencies:** None
- **Verify:** Product prices display with MDL format

### Task 1.3: HTML lang attribute
- **File:** `store/app/layout.tsx`
- **Action:** Change `lang="en"` to `lang="ro"`, update metadata title/description
- **Dependencies:** None

### Task 1.4: Rebrand Navbar
- **Files:**
  - `store/components/navbar.tsx` — brand text "LEMN ART DECOR"
  - `store/components/main-nav.tsx` — add static nav links (Calculator, Galerie, Simulare, Contact)
  - `store/components/navbar-actions.tsx` — add "Comandă acum" CTA button
- **Dependencies:** None
- **Verify:** Navbar shows LemnArt branding with all links

### Task 1.5: Rebrand Footer
- **File:** `store/components/footer.tsx`
- **Action:** Replace single-line copyright with 4-column footer (brand, navigation, support, atelier)
- **Dependencies:** None
- **Verify:** Footer renders with all company information

---

## Phase 2 — Localization

Translate all existing English strings to Romanian.

### Task 2.1: Translate Store Components
- **Files:**
  - `store/components/info.tsx` — Size/Color/Add To Cart labels
  - `store/components/ui/no-results.tsx` or `product-list.tsx` — "Nu s-au găsit rezultate."
- **Dependencies:** Phase 1 complete
- **Verify:** Product detail page shows Romanian labels

### Task 2.2: Translate Cart Page
- **Files:**
  - `store/app/(routes)/cart/page.tsx` — "Coșul Tău", empty state
  - `store/app/(routes)/cart/components/summary.tsx` — "Sumar Comandă", "Total comandă", "Finalizează Comanda"
- **Dependencies:** Phase 1 complete
- **Verify:** Cart page fully in Romanian

### Task 2.3: Translate Category Page
- **File:** `store/app/(routes)/category/[categoryId]/page.tsx`
- **Action:** Translate filter labels ("Filtrare", "Dimensiuni", "Culori")
- **Dependencies:** Phase 1 complete

### Task 2.4: Translate Product Page
- **File:** `store/app/(routes)/product/[productId]/page.tsx`
- **Action:** Translate "Related Items" → "Produse Similare"
- **Dependencies:** Phase 1 complete

### Task 2.5: Translate Toast Messages
- **File:** `store/hooks/use-cart.tsx`
- **Action:** Update all toast strings to Romanian
- **Dependencies:** Phase 1 complete

### Task 2.6: Update SEO Metadata
- **File:** `store/app/layout.tsx`
- **Action:** Set final metadata title, description, OG tags in Romanian
- **Dependencies:** Task 1.3 complete

---

## Phase 3 — Landing Page

Build all new section components and redesign the home page.

### Task 3.1: Create Hero Section
- **File:** `store/components/sections/hero.tsx`
- **Type:** Server component
- **Content:** Headline, description, 2 CTAs, feature badges
- **Dependencies:** Phase 2 complete (so navbar/footer are done)

### Task 3.2: Create Collections Section
- **File:** `store/components/sections/collections.tsx`
- **Type:** Server component
- **Content:** 3 collection cards linking to category pages
- **Dependencies:** Task 1.1 (categories must exist in DB)

### Task 3.3: Create Process Steps Section
- **File:** `store/components/sections/process-steps.tsx`
- **Type:** Static component
- **Content:** 3-phase timeline
- **Dependencies:** None (static content)

### Task 3.4: Create Quality Standards Section
- **File:** `store/components/sections/quality-standards.tsx`
- **Type:** Static component
- **Content:** 6-feature grid + 4 trust badges
- **Dependencies:** None (static content)

### Task 3.5: Create AI Simulation Section
- **File:** `store/components/sections/ai-simulation.tsx`
- **Type:** Static component
- **Content:** WhatsApp CTA for 3D rendering
- **Dependencies:** None (static content)

### Task 3.6: Create Testimonials Section
- **File:** `store/components/sections/testimonials.tsx`
- **Type:** Static component
- **Content:** 3 review cards
- **Dependencies:** None (static content)

### Task 3.7: Create FAQ Section
- **File:** `store/components/sections/faq.tsx`
- **Type:** Client component
- **Content:** 4 accordion items
- **Dependencies:** None (static content)

### Task 3.8: Create Contact Section
- **File:** `store/components/sections/contact.tsx`
- **Type:** Client component
- **Content:** Contact form + info cards
- **Dependencies:** None (static content)

### Task 3.9: Create Portfolio Section
- **File:** `store/components/sections/portfolio.tsx`
- **Type:** Client component
- **Content:** Tabbed gallery with 5 room types
- **Dependencies:** Portfolio images needed

### Task 3.10: Build Pricing Calculator
- **File:** `store/components/sections/calculator.tsx`
- **Type:** Client component
- **Spec:** See `docs/calculator-spec.md`
- **Dependencies:** None (self-contained logic)
- **Note:** Most complex component — budget extra time

### Task 3.11: Redesign Home Page
- **File:** `store/app/(routes)/page.tsx`
- **Action:** Replace billboard+products with composition of all 10 section components
- **Dependencies:** Tasks 3.1–3.10 complete
- **Verify:** Home page renders all sections in correct order

---

## Phase 4 — Polish

Optional enhancements and quality pass.

### Task 4.1: Portfolio Gallery Page
- **File:** `store/app/(routes)/galerie/page.tsx`
- **Action:** Standalone gallery page, extended version of Portfolio section
- **Dependencies:** Task 3.9 complete

### Task 4.2: Standalone Contact Page
- **File:** `store/app/(routes)/contact/page.tsx`
- **Action:** Reuse Contact section component
- **Dependencies:** Task 3.8 complete

### Task 4.3: Standalone FAQ Page
- **File:** `store/app/(routes)/faq/page.tsx`
- **Action:** Reuse FAQ section component
- **Dependencies:** Task 3.7 complete

### Task 4.4: Mobile Responsiveness Pass
- **Files:** All section components
- **Action:** Test and fix responsive breakpoints, touch targets, scroll behavior
- **Dependencies:** Phase 3 complete

### Task 4.5: Image Optimization
- **Action:** Upload all product/portfolio/billboard images to MinIO, update URLs in seed script
- **Dependencies:** Task 1.1 complete + images available

---

## Dependency Graph

```
Phase 1 (parallel tasks)
├── 1.1 Seed DB
├── 1.2 Currency
├── 1.3 Lang attribute
├── 1.4 Navbar
└── 1.5 Footer

Phase 2 (after Phase 1)
├── 2.1 Component translations
├── 2.2 Cart translation
├── 2.3 Category translation
├── 2.4 Product translation
├── 2.5 Toast translations
└── 2.6 SEO metadata

Phase 3 (after Phase 2, components can be parallel)
├── 3.1  Hero
├── 3.2  Collections (needs 1.1)
├── 3.3  Process Steps
├── 3.4  Quality Standards
├── 3.5  AI Simulation
├── 3.6  Testimonials
├── 3.7  FAQ
├── 3.8  Contact
├── 3.9  Portfolio
├── 3.10 Calculator
└── 3.11 Home Page (needs 3.1–3.10)

Phase 4 (after Phase 3)
├── 4.1 Gallery page
├── 4.2 Contact page
├── 4.3 FAQ page
├── 4.4 Responsive pass
└── 4.5 Image upload
```

---

## Estimated Scope

| Phase | Tasks | New Files | Modified Files |
|-------|-------|-----------|----------------|
| 1 — Foundation | 5 | 1 (seed.ts) | 5 |
| 2 — Localization | 6 | 0 | 7 |
| 3 — Landing Page | 11 | 11 | 1 |
| 4 — Polish | 5 | 3 | 10+ |
| **Total** | **27** | **15** | **23** |
