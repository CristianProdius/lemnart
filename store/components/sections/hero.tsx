"use client"

import { useRef } from "react"
import { useGSAP } from "@gsap/react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import BackgroundVideo from "@/components/ui/background-video"

gsap.registerPlugin(ScrollTrigger)

interface HeroProps {
    headingLine1: string
    headingLine2: string
    subtext: string
    cta: { label: string; href: string }
    videoSrc: string
    posterSrc?: string
}

const Hero: React.FC<HeroProps> = ({
    headingLine1,
    headingLine2,
    subtext,
    cta,
    videoSrc,
    posterSrc,
}) => {
    const containerRef = useRef<HTMLDivElement>(null)
    const videoWrapRef = useRef<HTMLDivElement>(null)
    const line1Ref = useRef<HTMLDivElement>(null)
    const line2Ref = useRef<HTMLDivElement>(null)
    const subtextRef = useRef<HTMLParagraphElement>(null)
    const ctaRef = useRef<HTMLDivElement>(null)
    const scrollRef = useRef<HTMLDivElement>(null)
    const lineRef = useRef<HTMLDivElement>(null)

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

            // Heading line 1 — word by word with 3D rotation
            if (line1Ref.current) {
                const words = line1Ref.current.querySelectorAll(".hero-word")
                tl.from(
                    words,
                    {
                        y: 80,
                        opacity: 0,
                        rotateX: 30,
                        filter: "blur(8px)",
                        duration: 1,
                        stagger: 0.08,
                        ease: "power3.out",
                    },
                    0.8
                )
            }

            // Heading line 2 — elegant sweep in with skew
            if (line2Ref.current) {
                tl.from(
                    line2Ref.current,
                    {
                        y: 60,
                        opacity: 0,
                        skewY: 3,
                        duration: 1.2,
                        ease: "power3.out",
                    },
                    "-=0.5"
                )
            }

            // Subtext fade up
            if (subtextRef.current) {
                tl.from(
                    subtextRef.current,
                    { y: 30, opacity: 0, duration: 0.8 },
                    "-=0.5"
                )
            }

            // CTA — elastic scale in
            if (ctaRef.current) {
                tl.from(
                    ctaRef.current,
                    {
                        scale: 0.8,
                        opacity: 0,
                        duration: 0.8,
                        ease: "back.out(1.7)",
                    },
                    "-=0.4"
                )
            }

            // Bottom line draw
            if (lineRef.current) {
                tl.from(
                    lineRef.current,
                    {
                        scaleX: 0,
                        duration: 1.2,
                        ease: "power2.inOut",
                    },
                    "-=0.6"
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

            // Scroll indicator fade
            if (scrollRef.current) {
                gsap.to(scrollRef.current, {
                    opacity: 0,
                    y: -20,
                    scrollTrigger: {
                        trigger: containerRef.current,
                        start: "top top",
                        end: "15% top",
                        scrub: true,
                    },
                })

                gsap.to(scrollRef.current.querySelector(".scroll-dot"), {
                    y: 18,
                    repeat: -1,
                    yoyo: true,
                    duration: 1.5,
                    ease: "power1.inOut",
                })
            }
        },
        { scope: containerRef }
    )

    const words1 = headingLine1.split(" ")

    return (
        <section
            ref={containerRef}
            className="relative flex min-h-[90vh] items-center justify-center overflow-hidden"
        >
            {/* Video background — no color overlay */}
            <div ref={videoWrapRef} className="absolute inset-0 will-change-transform">
                <BackgroundVideo
                    src={videoSrc}
                    poster={posterSrc}
                    disableOnMobile={false}
                />
            </div>

            {/* Subtle gradient for text legibility only */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-transparent to-black/30 pointer-events-none" />

            {/* Content */}
            <div className="hero-content relative z-10 mx-auto max-w-5xl px-6 pt-20 text-center text-white">
                {/* Line 1 — Barlow bold, tight tracking */}
                <div
                    ref={line1Ref}
                    className="mb-2 text-3xl font-semibold tracking-[-0.04em] text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.3)] sm:text-4xl md:text-5xl lg:text-6xl"
                    style={{ fontFamily: "var(--font-barlow)", perspective: "600px" }}
                >
                    {words1.map((word, i) => (
                        <span
                            key={i}
                            className="hero-word inline-block will-change-transform"
                            style={{ backfaceVisibility: "hidden" }}
                        >
                            {word}
                            {i < words1.length - 1 && "\u00A0"}
                        </span>
                    ))}
                </div>

                {/* Line 2 — Instrument Serif italic, large */}
                <div
                    ref={line2Ref}
                    className="mb-8 text-5xl italic leading-[1.1] text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.3)] sm:text-6xl md:text-7xl lg:text-[84px]"
                    style={{ fontFamily: "var(--font-instrument-serif)" }}
                >
                    {headingLine2}
                </div>

                {/* Subtext — Barlow Medium 18px */}
                <p
                    ref={subtextRef}
                    className="mx-auto mb-10 max-w-lg text-base font-medium leading-relaxed text-white/80 drop-shadow-[0_1px_4px_rgba(0,0,0,0.3)] md:text-lg"
                    style={{ fontFamily: "var(--font-barlow)" }}
                >
                    {subtext}
                </p>

                {/* CTA — white pill with play icon */}
                <div ref={ctaRef}>
                    <a
                        href={cta.href}
                        className="group inline-flex items-center gap-3 rounded-full bg-white px-8 py-4 text-sm font-semibold text-[#1A1A1A] shadow-[0_4px_30px_rgba(0,0,0,0.1)] transition-all duration-300 hover:shadow-[0_8px_40px_rgba(0,0,0,0.2)] hover:scale-[1.02]"
                        style={{ fontFamily: "var(--font-barlow)" }}
                    >
                        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#1A1A1A] transition-transform duration-300 group-hover:scale-110">
                            <svg
                                className="ml-0.5 h-3 w-3 text-white"
                                viewBox="0 0 12 14"
                                fill="currentColor"
                            >
                                <path d="M0 0L12 7L0 14V0Z" />
                            </svg>
                        </span>
                        {cta.label}
                    </a>
                </div>
            </div>

            {/* Bottom decorative line */}
            <div
                ref={lineRef}
                className="absolute bottom-20 left-[10%] right-[10%] h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"
            />

            {/* Scroll indicator */}
            <div
                ref={scrollRef}
                className="absolute bottom-8 left-1/2 -translate-x-1/2"
            >
                <div className="flex flex-col items-center gap-3 text-white/40">
                    <span
                        className="text-[10px] font-medium uppercase tracking-[0.25em]"
                        style={{ fontFamily: "var(--font-barlow)" }}
                    >
                        Scroll
                    </span>
                    <div className="relative h-10 w-5 rounded-full border border-white/20">
                        <div className="scroll-dot absolute left-1/2 top-1.5 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-white" />
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Hero
