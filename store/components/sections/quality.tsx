"use client"

import { useRef } from "react"
import { useGSAP } from "@gsap/react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import {
    TreePine,
    Paintbrush,
    Wind,
    Scaling,
    ShieldCheck,
    PackageCheck,
} from "lucide-react"
import SplitText from "@/components/ui/split-text"

gsap.registerPlugin(ScrollTrigger)

const badges = [
    {
        title: "Lemn Masiv",
        description: "Stejar, nuc și fag din surse certificate.",
        Icon: TreePine,
    },
    {
        title: "Finisaje Premium",
        description: "Lacuri și vopsele ecologice, rezistente.",
        Icon: Paintbrush,
    },
    {
        title: "Ventilație Optimă",
        description: "Design care permite circulația eficientă a căldurii.",
        Icon: Wind,
    },
    {
        title: "Măsuri Personalizate",
        description: "Fiecare piesă este fabricată pe comandă.",
        Icon: Scaling,
    },
    {
        title: "Garanție 5 Ani",
        description: "Încredere totală în calitatea produselor.",
        Icon: ShieldCheck,
    },
    {
        title: "Montaj Inclus",
        description: "Instalare profesională la domiciliu.",
        Icon: PackageCheck,
    },
]

const Quality = () => {
    const sectionRef = useRef<HTMLElement>(null)
    const gridRef = useRef<HTMLDivElement>(null)
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

            // Batch process cards from center
            if (gridRef.current) {
                const items = gridRef.current.querySelectorAll(".quality-badge")
                gsap.from(items, {
                    y: 60,
                    opacity: 0,
                    scale: 0.9,
                    duration: 0.9,
                    ease: "power3.out",
                    force3D: true,
                    stagger: {
                        amount: 0.4,
                        grid: "auto",
                        from: "center",
                    },
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
                            De Ce Noi
                        </p>
                        <SplitText
                            as="h2"
                            className="text-4xl font-bold tracking-tight md:text-6xl"
                            scrollTrigger
                            stagger={0.06}
                        >
                            Calitate Fără Compromis
                        </SplitText>
                    </div>

                    <div
                        ref={gridRef}
                        className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
                    >
                        {badges.map((badge) => (
                            <div
                                key={badge.title}
                                className="quality-badge group rounded-2xl border border-[#E5E5E0] bg-[#FAFAFA] p-8 transition-all duration-500 hover:-translate-y-1 hover:border-[#C8A55C]/30 hover:shadow-[0_8px_40px_rgba(139,105,20,0.06)]"
                            >
                                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-[#F5F5F0] to-[#EDE5D0] transition-all duration-500 group-hover:from-[#C8A55C]/10 group-hover:to-[#C8A55C]/20">
                                    <badge.Icon
                                        size={26}
                                        strokeWidth={1.5}
                                        className="text-[#8B6914] transition-transform duration-500 group-hover:scale-110"
                                    />
                                </div>
                                <h3 className="mb-2 text-lg font-semibold text-[#1A1A1A]">
                                    {badge.title}
                                </h3>
                                <p className="text-sm leading-relaxed text-neutral-500">
                                    {badge.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </>
    )
}

export default Quality
