import { Color } from "@/types";

const URL = `${process.env.NEXT_PUBLIC_API_URL}/colors`

const getColors = async (): Promise<Color[]> => {
    if (!process.env.NEXT_PUBLIC_API_URL) {
        console.warn('[GET_COLORS] NEXT_PUBLIC_API_URL not set; returning []');
        return [];
    }
    try {
        const res = await fetch(URL);
        if (!res.ok) {
            console.warn('[GET_COLORS]', res.status, res.statusText);
            return [];
        }
        const data = await res.json();
        if (!Array.isArray(data)) {
            console.warn('[GET_COLORS] response was not an array:', data);
            return [];
        }
        return data;
    } catch (err) {
        console.warn('[GET_COLORS]', err);
        return [];
    }
}

export default getColors;
