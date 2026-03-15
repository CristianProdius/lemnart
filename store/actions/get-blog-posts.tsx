import { BlogPost } from "@/types";

const URL = `${process.env.NEXT_PUBLIC_API_URL}/blog-posts`;

const getBlogPosts = async (): Promise<BlogPost[]> => {
    try {
        const res = await fetch(`${URL}?published=true`, { next: { revalidate: 0 } });
        if (!res.ok) return [];
        return res.json();
    } catch {
        return [];
    }
};

export default getBlogPosts;
