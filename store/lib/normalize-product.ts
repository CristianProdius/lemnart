import { Color, Image, Product } from "@/types";

/**
 * Normalize a wire-shape product into the canonical Product:
 * - Always sets colors: Color[] (falls back to [color] from the legacy API field, then [])
 * - Always sets images: Image[] with colorId: string | null
 * - Returns null if the input is missing the minimum required fields
 *
 * Returning null is safer than throwing — callers handle the empty case via notFound() or fallback UI.
 */
export function normalizeProduct(raw: unknown): Product | null {
    if (!raw || typeof raw !== "object") return null;
    const p = raw as Record<string, unknown>;
    if (typeof p.id !== "string" || typeof p.name !== "string") return null;

    const colorsArray = Array.isArray(p.colors) ? (p.colors as Color[]) : [];
    const legacyColor = (p.color && typeof p.color === "object" ? p.color : null) as Color | null;
    const colors: Color[] = colorsArray.length > 0
        ? colorsArray
        : (legacyColor ? [legacyColor] : []);

    const images: Image[] = Array.isArray(p.images)
        ? (p.images as Array<Record<string, unknown>>)
            .map((img) => ({
                id: typeof img.id === "string" ? img.id : "",
                url: typeof img.url === "string" ? img.url : "",
                colorId: typeof img.colorId === "string" ? img.colorId : null,
                sortOrder: typeof img.sortOrder === "number" ? img.sortOrder : undefined,
            }))
            .filter((img) => img.url && img.id)
            // Defensive client-side sort with id tiebreaker. The admin API already orders
            // images server-side; this guards against a misconfigured cache or stale CDN.
            .sort((a, b) => {
                const so = (a.sortOrder ?? 0) - (b.sortOrder ?? 0);
                if (so !== 0) return so;
                return a.id.localeCompare(b.id);
            })
        : [];

    return {
        ...(p as unknown as Product),
        colors,
        images,
    };
}

export function normalizeProducts(raw: unknown): Product[] {
    if (!Array.isArray(raw)) return [];
    return raw.map(normalizeProduct).filter((p): p is Product => p !== null);
}
