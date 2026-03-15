"use client"

import { useEffect, useState, useCallback, useRef, Suspense } from "react"
import dynamic from "next/dynamic"

const Hero = dynamic(() => import("@/components/sections/hero"))
const Process = dynamic(() => import("@/components/sections/process"))
const Quality = dynamic(() => import("@/components/sections/quality"))
const Testimonials = dynamic(() => import("@/components/sections/testimonials"))
const FAQ = dynamic(() => import("@/components/sections/faq"))
const CTA = dynamic(() => import("@/components/sections/cta"))

type SectionsData = Record<string, Record<string, unknown>>

function PagePreviewInner() {
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
