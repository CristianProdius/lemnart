"use client"

import { useRef } from "react"
import { useGSAP } from "@gsap/react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { Ruler, Palette, Hammer, Wrench } from "lucide-react"
import SplitText from "@/components/ui/split-text"

gsap.registerPlugin(ScrollTrigger)

const steps = [
    {
        number: "01",
        title: "Măsurare",
        description:
            "Venim la locație pentru dimensiuni precise și evaluarea spațiului.",
        Icon: Ruler,
    },
    {
        number: "02",
        title: "Design",
        description:
            "Proiectăm modelul perfect pentru spațiul tău, cu materiale alese de tine.",
        Icon: Palette,
    },
    {
        number: "03",
        title: "Fabricare",
        description:
            "Construim manual din materiale premium, cu atenție la fiecare detaliu.",
        Icon: Hammer,
    },
    {
        number: "04",
        title: "Instalare",
        description:
            "Montaj profesional la domiciliu, fără griji și fără mizerie.",
        Icon: Wrench,
    },
]

const Process = () => {
    const sectionRef = useRef<HTMLElement>(null)
    const rightRef = useRef<HTMLDivElement>(null)

    useGSAP(
        () => {
            if (!sectionRef.current || !rightRef.current) return

            // Label entrance
            const label = sectionRef.current.querySelector(".process-label")
            if (label) {
                gsap.from(label, {
                    y: 20,
                    opacity: 0,
                    duration: 1,
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: label,
                        start: "top 85%",
                        toggleActions: "play none none reverse",
                    },
                })
            }

            // Intro paragraph
            const intro = sectionRef.current.querySelector(".process-intro")
            if (intro) {
                gsap.from(intro, {
                    y: 20,
                    opacity: 0,
                    duration: 0.8,
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: intro,
                        start: "top 85%",
                        toggleActions: "play none none reverse",
                    },
                    delay: 0.2,
                })
            }

            // Stagger each step row
            const items = rightRef.current.querySelectorAll(".split-step")
            items.forEach((item, i) => {
                gsap.from(item, {
                    y: 40,
                    opacity: 0,
                    duration: 0.8,
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: item,
                        start: "top 85%",
                        toggleActions: "play none none reverse",
                    },
                    delay: i * 0.1,
                })
            })
        },
        { scope: sectionRef }
    )

    return (
        <section
            ref={sectionRef}
            className="bg-[#1A1A1A] py-28 text-white md:py-40"
        >
            <div className="mx-auto max-w-7xl px-6">
                <div className="grid grid-cols-1 gap-16 lg:grid-cols-12 lg:gap-20">
                    {/* Left — sticky heading */}
                    <div className="lg:col-span-5">
                        <div className="lg:sticky lg:top-32">
                            <p className="process-label mb-4 text-xs font-medium uppercase tracking-[0.3em] text-[var(--color-accent-light)]">
                                Cum Funcționează
                            </p>
                            <SplitText
                                as="h2"
                                className="text-pretty mb-6 text-4xl font-bold text-white md:text-5xl"
                                scrollTrigger
                                stagger={0.06}
                            >
                                De la Idee la Realitate
                            </SplitText>
                            <p className="process-intro text-pretty max-w-sm text-base leading-relaxed text-white/50">
                                Patru pași simpli care transformă spațiul
                                tău. De la prima măsurătoare până la
                                instalarea finală — ne ocupăm de tot.
                            </p>
                        </div>
                    </div>

                    {/* Right — steps list */}
                    <div ref={rightRef} className="lg:col-span-7">
                        <div className="flex flex-col">
                            {steps.map((step, i) => (
                                <div key={step.number}>
                                    {/* Top border on first item */}
                                    {i === 0 && (
                                        <div className="h-px bg-white/10" />
                                    )}

                                    <div className="split-step flex items-start gap-6 py-10 md:gap-8">
                                        {/* Number */}
                                        <span
                                            className="shrink-0 pt-1 text-3xl font-bold text-white/15 md:text-4xl"
                                            style={{
                                                fontVariantNumeric:
                                                    "tabular-nums",
                                            }}
                                        >
                                            {step.number}
                                        </span>

                                        {/* Content */}
                                        <div className="flex-1">
                                            <div className="mb-2 flex items-center gap-3">
                                                <div className="flex size-9 items-center justify-center rounded-lg bg-white/[0.07]">
                                                    <step.Icon
                                                        size={16}
                                                        strokeWidth={1.5}
                                                        className="text-[var(--color-accent-light)]"
                                                    />
                                                </div>
                                                <h3 className="text-lg font-semibold text-white">
                                                    {step.title}
                                                </h3>
                                            </div>
                                            <p className="text-pretty ml-12 text-sm leading-relaxed text-white/40">
                                                {step.description}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Bottom border */}
                                    <div className="h-px bg-white/10" />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Process
