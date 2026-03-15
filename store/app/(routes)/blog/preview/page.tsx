"use client"

import { useEffect, useState, useCallback } from "react"
import { Calendar, Clock } from "lucide-react"

interface PreviewData {
    title: string
    excerpt: string
    content: string
    category: string
    readTime: string
    authorName: string
    coverImage: string
    publishedAt: string | null
}

const EMPTY: PreviewData = {
    title: "",
    excerpt: "",
    content: "",
    category: "",
    readTime: "",
    authorName: "",
    coverImage: "",
    publishedAt: null,
}

export default function BlogPreviewPage() {
    const [data, setData] = useState<PreviewData>(EMPTY)
    const [ready, setReady] = useState(false)

    const handleMessage = useCallback((event: MessageEvent) => {
        if (event.data?.type === "BLOG_PREVIEW_UPDATE") {
            setData(event.data.payload)
            if (!ready) setReady(true)
        }
    }, [ready])

    useEffect(() => {
        // Hide navbar, footer, and skip-to-content link when in preview mode
        const nav = document.querySelector("nav")
        const footer = document.querySelector("footer")
        const skip = document.querySelector('a[href="#main-content"]')
        if (nav) nav.style.display = "none"
        if (footer) footer.style.display = "none"
        if (skip) (skip as HTMLElement).style.display = "none"

        window.addEventListener("message", handleMessage)

        // Tell the parent iframe we're ready to receive data
        window.parent.postMessage({ type: "BLOG_PREVIEW_READY" }, "*")

        return () => {
            window.removeEventListener("message", handleMessage)
            if (nav) nav.style.display = ""
            if (footer) footer.style.display = ""
            if (skip) (skip as HTMLElement).style.display = ""
        }
    }, [handleMessage])

    const formatDate = (dateStr: string | null) => {
        if (!dateStr) return "Fără dată"
        return new Date(dateStr).toLocaleDateString("ro-RO", {
            day: "numeric",
            month: "long",
            year: "numeric",
        })
    }

    if (!ready) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-[var(--th-surface)]">
                <p
                    className="text-sm text-[var(--th-text-muted)]"
                    style={{ fontFamily: "var(--font-barlow)" }}
                >
                    Waiting for preview data...
                </p>
            </div>
        )
    }

    return (
        <div className="bg-[var(--th-surface)]">
            {/* Hero */}
            <section className="py-24 md:py-32">
                <div className="mx-auto max-w-4xl px-6">
                    {/* Category */}
                    {data.category && (
                        <p
                            className="mb-6 text-xs font-medium uppercase tracking-[0.3em] text-[var(--color-accent-light)]"
                            style={{ fontFamily: "var(--font-barlow)" }}
                        >
                            {data.category}
                        </p>
                    )}

                    {/* Title */}
                    <h1
                        className="text-3xl text-[rgb(var(--th-text))] md:text-5xl lg:text-6xl"
                        style={{
                            fontFamily: "var(--font-instrument-serif)",
                            fontStyle: "italic",
                            lineHeight: 1.15,
                        }}
                    >
                        {data.title || "Untitled Post"}
                    </h1>

                    {/* Meta */}
                    <div className="mt-8 flex flex-wrap items-center gap-6 text-sm text-[var(--th-text-tertiary)]">
                        <span
                            className="flex items-center gap-2"
                            style={{ fontFamily: "var(--font-barlow)" }}
                        >
                            <Calendar size={14} className="text-[var(--th-text-muted)]" />
                            {formatDate(data.publishedAt)}
                        </span>
                        {data.readTime && (
                            <>
                                <span className="h-3 w-px bg-[var(--th-border-strong)]" />
                                <span
                                    className="flex items-center gap-2"
                                    style={{ fontFamily: "var(--font-barlow)" }}
                                >
                                    <Clock size={14} className="text-[var(--th-text-muted)]" />
                                    {data.readTime} citire
                                </span>
                            </>
                        )}
                        {data.authorName && (
                            <>
                                <span className="h-3 w-px bg-[var(--th-border-strong)]" />
                                <span style={{ fontFamily: "var(--font-barlow)" }}>
                                    {data.authorName}
                                </span>
                            </>
                        )}
                    </div>

                    {/* Decorative line */}
                    <div className="mt-10 h-px w-16 bg-[var(--color-accent-light)]/30" />
                </div>
            </section>

            {/* Cover Image */}
            {data.coverImage && (
                <section className="pb-12">
                    <div className="mx-auto max-w-4xl px-6">
                        <img
                            src={data.coverImage}
                            alt={data.title || "Cover"}
                            className="w-full rounded-sm object-cover"
                            style={{ maxHeight: "480px" }}
                        />
                    </div>
                </section>
            )}

            {/* Article */}
            <section className="pb-20 md:pb-28">
                <div className="mx-auto max-w-3xl px-6">
                    {data.content ? (
                        <div
                            className="blog-content"
                            dangerouslySetInnerHTML={{ __html: data.content }}
                        />
                    ) : (
                        <p
                            className="text-sm text-[var(--th-text-muted)]"
                            style={{ fontFamily: "var(--font-barlow)" }}
                        >
                            Start writing to see content here...
                        </p>
                    )}
                </div>
            </section>
        </div>
    )
}
