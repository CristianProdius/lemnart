import { create } from "zustand";
import { ConfiguredItem, Product } from "@/types";
import { persist, createJSONStorage } from "zustand/middleware";
import { toast } from "react-hot-toast";

interface CartLineProduct extends Product {
    cartLineId: string;
}

type CartLine = CartLineProduct | ConfiguredItem;

interface CartStore {
    items: CartLine[];
    addItem: (data: Product | ConfiguredItem) => void;
    removeItem: (cartLineId: string) => void;
    removeAll: () => void;
}

function isConfiguredItem(item: CartLine | Product | ConfiguredItem): item is ConfiguredItem {
    return "type" in item && (item as ConfiguredItem).type === "configured";
}

function makeCartLineId(): string {
    if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
    return `cl_${Date.now()}_${Math.random().toString(36).slice(2)}`;
}

const useCart = create(persist<CartStore>((set, get) => ({
    items: [],
    addItem: (data) => {
        const currentItems = get().items;
        if (isConfiguredItem(data)) {
            // Configured items are always unique (each has its own UUID).
            set({ items: [...currentItems, data] });
            toast.success("Produs adăugat în coș.");
            return;
        }
        // Default selectedColorId to the first available color so every callsite
        // produces a consistent line shape — otherwise dedup, the cart-item
        // swatch, the configurator deeplink, and the checkout payload all behave
        // subtly differently for callers that forgot to set it.
        const productData = data as Product;
        const selectedColorId = productData.selectedColorId ?? productData.colors?.[0]?.id ?? null;
        const dup = currentItems.find((item) => {
            if (isConfiguredItem(item)) return false;
            return item.id === productData.id && (item.selectedColorId ?? null) === selectedColorId;
        });
        if (dup) {
            toast("Produsul este deja în coș.");
            return;
        }
        const line: CartLineProduct = { ...productData, selectedColorId, cartLineId: makeCartLineId() };
        set({ items: [...currentItems, line] });
        toast.success("Produs adăugat în coș.");
    },
    removeItem: (cartLineId) => {
        set({
            items: get().items.filter((item) => {
                if (isConfiguredItem(item)) return item.id !== cartLineId;
                return item.cartLineId !== cartLineId;
            }),
        });
    },
    removeAll: () => set({ items: [] }),
}), {
    name: "cart-storage",
    storage: createJSONStorage(() => localStorage),
    version: 2,
    // Custom merge: shallow-merge persisted state into the live store so the action
    // functions defined in the store factory are NEVER overwritten by hydration.
    merge: (persisted, current) => ({
        ...current,
        ...(persisted as Partial<CartStore>),
    }),
    // migrate returns a Partial cast through unknown — Zustand's merge above re-attaches the action handlers.
    migrate: (persisted: unknown, _fromVersion: number): CartStore => {
        const empty = { items: [] } as unknown as CartStore;
        if (!persisted || typeof persisted !== "object") return empty;
        const state = (persisted as { state?: { items?: unknown } }).state ?? (persisted as { items?: unknown });
        const rawItems = Array.isArray(state?.items) ? state.items : [];

        const migrated = rawItems.flatMap((raw): CartLine[] => {
            if (!raw || typeof raw !== "object") return [];
            const item = raw as Record<string, unknown>;

            // Configured items pass through untouched (already use UUIDs).
            if (item.type === "configured" && typeof item.id === "string") {
                return [item as unknown as ConfiguredItem];
            }

            // Legacy product shape: { id, name, color: Color, ... } — map to new shape.
            // Drop lines without at least one image (cart-item renders data.images[0].url).
            if (typeof item.id !== "string") return [];
            const images = Array.isArray(item.images) ? item.images : [];
            if (images.length === 0) return [];

            const legacyColor = (item.color && typeof item.color === "object" ? item.color : null) as { id?: string } | null;
            const colors = Array.isArray(item.colors) ? item.colors : (legacyColor ? [legacyColor] : []);
            const selectedColorId = typeof item.selectedColorId === "string"
                ? item.selectedColorId
                : (legacyColor?.id ?? null);
            return [{
                ...(item as unknown as Product),
                colors: colors as Product["colors"],
                selectedColorId,
                cartLineId: typeof item.cartLineId === "string" ? item.cartLineId : makeCartLineId(),
            } as CartLineProduct];
        });

        return { items: migrated } as unknown as CartStore;
    },
}));

export type { CartLine, CartLineProduct };
export { isConfiguredItem };
export default useCart;
