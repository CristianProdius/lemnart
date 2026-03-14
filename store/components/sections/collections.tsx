"use client"

import { useRef, useCallback, useState } from "react"
import { useGSAP } from "@gsap/react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import Image from "next/image"
import Link from "next/link"
import SplitText from "@/components/ui/split-text"
import { cn } from "@/lib/utils"
import { Category, Product } from "@/types"

gsap.registerPlugin(ScrollTrigger)

const collectionsData = [
    {
        name: "Clasic",
        description: "Eleganță atemporală",
        image: "/images/collection-classic.jpg",
    },
    {
        name: "Modern",
        description: "Linii curate, design contemporan",
        image: "/images/collection-modern.jpg",
    },
    {
        name: "Rustic",
        description: "Căldura lemnului natural",
        image: "/images/collection-rustic.jpg",
    },
    {
        name: "Minimalist",
        description: "Simplitate rafinată",
        image: "/images/collection-minimalist.jpg",
    },
]

interface CollectionsProps {
    categories?: Category[]
    products?: Product[]
}

const Collections: React.FC<CollectionsProps> = ({ categories, products }) => {
    const sectionRef = useRef<HTMLElement>(null)
    const listRef = useRef<HTMLDivElement>(null)
    const previewRef = useRef<HTMLDivElement>(null)
    const [activePreview, setActivePreview] = useState<string | null>(null)

    const handleMouseMove = useCallback((e: React.MouseEvent) => {
        if (!previewRef.current) return
        gsap.to(previewRef.current, {
            x: e.clientX,
            y: e.clientY,
            duration: 0.4,
            ease: "power2.out",
            force3D: true,
        })
    }, [])

    const handleRowEnter = useCallback((id: string) => {
        setActivePreview(id)
        if (previewRef.current) {
            gsap.killTweensOf(previewRef.current)
            gsap.to(previewRef.current, {
                opacity: 1,
                scale: 1,
                duration: 0.2,
                ease: "power2.out",
            })
        }
    }, [])

    const handleRowLeave = useCallback(() => {
        if (previewRef.current) {
            gsap.to(previewRef.current, {
                opacity: 0,
                scale: 0.95,
                duration: 0.2,
                ease: "power2.out",
            })
        }
    }, [])

    const collections = collectionsData.map((item, i) => {
        const match = categories?.find(
            (cat) => cat.name.toLowerCase() === item.name.toLowerCase()
        )
        const categoryProducts = match
            ? products?.filter((p) => p.category.id === match.id)
            : products?.filter((p) => p.category.name.toLowerCase() === item.name.toLowerCase())
        const previewImage = categoryProducts?.[0]?.images?.[0]?.url || item.image
        return {
            id: match?.id || String(i + 1),
            name: item.name,
            description: item.description,
            image: previewImage,
            href: match ? `/category/${match.id}` : `/category/${item.name.toLowerCase()}`,
        }
    })

    useGSAP(
        () => {
            if (!sectionRef.current) return

            // Label entrance
            const label = sectionRef.current.querySelector(".collections-label")
            if (label) {
                gsap.from(label, {
                    y: 20,
                    opacity: 0,
                    duration: 1,
                    ease: "power2.out",
                    force3D: true,
                    scrollTrigger: {
                        trigger: label,
                        start: "top 85%",
                        toggleActions: "play none none reverse",
                    },
                })
            }

            // Rows stagger entrance — deliberate, one by one
            if (listRef.current) {
                const rows =
                    listRef.current.querySelectorAll(".collection-row")
                gsap.from(rows, {
                    y: 60,
                    opacity: 0,
                    duration: 1.2,
                    ease: "power2.out",
                    stagger: 0.2,
                    force3D: true,
                    scrollTrigger: {
                        trigger: listRef.current,
                        start: "top 70%",
                        toggleActions: "play none none reverse",
                    },
                })
            }
        },
        { scope: sectionRef }
    )

    return (
        <section
            ref={sectionRef}
            className="py-28 md:py-40 bg-[#1A1A1A] text-white"
            onMouseMove={handleMouseMove}
        >
                {/* Cursor-following preview image */}
                <div
                    ref={previewRef}
                    className="pointer-events-none fixed left-0 top-0 z-10 hidden md:block"
                    style={{
                        opacity: 0,
                        transform: "translate(-50%, -50%) scale(0.95)",
                    }}
                >
                    <div className="relative h-[400px] w-[320px] overflow-hidden rounded-2xl shadow-2xl">
                        {collections.map((c) => (
                            <Image
                                key={c.id}
                                src={c.image}
                                alt={c.name}
                                fill
                                className={cn(
                                    "object-cover transition-opacity duration-200 ease-out",
                                    activePreview === c.id ? "opacity-100" : "opacity-0"
                                )}
                                sizes="320px"
                            />
                        ))}
                    </div>
                </div>

                <div className="mx-auto max-w-7xl px-6">
                    {/* Heading */}
                    <div className="mb-20">
                        <p className="collections-label mb-4 text-xs font-medium uppercase tracking-[0.3em] text-[var(--color-accent-light)]">
                            Descoperă
                        </p>
                        <SplitText
                            as="h2"
                            className="text-4xl font-bold tracking-tight text-white md:text-6xl"
                            scrollTrigger
                            stagger={0.06}
                        >
                            Colecțiile Noastre
                        </SplitText>
                    </div>

                    {/* Text list */}
                    <div
                        ref={listRef}
                        className="border-t border-white/10"
                    >
                        {collections.map((c, i) => (
                            <Link
                                key={c.id}
                                href={c.href}
                                className="collection-row group flex items-center justify-between border-b border-white/10 py-8 transition-colors duration-200 ease-out hover:bg-white/[0.03] md:py-10"
                                onMouseEnter={() => handleRowEnter(c.id)}
                                onMouseLeave={handleRowLeave}
                            >
                                <div className="flex items-baseline gap-6 md:gap-10">
                                    <span className="font-body text-sm font-medium tabular-nums text-[var(--color-accent-light)]">
                                        {String(i + 1).padStart(2, "0")}
                                    </span>
                                    <h3 className="font-display text-3xl font-bold italic tracking-tight text-white transition-colors duration-200 ease-out group-hover:text-[var(--color-accent-light)] md:text-5xl lg:text-7xl">
                                        {c.name}
                                    </h3>
                                </div>
                                <div className="flex items-center gap-4 md:gap-8">
                                    <span
                                        className="hidden text-sm font-body text-white/40 md:block"
                                        style={{ textWrap: "pretty" }}
                                    >
                                        {c.description}
                                    </span>
                                    <div className="flex size-10 items-center justify-center rounded-full border border-white/10 transition-colors duration-200 ease-out group-hover:border-[var(--color-accent-light)] group-hover:bg-[var(--color-accent-light)]/10 md:size-12">
                                        <svg
                                            className="size-4 text-white/30 transition-[color,transform] duration-200 ease-out group-hover:text-[var(--color-accent-light)] group-hover:translate-x-0.5"
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
                            </Link>
                        ))}
                    </div>
                </div>
        </section>
    )
}

export default Collections
