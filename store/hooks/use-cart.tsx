import { create } from "zustand";
import { CartItem, ConfiguredItem, Product } from "@/types";
import { persist, createJSONStorage } from 'zustand/middleware'
import { toast } from "react-hot-toast";

interface CartStore {
    items: CartItem[];
    addItem: (data: CartItem) => void;
    removeItem: (id: string) => void;
    removeAll: () => void;
}

function isConfiguredItem(item: CartItem): item is ConfiguredItem {
    return "type" in item && item.type === "configured";
}

const useCart = create(persist<CartStore>((set, get) =>({
    items: [],
    addItem: (data: CartItem) => {
        const currentItems = get().items;

        // Configured items are always unique (each has a UUID)
        if (!isConfiguredItem(data)) {
            const existingItem = currentItems.find(item => item.id === data.id);
            if(existingItem) {
                return toast("Produsul este deja în coș.");
            }
        }

        set({ items: [...get().items, data] })
        toast.success("Produs adăugat în coș.")
    },
    removeItem: (id: string) => {
        set({ items: [...get().items.filter(item => item.id !== id)] });
    },
    removeAll: () => set({ items: [] }),
}), {
    name: "cart-storage",
    storage: createJSONStorage(() => localStorage)
}))

export { isConfiguredItem };
export default useCart;
