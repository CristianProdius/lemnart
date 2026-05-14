"use client"

import { useRef } from "react"
import { useGSAP } from "@gsap/react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import Link from "next/link"
import { Phone, Mail, MapPin } from "lucide-react"
import ThemeToggle from "@/components/ui/theme-toggle"

gsap.registerPlugin(ScrollTrigger)

/**
 * Footer — "The Cartographer" (Asymmetric Editorial Grid)
 *
 * 60/40 two-column split. Left column has oversized ghost brand name,
 * tagline in Instrument Serif italic, a gold rule that draws in, and
 * nav + legal links. Right column: contact info with gold numbered
 * prefixes. Bottom bar: copyright + full-width gold line above.
 */

const contactItems = [
    { num: "01", label: "Telefon", value: "+40 700 000 000", href: "tel:+40700000000", icon: Phone },
    { num: "02", label: "Email", value: "contact@lemnart.ro", href: "mailto:contact@lemnart.ro", icon: Mail },
    { num: "03", label: "Locație", value: "București, România", href: null, icon: MapPin },
]

const Footer = () => {
    const footerRef = useRef<HTMLElement>(null)
    const goldRuleRef = useRef<HTMLDivElement>(null)
    const bottomRuleRef = useRef<HTMLDivElement>(null)
    const ghostRef = useRef<HTMLSpanElement>(null)
    const linksRef = useRef<HTMLDivElement>(null)
    const contactRef = useRef<HTMLDivElement>(null)

    useGSAP(
        () => {
            if (!footerRef.current) return

            // Ghost brand fade in
            if (ghostRef.current) {
                gsap.from(ghostRef.current, {
                    opacity: 0,
                    scale: 0.97,
                    duration: 1.6,
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: footerRef.current,
                        start: "top 85%",
                        toggleActions: "play none none reverse",
                    },
                })
            }

            // Gold rule draws in
            if (goldRuleRef.current) {
                gsap.from(goldRuleRef.current, {
                    scaleX: 0,
                    duration: 1.4,
                    ease: "power2.inOut",
                    scrollTrigger: {
                        trigger: goldRuleRef.current,
                        start: "top 90%",
                        toggleActions: "play none none reverse",
                    },
                })
            }

            // Links stagger up
            if (linksRef.current) {
                const links = linksRef.current.querySelectorAll(".footer-link")
                gsap.from(links, {
                    y: 30,
                    opacity: 0,
                    duration: 0.8,
                    ease: "power3.out",
                    stagger: 0.08,
                    scrollTrigger: {
                        trigger: linksRef.current,
                        start: "top 90%",
                        toggleActions: "play none none reverse",
                    },
                })
            }

            // Contact items stagger from right
            if (contactRef.current) {
                const items = contactRef.current.querySelectorAll(".contact-item")
                gsap.from(items, {
                    x: 40,
                    opacity: 0,
                    duration: 0.9,
                    ease: "power3.out",
                    stagger: 0.12,
                    scrollTrigger: {
                        trigger: contactRef.current,
                        start: "top 90%",
                        toggleActions: "play none none reverse",
                    },
                })
            }

            // Bottom rule draws
            if (bottomRuleRef.current) {
                gsap.from(bottomRuleRef.current, {
                    scaleX: 0,
                    duration: 1.4,
                    ease: "power2.inOut",
                    scrollTrigger: {
                        trigger: bottomRuleRef.current,
                        start: "top 95%",
                        toggleActions: "play none none reverse",
                    },
                })
            }
        },
        { scope: footerRef }
    )

    return (
        <footer
            ref={footerRef}
            className="bg-[var(--th-footer-bg)] py-20 text-[rgb(var(--th-text))] md:py-28"
        >
            <div className="mx-auto max-w-7xl px-6">
                {/* Two-column split */}
                <div className="grid grid-cols-1 gap-16 md:grid-cols-5">
                    {/* Left column — 60% */}
                    <div className="relative md:col-span-3">
                        {/* Ghost brand */}
                        <span
                            ref={ghostRef}
                            className="pointer-events-none select-none text-[80px] font-bold uppercase leading-none tracking-[0.2em] text-[var(--th-footer-ghost)] md:text-[120px]"
                            style={{ fontFamily: "var(--font-barlow)" }}
                            aria-hidden="true"
                        >
                            LEMNART
                        </span>

                        {/* Tagline */}
                        <p
                            className="mt-6 max-w-sm text-xl text-[var(--th-text-tertiary)] md:text-2xl"
                            style={{
                                fontFamily: "var(--font-instrument-serif)",
                                fontStyle: "italic",
                            }}
                        >
                            Mascare calorifere din lemn masiv, fabricate artizanal.
                        </p>

                        {/* Gold rule */}
                        <div
                            ref={goldRuleRef}
                            className="my-10 h-px origin-left bg-[var(--color-accent-light)]/30"
                        />

                        {/* Links */}
                        <div ref={linksRef} className="flex flex-wrap gap-x-12 gap-y-6">
                            <div className="flex flex-wrap gap-x-8 gap-y-3">
                                <Link href="/" className="footer-link text-sm text-[var(--th-text-tertiary)] transition-colors hover:text-[rgb(var(--th-text))]">
                                    Acasă
                                </Link>
                                <Link href="/category/all" className="footer-link text-sm text-[var(--th-text-tertiary)] transition-colors hover:text-[rgb(var(--th-text))]">
                                    Colecții
                                </Link>
                                <Link href="/contact" className="footer-link text-sm text-[var(--th-text-tertiary)] transition-colors hover:text-[rgb(var(--th-text))]">
                                    Contact
                                </Link>
                            </div>
                            <div className="flex flex-wrap gap-x-8 gap-y-3">
                                <Link href="/terms" className="footer-link text-sm text-[var(--th-text-tertiary)] transition-colors hover:text-[rgb(var(--th-text))]">
                                    Termeni și Condiții
                                </Link>
                                <Link href="/privacy" className="footer-link text-sm text-[var(--th-text-tertiary)] transition-colors hover:text-[rgb(var(--th-text))]">
                                    Confidențialitate
                                </Link>
                                <Link href="/returns" className="footer-link text-sm text-[var(--th-text-tertiary)] transition-colors hover:text-[rgb(var(--th-text))]">
                                    Politica de Retur
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Right column — 40% */}
                    <div ref={contactRef} className="flex flex-col justify-end gap-8 md:col-span-2">
                        {contactItems.map((item) => (
                            <div key={item.num} className="contact-item flex items-start gap-4">
                                <span
                                    className="text-xs font-medium tracking-widest"
                                    style={{ color: "var(--color-accent-light)" }}
                                >
                                    {item.num}
                                </span>
                                <div>
                                    <p className="mb-1 text-[10px] font-medium uppercase tracking-[0.3em] text-[var(--th-text-muted)]">
                                        {item.label}
                                    </p>
                                    {item.href ? (
                                        <a
                                            href={item.href}
                                            className="flex items-center gap-2 text-sm text-[var(--th-text-tertiary)] transition-colors hover:text-[rgb(var(--th-text))]"
                                        >
                                            <item.icon size={14} className="text-[var(--th-text-muted)]" />
                                            {item.value}
                                        </a>
                                    ) : (
                                        <span className="flex items-center gap-2 text-sm text-[var(--th-text-tertiary)]">
                                            <item.icon size={14} className="text-[var(--th-text-muted)]" />
                                            {item.value}
                                        </span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Bottom bar */}
                <div
                    ref={bottomRuleRef}
                    className="mt-16 h-px origin-center bg-[var(--color-accent-light)]/15"
                />
                <div className="mt-6 flex items-center justify-between">
                    <p className="text-xs text-[var(--th-text-muted)]">
                        &copy; {new Date().getFullYear()} LemnArt. Toate drepturile rezervate.
                    </p>
                    <ThemeToggle />
                </div>
            </div>
        </footer>
    )
}

export default Footer
