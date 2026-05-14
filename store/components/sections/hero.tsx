"use client"

import { useRef } from "react"
import { useGSAP } from "@gsap/react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"

gsap.registerPlugin(ScrollTrigger)

interface HeroProps {
    headingLine1: string
    headingLine2: string
    subtitle?: string
    cta: { label: string; href: string }
    secondaryLink?: { label: string; href: string }
}

const Hero: React.FC<HeroProps> = ({
    headingLine1,
    headingLine2,
    subtitle,
    cta,
    secondaryLink,
}) => {
    const containerRef = useRef<HTMLDivElement>(null)
    const line1Ref = useRef<HTMLDivElement>(null)
    const line2Ref = useRef<HTMLDivElement>(null)
    const subtitleRef = useRef<HTMLParagraphElement>(null)
    const ctaRef = useRef<HTMLDivElement>(null)

    useGSAP(
        () => {
            if (!containerRef.current) return

            const tl = gsap.timeline({
                defaults: { ease: "power3.out", force3D: true },
            })

            if (line1Ref.current) {
                const words = line1Ref.current.querySelectorAll(".hero-word")
                tl.from(
                    words,
                    {
                        y: 60,
                        opacity: 0,
                        filter: "blur(6px)",
                        duration: 0.6,
                        stagger: 0.05,
                        ease: "power3.out",
                    },
                    0.1
                )
            }

            if (line2Ref.current) {
                const words = line2Ref.current.querySelectorAll(".hero-word")
                tl.from(
                    words,
                    {
                        y: 40,
                        opacity: 0,
                        filter: "blur(4px)",
                        duration: 0.6,
                        stagger: 0.05,
                        ease: "power3.out",
                    },
                    "-=0.45"
                )
            }

            if (subtitleRef.current) {
                tl.from(
                    subtitleRef.current,
                    {
                        y: 20,
                        opacity: 0,
                        duration: 0.5,
                        ease: "power3.out",
                    },
                    "-=0.35"
                )
            }

            if (ctaRef.current) {
                tl.from(
                    ctaRef.current,
                    {
                        y: 25,
                        opacity: 0,
                        duration: 0.5,
                        ease: "power3.out",
                    },
                    "-=0.35"
                )
            }

            const content = containerRef.current.querySelector(".hero-content")
            if (content) {
                gsap.to(content, {
                    yPercent: -20,
                    opacity: 0,
                    ease: "none",
                    scrollTrigger: {
                        trigger: containerRef.current,
                        start: "top top",
                        end: "60% top",
                        scrub: true,
                    },
                })
            }
        },
        { scope: containerRef }
    )

    const words1 = headingLine1.split(" ")
    const words2 = headingLine2.split(" ")

    return (
        <section
            ref={containerRef}
            className="relative min-h-[80vh] overflow-hidden bg-[var(--th-hero-bg)]"
        >
            <div
                className="pointer-events-none absolute inset-0"
                style={{ backgroundImage: "var(--th-hero-glow)" }}
            />

            <div
                className="pointer-events-none absolute bottom-0 left-0 right-0 h-20 md:h-28"
                style={{
                    backgroundImage:
                        "linear-gradient(to bottom, transparent, var(--th-surface))",
                }}
            />

            <div
                className={cn(
                    "hero-content relative z-10",
                    "flex min-h-[80vh] flex-col items-center justify-center text-center",
                    "px-6 md:px-12 lg:px-20"
                )}
            >
                <div className="mx-auto max-w-4xl">
                    <h1
                        className="text-balance text-5xl italic leading-[1.05] text-[rgb(var(--th-text))] sm:text-6xl md:text-7xl lg:text-8xl xl:text-[96px]"
                        style={{ fontFamily: "var(--font-instrument-serif)" }}
                    >
                        <span ref={line1Ref} className="block">
                            {words1.map((word, i) => (
                                <span
                                    key={i}
                                    className="hero-word inline-block"
                                    style={{ backfaceVisibility: "hidden" }}
                                >
                                    {word}
                                    {i < words1.length - 1 && " "}
                                </span>
                            ))}
                        </span>
                        <span ref={line2Ref} className="block">
                            {words2.map((word, i) => (
                                <span
                                    key={i}
                                    className="hero-word inline-block"
                                    style={{ backfaceVisibility: "hidden" }}
                                >
                                    {word}
                                    {i < words2.length - 1 && " "}
                                </span>
                            ))}
                        </span>
                    </h1>

                    {subtitle && (
                        <p
                            ref={subtitleRef}
                            className="text-pretty mx-auto mt-6 max-w-xl text-lg leading-relaxed text-[var(--th-text-secondary)] md:text-xl lg:text-2xl"
                            style={{ fontFamily: "var(--font-barlow)" }}
                        >
                            {subtitle}
                        </p>
                    )}

                    <div
                        ref={ctaRef}
                        className="mt-10 flex items-center justify-center gap-6"
                    >
                        <Link
                            href={cta.href}
                            className="group inline-flex items-center gap-3 rounded-full bg-[var(--th-btn-inverse-bg)] px-7 py-4 text-sm font-medium text-[var(--th-btn-inverse-text)] transition-all duration-200 hover:opacity-85"
                            style={{ fontFamily: "var(--font-barlow)" }}
                        >
                            {cta.label}
                            <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" />
                        </Link>
                        {secondaryLink && (
                            <Link
                                href={secondaryLink.href}
                                className="text-sm font-medium text-[var(--th-text-tertiary)] underline underline-offset-4 transition-colors duration-200 hover:text-[rgb(var(--th-text))]"
                                style={{ fontFamily: "var(--font-barlow)" }}
                            >
                                {secondaryLink.label}
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Hero
