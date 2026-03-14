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
    const stepsRef = useRef<HTMLDivElement>(null)
    const lineRef = useRef<HTMLDivElement>(null)
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

            if (!stepsRef.current) return

            // Connecting line — draws with scroll
            if (lineRef.current) {
                gsap.from(lineRef.current, {
                    scaleX: 0,
                    transformOrigin: "left center",
                    ease: "none",
                    scrollTrigger: {
                        trigger: stepsRef.current,
                        start: "top 70%",
                        end: "bottom 60%",
                        scrub: 1,
                    },
                })
            }

            // Each step
            const stepEls = stepsRef.current.querySelectorAll(".process-step")
            stepEls.forEach((step, i) => {
                // Number clip-reveal
                const num = step.querySelector(".step-number")
                if (num) {
                    gsap.from(num, {
                        clipPath: "inset(100% 0 0 0)",
                        duration: 0.8,
                        ease: "power3.out",
                        scrollTrigger: {
                            trigger: step,
                            start: "top 80%",
                            toggleActions: "play none none reverse",
                        },
                        delay: i * 0.15,
                    })
                }

                // Circle pulse
                const circle = step.querySelector(".step-circle")
                if (circle) {
                    gsap.from(circle, {
                        scale: 0,
                        opacity: 0,
                        duration: 0.6,
                        ease: "back.out(2)",
                        scrollTrigger: {
                            trigger: step,
                            start: "top 80%",
                            toggleActions: "play none none reverse",
                        },
                        delay: i * 0.15 + 0.2,
                    })

                    // Pulse once
                    gsap.to(circle, {
                        boxShadow: "0 0 0 15px rgba(200, 165, 92, 0)",
                        duration: 1,
                        ease: "power2.out",
                        scrollTrigger: {
                            trigger: step,
                            start: "top 75%",
                            toggleActions: "play none none none",
                        },
                        delay: i * 0.15 + 0.5,
                    })
                }

                // Text content fade up
                const content = step.querySelector(".step-content")
                if (content) {
                    gsap.from(content, {
                        y: 30,
                        opacity: 0,
                        duration: 0.7,
                        ease: "power2.out",
                        scrollTrigger: {
                            trigger: step,
                            start: "top 80%",
                            toggleActions: "play none none reverse",
                        },
                        delay: i * 0.15 + 0.3,
                    })
                }
            })
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
                style={{ backgroundColor: "var(--color-background)" }}
            >
                <div className="mx-auto max-w-7xl px-6">
                    {/* Heading */}
                    <div className="mb-24 text-center">
                        <p className="mb-4 text-xs font-medium uppercase tracking-[0.3em] text-[#C8A55C]">
                            Cum Funcționează
                        </p>
                        <SplitText
                            as="h2"
                            className="text-4xl font-bold tracking-tight md:text-6xl"
                            scrollTrigger
                            stagger={0.06}
                        >
                            De la Idee la Realitate
                        </SplitText>
                    </div>

                    <div ref={stepsRef} className="relative">
                        {/* Connecting line (desktop) */}
                        <div
                            ref={lineRef}
                            className="absolute left-[12.5%] right-[12.5%] top-8 hidden h-px bg-gradient-to-r from-transparent via-[#C8A55C]/30 to-transparent lg:block"
                        />

                        <div className="grid grid-cols-1 gap-16 md:grid-cols-2 lg:grid-cols-4 lg:gap-8">
                            {steps.map((step) => (
                                <div
                                    key={step.number}
                                    className="process-step flex flex-col items-center text-center"
                                >
                                    {/* Circle with icon */}
                                    <div
                                        className="step-circle relative mb-8 flex h-16 w-16 items-center justify-center rounded-full will-change-transform"
                                        style={{
                                            backgroundColor: "var(--color-muted)",
                                            boxShadow: "0 0 0 0 rgba(200, 165, 92, 0.3)",
                                        }}
                                    >
                                        <step.Icon
                                            size={24}
                                            strokeWidth={1.5}
                                            className="text-[#8B6914]"
                                        />
                                    </div>

                                    {/* Number */}
                                    <span
                                        className="step-number mb-3 block text-5xl font-bold text-[#C8A55C]/15"
                                        style={{ fontVariantNumeric: "tabular-nums" }}
                                    >
                                        {step.number}
                                    </span>

                                    {/* Content */}
                                    <div className="step-content">
                                        <h3 className="mb-2 text-lg font-semibold text-[#1A1A1A]">
                                            {step.title}
                                        </h3>
                                        <p className="text-sm leading-relaxed text-neutral-500">
                                            {step.description}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}

export default Process
