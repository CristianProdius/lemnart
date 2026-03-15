import { getBlogPost, getAllBlogPosts } from "@/lib/blog-data"
import { notFound } from "next/navigation"
import BlogPostContent from "./components/blog-post-content"
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
    const post = getBlogPost(slug)

    if (!post) return { title: "Post not found" }

    return {
        title: `${post.title} — LemnArt Blog`,
        description: post.excerpt,
    }
}

const BlogPostPage = async ({ params }: { params: Params }) => {
    const { slug } = await params
    const post = getBlogPost(slug)

    if (!post) {
        notFound()
    }

    const allPosts = getAllBlogPosts()
    const currentIndex = allPosts.findIndex((p) => p.slug === slug)
    const nextPost = allPosts[currentIndex + 1] || null
    const prevPost = allPosts[currentIndex - 1] || null

    return <BlogPostContent post={post} nextPost={nextPost} prevPost={prevPost} />
}

export default BlogPostPage
