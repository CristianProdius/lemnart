import { getAllBlogPosts } from "@/lib/blog-data"
import BlogList from "./components/blog-list"
import type { Metadata } from "next"

export const metadata: Metadata = {
    title: "Blog — LemnArt | Ghiduri și Inspirație pentru Designul Interior",
    description:
        "Articole despre mascări calorifere din lemn, tendințe în design interior, ghiduri de alegere și inspirație pentru casa ta.",
}

const BlogPage = () => {
    const posts = getAllBlogPosts()

    return (
        <div className="bg-[var(--th-surface)]">
            {/* Hero */}
            <section className="py-24 md:py-32">
                <div className="mx-auto max-w-7xl px-6">
                    <p
                        className="mb-8 text-xs font-medium uppercase tracking-[0.3em] text-[var(--color-accent-light)]"
                        style={{ fontFamily: "var(--font-barlow)" }}
                    >
                        Acasă{" "}
                        <span className="mx-2 text-[var(--th-text-muted)]">/</span>{" "}
                        <span className="text-[var(--th-text-tertiary)]">Blog</span>
                    </p>

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
