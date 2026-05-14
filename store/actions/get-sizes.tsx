import { Size } from "@/types";

const URL = `${process.env.NEXT_PUBLIC_API_URL}/sizes`

const getSizes = async (): Promise<Size[]> => {
    if (!process.env.NEXT_PUBLIC_API_URL) {
        console.warn('[GET_SIZES] NEXT_PUBLIC_API_URL not set; returning []');
        return [];
    }
    try {
        const res = await fetch(URL);
        if (!res.ok) {
            console.warn('[GET_SIZES]', res.status, res.statusText);
            return [];
        }
        const data = await res.json();
        if (!Array.isArray(data)) {
            console.warn('[GET_SIZES] response was not an array:', data);
            return [];
        }
        return data;
    } catch (err) {
        console.warn('[GET_SIZES]', err);
        return [];
    }
}

export default getSizes;
