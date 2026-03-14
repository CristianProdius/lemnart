"use client"

import { useRef, useEffect } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

interface SplitTextProps {
    children: string
    className?: string
    as?: "h1" | "h2" | "h3" | "p" | "span"
    delay?: number
    stagger?: number
    scrollTrigger?: boolean
    triggerStart?: string
}

const SplitText: React.FC<SplitTextProps> = ({
    children,
    className = "",
    as: Tag = "h1",
    delay = 0,
    stagger = 0.08,
    scrollTrigger = false,
    triggerStart = "top 80%",
}) => {
    const containerRef = useRef<HTMLElement>(null)

    useEffect(() => {
        const el = containerRef.current
        if (!el) return

        const words = el.querySelectorAll(".split-word")

        const config: gsap.TweenVars = {
            y: 80,
            opacity: 0,
            rotateX: 50,
            filter: "blur(8px)",
            duration: 1,
            ease: "power3.out",
            stagger,
            delay,
            force3D: true,
        }

        if (scrollTrigger) {
            config.scrollTrigger = {
                trigger: el,
                start: triggerStart,
                toggleActions: "play none none reverse",
            }
        }

        gsap.from(words, config)

        return () => {
            ScrollTrigger.getAll().forEach((t) => {
                if (t.trigger === el) t.kill()
            })
        }
    }, [delay, stagger, scrollTrigger, triggerStart])

    const words = children.split(" ")

    return (
        <Tag
            ref={containerRef as any}
            className={`${className}`}
            style={{ perspective: "600px" }}
        >
            {words.map((word, i) => (
                <span
                    key={i}
                    className="split-word inline-block will-change-transform"
                    style={{ backfaceVisibility: "hidden" }}
                >
                    {word}
                    {i < words.length - 1 && "\u00A0"}
                </span>
            ))}
        </Tag>
    )
}

export default SplitText
