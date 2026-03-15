import { getBlogPost, getAllBlogPosts } from "@/lib/blog-data"
import getBlogPostBySlug from "@/actions/get-blog-post"
import getBlogPosts from "@/actions/get-blog-posts"
import { notFound } from "next/navigation"
import BlogPostContent from "./components/blog-post-content"
import BlogPostingSchema from "@/components/schema/blog-posting-schema"
import type { Metadata } from "next"

type Params = Promise<{ slug: string }>

export async function generateStaticParams() {
    const posts = getAllBlogPosts()
    return posts.map((post) => ({ slug: post.slug }))
}

export async function generateMetadata({
    params,
}: {
    params: Params
}): Promise<Metadata> {
    const { slug } = await params

    // Try API first, then fallback
    const apiPost = await getBlogPostBySlug(slug)
    if (apiPost) {
        return {
            title: `${apiPost.title} — LemnArt Blog`,
            description: apiPost.excerpt,
        }
    }

    const post = getBlogPost(slug)
    if (!post) return { title: "Post not found" }

    return {
        title: `${post.title} — LemnArt Blog`,
        description: post.excerpt,
    }
}

const BlogPostPage = async ({ params }: { params: Params }) => {
    const { slug } = await params

    // Try API first
    const apiPost = await getBlogPostBySlug(slug)

    let post;
    let allPosts;

    if (apiPost) {
        // Map API post to the format expected by BlogPostContent
        post = {
            slug: apiPost.slug,
            title: apiPost.title,
            excerpt: apiPost.excerpt,
            content: apiPost.content,
            coverImage: apiPost.coverImage,
            date: apiPost.publishedAt || apiPost.createdAt,
            readTime: apiPost.readTime,
            category: apiPost.category,
            author: {
                name: apiPost.authorName,
                role: apiPost.authorRole,
            },
        }

        // Get all API posts for prev/next navigation
        const apiPosts = await getBlogPosts()
        allPosts = apiPosts.map((p) => ({
            slug: p.slug,
            title: p.title,
            excerpt: p.excerpt,
            content: p.content,
            coverImage: p.coverImage,
            date: p.publishedAt || p.createdAt,
            readTime: p.readTime,
            category: p.category,
            author: {
                name: p.authorName,
                role: p.authorRole,
            },
        }))
    } else {
        // Fallback to hardcoded data
        const hardcodedPost = getBlogPost(slug)
        if (!hardcodedPost) {
            notFound()
        }
        post = hardcodedPost
        allPosts = getAllBlogPosts()
    }

    const currentIndex = allPosts.findIndex((p) => p.slug === slug)
    const nextPost = allPosts[currentIndex + 1] || null
    const prevPost = allPosts[currentIndex - 1] || null

    return (
        <>
            <BlogPostingSchema post={post} />
            <BlogPostContent post={post} nextPost={nextPost} prevPost={prevPost} />
        </>
    )
}

export default BlogPostPage
