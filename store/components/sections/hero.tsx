"use client"

import { useRef } from "react"
import { useGSAP } from "@gsap/react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import BackgroundVideo from "@/components/ui/background-video"
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
    videoSrc: string
    posterSrc?: string
}

const Hero: React.FC<HeroProps> = ({
    headingLine1,
    headingLine2,
    subtitle,
    cta,
    secondaryLink,
    videoSrc,
    posterSrc,
}) => {
    const containerRef = useRef<HTMLDivElement>(null)
    const videoWrapRef = useRef<HTMLDivElement>(null)
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

            // Video zoom-out reveal
            if (videoWrapRef.current) {
                tl.from(videoWrapRef.current, {
                    scale: 1.2,
                    duration: 2.4,
                    ease: "power2.out",
                })
            }

            // Heading line 1 — word by word with blur
            if (line1Ref.current) {
                const words = line1Ref.current.querySelectorAll(".hero-word")
                tl.from(
                    words,
                    {
                        y: 80,
                        opacity: 0,
                        filter: "blur(8px)",
                        duration: 1,
                        stagger: 0.08,
                        ease: "power3.out",
                    },
                    0.8
                )
            }

            // Heading line 2 — sweep in
            if (line2Ref.current) {
                const words = line2Ref.current.querySelectorAll(".hero-word")
                tl.from(
                    words,
                    {
                        y: 60,
                        opacity: 0,
                        filter: "blur(6px)",
                        duration: 1,
                        stagger: 0.08,
                        ease: "power3.out",
                    },
                    "-=0.6"
                )
            }

            // Subtitle — fade in
            if (subtitleRef.current) {
                tl.from(
                    subtitleRef.current,
                    {
                        y: 30,
                        opacity: 0,
                        duration: 0.8,
                        ease: "power3.out",
                    },
                    "-=0.4"
                )
            }

            // CTA — slide up and fade in
            if (ctaRef.current) {
                tl.from(
                    ctaRef.current,
                    {
                        y: 40,
                        opacity: 0,
                        duration: 1,
                        ease: "power3.out",
                    },
                    "-=0.4"
                )
            }

            // Content parallax on scroll
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
            className="relative min-h-dvh overflow-hidden"
        >
            {/* Video background */}
            <div ref={videoWrapRef} className="absolute inset-0 will-change-transform">
                <BackgroundVideo
                    src={videoSrc}
                    poster={posterSrc}
                />
            </div>

            {/* Solid overlay for text legibility */}
            <div className="pointer-events-none absolute inset-0 bg-black/50" />

            {/* Content */}
            <div
                className={cn(
                    "hero-content relative z-10",
                    "flex min-h-dvh items-center",
                    "px-6 md:px-12 lg:px-20"
                )}
            >
                <div className="max-w-3xl">
                    <h1 className="text-balance text-5xl italic leading-[1.05] text-[#F5F0EB] drop-shadow-lg sm:text-6xl md:text-7xl lg:text-8xl xl:text-[96px]" style={{ fontFamily: "var(--font-instrument-serif)" }}>
                        <span ref={line1Ref} className="block">
                            {words1.map((word, i) => (
                                <span
                                    key={i}
                                    className="hero-word inline-block"
                                    style={{ backfaceVisibility: "hidden" }}
                                >
                                    {word}
                                    {i < words1.length - 1 && "\u00A0"}
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
                                    {i < words2.length - 1 && "\u00A0"}
                                </span>
                            ))}
                        </span>
                    </h1>

                    {/* Subtitle */}
                    {subtitle && (
                        <p
                            ref={subtitleRef}
                            className="text-pretty mt-6 max-w-xl text-lg leading-relaxed text-white/70 md:text-xl lg:text-2xl"
                            style={{ fontFamily: "var(--font-barlow)" }}
                        >
                            {subtitle}
                        </p>
                    )}

                    {/* CTA */}
                    <div ref={ctaRef} className="mt-10 flex items-center gap-6">
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
                                className="text-sm font-medium text-white/60 underline underline-offset-4 transition-colors duration-200 hover:text-white"
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
