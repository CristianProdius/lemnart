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

function SectionPreviewInner() {
    const searchParams = useSearchParams()
    const sectionKey = searchParams.get("key")
    const [data, setData] = useState<Record<string, unknown> | null>(null)
    const [ready, setReady] = useState(false)
    const readyRef = useRef(false)

    const handleMessage = useCallback(
        (event: MessageEvent) => {
            if (
                event.data?.type === "SECTION_PREVIEW_UPDATE" &&
                event.data.payload?.sectionKey === sectionKey
            ) {
                setData(event.data.payload.data)
                if (!readyRef.current) {
                    readyRef.current = true
                    setReady(true)
                }
            }
        },
        [sectionKey]
    )

    useEffect(() => {
        const nav = document.getElementById("site-navbar")
        const footer = document.querySelector("footer")
        const skip = document.querySelector('a[href="#main-content"]')
        if (nav) nav.style.display = "none"
        if (footer) footer.style.display = "none"
        if (skip) (skip as HTMLElement).style.display = "none"

        window.addEventListener("message", handleMessage)
        window.parent.postMessage({ type: "SECTION_PREVIEW_READY" }, "*")

        return () => {
            window.removeEventListener("message", handleMessage)
            if (nav) nav.style.display = ""
            if (footer) footer.style.display = ""
            if (skip) (skip as HTMLElement).style.display = ""
        }
    }, [handleMessage])

    if (!ready || !data) {
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

    return <SectionRenderer sectionKey={sectionKey} data={data} />
}

function SectionRenderer({
    sectionKey,
    data,
}: {
    sectionKey: string | null
    data: Record<string, unknown>
}) {
    switch (sectionKey) {
        case "hero":
            return (
                <Hero
                    headingLine1={(data.headingLine1 as string) || ""}
                    headingLine2={(data.headingLine2 as string) || ""}
                    subtitle={data.subtitle as string}
                    cta={{
                        label: (data.ctaLabel as string) || "",
                        href: (data.ctaHref as string) || "#",
                    }}
                    secondaryLink={
                        data.secondaryLabel
                            ? {
                                  label: data.secondaryLabel as string,
                                  href: (data.secondaryHref as string) || "#",
                              }
                            : undefined
                    }
                    videoSrc={(data.videoSrc as string) || ""}
                />
            )
        case "process":
            return (
                <Process
                    data={{
                        steps: data.steps as {
                            number: string
                            title: string
                            description: string
                        }[],
                    }}
                />
            )
        case "quality":
            return (
                <Quality
                    data={{
                        badges: data.badges as {
                            title: string
                            description: string
                        }[],
                    }}
                />
            )
        case "testimonials":
            return (
                <Testimonials
                    data={{
                        items: data.items as {
                            quote: string
                            name: string
                            location: string
                        }[],
                    }}
                />
            )
        case "faq":
            return (
                <FAQ
                    data={{
                        items: data.items as {
                            question: string
                            answer: string
                        }[],
                    }}
                />
            )
        case "cta":
            return <CTA data={data as CTAData} />
        default:
            return (
                <div className="flex min-h-screen items-center justify-center">
                    <p className="text-sm text-muted-foreground">
                        Unknown section: {sectionKey}
                    </p>
                </div>
            )
    }
}

type CTAData = {
    marqueeText?: string
    heading?: string
    description?: string
    buttonLabel?: string
    buttonHref?: string
    phone?: string
    email?: string
}

export default function SectionPreviewPage() {
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
            <SectionPreviewInner />
        </Suspense>
    )
}
