import { Product } from "@/types";
import { normalizeProduct } from "@/lib/normalize-product";

const URL = `${process.env.NEXT_PUBLIC_API_URL}/products`;

const getProduct = async (id: string): Promise<Product | null> => {
    if (!process.env.NEXT_PUBLIC_API_URL) {
        console.warn("[GET_PRODUCT] NEXT_PUBLIC_API_URL not set; returning null");
        return null;
    }
    try {
        const res = await fetch(`${URL}/${id}`);
        if (!res.ok) {
            console.warn("[GET_PRODUCT]", res.status, res.statusText);
            return null;
        }
        const raw = await res.json();
        return normalizeProduct(raw);
    } catch (err) {
        console.warn("[GET_PRODUCT]", err);
        return null;
    }
};

export default getProduct;
