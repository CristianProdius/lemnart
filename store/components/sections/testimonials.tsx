"use client"

import { useRef } from "react"
import { useGSAP } from "@gsap/react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import SplitText from "@/components/ui/split-text"

gsap.registerPlugin(ScrollTrigger)

/**
 * V1 — Gold-Line Triptych
 *
 * Three testimonials separated by thin vertical gold lines — like
 * a high-end wine list or luxury menu. No cards, no backgrounds,
 * just panels defined by delicate 1px gold borders. A top and
 * bottom horizontal rule frames the entire grid.
 *
 * The luxury is in the proportion: generous inner padding, perfectly
 * sized typography, and the restraint of using only thin lines
 * as structural elements.
 */

const defaultTestimonials = [
    {
        quote: "Mascarea caloriferului a schimbat complet aspectul livingului. Calitate excepțională și finisaj impecabil!",
        name: "Maria P.",
        location: "București",
    },
    {
        quote: "Profesioniști de la A la Z. De la măsurare până la montaj, totul a decurs perfect. Recomand cu încredere.",
        name: "Andrei M.",
        location: "Cluj-Napoca",
    },
    {
        quote: "Am comandat pentru 4 camere. Fiecare piesă arată fabulos și se simte calitatea lemnului masiv.",
        name: "Elena D.",
        location: "Timișoara",
    },
]

interface TestimonialsProps {
    data?: { items: { quote: string; name: string; location: string }[] } | null;
}

const Testimonials: React.FC<TestimonialsProps> = ({ data }) => {
    const testimonials = (data?.items ?? defaultTestimonials).map((t, i) => ({
        ...t,
        id: i + 1,
    }));
    const sectionRef = useRef<HTMLElement>(null)
    const gridRef = useRef<HTMLDivElement>(null)
    const topLineRef = useRef<HTMLDivElement>(null)
    const bottomLineRef = useRef<HTMLDivElement>(null)

    useGSAP(
        () => {
            if (!sectionRef.current) return

            // Horizontal rules draw in
            ;[topLineRef, bottomLineRef].forEach((ref) => {
                if (!ref.current) return
                gsap.from(ref.current, {
                    scaleX: 0,
                    duration: 1.4,
                    ease: "power2.inOut",
                    scrollTrigger: {
                        trigger: ref.current,
                        start: "top 90%",
                        toggleActions: "play none none reverse",
                    },
                })
            })

            if (!gridRef.current) return

            // Panels stagger in
            const panels = gridRef.current.querySelectorAll(".triptych-panel")
            gsap.from(panels, {
                y: 40,
                opacity: 0,
                duration: 1,
                ease: "power3.out",
                stagger: 0.15,
                scrollTrigger: {
                    trigger: gridRef.current,
                    start: "top 80%",
                    toggleActions: "play none none reverse",
                },
            })

            // Ghost marks
            const marks = gridRef.current.querySelectorAll(".ghost-mark")
            gsap.from(marks, {
                scale: 0.7,
                opacity: 0,
                duration: 1.2,
                ease: "power2.out",
                stagger: 0.15,
                scrollTrigger: {
                    trigger: gridRef.current,
                    start: "top 80%",
                    toggleActions: "play none none reverse",
                },
            })
        },
        { scope: sectionRef }
    )

    return (
        <section
            ref={sectionRef}
            className="bg-[var(--th-surface)] py-28 text-[rgb(var(--th-text))] md:py-40"
        >
            <div className="mx-auto max-w-7xl px-6">
                {/* Heading */}
                <div className="mb-20 text-center md:mb-28">
                    <p className="mb-4 text-xs font-medium uppercase tracking-[0.3em] text-[var(--color-accent-light)]">
                        Testimoniale
                    </p>
                    <SplitText
                        as="h2"
                        className="text-balance text-4xl font-bold tracking-tight text-[rgb(var(--th-text))] md:text-6xl"
                        scrollTrigger
                        stagger={0.06}
                    >
                        Ce Spun Clienții Noștri
                    </SplitText>
                </div>

                {/* Top rule */}
                <div
                    ref={topLineRef}
                    className="h-px origin-center bg-[var(--color-accent-light)]/20"
                />

                {/* Triptych grid */}
                <div
                    ref={gridRef}
                    className="grid grid-cols-1 md:grid-cols-3"
                >
                    {testimonials.map((t, i) => (
                        <div
                            key={t.id}
                            className="triptych-panel relative px-6 py-14 md:px-10 md:py-16"
                            style={{
                                borderRight:
                                    i < testimonials.length - 1
                                        ? "1px solid rgba(200, 165, 92, 0.15)"
                                        : "none",
                                borderBottom:
                                    i < testimonials.length - 1
                                        ? "1px solid rgba(200, 165, 92, 0.15)"
                                        : "none",
                            }}
                        >
                            {/* Remove bottom border on desktop (only vertical lines) */}
                            <style>{`
                                @media (min-width: 768px) {
                                    .triptych-panel { border-bottom: none !important; }
                                }
                            `}</style>

                            {/* Ghost quote mark */}
                            <span
                                className="ghost-mark pointer-events-none absolute left-6 top-8 select-none text-7xl font-bold leading-none md:left-10 md:text-8xl"
                                style={{ color: "rgba(200, 165, 92, 0.04)" }}
                                aria-hidden="true"
                            >
                                &ldquo;
                            </span>

                            {/* Rating dots */}
                            <div className="relative mb-6 flex gap-1.5">
                                {Array.from({ length: 5 }).map((_, j) => (
                                    <span
                                        key={j}
                                        className="size-1 rounded-full bg-[var(--color-accent-light)]"
                                    />
                                ))}
                            </div>

                            {/* Quote */}
                            <blockquote
                                className="text-pretty relative mb-10 text-lg leading-relaxed text-[var(--th-text-secondary)] md:text-xl"
                                style={{
                                    fontFamily:
                                        "var(--font-instrument-serif)",
                                    fontStyle: "italic",
                                }}
                            >
                                {t.quote}
                            </blockquote>

                            {/* Attribution */}
                            <div className="relative mt-auto">
                                <div className="mb-3 h-px w-8 bg-[var(--th-border)]" />
                                <p className="text-sm font-medium text-[var(--th-text-secondary)]">
                                    {t.name}
                                </p>
                                <p className="mt-0.5 text-xs text-[var(--th-text-muted)]">
                                    {t.location}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Bottom rule */}
                <div
                    ref={bottomLineRef}
                    className="h-px origin-center bg-[var(--color-accent-light)]/20"
                />
            </div>
        </section>
    )
}

export default Testimonials
