import { Category } from "@/types";

const URL = `${process.env.NEXT_PUBLIC_API_URL}/categories`

const getCategories = async (): Promise<Category[]> => {
    if (!process.env.NEXT_PUBLIC_API_URL) {
        console.warn('[GET_CATEGORIES] NEXT_PUBLIC_API_URL not set; returning []');
        return [];
    }
    try {
        const res = await fetch(URL);
        if (!res.ok) {
            console.warn('[GET_CATEGORIES]', res.status, res.statusText);
            return [];
        }
        const data = await res.json();
        if (!Array.isArray(data)) {
            console.warn('[GET_CATEGORIES] response was not an array:', data);
            return [];
        }
        return data;
    } catch (err) {
        console.warn('[GET_CATEGORIES]', err);
        return [];
    }
}

export default getCategories;