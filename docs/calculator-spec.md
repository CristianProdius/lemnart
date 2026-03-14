# Pricing Calculator Specification — LemnArt Decor

Detailed functional spec for the interactive pricing calculator component.

**Component:** `store/components/sections/calculator.tsx`
**Type:** Client component (`"use client"`)

---

## Overview

A 3-step interactive calculator that lets visitors estimate the cost of a decorative radiator cover. The result is an estimated quote (deviz estimativ), not a final price — the CTA drives them to request a laser measurement via WhatsApp.

---

## Step 1: Dimensiunile Radiatorului

**Label:** `Pas 01. Dimensiunile Radiatorului`

### Inputs

| Field | Type | Label | Placeholder | Min | Max | Default | Unit |
|-------|------|-------|-------------|-----|-----|---------|------|
| width | number | Lățime | 100 | 40 | 200 | 100 | cm |
| height | number | Înălțime | 60 | 30 | 120 | 60 | cm |

### Constraints
- Width and height are entered in centimeters
- Values outside min/max should be clamped (not rejected)
- Area is calculated as `(width / 100) * (height / 100)` to get m²

---

## Step 2: Volum Proiect

**Label:** `Pas 02. Volum Proiect`

### Options (radio/card selector)

| Value | Label | Discount |
|-------|-------|----------|
| 1 | 1 Mască Calorifer | 0% |
| 2 | 2 Măști Calorifer | 0% |
| 3 | 3 Măști (Reducere 10%) | 10% |
| 4 | 4 Măști (Reducere 10%) | 10% |
| 5 | 5+ Măști (Reducere 10%) | 10% |

### Behavior
- Single selection (radio behavior)
- Default: 1
- Discount is applied to the total (not per-unit)
- When quantity ≥ 3, show "Reducere Volum Aplicată" badge on result card

---

## Step 3: Colecția & Stilul Vopsirii

**Label:** `Pas 03. Colecția & Stilul Vopsirii`

### Collection Options (radio/card selector)

| Value | Label | Price per m² (MDL) |
|-------|-------|--------------------|
| `geometric` | Geometric — Minimalism Modern | 7,500 |
| `floral` | Floral — Eleganță Organică | 8,500 |
| `abstract` | Abstract — Design Loft | 7,000 |
| `prestigio` | Prestigio — Clasic & Complex | 10,000 |

### Finish Options (radio/card selector)

| Value | Label | Multiplier |
|-------|-------|------------|
| `standard` | Alb Standard Mat sau Lucios | 1.0× |
| `custom` | Personalizat RAL Custom / Metalic | 1.25× |

### Defaults
- Collection: `geometric`
- Finish: `standard`

---

## Pricing Formula

```
area = (width / 100) × (height / 100)                    // in m²
basePrice = area × collectionPricePerM2                   // per mask
finishedPrice = basePrice × finishMultiplier              // per mask with finish
subtotal = finishedPrice × quantity                        // all masks
discount = quantity >= 3 ? 0.10 : 0                       // 10% if 3+
total = subtotal × (1 - discount)                         // final price
```

### Example Calculation

```
Width: 100 cm, Height: 60 cm → area = 0.6 m²
Collection: Geometric (7,500 MDL/m²)
Finish: Standard (1.0×)
Quantity: 3

basePrice = 0.6 × 7,500 = 4,500 MDL
finishedPrice = 4,500 × 1.0 = 4,500 MDL
subtotal = 4,500 × 3 = 13,500 MDL
discount = 10% → 1,350 MDL
total = 13,500 - 1,350 = 12,150 MDL
```

---

## Result Card

**Displayed below/beside the calculator steps. Updates in real-time as inputs change.**

### Layout

```
┌─────────────────────────────────────────┐
│  Deviz Estimativ REF: #LAD-2026         │
│                                         │
│           12,150 MDL                    │
│                                         │
│  ┌─ Reducere Volum Aplicată ──┐         │  ← only if qty ≥ 3
│  └────────────────────────────┘         │
│                                         │
│  Prețul include proiectare 3D, MDF      │
│  vopsit 18mm, feronerie invizibilă,     │
│  livrare și montaj complet.             │
│                                         │
│  ┌─────────────────────────────────┐    │
│  │   Solicită Măsurare Laser       │    │  ← WhatsApp CTA
│  └─────────────────────────────────┘    │
└─────────────────────────────────────────┘
```

### Price Formatting
- Use `Intl.NumberFormat('ro-MD')` for thousand separators
- Append ` MDL` suffix
- Example: `12.150 MDL`

### CTA Button
- Text: "Solicită Măsurare Laser"
- Action: Opens WhatsApp with pre-filled message
- URL: `https://wa.me/37369164699?text=${encodeURIComponent(message)}`
- Message template:
  ```
  Salut! Doresc o măsurare laser pentru ${quantity} mască/măști de calorifer.
  Dimensiuni: ${width}×${height} cm
  Colecție: ${collectionLabel}
  Finisaj: ${finishLabel}
  Estimare: ${formattedTotal} MDL
  ```

---

## State Management

```tsx
// React useState — no external state library needed
const [width, setWidth] = useState(100)
const [height, setHeight] = useState(60)
const [quantity, setQuantity] = useState(1)
const [collection, setCollection] = useState<'geometric' | 'floral' | 'abstract' | 'prestigio'>('geometric')
const [finish, setFinish] = useState<'standard' | 'custom'>('standard')

// Derived (computed on render, no useState needed)
const area = (width / 100) * (height / 100)
const basePrice = area * COLLECTION_PRICES[collection]
const finishedPrice = basePrice * FINISH_MULTIPLIERS[finish]
const subtotal = finishedPrice * quantity
const discount = quantity >= 3 ? 0.10 : 0
const total = subtotal * (1 - discount)
```

### Constants

```tsx
const COLLECTION_PRICES: Record<string, number> = {
  geometric: 7500,
  floral: 8500,
  abstract: 7000,
  prestigio: 10000,
}

const FINISH_MULTIPLIERS: Record<string, number> = {
  standard: 1.0,
  custom: 1.25,
}
```

---

## Responsive Behavior

### Desktop (≥ 1024px)
- 2-column layout: steps on the left (60%), result card on the right (40%)
- Result card is sticky (`position: sticky; top: 2rem`)

### Tablet (768px – 1023px)
- Single column, result card below steps
- Steps still show side-by-side where space allows

### Mobile (< 768px)
- Full-width single column
- Each step stacks vertically
- Volume and collection options become full-width cards
- Result card at bottom with sticky CTA button

---

## Accessibility

- All inputs have associated `<label>` elements
- Radio groups use `role="radiogroup"` with `aria-label`
- Number inputs have `aria-valuemin`, `aria-valuemax`
- Result card has `aria-live="polite"` for screen reader updates
- CTA button is keyboard-focusable with visible focus ring

---

## Edge Cases

| Scenario | Behavior |
|----------|----------|
| Width < 40 | Clamp to 40 |
| Width > 200 | Clamp to 200 |
| Height < 30 | Clamp to 30 |
| Height > 120 | Clamp to 120 |
| Empty input | Use default (100×60) |
| Non-numeric input | Ignore/prevent |
| Total < 0 (impossible but safe) | Show 0 MDL |
