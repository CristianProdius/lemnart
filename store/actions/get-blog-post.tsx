import { BlogPost } from "@/types";

const URL = `${process.env.NEXT_PUBLIC_API_URL}/blog-posts/slug`;

const getBlogPostBySlug = async (slug: string): Promise<BlogPost | null> => {
    try {
        const res = await fetch(`${URL}/${slug}`, { next: { revalidate: 0 } });
        if (!res.ok) return null;
        const data = await res.json();
        return data || null;
    } catch {
        return null;
    }
};

export default getBlogPostBySlug;
