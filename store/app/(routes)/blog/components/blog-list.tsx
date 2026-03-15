"use client"

import { useRef } from "react"
import Link from "next/link"
import { useGSAP } from "@gsap/react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { ArrowRight } from "lucide-react"
import { BlogPost } from "@/lib/blog-data"

gsap.registerPlugin(ScrollTrigger)

interface BlogListProps {
    posts: BlogPost[]
}

const BlogList: React.FC<BlogListProps> = ({ posts }) => {
    const listRef = useRef<HTMLDivElement>(null)

    useGSAP(
        () => {
            if (!listRef.current) return

            const items = listRef.current.querySelectorAll(".blog-card")
            gsap.from(items, {
                y: 50,
                opacity: 0,
                duration: 0.8,
                ease: "power3.out",
                stagger: 0.12,
                scrollTrigger: {
                    trigger: listRef.current,
                    start: "top 90%",
                    toggleActions: "play none none reverse",
                },
            })
        },
        { scope: listRef }
    )

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString("ro-RO", {
            day: "numeric",
            month: "long",
            year: "numeric",
        })
    }

    return (
        <div ref={listRef} className="space-y-0">
            {posts.map((post, i) => (
                <Link
                    key={post.slug}
                    href={`/blog/${post.slug}`}
                    className="blog-card group block border-t border-[var(--th-border)] py-10 transition first:border-t-0 md:py-14"
                >
                    <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between md:gap-16">
                        {/* Left — Meta */}
                        <div className="flex shrink-0 items-center gap-6 md:w-48">
                            <span
                                className="text-3xl font-bold text-[var(--th-text-ghost)] md:text-4xl"
                                style={{
                                    fontFamily: "var(--font-barlow)",
                                    fontVariantNumeric: "tabular-nums",
                                }}
                            >
                                {String(i + 1).padStart(2, "0")}
                            </span>
                            <div>
                                <p
                                    className="text-xs font-medium uppercase tracking-[0.2em] text-[var(--color-accent-light)]"
                                    style={{
                                        fontFamily: "var(--font-barlow)",
                                    }}
                                >
                                    {post.category}
                                </p>
                                <p
                                    className="mt-1 text-xs text-[var(--th-text-muted)]"
                                    style={{
                                        fontFamily: "var(--font-barlow)",
                                    }}
                                >
                                    {formatDate(post.date)}
                                </p>
                            </div>
                        </div>

                        {/* Center — Title + Excerpt */}
                        <div className="flex-1">
                            <h2
                                className="text-xl font-medium text-[var(--th-text-secondary)] transition-colors group-hover:text-[var(--color-accent-light)] md:text-2xl"
                                style={{
                                    fontFamily: "var(--font-barlow)",
                                }}
                            >
                                {post.title}
                            </h2>
                            <p
                                className="mt-3 line-clamp-2 text-sm leading-relaxed text-[var(--th-text-tertiary)]"
                                style={{
                                    fontFamily: "var(--font-barlow)",
                                }}
                            >
                                {post.excerpt}
                            </p>
                        </div>

                        {/* Right — Arrow + Read time */}
                        <div className="flex shrink-0 items-center gap-4 md:self-center">
                            <span
                                className="text-xs text-[var(--th-text-muted)]"
                                style={{
                                    fontFamily: "var(--font-barlow)",
                                }}
                            >
                                {post.readTime}
                            </span>
                            <div className="flex h-10 w-10 items-center justify-center border border-[var(--th-border)] text-[var(--th-text-muted)] transition-all group-hover:border-[var(--color-accent-light)] group-hover:text-[var(--color-accent-light)]">
                                <ArrowRight
                                    size={16}
                                    className="transition-transform group-hover:translate-x-0.5"
                                />
                            </div>
                        </div>
                    </div>
                </Link>
            ))}

            {/* Bottom border */}
            <div className="h-px bg-[var(--th-border)]" />
        </div>
    )
}

export default BlogList
