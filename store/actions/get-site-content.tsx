const URL = `${process.env.NEXT_PUBLIC_API_URL}/site-content`;

const getSiteContent = async (key: string): Promise<Record<string, unknown> | null> => {
    try {
        const res = await fetch(`${URL}/${key}`, { next: { revalidate: 0 } });
        if (!res.ok) return null;
        const data = await res.json();
        return data?.value || null;
    } catch {
        return null;
    }
};

export default getSiteContent;
