"use client"

import { useRef } from "react"
import { useGSAP } from "@gsap/react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { ArrowRight, Phone, Mail } from "lucide-react"

gsap.registerPlugin(ScrollTrigger)

/**
 * CTA — Infinite Marquee with Floating CTA
 *
 * Two rows of oversized text scroll infinitely in opposite
 * directions — one left, one right — creating visual energy
 * and movement. A static, sharp-cornered card floats centered
 * on top containing the actual CTA content (subtitle, button,
 * contact). The marquee text is the heading repeated.
 *
 * The contrast between the kinetic background and the still
 * card creates tension and draws focus.
 */

const CTA = () => {
    const sectionRef = useRef<HTMLElement>(null)
    const cardRef = useRef<HTMLDivElement>(null)
    const marquee1Ref = useRef<HTMLDivElement>(null)
    const marquee2Ref = useRef<HTMLDivElement>(null)

    useGSAP(
        () => {
            if (!sectionRef.current) return

            // Marquee 1 — scrolls left
            if (marquee1Ref.current) {
                gsap.to(marquee1Ref.current, {
                    xPercent: -50,
                    duration: 30,
                    ease: "none",
                    repeat: -1,
                })
            }

            // Marquee 2 — scrolls right
            if (marquee2Ref.current) {
                gsap.fromTo(
                    marquee2Ref.current,
                    { xPercent: -50 },
                    {
                        xPercent: 0,
                        duration: 30,
                        ease: "none",
                        repeat: -1,
                    }
                )
            }

            // Card entrance
            if (cardRef.current) {
                gsap.from(cardRef.current, {
                    y: 60,
                    opacity: 0,
                    scale: 0.95,
                    duration: 1,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: "top 70%",
                        toggleActions: "play none none reverse",
                    },
                })
            }
        },
        { scope: sectionRef }
    )

    const marqueeText = "Transformă-ți Spațiul — "
    const repeated = marqueeText.repeat(6)

    return (
        <section
            ref={sectionRef}
            className="relative overflow-hidden bg-[#1A1A1A] py-32 text-white md:py-48"
        >
            {/* Marquee Row 1 — scrolls left */}
            <div className="pointer-events-none select-none">
                <div
                    ref={marquee1Ref}
                    className="flex whitespace-nowrap"
                    style={{ width: "fit-content" }}
                >
                    <span
                        className="text-7xl font-bold text-white/[0.03] md:text-9xl"
                        aria-hidden="true"
                    >
                        {repeated}
                    </span>
                </div>
            </div>

            {/* Floating CTA Card — centered */}
            <div className="absolute inset-0 flex items-center justify-center px-6">
                <div
                    ref={cardRef}
                    className="w-full max-w-lg border border-white/8 bg-[#1A1A1A]/95 p-10 text-center backdrop-blur-sm md:p-14"
                >
                    <p className="mb-4 text-xs font-medium uppercase tracking-[0.3em] text-[var(--color-accent-light)]">
                        Contactează-ne
                    </p>

                    <h2
                        className="text-balance text-3xl text-white md:text-4xl"
                        style={{
                            fontFamily: "var(--font-instrument-serif)",
                            fontStyle: "italic",
                        }}
                    >
                        Transformă-ți Spațiul
                    </h2>

                    <p className="text-pretty mx-auto mt-4 max-w-xs text-sm leading-relaxed text-white/40">
                        Solicită o consultație gratuită și descoperă soluția
                        perfectă pentru casa ta.
                    </p>

                    <a
                        href="/contact"
                        className="group mt-8 inline-flex items-center gap-3 border border-[var(--color-accent-light)] px-10 py-4 text-sm font-medium text-[var(--color-accent-light)] transition-all duration-300 hover:bg-[var(--color-accent-light)] hover:text-[#1A1A1A]"
                    >
                        Contactează-ne
                        <ArrowRight
                            size={16}
                            className="transition-transform duration-300 group-hover:translate-x-1"
                        />
                    </a>

                    <div className="mt-10 flex flex-col items-center justify-center gap-6 sm:flex-row">
                        <a
                            href="tel:+40700000000"
                            className="flex items-center gap-2 text-xs text-white/25 transition-colors duration-300 hover:text-[var(--color-accent-light)]"
                        >
                            <Phone size={12} />
                            +40 700 000 000
                        </a>
                        <a
                            href="mailto:contact@lemnart.ro"
                            className="flex items-center gap-2 text-xs text-white/25 transition-colors duration-300 hover:text-[var(--color-accent-light)]"
                        >
                            <Mail size={12} />
                            contact@lemnart.ro
                        </a>
                    </div>
                </div>
            </div>

            {/* Marquee Row 2 — scrolls right */}
            <div className="pointer-events-none select-none">
                <div
                    ref={marquee2Ref}
                    className="flex whitespace-nowrap"
                    style={{ width: "fit-content" }}
                >
                    <span
                        className="text-7xl font-bold text-white/[0.03] md:text-9xl"
                        aria-hidden="true"
                    >
                        {repeated}
                    </span>
                </div>
            </div>
        </section>
    )
}

export default CTA
