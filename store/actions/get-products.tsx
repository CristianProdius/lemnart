import { Product } from "@/types";
import { normalizeProducts } from "@/lib/normalize-product";
import qs from 'query-string';

const URL = `${process.env.NEXT_PUBLIC_API_URL}/products`;

interface Query {
    categoryId?: string;
    colorId?: string;
    sizeId?: string;
    isFeatured?: boolean;
}

const getProducts = async (query: Query): Promise<Product[]> => {
    if (!process.env.NEXT_PUBLIC_API_URL) {
        console.warn('[GET_PRODUCTS] NEXT_PUBLIC_API_URL not set; returning []');
        return [];
    }
    const url = qs.stringifyUrl({
        url: URL,
        query: {
            colorId: query.colorId,
            sizeId: query.sizeId,
            categoryId: query.categoryId,
            isFeatured: query.isFeatured
        }
    })
    try {
        const res = await fetch(url);
        if (!res.ok) {
            console.warn('[GET_PRODUCTS]', res.status, res.statusText);
            return [];
        }
        const data = await res.json();
        if (!Array.isArray(data)) {
            console.warn('[GET_PRODUCTS] response was not an array:', data);
            return [];
        }
        return normalizeProducts(data);
    } catch (err) {
        console.warn('[GET_PRODUCTS]', err);
        return [];
    }
}

export default getProducts;