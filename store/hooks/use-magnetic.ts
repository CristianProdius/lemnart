"use client"

import { useRef, useCallback, useEffect } from "react"
import { gsap } from "gsap"

interface MagneticOptions {
    strength?: number
    ease?: number
    imageParallax?: boolean
}

export function useMagnetic<T extends HTMLElement = HTMLDivElement>(
    options: MagneticOptions = {}
) {
    const ref = useRef<T>(null)
    const { strength = 0.3, ease = 0.4, imageParallax = false } = options

    const handleMouseMove = useCallback(
        (e: MouseEvent) => {
            if (!ref.current) return
            const rect = ref.current.getBoundingClientRect()
            const centerX = rect.left + rect.width / 2
            const centerY = rect.top + rect.height / 2
            const deltaX = (e.clientX - centerX) * strength
            const deltaY = (e.clientY - centerY) * strength

            gsap.to(ref.current, {
                x: deltaX,
                y: deltaY,
                rotateX: -deltaY * 0.08,
                rotateY: deltaX * 0.08,
                duration: ease,
                ease: "power2.out",
                force3D: true,
            })

            if (imageParallax) {
                const img = ref.current.querySelector(".magnetic-img")
                if (img) {
                    gsap.to(img, {
                        x: -deltaX * 0.4,
                        y: -deltaY * 0.4,
                        scale: 1.1,
                        duration: ease,
                        ease: "power2.out",
                        force3D: true,
                    })
                }
            }
        },
        [strength, ease, imageParallax]
    )

    const handleMouseLeave = useCallback(() => {
        if (!ref.current) return
        gsap.to(ref.current, {
            x: 0,
            y: 0,
            rotateX: 0,
            rotateY: 0,
            duration: 0.6,
            ease: "elastic.out(1, 0.5)",
            force3D: true,
        })

        if (imageParallax) {
            const img = ref.current.querySelector(".magnetic-img")
            if (img) {
                gsap.to(img, {
                    x: 0,
                    y: 0,
                    scale: 1,
                    duration: 0.6,
                    ease: "elastic.out(1, 0.5)",
                    force3D: true,
                })
            }
        }
    }, [imageParallax])

    useEffect(() => {
        const el = ref.current
        if (!el) return
        el.style.perspective = "800px"
        el.addEventListener("mousemove", handleMouseMove)
        el.addEventListener("mouseleave", handleMouseLeave)
        return () => {
            el.removeEventListener("mousemove", handleMouseMove)
            el.removeEventListener("mouseleave", handleMouseLeave)
        }
    }, [handleMouseMove, handleMouseLeave])

    return ref
}
