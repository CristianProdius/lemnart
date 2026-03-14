# Site Architecture — LemnArt Decor

Maps every demo section to a component/file. Defines what needs to be modified and what needs to be built.

---

## 1. Existing File Modifications

### Store Layout & Global

| File | Change | Details |
|------|--------|---------|
| `store/app/layout.tsx` | Language + metadata | `lang="ro"`, update `title`/`description`, keep Urbanist font |
| `store/components/navbar.tsx` | Rebrand + nav links | "LEMN ART DECOR" brand, add Calculator/Galerie/Simulare/Contact links, "Comandă acum" CTA |
| `store/components/main-nav.tsx` | Add static links | Mix category routes with static section anchors |
| `store/components/footer.tsx` | Multi-column footer | 4 columns: brand+tagline, navigation, support, atelier info |
| `store/components/ui/currency.tsx` | MDL currency | `'ro-MD'` locale, `'MDL'` currency code |
| `store/components/info.tsx` | Romanian labels | Translate Size/Color/Add To Cart |
| `store/components/billboard.tsx` | No structural change | Content comes from DB, already dynamic |
| `store/components/product-list.tsx` | Translate empty state | "Nu s-au găsit rezultate." |
| `store/components/ui/no-results.tsx` | Romanian text | Update "No results found." |

### Store Pages

| File | Change | Details |
|------|--------|---------|
| `store/app/(routes)/page.tsx` | Full redesign | Replace billboard+products with 10-section landing page |
| `store/app/(routes)/cart/page.tsx` | Translate | "Coșul Tău", empty state message |
| `store/app/(routes)/cart/components/summary.tsx` | Translate + currency | "Sumar Comandă", "Total comandă", "Finalizează Comanda" |
| `store/app/(routes)/cart/components/cart-item.tsx` | No text changes | Only displays product data (already dynamic) |
| `store/app/(routes)/category/[categoryId]/page.tsx` | Translate filters | "Filtrare", "Dimensiuni", "Culori" |
| `store/app/(routes)/product/[productId]/page.tsx` | Translate | "Produse Similare" heading |

### Admin

| File | Change | Details |
|------|--------|---------|
| `admin/app/api/[storeId]/checkout/route.ts` | Currency | `currency: 'usd'` → `currency: 'mdl'` in Stripe line items |

---

## 2. New Store Components

All new components go in `store/components/sections/`.

### Landing Page Sections (render order)

| # | Component | File | Type | Description |
|---|-----------|------|------|-------------|
| 1 | Hero | `sections/hero.tsx` | Server | Full-width hero with headline, description, 2 CTA buttons, feature badges carousel |
| 2 | Collections | `sections/collections.tsx` | Server | 3 collection cards (Floral, Geometric, Abstract) with badges linking to category pages |
| 3 | ProcessSteps | `sections/process-steps.tsx` | Static | 3-phase timeline: Configurare → Măsurare → Instalare |
| 4 | Calculator | `sections/calculator.tsx` | Client (`"use client"`) | Interactive 3-step pricing calculator with state (see `calculator-spec.md`) |
| 5 | QualityStandards | `sections/quality-standards.tsx` | Static | 6-feature grid + 4 trust badges |
| 6 | AISimulation | `sections/ai-simulation.tsx` | Static | WhatsApp CTA for 3D rendering service |
| 7 | Portfolio | `sections/portfolio.tsx` | Client (`"use client"`) | Tabbed room gallery (5 tabs) with image grid |
| 8 | Testimonials | `sections/testimonials.tsx` | Static | 3 customer review cards with star ratings |
| 9 | FAQ | `sections/faq.tsx` | Client (`"use client"`) | Accordion with 4 Q&A items |
| 10 | Contact | `sections/contact.tsx` | Client (`"use client"`) | Contact form + company info cards |

### Component Details

#### `sections/hero.tsx`
```
Props: none (static content from content-ro.md)
Structure:
  - Full-width container with background gradient or image
  - Eyebrow: "Atelier de Design"
  - H1: "Artă în fiecare detaliu. Mai mult decât o mască"
  - P: description text
  - 2 buttons: "Calculează Oferta" (anchor #calculator), "Vezi Catalogul" (link /category)
  - Horizontal badge row (6 badges, overflow scroll on mobile)
```

#### `sections/collections.tsx`
```
Props: categories from getCategories() or hardcoded collection data
Structure:
  - Section heading: "Descoperă Rafinamentul"
  - 3-column grid (stack on mobile)
  - Each card: badge, title, description, "Explorează modelele" link → /category/{id}
  - Footer link: "Vezi întregul catalog"
```

