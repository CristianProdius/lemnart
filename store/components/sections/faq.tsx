"use client"

import { useRef, useState, useCallback } from "react"
import { useGSAP } from "@gsap/react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { Plus } from "lucide-react"
import SplitText from "@/components/ui/split-text"

gsap.registerPlugin(ScrollTrigger)

const faqs = [
    {
        question: "Cât durează o comandă personalizată?",
        answer:
            "Termenul standard este de 2-3 săptămâni de la confirmarea comenzii. Pentru proiecte mai complexe sau comenzi multiple, termenul poate fi de 3-4 săptămâni. Vă ținem la curent pe parcursul întregului proces.",
    },
    {
        question: "Ce materiale folosiți?",
        answer:
            "Lucrăm exclusiv cu lemn masiv — stejar, nuc, fag și alte esențe premium din surse certificate. Finisajele sunt realizate cu lacuri și vopsele ecologice, rezistente la uzură și căldură.",
    },
    {
        question: "Oferiți montaj?",
        answer:
            "Da, montajul profesional este inclus în preț. Echipa noastră se ocupă de instalarea completă, asigurând o fixare sigură și un aspect impecabil, fără deteriorarea pereților.",
    },
    {
        question: "Mascarea afectează eficiența caloriferului?",
        answer:
            "Designul nostru asigură ventilație optimă prin deschideri strategice în partea superioară și inferioară. Testele arată o pierdere minimă de eficiență termică, de doar 5-10%.",
    },
    {
        question: "Care este zona de livrare?",
        answer:
            "Livrăm și montăm în toată România. Pentru localitățile din afara Bucureștiului, programăm vizite de măsurare și montaj în funcție de zonă. Transportul este inclus pentru comenzi peste 1.500 RON.",
    },
]

const FAQ = () => {
    const sectionRef = useRef<HTMLElement>(null)
    const listRef = useRef<HTMLDivElement>(null)
    const dividerRef = useRef<HTMLDivElement>(null)
    const [openIndex, setOpenIndex] = useState<number | null>(null)
    const answerRefs = useRef<(HTMLDivElement | null)[]>([])

    const toggle = useCallback(
        (index: number) => {
            // Close previous
            if (openIndex !== null && openIndex !== index) {
                const prev = answerRefs.current[openIndex]
                if (prev) {
                    gsap.to(prev, {
                        height: 0,
                        duration: 0.4,
                        ease: "power2.inOut",
                        onComplete: () => {
                            const inner = prev.querySelector(".faq-answer-inner")
                            if (inner)
                                gsap.set(inner, { opacity: 0, y: 10 })
                        },
                    })
                }
            }

            if (openIndex === index) {
                // Close current
                const el = answerRefs.current[index]
                if (el) {
                    gsap.to(el, {
                        height: 0,
                        duration: 0.4,
                        ease: "power2.inOut",
                    })
                }
                setOpenIndex(null)
            } else {
                // Open new
                const el = answerRefs.current[index]
                if (el) {
                    gsap.set(el, { height: "auto" })
                    const h = el.offsetHeight
                    gsap.from(el, {
                        height: 0,
                        duration: 0.5,
                        ease: "power3.out",
                        onComplete: () => {
                            // Fade in content after height is done
                            const inner =
                                el.querySelector(".faq-answer-inner")
                            if (inner) {
                                gsap.fromTo(
                                    inner,
                                    { opacity: 0, y: 10 },
                                    {
                                        opacity: 1,
                                        y: 0,
                                        duration: 0.3,
                                        ease: "power2.out",
                                    }
                                )
                            }
                        },
                    })
                }
                setOpenIndex(index)
            }
        },
        [openIndex]
    )

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

            // Items stagger
            if (listRef.current) {
                const items = listRef.current.querySelectorAll(".faq-item")
                gsap.from(items, {
                    y: 30,
                    opacity: 0,
                    duration: 0.7,
                    ease: "power2.out",
                    stagger: 0.08,
                    force3D: true,
                    scrollTrigger: {
                        trigger: listRef.current,
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
            <div className="mx-auto max-w-3xl px-6">
                <div ref={dividerRef} className="section-divider" />
            </div>

            <section
                ref={sectionRef}
                className="section-breathe py-28 md:py-40"
                style={{ backgroundColor: "var(--color-background)" }}
            >
                <div className="mx-auto max-w-3xl px-6">
                    {/* Heading */}
                    <div className="mb-16 text-center">
                        <p className="mb-4 text-xs font-medium uppercase tracking-[0.3em] text-[#C8A55C]">
                            Suport
                        </p>
                        <SplitText
                            as="h2"
                            className="text-4xl font-bold tracking-tight md:text-6xl"
                            scrollTrigger
                            stagger={0.06}
                        >
                            Întrebări Frecvente
                        </SplitText>
                    </div>

                    <div ref={listRef} className="space-y-3">
                        {faqs.map((faq, index) => (
                            <div
                                key={index}
                                className={`faq-item overflow-hidden rounded-xl border transition-colors duration-300 ${
                                    openIndex === index
                                        ? "border-[#C8A55C]/30 bg-[#F5F5F0]"
                                        : "border-[#E5E5E0] bg-transparent"
                                }`}
                            >
                                <button
                                    onClick={() => toggle(index)}
                                    className="flex w-full items-center justify-between px-7 py-5 text-left"
                                >
                                    <span className="pr-6 text-[15px] font-medium text-[#1A1A1A]">
                                        {faq.question}
                                    </span>
                                    <span
                                        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full transition-all duration-300 ${
                                            openIndex === index
                                                ? "rotate-45 bg-[#8B6914] text-white"
                                                : "bg-[#F5F5F0] text-neutral-400"
                                        }`}
                                    >
                                        <Plus size={14} strokeWidth={2.5} />
                                    </span>
                                </button>

                                <div
                                    ref={(el) => {
                                        answerRefs.current[index] = el
                                    }}
                                    className="overflow-hidden"
                                    style={{
                                        height: openIndex === index ? "auto" : 0,
                                    }}
                                >
                                    <div className="faq-answer-inner px-7 pb-6">
                                        <p className="text-sm leading-relaxed text-neutral-500">
                                            {faq.answer}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </>
    )
}

export default FAQ
