import { getAllBlogPosts } from "@/lib/blog-data"
import getBlogPosts from "@/actions/get-blog-posts"
import BlogList from "./components/blog-list"
import BlogListSchema from "@/components/schema/blog-list-schema"
import Breadcrumb from "@/components/ui/breadcrumb"
import type { Metadata } from "next"

export const metadata: Metadata = {
    title: "Blog — LemnArt | Ghiduri și Inspirație pentru Designul Interior",
    description:
        "Articole despre mascări calorifere din lemn, tendințe în design interior, ghiduri de alegere și inspirație pentru casa ta.",
}

const BlogPage = async () => {
    const apiBlogPosts = await getBlogPosts()

    // Map API posts to the format expected by BlogList, or fallback to hardcoded
    const posts = apiBlogPosts.length > 0
        ? apiBlogPosts.map((post) => ({
            slug: post.slug,
            title: post.title,
            excerpt: post.excerpt,
            content: post.content,
            coverImage: post.coverImage,
            date: post.publishedAt || post.createdAt,
            readTime: post.readTime,
            category: post.category,
            author: {
                name: post.authorName,
                role: post.authorRole,
            },
        }))
        : getAllBlogPosts()

    return (
        <div className="bg-[var(--th-surface)]">
            <BlogListSchema posts={posts} />
            {/* Hero */}
            <section className="py-24 md:py-32">
                <div className="mx-auto max-w-7xl px-6">
                    <Breadcrumb
                        className="mb-8"
                        items={[
                            { label: "Acasă", href: "/" },
                            { label: "Blog" },
                        ]}
                    />

                    <h1
                        className="text-5xl text-[rgb(var(--th-text))] md:text-7xl lg:text-8xl"
                        style={{
                            fontFamily: "var(--font-instrument-serif)",
                            fontStyle: "italic",
                        }}
                    >
                        Blog
                    </h1>

                    <p
                        className="mt-6 max-w-xl text-base leading-relaxed text-[var(--th-text-tertiary)] md:text-lg"
                        style={{ fontFamily: "var(--font-barlow)" }}
                    >
                        Ghiduri, inspirație și sfaturi de la echipa noastră de
                        artizani. Totul despre mascări calorifere și design
                        interior.
                    </p>

                    <div className="mt-10 h-px w-16 bg-[var(--color-accent-light)]/30" />
                </div>
            </section>

            {/* Posts */}
            <section className="pb-28 md:pb-40">
                <div className="mx-auto max-w-7xl px-6">
                    <BlogList posts={posts} />
                </div>
            </section>
        </div>
    )
}

export default BlogPage
