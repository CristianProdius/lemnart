"use client"

import { useRef } from "react"
import { useGSAP } from "@gsap/react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { Billboard } from "@/types"

gsap.registerPlugin(ScrollTrigger)

interface CategoryHeroProps {
    name: string
    billboard?: Billboard
    productCount: number
}

const CategoryHero: React.FC<CategoryHeroProps> = ({
    name,
    billboard,
    productCount,
}) => {
    const sectionRef = useRef<HTMLElement>(null)

    useGSAP(
        () => {
            if (!sectionRef.current) return
            const els = sectionRef.current.querySelectorAll(".hero-animate")
            gsap.from(els, {
                y: 40,
                opacity: 0,
                duration: 0.8,
                ease: "power3.out",
                stagger: 0.12,
            })
        },
        { scope: sectionRef }
    )

    return (
        <section
            ref={sectionRef}
            className="relative overflow-hidden bg-[var(--th-surface)] py-24 text-[rgb(var(--th-text))] md:py-32"
        >
            {/* Billboard background image */}
            {billboard?.imageUrl && (
                <div
                    className="absolute inset-0 opacity-15 bg-cover bg-center"
                    style={{ backgroundImage: `url(${billboard.imageUrl})` }}
                />
            )}

            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-[var(--th-surface)]/40 via-[var(--th-surface)]/70 to-[var(--th-surface)]" />

            <div className="relative mx-auto max-w-7xl px-6">
                {/* Breadcrumb */}
                <p
                    className="hero-animate mb-8 text-xs font-medium uppercase tracking-[0.3em] text-[var(--color-accent-light)]"
                    style={{ fontFamily: "var(--font-barlow)" }}
                >
                    Acasă <span className="mx-2 text-[var(--th-text-muted)]">/</span> {name}
                </p>

                {/* Category name */}
                <h1
                    className="hero-animate text-5xl text-[rgb(var(--th-text))] md:text-7xl lg:text-8xl"
                    style={{
                        fontFamily: "var(--font-instrument-serif)",
                        fontStyle: "italic",
                    }}
                >
                    {name}
                </h1>

                {/* Product count + decorative line */}
                <div className="hero-animate mt-8 flex items-center gap-6">
                    <div className="h-px w-16 bg-[var(--color-accent-light)]/30" />
                    <p
                        className="text-sm text-[var(--th-text-tertiary)]"
                        style={{
                            fontFamily: "var(--font-barlow)",
                            fontVariantNumeric: "tabular-nums",
                        }}
                    >
                        {productCount}{" "}
                        {productCount === 1 ? "produs" : "produse"}
                    </p>
                </div>
            </div>
        </section>
    )
}

export default CategoryHero
