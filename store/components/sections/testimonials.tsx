"use client"

import { useRef } from "react"
import { useGSAP } from "@gsap/react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { Star } from "lucide-react"
import SplitText from "@/components/ui/split-text"

gsap.registerPlugin(ScrollTrigger)

const testimonials = [
    {
        id: 1,
        quote: "Mascarea caloriferului a schimbat complet aspectul livingului. Calitate excepțională și finisaj impecabil!",
        name: "Maria P.",
        location: "București",
        stars: 5,
    },
    {
        id: 2,
        quote: "Profesioniști de la A la Z. De la măsurare până la montaj, totul a decurs perfect. Recomand cu încredere.",
        name: "Andrei M.",
        location: "Cluj-Napoca",
        stars: 5,
    },
    {
        id: 3,
        quote: "Am comandat pentru 4 camere. Fiecare piesă arată fabulos și se simte calitatea lemnului masiv.",
        name: "Elena D.",
        location: "Timișoara",
        stars: 5,
    },
]

const Testimonials = () => {
    const sectionRef = useRef<HTMLElement>(null)
    const cardsRef = useRef<HTMLDivElement>(null)
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

            if (!cardsRef.current) return

            const cards = cardsRef.current.querySelectorAll(".testimonial-card")

            // Entrance
            gsap.from(cards, {
                y: 60,
                opacity: 0,
                scale: 0.95,
                duration: 0.9,
                ease: "power3.out",
                stagger: 0.12,
                force3D: true,
                scrollTrigger: {
                    trigger: cardsRef.current,
                    start: "top 80%",
                    toggleActions: "play none none reverse",
                },
            })

            // Floating — different speed per card for organic feel
            cards.forEach((card, i) => {
                const speed = 2.5 + i * 0.7
                const amplitude = 6 + i * 3
                gsap.to(card, {
                    y: `+=${amplitude}`,
                    duration: speed,
                    repeat: -1,
                    yoyo: true,
                    ease: "sine.inOut",
                    delay: i * 0.5,
                })
            })

            // Quote marks scale in
            const quotes = cardsRef.current.querySelectorAll(".quote-mark")
            gsap.from(quotes, {
                scale: 0,
                opacity: 0,
                duration: 0.6,
                ease: "back.out(2)",
                stagger: 0.15,
                scrollTrigger: {
                    trigger: cardsRef.current,
                    start: "top 75%",
                    toggleActions: "play none none reverse",
                },
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
                style={{ backgroundColor: "var(--color-muted)" }}
            >
                <div className="mx-auto max-w-7xl px-6">
                    {/* Heading */}
                    <div className="mb-20 text-center">
                        <p className="mb-4 text-xs font-medium uppercase tracking-[0.3em] text-[#C8A55C]">
                            Testimoniale
                        </p>
                        <SplitText
                            as="h2"
                            className="text-4xl font-bold tracking-tight md:text-6xl"
                            scrollTrigger
                            stagger={0.06}
                        >
                            Ce Spun Clienții Noștri
                        </SplitText>
                    </div>

                    <div
                        ref={cardsRef}
                        className="grid grid-cols-1 gap-8 md:grid-cols-3"
                    >
                        {testimonials.map((t) => (
                            <div
                                key={t.id}
                                className="testimonial-card relative rounded-2xl border border-[#E5E5E0] bg-[#FAFAFA] p-8 will-change-transform"
                            >
                                {/* Quote mark */}
                                <span className="quote-mark mb-4 block text-5xl font-bold leading-none text-[#C8A55C]/15">
                                    &ldquo;
                                </span>

                                {/* Stars */}
                                <div className="mb-5 flex gap-1">
                                    {Array.from({ length: t.stars }).map((_, i) => (
                                        <Star
                                            key={i}
                                            size={14}
                                            fill="#C8A55C"
                                            stroke="#C8A55C"
                                        />
                                    ))}
                                </div>

                                <p className="mb-8 text-base leading-relaxed text-[#1A1A1A]/80">
                                    {t.quote}
                                </p>

                                <div className="border-t border-[#E5E5E0] pt-5">
                                    <p className="text-sm font-semibold text-[#1A1A1A]">
                                        {t.name}
                                    </p>
                                    <p className="text-xs text-neutral-400">
                                        {t.location}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </>
    )
}

export default Testimonials
