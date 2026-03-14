"use client"

import { useRef, useCallback } from "react"
import { useGSAP } from "@gsap/react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import Image from "next/image"
import SplitText from "@/components/ui/split-text"

gsap.registerPlugin(ScrollTrigger)

const collections = [
    {
        id: "1",
        name: "Clasic",
        description: "Eleganță atemporală",
        image: "/images/collection-classic.jpg",
        href: "/category/clasic",
    },
    {
        id: "2",
        name: "Modern",
        description: "Linii curate, design contemporan",
        image: "/images/collection-modern.jpg",
        href: "/category/modern",
    },
    {
        id: "3",
        name: "Rustic",
        description: "Căldura lemnului natural",
        image: "/images/collection-rustic.jpg",
        href: "/category/rustic",
    },
    {
        id: "4",
        name: "Minimalist",
        description: "Simplitate rafinată",
        image: "/images/collection-minimalist.jpg",
        href: "/category/minimalist",
    },
]

const Collections = () => {
    const sectionRef = useRef<HTMLElement>(null)
    const gridRef = useRef<HTMLDivElement>(null)
    const dividerRef = useRef<HTMLDivElement>(null)

    // Magnetic tilt per card
    const handleMouseMove = useCallback(
        (e: React.MouseEvent<HTMLAnchorElement>) => {
            const card = e.currentTarget
            const rect = card.getBoundingClientRect()
            const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2
            const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2

            gsap.to(card, {
                rotateY: x * 8,
                rotateX: -y * 8,
                duration: 0.4,
                ease: "power2.out",
                force3D: true,
            })

            // Image parallax inside card
            const img = card.querySelector(".card-img") as HTMLElement
            if (img) {
                gsap.to(img, {
                    x: -x * 15,
                    y: -y * 15,
                    scale: 1.12,
                    duration: 0.4,
                    ease: "power2.out",
                    force3D: true,
                })
            }
        },
        []
    )

    const handleMouseLeave = useCallback(
        (e: React.MouseEvent<HTMLAnchorElement>) => {
            const card = e.currentTarget
            gsap.to(card, {
                rotateY: 0,
                rotateX: 0,
                duration: 0.6,
                ease: "elastic.out(1, 0.5)",
                force3D: true,
            })
            const img = card.querySelector(".card-img") as HTMLElement
            if (img) {
                gsap.to(img, {
                    x: 0,
                    y: 0,
                    scale: 1,
                    duration: 0.6,
                    ease: "elastic.out(1, 0.5)",
                    force3D: true,
                })
            }
        },
        []
    )

    useGSAP(
        () => {
            if (!sectionRef.current) return

            // Section breathing entrance
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

            // Divider line draw
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

            // Cards stagger with rotation
            if (gridRef.current) {
                const cards = gridRef.current.querySelectorAll(".collection-card")
                gsap.from(cards, {
                    y: 80,
                    opacity: 0,
                    rotateZ: 2,
                    scale: 0.95,
                    duration: 1,
                    ease: "power3.out",
                    stagger: 0.12,
                    force3D: true,
                    scrollTrigger: {
                        trigger: gridRef.current,
                        start: "top 80%",
                        toggleActions: "play none none reverse",
                    },
                })
            }
        },
        { scope: sectionRef }
    )

    return (
        <>
            {/* Section divider */}
            <div className="mx-auto max-w-7xl px-6">
                <div ref={dividerRef} className="section-divider" />
            </div>

            <section
                ref={sectionRef}
                className="section-breathe py-28 md:py-40"
                style={{ backgroundColor: "var(--color-muted)" }}
            >
                <div className="mx-auto max-w-7xl px-6">
                    {/* Heading */}
                    <div className="mb-20 text-center">
                        <p className="mb-4 text-xs font-medium uppercase tracking-[0.3em] text-[#C8A55C]">
                            Descoperă
                        </p>
                        <SplitText
                            as="h2"
                            className="text-4xl font-bold tracking-tight md:text-6xl"
                            scrollTrigger
                            stagger={0.06}
                        >
                            Colecțiile Noastre
                        </SplitText>
                    </div>

                    {/* Cards */}
                    <div
                        ref={gridRef}
                        className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4"
                    >
                        {collections.map((c) => (
                            <a
                                key={c.id}
                                href={c.href}
                                className="collection-card group relative block aspect-[3/4] overflow-hidden rounded-2xl"
                                style={{ perspective: "800px" }}
                                onMouseMove={handleMouseMove}
                                onMouseLeave={handleMouseLeave}
                            >
                                <div className="absolute inset-0 overflow-hidden rounded-2xl bg-[#1A1A1A]">
                                    <Image
                                        src={c.image}
                                        alt={c.name}
                                        fill
                                        className="card-img object-cover opacity-75 transition-opacity duration-700 group-hover:opacity-50 will-change-transform"
                                    />
                                </div>

                                {/* Gradient */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                                {/* Content */}
                                <div className="absolute bottom-0 left-0 right-0 p-7">
                                    <p className="mb-1 text-xs font-medium uppercase tracking-[0.2em] text-[#C8A55C] opacity-0 transition-all duration-500 group-hover:opacity-100 group-hover:translate-y-0 translate-y-2">
                                        {c.description}
                                    </p>
                                    <h3 className="text-2xl font-bold text-white">
                                        {c.name}
                                    </h3>
                                    <div className="mt-3 flex items-center gap-2 text-sm text-white/50 transition-colors duration-300 group-hover:text-[#C8A55C]">
                                        <span>Explorează</span>
                                        <svg
                                            className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-2"
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
                                    </div>
                                </div>
                            </a>
                        ))}
                    </div>
                </div>
            </section>
        </>
    )
}

export default Collections
