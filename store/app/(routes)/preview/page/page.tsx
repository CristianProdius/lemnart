"use client"

import { useEffect, useState, useCallback, useRef, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import dynamic from "next/dynamic"

const Hero = dynamic(() => import("@/components/sections/hero"))
const Process = dynamic(() => import("@/components/sections/process"))
const Quality = dynamic(() => import("@/components/sections/quality"))
const Testimonials = dynamic(() => import("@/components/sections/testimonials"))
const FAQ = dynamic(() => import("@/components/sections/faq"))
const CTA = dynamic(() => import("@/components/sections/cta"))

type SectionsData = Record<string, Record<string, unknown>>

function HomePreview({ sections, sectionRefs }: {
    sections: SectionsData
    sectionRefs: React.MutableRefObject<Record<string, HTMLDivElement | null>>
}) {
    const h = (sections.hero ?? {}) as Record<string, string>
    const processData = sections.process as { steps: { number: string; title: string; description: string }[] } | undefined
    const qualityData = sections.quality as { badges: { title: string; description: string }[] } | undefined
    const testimonialsData = sections.testimonials as { items: { quote: string; name: string; location: string }[] } | undefined
    const faqData = sections.faq as { items: { question: string; answer: string }[] } | undefined
    const ctaData = sections.cta as {
        marqueeText?: string; heading?: string; description?: string
        buttonLabel?: string; buttonHref?: string; phone?: string; email?: string
    } | undefined

    return (
        <>
            <div ref={(el) => { sectionRefs.current.hero = el }}>
                <Hero
                    headingLine1={h.headingLine1 || ""}
                    headingLine2={h.headingLine2 || ""}
                    subtitle={h.subtitle || ""}
                    cta={{ label: h.ctaLabel || "", href: h.ctaHref || "#" }}
                    secondaryLink={
                        h.secondaryLabel
                            ? { label: h.secondaryLabel, href: h.secondaryHref || "#" }
                            : undefined
                    }
                    videoSrc={h.videoSrc || ""}
                />
            </div>
            <div ref={(el) => { sectionRefs.current.process = el }}>
                <Process data={processData ?? null} />
            </div>
            <div ref={(el) => { sectionRefs.current.quality = el }}>
                <Quality data={qualityData ?? null} />
            </div>
            <div ref={(el) => { sectionRefs.current.testimonials = el }}>
                <Testimonials data={testimonialsData ?? null} />
            </div>
            <div ref={(el) => { sectionRefs.current.faq = el }}>
                <FAQ data={faqData ?? null} />
            </div>
            <div ref={(el) => { sectionRefs.current.cta = el }}>
                <CTA data={ctaData ?? null} />
            </div>
        </>
    )
}

function ContactPreview({ sections, sectionRefs }: {
    sections: SectionsData
    sectionRefs: React.MutableRefObject<Record<string, HTMLDivElement | null>>
}) {
    const hero = (sections["contact-hero"] ?? {}) as { heading?: string; description?: string }
    const info = (sections["contact-info"] ?? {}) as {
        phone?: string; phoneHref?: string; email?: string; emailHref?: string; location?: string
    }
    const hours = (sections["contact-hours"] ?? {}) as { rows?: { label: string; value: string }[] }

    return (
        <div className="bg-[var(--th-surface)]">
            <div ref={(el) => { sectionRefs.current["contact-hero"] = el }}>
                <section className="py-24 md:py-32">
                    <div className="mx-auto max-w-7xl px-6">
                        <h1
                            className="text-5xl text-[rgb(var(--th-text))] md:text-7xl lg:text-8xl"
                            style={{ fontFamily: "var(--font-instrument-serif)", fontStyle: "italic" }}
                        >
                            {hero.heading || "Contactează-ne"}
                        </h1>
                        <p
                            className="mt-6 max-w-xl text-base leading-relaxed text-[var(--th-text-tertiary)] md:text-lg"
                            style={{ fontFamily: "var(--font-barlow)" }}
                        >
                            {hero.description || ""}
                        </p>
                        <div className="mt-10 h-px w-16 bg-[var(--color-accent-light)]/30" />
                    </div>
                </section>
            </div>

            <div ref={(el) => { sectionRefs.current["contact-info"] = el }}>
                <section className="pb-16">
                    <div className="mx-auto max-w-7xl px-6">
                        <p
                            className="mb-8 text-xs font-medium uppercase tracking-[0.3em] text-[var(--color-accent-light)]"
                            style={{ fontFamily: "var(--font-barlow)" }}
                        >
                            Informații
                        </p>
                        <div className="space-y-6">
                            {info.phone && (
                                <div className="text-sm" style={{ fontFamily: "var(--font-barlow)" }}>
                                    <span className="text-[var(--th-text-muted)]">Telefon: </span>
                                    <span className="text-[var(--th-text-secondary)]">{info.phone}</span>
                                </div>
                            )}
                            {info.email && (
                                <div className="text-sm" style={{ fontFamily: "var(--font-barlow)" }}>
                                    <span className="text-[var(--th-text-muted)]">Email: </span>
                                    <span className="text-[var(--th-text-secondary)]">{info.email}</span>
                                </div>
                            )}
                            {info.location && (
                                <div className="text-sm" style={{ fontFamily: "var(--font-barlow)" }}>
                                    <span className="text-[var(--th-text-muted)]">Locație: </span>
                                    <span className="text-[var(--th-text-secondary)]">{info.location}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </section>
            </div>

            <div ref={(el) => { sectionRefs.current["contact-hours"] = el }}>
                <section className="pb-28 md:pb-40">
                    <div className="mx-auto max-w-7xl px-6">
                        <p
                            className="mb-4 text-xs font-medium uppercase tracking-[0.2em] text-[var(--th-text-muted)]"
                            style={{ fontFamily: "var(--font-barlow)" }}
                        >
                            Program
                        </p>
                        <div
                            className="max-w-sm space-y-2 text-sm text-[var(--th-text-tertiary)]"
                            style={{ fontFamily: "var(--font-barlow)" }}
                        >
                            {(hours.rows ?? []).map((row, i) => (
                                <div key={i} className="flex justify-between">
                                    <span>{row.label}</span>
                                    <span className="text-[var(--th-text-secondary)]">{row.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            </div>
        </div>
    )
}

function BlogPreview({ sections, sectionRefs }: {
    sections: SectionsData
    sectionRefs: React.MutableRefObject<Record<string, HTMLDivElement | null>>
}) {
    const hero = (sections["blog-hero"] ?? {}) as { heading?: string; description?: string }

    return (
        <div className="bg-[var(--th-surface)]">
            <div ref={(el) => { sectionRefs.current["blog-hero"] = el }}>
                <section className="py-24 md:py-32">
                    <div className="mx-auto max-w-7xl px-6">
                        <h1
                            className="text-5xl text-[rgb(var(--th-text))] md:text-7xl lg:text-8xl"
                            style={{ fontFamily: "var(--font-instrument-serif)", fontStyle: "italic" }}
                        >
                            {hero.heading || "Blog"}
                        </h1>
                        <p
                            className="mt-6 max-w-xl text-base leading-relaxed text-[var(--th-text-tertiary)] md:text-lg"
                            style={{ fontFamily: "var(--font-barlow)" }}
                        >
                            {hero.description || ""}
                        </p>
                        <div className="mt-10 h-px w-16 bg-[var(--color-accent-light)]/30" />
                    </div>
                </section>
            </div>
        </div>
    )
}

function PagePreviewInner() {
    const searchParams = useSearchParams()
    const pageKey = searchParams.get("pageKey") || "home"

    const [sections, setSections] = useState<SectionsData>({})
    const [ready, setReady] = useState(false)
    const readyRef = useRef(false)
    const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({})

    const handleMessage = useCallback((event: MessageEvent) => {
        if (event.data?.type === "PAGE_PREVIEW_UPDATE") {
            const payload = event.data.payload as {
                sections: SectionsData
                scrollTo?: string
            }
            setSections(payload.sections)
            if (!readyRef.current) {
                readyRef.current = true
                setReady(true)
            }
            if (payload.scrollTo && sectionRefs.current[payload.scrollTo]) {
                sectionRefs.current[payload.scrollTo]?.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                })
            }
        }
        if (event.data?.type === "PAGE_PREVIEW_SCROLL_TO") {
            const key = event.data.payload?.sectionKey as string
            if (key && sectionRefs.current[key]) {
                sectionRefs.current[key]?.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                })
            }
        }
    }, [])

    useEffect(() => {
        const nav = document.getElementById("site-navbar")
        const footer = document.querySelector("footer")
        const skip = document.querySelector('a[href="#main-content"]')
        if (nav) nav.style.display = "none"
        if (footer) footer.style.display = "none"
        if (skip) (skip as HTMLElement).style.display = "none"

        window.addEventListener("message", handleMessage)
        window.parent.postMessage({ type: "PAGE_PREVIEW_READY" }, "*")

        return () => {
            window.removeEventListener("message", handleMessage)
            if (nav) nav.style.display = ""
            if (footer) footer.style.display = ""
            if (skip) (skip as HTMLElement).style.display = ""
        }
    }, [handleMessage])

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

    if (pageKey === "contact") {
        return <ContactPreview sections={sections} sectionRefs={sectionRefs} />
    }

    if (pageKey === "blog") {
        return <BlogPreview sections={sections} sectionRefs={sectionRefs} />
    }

    return <HomePreview sections={sections} sectionRefs={sectionRefs} />
}

export default function PagePreviewPage() {
    return (
        <Suspense
            fallback={
                <div className="flex min-h-screen items-center justify-center bg-[var(--th-surface)]">
                    <p className="text-sm text-[var(--th-text-muted)]">
                        Loading...
                    </p>
                </div>
            }
        >
            <PagePreviewInner />
        </Suspense>
    )
}
