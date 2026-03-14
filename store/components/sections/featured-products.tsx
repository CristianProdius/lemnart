"use client"

import { useRef, useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { useGSAP } from "@gsap/react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { Expand, ShoppingCart } from "lucide-react"
import { Product } from "@/types"
import Currency from "@/components/ui/currency"
import IconButton from "@/components/ui/icon-button"
import SplitText from "@/components/ui/split-text"
import usePreviewModal from "@/hooks/use-preview-modal"
import useCart from "@/hooks/use-cart"

gsap.registerPlugin(ScrollTrigger)

/**
 * V4 — Horizontal Rhythm Strip
 *
 * Products arranged in a horizontally-scrolling filmstrip against a
 * dark background. Each card is tall and narrow (3:4 aspect ratio)
 * with snap-scrolling between items. A counter (01/04) tracks position,
 * and a gold progress bar at the bottom visualizes scroll depth.
 *
 * Think: luxury lookbook, horizontal gallery wall, film contact sheet.
 *
 * Palette: Dark (#1A1A1A) — products glow against the dark canvas.
 */

interface FeaturedProductsProps {
    items: Product[]
}

const FeaturedProducts: React.FC<FeaturedProductsProps> = ({ items }) => {
    const sectionRef = useRef<HTMLElement>(null)
    const stripRef = useRef<HTMLDivElement>(null)
    const progressRef = useRef<HTMLDivElement>(null)
    const [activeIndex, setActiveIndex] = useState(0)

    const router = useRouter()
    const previewModal = usePreviewModal()
    const cart = useCart()

    const displayed = items.slice(0, 6)

    const handleScroll = useCallback(() => {
        if (!stripRef.current || !progressRef.current) return

        const { scrollLeft, scrollWidth, clientWidth } = stripRef.current
        const maxScroll = scrollWidth - clientWidth
        if (maxScroll <= 0) return

        const progress = scrollLeft / maxScroll
        progressRef.current.style.transform = `scaleX(${progress})`

        // Update active index
        const cardWidth = scrollWidth / displayed.length
        const newIndex = Math.round(scrollLeft / cardWidth)
        setActiveIndex(Math.min(newIndex, displayed.length - 1))
    }, [displayed.length])

    useGSAP(
        () => {
            if (!stripRef.current) return

            // Cards slide in from right with stagger
            const cards = stripRef.current.querySelectorAll(".strip-card")
            gsap.from(cards, {
                x: 120,
                opacity: 0,
                duration: 0.9,
                ease: "power3.out",
                stagger: 0.1,
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top 80%",
                    toggleActions: "play none none reverse",
                },
            })
        },
        { scope: sectionRef }
    )

    const handleClick = (product: Product) =>
        router.push(`/product/${product.id}`)
    const onPreview = (e: React.MouseEvent, product: Product) => {
        e.stopPropagation()
        previewModal.onOpen(product)
    }
    const onAddToCart = (e: React.MouseEvent, product: Product) => {
        e.stopPropagation()
        cart.addItem(product)
    }

    if (displayed.length === 0) return null

    return (
        <section
            ref={sectionRef}
            className="bg-[#1A1A1A] py-28 text-white md:py-40"
        >
            {/* Header */}
            <div className="mx-auto max-w-7xl px-6">
                <div className="mb-16 flex items-end justify-between">
                    <div>
                        <p className="mb-4 text-xs font-medium uppercase tracking-[0.3em] text-[var(--color-accent-light)]">
                            Selecție
                        </p>
                        <SplitText
                            as="h2"
                            className="text-balance text-4xl font-bold tracking-tight text-white md:text-6xl"
                            scrollTrigger
                            stagger={0.06}
                        >
                            Produse Recomandate
                        </SplitText>
                    </div>
                    <p
                        className="hidden text-sm text-white/40 md:block"
                        style={{ fontVariantNumeric: "tabular-nums" }}
                    >
                        {String(activeIndex + 1).padStart(2, "0")} /{" "}
                        {String(displayed.length).padStart(2, "0")}
                    </p>
                </div>
            </div>

            {/* ── Horizontal strip ── */}
            <div
                ref={stripRef}
                onScroll={handleScroll}
                className="flex gap-5 overflow-x-auto px-6 pb-2 md:gap-7"
                style={{
                    scrollSnapType: "x mandatory",
                    scrollbarWidth: "none",
                    paddingLeft:
                        "max(1.5rem, calc((100vw - 80rem) / 2 + 1.5rem))",
                    paddingRight: "3rem",
                }}
            >
                {displayed.map((product, i) => (
                    <div
                        key={product.id}
                        onClick={() => handleClick(product)}
                        className="strip-card group w-64 shrink-0 cursor-pointer snap-start sm:w-72 md:w-80"
                    >
                        {/* Image */}
                        <div className="relative aspect-[3/4] overflow-hidden">
                            <Image
                                fill
                                src={product.images?.[0]?.url}
                                alt={product.name}
                                className="object-cover transition-transform duration-700 ease-out group-hover:-translate-y-2"
                            />

                            {/* Hover overlay */}
                            <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-5 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                                <span
                                    className="text-xs text-white/50"
                                    style={{
                                        fontVariantNumeric: "tabular-nums",
                                    }}
                                >
                                    {String(i + 1).padStart(2, "0")}
                                </span>
                                <div className="flex gap-2">
                                    <IconButton
                                        onClick={(e) =>
                                            onPreview(e, product)
                                        }
                                        icon={
                                            <Expand
                                                size={16}
                                                className="text-gray-600"
                                            />
                                        }
                                    />
                                    <IconButton
                                        onClick={(e) =>
                                            onAddToCart(e, product)
                                        }
                                        icon={
                                            <ShoppingCart
                                                size={16}
                                                className="text-gray-600"
                                            />
                                        }
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Meta */}
                        <div className="mt-4">
                            <p className="text-xs uppercase tracking-[0.15em] text-white/30">
                                {product.category?.name}
                            </p>
                            <h3 className="mt-1 text-base font-medium text-white/90">
                                {product.name}
                            </h3>
                            <div className="mt-2 tabular-nums text-sm text-[var(--color-accent-light)]">
                                <Currency value={product.price} />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* ── Progress bar ── */}
            <div className="mx-auto mt-12 max-w-7xl px-6">
                <div className="h-px bg-white/10">
                    <div
                        ref={progressRef}
                        className="h-full origin-left bg-[var(--color-accent-light)]"
                        style={{
                            transform: "scaleX(0)",
                            transition: "transform 150ms ease-out",
                        }}
                    />
                </div>
            </div>
        </section>
    )
}

export default FeaturedProducts
