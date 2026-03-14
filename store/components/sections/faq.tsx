"use client"

import { useRef, useState, useCallback } from "react"
import { useGSAP } from "@gsap/react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import SplitText from "@/components/ui/split-text"

gsap.registerPlugin(ScrollTrigger)

/**
 * FAQ — 3D Grid Card Flip
 *
 * Breaks completely from the accordion model. FAQs are displayed
 * as a 2-column grid of physical cards. Each card has a front face
 * (question + ghost number) and a back face (answer). Clicking a
 * card flips it 180° on the Y-axis — a horizontal flip like
 * turning a playing card.
 *
 * Only one card can be flipped at a time. The active card gets
 * a gold border. Cards stagger in on scroll with a subtle
 * rotateY tilt. The grid layout + flip interaction creates a
 * tactile, game-like experience.
 */

const faqs = [
    {
        question: "Cât durează o comandă personalizată?",
        answer: "Termenul standard este de 2-3 săptămâni de la confirmarea comenzii. Pentru proiecte mai complexe sau comenzi multiple, termenul poate fi de 3-4 săptămâni. Vă ținem la curent pe parcursul întregului proces.",
    },
    {
        question: "Ce materiale folosiți?",
        answer: "Lucrăm exclusiv cu lemn masiv — stejar, nuc, fag și alte esențe premium din surse certificate. Finisajele sunt realizate cu lacuri și vopsele ecologice, rezistente la uzură și căldură.",
    },
    {
        question: "Oferiți montaj?",
        answer: "Da, montajul profesional este inclus în preț. Echipa noastră se ocupă de instalarea completă, asigurând o fixare sigură și un aspect impecabil, fără deteriorarea pereților.",
    },
    {
        question: "Mascarea afectează eficiența caloriferului?",
        answer: "Designul nostru asigură ventilație optimă prin deschideri strategice în partea superioară și inferioară. Testele arată o pierdere minimă de eficiență termică, de doar 5-10%.",
    },
    {
        question: "Care este zona de livrare?",
        answer: "Livrăm și montăm în toată România. Pentru localitățile din afara Bucureștiului, programăm vizite de măsurare și montaj în funcție de zonă. Transportul este inclus pentru comenzi peste 1.500 RON.",
    },
]

