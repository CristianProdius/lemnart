"use client"

import { useRef } from "react"
import Link from "next/link"
import { useGSAP } from "@gsap/react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { ArrowLeft, ArrowRight, Clock, Calendar } from "lucide-react"
import { BlogPost } from "@/lib/blog-data"

gsap.registerPlugin(ScrollTrigger)

interface BlogPostContentProps {
    post: BlogPost
    nextPost: BlogPost | null
    prevPost: BlogPost | null
}

const BlogPostContent: React.FC<BlogPostContentProps> = ({
    post,
    nextPost,
    prevPost,
}) => {
    const heroRef = useRef<HTMLElement>(null)
    const articleRef = useRef<HTMLElement>(null)

    useGSAP(
        () => {
            if (!heroRef.current) return
            const els = heroRef.current.querySelectorAll(".hero-animate")
            gsap.from(els, {
                y: 40,
                opacity: 0,
                duration: 0.8,
                ease: "power3.out",
                stagger: 0.12,
            })
        },
        { scope: heroRef }
    )

    useGSAP(
        () => {
            if (!articleRef.current) return
            gsap.from(articleRef.current, {
                y: 30,
                opacity: 0,
                duration: 0.8,
                ease: "power3.out",
                delay: 0.4,
            })
        },
        { scope: articleRef }
    )

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString("ro-RO", {
            day: "numeric",
            month: "long",
            year: "numeric",
        })
    }

    return (
        <div className="bg-[var(--th-surface)]">
            {/* Hero */}
            <section ref={heroRef} className="py-24 md:py-32">
                <div className="mx-auto max-w-4xl px-6">
                    {/* Back link */}
                    <Link
                        href="/blog"
                        className="hero-animate mb-10 inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.3em] text-[var(--color-accent-light)] transition hover:text-[rgb(var(--th-text))]"
                        style={{ fontFamily: "var(--font-barlow)" }}
                    >
                        <ArrowLeft size={14} />
                        Înapoi la blog
                    </Link>

                    {/* Category */}
                    <p
                        className="hero-animate mb-6 text-xs font-medium uppercase tracking-[0.3em] text-[var(--color-accent-light)]"
                        style={{ fontFamily: "var(--font-barlow)" }}
                    >
                        {post.category}
                    </p>

                    {/* Title */}
                    <h1
                        className="hero-animate text-3xl text-[rgb(var(--th-text))] md:text-5xl lg:text-6xl"
                        style={{
                            fontFamily: "var(--font-instrument-serif)",
                            fontStyle: "italic",
                            lineHeight: 1.15,
                        }}
                    >
                        {post.title}
                    </h1>

                    {/* Meta */}
                    <div className="hero-animate mt-8 flex flex-wrap items-center gap-6 text-sm text-[var(--th-text-tertiary)]">
                        <span
                            className="flex items-center gap-2"
                            style={{ fontFamily: "var(--font-barlow)" }}
                        >
                            <Calendar size={14} className="text-[var(--th-text-muted)]" />
                            {formatDate(post.date)}
                        </span>
                        <span className="h-3 w-px bg-[var(--th-border-strong)]" />
                        <span
                            className="flex items-center gap-2"
                            style={{ fontFamily: "var(--font-barlow)" }}
                        >
                            <Clock size={14} className="text-[var(--th-text-muted)]" />
                            {post.readTime} citire
                        </span>
                        <span className="h-3 w-px bg-[var(--th-border-strong)]" />
                        <span style={{ fontFamily: "var(--font-barlow)" }}>
                            {post.author.name}
                        </span>
                    </div>

                    {/* Decorative line */}
                    <div className="hero-animate mt-10 h-px w-16 bg-[var(--color-accent-light)]/30" />
                </div>
            </section>

            {/* Article */}
            <section ref={articleRef} className="pb-20 md:pb-28">
                <div className="mx-auto max-w-3xl px-6">
                    <div
                        className="blog-content"
                        dangerouslySetInnerHTML={{ __html: post.content }}
                    />
                </div>
            </section>

            {/* Navigation */}
            <section className="border-t border-[var(--th-border)] pb-28 md:pb-40">
                <div className="mx-auto max-w-4xl px-6 pt-12">
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                        {prevPost ? (
                            <Link
                                href={`/blog/${prevPost.slug}`}
                                className="group flex items-start gap-4 border border-[var(--th-border)] p-6 transition hover:border-[var(--color-accent-light)]/30"
                            >
                                <ArrowLeft
                                    size={18}
                                    className="mt-0.5 shrink-0 text-[var(--th-text-muted)] transition group-hover:text-[var(--color-accent-light)]"
                                />
                                <div>
                                    <p
                                        className="text-xs font-medium uppercase tracking-[0.2em] text-[var(--th-text-muted)]"
                                        style={{
                                            fontFamily: "var(--font-barlow)",
                                        }}
                                    >
                                        Articolul anterior
                                    </p>
                                    <p
                                        className="mt-2 text-sm text-[var(--th-text-secondary)] transition group-hover:text-[rgb(var(--th-text))]"
                                        style={{
                                            fontFamily: "var(--font-barlow)",
                                        }}
                                    >
                                        {prevPost.title}
                                    </p>
                                </div>
                            </Link>
                        ) : (
                            <div />
                        )}

                        {nextPost ? (
                            <Link
                                href={`/blog/${nextPost.slug}`}
                                className="group flex items-start justify-end gap-4 border border-[var(--th-border)] p-6 text-right transition hover:border-[var(--color-accent-light)]/30"
                            >
                                <div>
                                    <p
                                        className="text-xs font-medium uppercase tracking-[0.2em] text-[var(--th-text-muted)]"
                                        style={{
                                            fontFamily: "var(--font-barlow)",
                                        }}
                                    >
                                        Articolul următor
                                    </p>
                                    <p
                                        className="mt-2 text-sm text-[var(--th-text-secondary)] transition group-hover:text-[rgb(var(--th-text))]"
                                        style={{
                                            fontFamily: "var(--font-barlow)",
                                        }}
                                    >
                                        {nextPost.title}
                                    </p>
                                </div>
                                <ArrowRight
                                    size={18}
                                    className="mt-0.5 shrink-0 text-[var(--th-text-muted)] transition group-hover:text-[var(--color-accent-light)]"
                                />
                            </Link>
                        ) : (
                            <div />
                        )}
                    </div>
                </div>
            </section>
        </div>
    )
}

export default BlogPostContent
