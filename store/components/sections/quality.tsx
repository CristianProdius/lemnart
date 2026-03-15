"use client"

import { useRef } from "react"
import { useGSAP } from "@gsap/react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import SplitText from "@/components/ui/split-text"

gsap.registerPlugin(ScrollTrigger)

const badges = [
    { title: "Lemn Masiv", description: "Stejar, nuc și fag din surse certificate." },
    { title: "Finisaje Premium", description: "Lacuri și vopsele ecologice, rezistente." },
    { title: "Ventilație Optimă", description: "Design care permite circulația eficientă a căldurii." },
    { title: "Măsuri Personalizate", description: "Fiecare piesă este fabricată pe comandă." },
    { title: "Garanție 5 Ani", description: "Încredere totală în calitatea produselor." },
    { title: "Montaj Inclus", description: "Instalare profesională la domiciliu." },
]

const Quality = () => {
    const sectionRef = useRef<HTMLElement>(null)
    const entriesRef = useRef<HTMLDivElement>(null)

    useGSAP(
        () => {
            if (!sectionRef.current) return

            if (!entriesRef.current) return

            const rows = entriesRef.current.querySelectorAll(".ghost-entry")
            rows.forEach((row, i) => {
                gsap.from(row, {
                    y: 40,
                    opacity: 0,
                    duration: 0.8,
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: row,
                        start: "top 88%",
                        toggleActions: "play none none reverse",
                    },
                    delay: i * 0.05,
                })
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
                <div className="mb-20 md:mb-28">
                    <p className="mb-4 text-xs font-medium uppercase tracking-[0.3em] text-[var(--color-accent-light)]">
                        De Ce Noi
                    </p>
                    <SplitText
                        as="h2"
                        className="text-balance text-4xl font-bold text-[rgb(var(--th-text))] md:text-6xl"
                        scrollTrigger
                        stagger={0.06}
                    >
                        Calitate Fără Compromis
                    </SplitText>
                </div>

                {/* Ghost entries */}
                <div ref={entriesRef}>
                    <div className="h-px bg-[var(--th-border)]" />

                    {badges.map((badge, i) => (
                        <div key={badge.title}>
                            <div className="ghost-entry relative overflow-hidden py-12 md:py-16">
                                {/* Ghost title — massive, barely visible */}
                                <span
                                    className="pointer-events-none absolute left-0 top-1/2 -translate-y-1/2 select-none whitespace-nowrap text-6xl font-bold md:text-8xl lg:text-9xl"
                                    style={{ color: "var(--th-text-ghost)" }}
                                    aria-hidden="true"
                                >
                                    {badge.title}
                                </span>

                                {/* Real content */}
                                <div className="relative flex items-start gap-6 md:gap-10">
                                    <span
                                        className="shrink-0 pt-1 text-xs text-[var(--color-accent-light)]"
                                        style={{
                                            fontVariantNumeric: "tabular-nums",
                                        }}
                                    >
                                        {String(i + 1).padStart(2, "0")}
                                    </span>
                                    <div>
                                        <h3 className="mb-2 text-xl font-semibold text-[rgb(var(--th-text))] md:text-2xl">
                                            {badge.title}
                                        </h3>
                                        <p className="text-pretty max-w-lg text-sm leading-relaxed text-[var(--th-text-tertiary)] md:text-base">
                                            {badge.description}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="h-px bg-[var(--th-border)]" />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default Quality