#### `sections/process-steps.tsx`
```
Props: none (static)
Structure:
  - 3-column layout with connecting line/timeline
  - Each step: phase number, title, description
  - Icons: Settings/Ruler/Truck or similar from lucide-react
```

#### `sections/calculator.tsx`
```
Props: none
State: width, height, quantity, collection, finish (React useState)
Structure: see calculator-spec.md for full specification
```

#### `sections/quality-standards.tsx`
```
Props: none (static)
Structure:
  - Section heading + subheading
  - 2×3 or 3×2 grid of feature cards (icon, title, description)
  - Trust badges row below
```

#### `sections/ai-simulation.tsx`
```
Props: none (static)
Structure:
  - Split layout: text left, illustration/mockup right
  - Badge: "Serviciu Exclusiv"
  - Heading + description + feature bullets
  - WhatsApp CTA button → https://wa.me/37369164699
```

#### `sections/portfolio.tsx`
```
Props: none (static images or fetched from API)
State: activeTab (React useState)
Structure:
  - Section heading + subheading + description
  - 5 tab buttons (room types)
  - Image grid showing 4-6 portfolio images per tab
  - "Vezi Portofoliul Complet" link
```

#### `sections/testimonials.tsx`
```
Props: none (static)
Structure:
  - Section heading + subheading
  - 3-column grid of review cards
  - Each card: 5-star rating, quote text, author name, location
```

#### `sections/faq.tsx`
```
Props: none (static)
State: openIndex (React useState)
Structure:
  - Section heading + subheading
  - 4 accordion items (click to expand/collapse)
  - Each item: question (always visible), answer (toggle visibility)
  - Consider using shadcn/ui Accordion component
```

#### `sections/contact.tsx`
```
Props: none
State: form fields (name, phone, message)
Structure:
  - Section heading + subheading + description
  - 2-column layout: contact info cards (left), form (right)
  - 4 info cards: phone, email, showroom, hours
  - Form: 3 fields + submit button
  - Form submission: POST to API or mailto/WhatsApp link
```

---

## 3. Redesigned Home Page

**File:** `store/app/(routes)/page.tsx`

```tsx
// store/app/(routes)/page.tsx
import Hero from '@/components/sections/hero'
import Collections from '@/components/sections/collections'
import ProcessSteps from '@/components/sections/process-steps'
import Calculator from '@/components/sections/calculator'
import QualityStandards from '@/components/sections/quality-standards'
import AISimulation from '@/components/sections/ai-simulation'
import Portfolio from '@/components/sections/portfolio'
import Testimonials from '@/components/sections/testimonials'
import FAQ from '@/components/sections/faq'
import Contact from '@/components/sections/contact'

export default function HomePage() {
  return (
    <>
      <Hero />
      <Collections />
      <ProcessSteps />
      <Calculator />
      <QualityStandards />
      <AISimulation />
      <Portfolio />
      <Testimonials />
      <FAQ />
      <Contact />
    </>
  )
}
```

---

## 4. New Standalone Pages (Optional)

| Route | File | Description |
|-------|------|-------------|
| `/galerie` | `store/app/(routes)/galerie/page.tsx` | Full portfolio gallery, extended version of Portfolio section |
| `/contact` | `store/app/(routes)/contact/page.tsx` | Standalone contact page, reuses Contact section component |
| `/faq` | `store/app/(routes)/faq/page.tsx` | Standalone FAQ page, reuses FAQ section component |

---

## 5. File Tree (New Files Only)

```
store/
├── components/
│   └── sections/
│       ├── hero.tsx
│       ├── collections.tsx
│       ├── process-steps.tsx
│       ├── calculator.tsx
│       ├── quality-standards.tsx
│       ├── ai-simulation.tsx
│       ├── portfolio.tsx
│       ├── testimonials.tsx
│       ├── faq.tsx
│       └── contact.tsx
├── app/
│   └── (routes)/
│       ├── galerie/
│       │   └── page.tsx          (optional)
│       ├── contact/
│       │   └── page.tsx          (optional)
│       └── faq/
│           └── page.tsx          (optional)
admin/
└── prisma/
    └── seed.ts
docs/
├── product-catalog.md
├── content-ro.md
├── site-architecture.md
├── calculator-spec.md
└── implementation-roadmap.md
```
