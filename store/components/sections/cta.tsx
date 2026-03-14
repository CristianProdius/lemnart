"use client"

import { useRef } from "react"
import { useGSAP } from "@gsap/react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { Phone, Mail } from "lucide-react"

gsap.registerPlugin(ScrollTrigger)

const CTA = () => {
    const sectionRef = useRef<HTMLElement>(null)
    const headingRef = useRef<HTMLHeadingElement>(null)
    const contentRef = useRef<HTMLDivElement>(null)
    const dividerRef = useRef<HTMLDivElement>(null)

    useGSAP(
        () => {
            if (!sectionRef.current) return

            // Section breathing
            gsap.from(sectionRef.current, {
                scale: 0.97,
                opacity: 0.8,
                duration: 1,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top 85%",
                    toggleActions: "play none none reverse",
                },
            })

            // Divider
            if (dividerRef.current) {
                gsap.to(dividerRef.current, {
                    scaleX: 1,
                    duration: 1.2,
                    ease: "power2.inOut",
                    scrollTrigger: {
                        trigger: dividerRef.current,
                        start: "top 90%",
                        toggleActions: "play none none reverse",
                    },
                })
            }

            // Text outline → filled transition on scroll
            if (headingRef.current) {
                const words = headingRef.current.querySelectorAll(".cta-word")

                // Initial entrance
                gsap.from(words, {
                    y: 80,
                    opacity: 0,
                    duration: 1,
                    ease: "power3.out",
                    stagger: 0.08,
                    force3D: true,
                    scrollTrigger: {
                        trigger: headingRef.current,
                        start: "top 80%",
                        toggleActions: "play none none reverse",
                    },
                })

                // Outline → fill on deeper scroll
                words.forEach((word, i) => {
                    gsap.to(word, {
                        color: "var(--color-foreground)",
                        webkitTextStroke: "0px transparent",
                        duration: 0.6,
                        ease: "power2.out",
                        scrollTrigger: {
                            trigger: headingRef.current,
                            start: `${55 + i * 5}% 80%`,
                            toggleActions: "play none none reverse",
                        },
                    })
                })
            }

            // Content below heading
            if (contentRef.current) {
                gsap.from(contentRef.current.children, {
                    y: 30,
                    opacity: 0,
                    duration: 0.7,
                    ease: "power2.out",
                    stagger: 0.12,
                    scrollTrigger: {
                        trigger: contentRef.current,
                        start: "top 85%",
                        toggleActions: "play none none reverse",
                    },
                })
            }
        },
        { scope: sectionRef }
    )

    const heading = "Transformă-ți Spațiul"
    const words = heading.split(" ")

    return (
        <>
            <div className="mx-auto max-w-7xl px-6">
                <div ref={dividerRef} className="section-divider" />
            </div>

            <section
                ref={sectionRef}
                className="section-breathe relative overflow-hidden py-32 md:py-48"
                style={{
                    background:
                        "linear-gradient(160deg, #F8F4E8 0%, #F0EBD8 40%, #EDE5D0 100%)",
                }}
            >
                {/* Radial glow */}
                <div
                    className="pointer-events-none absolute inset-0"
                    style={{
                        background:
                            "radial-gradient(ellipse at 50% 80%, rgba(200, 165, 92, 0.15) 0%, transparent 60%)",
                    }}
                />

                <div className="relative mx-auto max-w-5xl px-6 text-center">
                    {/* Big heading with outline effect */}
                    <h2
                        ref={headingRef}
                        className="mb-8 text-5xl font-bold leading-[1.05] tracking-tight md:text-7xl lg:text-[6rem]"
                        style={{ perspective: "600px" }}
                    >
                        {words.map((word, i) => (
                            <span
                                key={i}
                                className="cta-word inline-block will-change-transform"
                                style={{
                                    WebkitTextStroke: "2px var(--color-foreground)",
                                    color: "transparent",
                                    backfaceVisibility: "hidden",
                                }}
                            >
                                {word}
                                {i < words.length - 1 && "\u00A0"}
                            </span>
                        ))}
                    </h2>

                    <div ref={contentRef}>
                        <p className="mx-auto mb-10 max-w-lg text-base leading-relaxed text-neutral-600 md:text-lg">
                            Solicită o consultație gratuită și descoperă soluția
                            perfectă pentru casa ta.
                        </p>

                        <a
                            href="/contact"
                            className="glow-pulse inline-flex items-center gap-2 rounded-full bg-[#8B6914] px-10 py-4 text-sm font-semibold text-white transition-all duration-300 hover:bg-[#6B5210] hover:shadow-[0_0_40px_rgba(139,105,20,0.4)]"
                        >
                            Contactează-ne
                            <svg
                                className="h-4 w-4"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={2}
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                                />
                            </svg>
                        </a>

                        <div className="mt-14 flex flex-col items-center justify-center gap-8 sm:flex-row">
                            <a
                                href="tel:+40700000000"
                                className="group flex items-center gap-3 text-sm text-neutral-500 transition-colors duration-300 hover:text-[#8B6914]"
                            >
                                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/80 transition-all duration-300 group-hover:bg-[#C8A55C]/10">
                                    <Phone size={16} />
                                </span>
                                +40 700 000 000
                            </a>
                            <a
                                href="mailto:contact@lemnart.ro"
                                className="group flex items-center gap-3 text-sm text-neutral-500 transition-colors duration-300 hover:text-[#8B6914]"
                            >
                                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/80 transition-all duration-300 group-hover:bg-[#C8A55C]/10">
                                    <Mail size={16} />
                                </span>
                                contact@lemnart.ro
                            </a>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}

export default CTA