const FAQ = () => {
    const sectionRef = useRef<HTMLElement>(null)
    const gridRef = useRef<HTMLDivElement>(null)
    const [flippedIndex, setFlippedIndex] = useState<number | null>(null)
    const cardRefs = useRef<(HTMLDivElement | null)[]>([])

    const flipCard = useCallback(
        (index: number) => {
            // Flip previous card back
            if (flippedIndex !== null && flippedIndex !== index) {
                const prevCard = cardRefs.current[flippedIndex]
                if (prevCard) {
                    gsap.to(prevCard, {
                        rotationY: 0,
                        duration: 0.5,
                        ease: "power3.inOut",
                    })
                }
            }

            if (flippedIndex === index) {
                // Flip back
                const card = cardRefs.current[index]
                if (card) {
                    gsap.to(card, {
                        rotationY: 0,
                        duration: 0.5,
                        ease: "power3.inOut",
                    })
                }
                setFlippedIndex(null)
            } else {
                // Flip to reveal answer
                const card = cardRefs.current[index]
                if (card) {
                    gsap.to(card, {
                        rotationY: 180,
                        duration: 0.6,
                        ease: "power3.inOut",
                    })
                }
                setFlippedIndex(index)
            }
        },
        [flippedIndex]
    )

    useGSAP(
        () => {
            if (!gridRef.current) return

            const cards = gridRef.current.querySelectorAll(".faq-flip-card")
            gsap.from(cards, {
                y: 60,
                opacity: 0,
                rotationY: -15,
                duration: 0.9,
                ease: "power3.out",
                stagger: 0.1,
                scrollTrigger: {
                    trigger: gridRef.current,
                    start: "top 85%",
                    toggleActions: "play none none reverse",
                },
            })
        },
        { scope: sectionRef }
    )

    return (
        <section
            ref={sectionRef}
            className="bg-[#1A1A1A] py-28 text-white md:py-40"
        >
            <div className="mx-auto max-w-5xl px-6">
                {/* Heading */}
                <div className="mb-20 text-center md:mb-28">
                    <p className="mb-4 text-xs font-medium uppercase tracking-[0.3em] text-[var(--color-accent-light)]">
                        Suport
                    </p>
                    <SplitText
                        as="h2"
                        className="text-balance text-4xl font-bold tracking-tight text-white md:text-6xl"
                        scrollTrigger
                        stagger={0.06}
                    >
                        Întrebări Frecvente
                    </SplitText>
                    <p className="text-pretty mx-auto mt-6 max-w-md text-sm leading-relaxed text-white/40">
                        Apasă pe orice card pentru a descoperi răspunsul.
                    </p>
                </div>

                {/* Card Grid */}
                <div
                    ref={gridRef}
                    className="grid grid-cols-1 gap-4 md:grid-cols-2"
                    style={{ perspective: "1200px" }}
                >
                    {faqs.map((faq, index) => (
                        <div
                            key={index}
                            className="faq-flip-card cursor-pointer"
                            style={{ perspective: "1000px" }}
                            onClick={() => flipCard(index)}
                            role="button"
                            tabIndex={0}
                            aria-label={`${faq.question} — apasă pentru răspuns`}
                            onKeyDown={(e) => {
                                if (e.key === "Enter" || e.key === " ") {
                                    e.preventDefault()
                                    flipCard(index)
                                }
                            }}
                        >
                            <div
                                ref={(el) => {
                                    cardRefs.current[index] = el
                                }}
                                className="relative"
                                style={{
                                    transformStyle: "preserve-3d",
                                }}
                            >
                                {/* Front Face — Question */}
                                <div
                                    className="flex min-h-[220px] flex-col justify-between border p-8 transition-colors duration-300 md:min-h-[240px] md:p-10"
                                    style={{
                                        backfaceVisibility: "hidden",
                                        borderColor:
                                            flippedIndex === index
                                                ? "var(--color-accent-light)"
                                                : "rgba(255,255,255,0.06)",
                                    }}
                                >
                                    {/* Ghost number */}
                                    <span
                                        className="select-none text-6xl font-bold leading-none md:text-7xl"
                                        style={{
                                            fontVariantNumeric: "tabular-nums",
                                            color: "rgba(255,255,255,0.03)",
                                        }}
                                        aria-hidden="true"
                                    >
                                        {String(index + 1).padStart(2, "0")}
                                    </span>

                                    <div>
                                        <p className="text-balance text-base font-medium text-white/85 md:text-lg">
                                            {faq.question}
                                        </p>
                                        <p className="mt-3 text-[10px] font-medium uppercase tracking-widest text-white/20">
                                            Flip for answer
                                        </p>
                                    </div>
                                </div>

                                {/* Back Face — Answer */}
                                <div
                                    className="absolute inset-0 flex flex-col justify-center border border-[var(--color-accent-light)]/25 p-8 md:p-10"
                                    style={{
                                        backfaceVisibility: "hidden",
                                        transform: "rotateY(180deg)",
                                        backgroundColor: "#1F1F1F",
                                    }}
                                >
                                    {/* Small number */}
                                    <span
                                        className="mb-4 text-xs"
                                        style={{
                                            fontVariantNumeric: "tabular-nums",
                                            color: "var(--color-accent-light)",
                                        }}
                                    >
                                        {String(index + 1).padStart(2, "0")}
                                    </span>

                                    <p className="text-pretty text-sm leading-relaxed text-white/60 md:text-base">
                                        {faq.answer}
                                    </p>

                                    <p className="mt-6 text-[10px] font-medium uppercase tracking-widest text-white/20">
                                        Flip to close
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default FAQ
