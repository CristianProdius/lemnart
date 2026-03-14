"use client"

import { useRef, useState, FormEvent } from "react"
import { useGSAP } from "@gsap/react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { Phone, Mail, MapPin, Send, ArrowRight } from "lucide-react"
import Link from "next/link"
import toast from "react-hot-toast"

gsap.registerPlugin(ScrollTrigger)

const contactItems = [
    {
        num: "01",
        label: "Telefon",
        value: "+40 700 000 000",
        href: "tel:+40700000000",
        icon: Phone,
    },
    {
        num: "02",
        label: "Email",
        value: "contact@lemnart.ro",
        href: "mailto:contact@lemnart.ro",
        icon: Mail,
    },
    {
        num: "03",
        label: "Locație",
        value: "București, România",
        href: null,
        icon: MapPin,
    },
]

const ContactPage = () => {
    const heroRef = useRef<HTMLElement>(null)
    const formRef = useRef<HTMLDivElement>(null)
    const contactRef = useRef<HTMLDivElement>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)

    useGSAP(
        () => {
            if (!heroRef.current) return

            // Hero entrance
            const heroEls = heroRef.current.querySelectorAll(".hero-animate")
            gsap.from(heroEls, {
                y: 40,
                opacity: 0,
                duration: 0.8,
                ease: "power3.out",
                stagger: 0.12,
            })
        },
        { scope: heroRef }
    )

    useGSAP(
        () => {
            if (!contactRef.current) return

            const items = contactRef.current.querySelectorAll(".contact-item")
            gsap.from(items, {
                x: -40,
                opacity: 0,
                duration: 0.8,
                ease: "power3.out",
                stagger: 0.12,
                scrollTrigger: {
                    trigger: contactRef.current,
                    start: "top 85%",
                    toggleActions: "play none none reverse",
                },
            })
        },
        { scope: contactRef }
    )

    useGSAP(
        () => {
            if (!formRef.current) return

            const fields = formRef.current.querySelectorAll(".form-field")
            gsap.from(fields, {
                y: 30,
                opacity: 0,
                duration: 0.7,
                ease: "power3.out",
                stagger: 0.08,
                scrollTrigger: {
                    trigger: formRef.current,
                    start: "top 85%",
                    toggleActions: "play none none reverse",
                },
            })
        },
        { scope: formRef }
    )

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setIsSubmitting(true)

        // Simulate form submission
        await new Promise((resolve) => setTimeout(resolve, 1000))
        toast.success("Mesajul a fost trimis cu succes!")
        setIsSubmitting(false)
        ;(e.target as HTMLFormElement).reset()
    }

    return (
        <div className="bg-[#1A1A1A]">
            {/* Hero */}
            <section ref={heroRef} className="py-24 md:py-32">
                <div className="mx-auto max-w-7xl px-6">
                    {/* Breadcrumb */}
                    <p
                        className="hero-animate mb-8 text-xs font-medium uppercase tracking-[0.3em] text-[var(--color-accent-light)]"
                        style={{ fontFamily: "var(--font-barlow)" }}
                    >
                        Acasă{" "}
                        <span className="mx-2 text-white/20">/</span>{" "}
                        <span className="text-white/60">Contact</span>
                    </p>

                    <h1
                        className="hero-animate text-5xl text-white md:text-7xl lg:text-8xl"
                        style={{
                            fontFamily: "var(--font-instrument-serif)",
                            fontStyle: "italic",
                        }}
                    >
                        Contactează-ne
                    </h1>

                    <p
                        className="hero-animate mt-6 max-w-xl text-base leading-relaxed text-white/40 md:text-lg"
                        style={{ fontFamily: "var(--font-barlow)" }}
                    >
                        Suntem aici pentru a vă ajuta cu orice întrebare despre
                        produsele noastre, comenzi personalizate sau montaj.
                    </p>

                    {/* Decorative line */}
                    <div className="hero-animate mt-10 h-px w-16 bg-[var(--color-accent-light)]/30" />
                </div>
            </section>

            {/* Content */}
            <section className="pb-28 md:pb-40">
                <div className="mx-auto max-w-7xl px-6">
                    <div className="grid grid-cols-1 gap-16 lg:grid-cols-5 lg:gap-20">
                        {/* Left — Contact info */}
                        <div
                            ref={contactRef}
                            className="lg:col-span-2"
                        >
                            <p
                                className="mb-8 text-xs font-medium uppercase tracking-[0.3em] text-[var(--color-accent-light)]"
                                style={{ fontFamily: "var(--font-barlow)" }}
                            >
                                Informații
                            </p>

                            <div className="space-y-8">
                                {contactItems.map((item) => (
                                    <div
                                        key={item.num}
                                        className="contact-item flex items-start gap-4"
                                    >
                                        <div className="flex h-12 w-12 shrink-0 items-center justify-center border border-white/10 bg-white/[0.03]">
                                            <item.icon
                                                size={18}
                                                className="text-[var(--color-accent-light)]"
                                            />
                                        </div>
                                        <div>
                                            <p
                                                className="text-xs font-medium uppercase tracking-[0.2em] text-white/30"
                                                style={{
                                                    fontFamily:
                                                        "var(--font-barlow)",
                                                }}
                                            >
                                                <span className="mr-2 text-[var(--color-accent-light)]/50">
                                                    {item.num}
                                                </span>
                                                {item.label}
                                            </p>
                                            {item.href ? (
                                                <a
                                                    href={item.href}
                                                    className="mt-1 block text-sm text-white/70 transition hover:text-white"
                                                    style={{
                                                        fontFamily:
                                                            "var(--font-barlow)",
                                                    }}
                                                >
                                                    {item.value}
                                                </a>
                                            ) : (
                                                <p
                                                    className="mt-1 text-sm text-white/70"
                                                    style={{
                                                        fontFamily:
                                                            "var(--font-barlow)",
                                                    }}
                                                >
                                                    {item.value}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Divider */}
                            <div className="my-10 h-px bg-white/10" />

                            {/* Hours */}
                            <div className="contact-item">
                                <p
                                    className="mb-4 text-xs font-medium uppercase tracking-[0.2em] text-white/30"
                                    style={{
                                        fontFamily: "var(--font-barlow)",
                                    }}
                                >
                                    Program
                                </p>
                                <div
                                    className="space-y-2 text-sm text-white/60"
                                    style={{
                                        fontFamily: "var(--font-barlow)",
                                    }}
                                >
                                    <div className="flex justify-between">
                                        <span>Luni – Vineri</span>
                                        <span className="tabular-nums text-white/80">
                                            09:00 – 18:00
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Sâmbătă</span>
                                        <span className="tabular-nums text-white/80">
                                            10:00 – 14:00
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Duminică</span>
                                        <span className="text-white/30">
                                            Închis
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right — Contact form */}
                        <div ref={formRef} className="lg:col-span-3">
                            <p
                                className="form-field mb-8 text-xs font-medium uppercase tracking-[0.3em] text-[var(--color-accent-light)]"
                                style={{ fontFamily: "var(--font-barlow)" }}
                            >
                                Trimite un mesaj
                            </p>

                            <form
                                onSubmit={handleSubmit}
                                className="space-y-6"
                            >
                                <div className="form-field grid grid-cols-1 gap-6 sm:grid-cols-2">
                                    <div>
                                        <label
                                            htmlFor="name"
                                            className="mb-2 block text-xs font-medium uppercase tracking-[0.15em] text-white/30"
                                            style={{
                                                fontFamily:
                                                    "var(--font-barlow)",
                                            }}
                                        >
                                            Nume
                                        </label>
                                        <input
                                            id="name"
                                            name="name"
                                            type="text"
                                            required
                                            className="w-full border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white/90 outline-none transition placeholder:text-white/20 focus:border-[var(--color-accent-light)]/50"
                                            style={{
                                                fontFamily:
                                                    "var(--font-barlow)",
                                            }}
                                            placeholder="Numele dvs."
                                        />
                                    </div>
                                    <div>
                                        <label
                                            htmlFor="email"
                                            className="mb-2 block text-xs font-medium uppercase tracking-[0.15em] text-white/30"
                                            style={{
                                                fontFamily:
                                                    "var(--font-barlow)",
                                            }}
                                        >
                                            Email
                                        </label>
                                        <input
                                            id="email"
                                            name="email"
                                            type="email"
                                            required
                                            className="w-full border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white/90 outline-none transition placeholder:text-white/20 focus:border-[var(--color-accent-light)]/50"
                                            style={{
                                                fontFamily:
                                                    "var(--font-barlow)",
                                            }}
                                            placeholder="email@exemplu.ro"
                                        />
                                    </div>
                                </div>

                                <div className="form-field">
                                    <label
                                        htmlFor="subject"
                                        className="mb-2 block text-xs font-medium uppercase tracking-[0.15em] text-white/30"
                                        style={{
                                            fontFamily: "var(--font-barlow)",
                                        }}
                                    >
                                        Subiect
                                    </label>
                                    <input
                                        id="subject"
                                        name="subject"
                                        type="text"
                                        required
                                        className="w-full border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white/90 outline-none transition placeholder:text-white/20 focus:border-[var(--color-accent-light)]/50"
                                        style={{
                                            fontFamily: "var(--font-barlow)",
                                        }}
                                        placeholder="Despre ce doriți să discutăm?"
                                    />
                                </div>

                                <div className="form-field">
                                    <label
                                        htmlFor="message"
                                        className="mb-2 block text-xs font-medium uppercase tracking-[0.15em] text-white/30"
                                        style={{
                                            fontFamily: "var(--font-barlow)",
                                        }}
                                    >
                                        Mesaj
                                    </label>
                                    <textarea
                                        id="message"
                                        name="message"
                                        rows={6}
                                        required
                                        className="w-full resize-none border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white/90 outline-none transition placeholder:text-white/20 focus:border-[var(--color-accent-light)]/50"
                                        style={{
                                            fontFamily: "var(--font-barlow)",
                                        }}
                                        placeholder="Scrieți mesajul dvs. aici..."
                                    />
                                </div>

                                <div className="form-field">
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="flex items-center gap-3 bg-[var(--color-accent-light)] px-8 py-4 text-sm font-semibold text-[#1A1A1A] transition-all duration-200 hover:bg-[var(--color-accent)] disabled:cursor-not-allowed disabled:opacity-40"
                                        style={{
                                            fontFamily: "var(--font-barlow)",
                                        }}
                                    >
                                        {isSubmitting
                                            ? "Se trimite..."
                                            : "Trimite mesajul"}
                                        <Send size={16} />
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default ContactPage
