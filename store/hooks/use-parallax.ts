"use client"

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { easings } from "@/lib/animations";

gsap.registerPlugin(ScrollTrigger);

interface ParallaxOptions {
    yPercent?: number;
    ease?: string;
}

export function useParallax<T extends HTMLElement = HTMLDivElement>(
    options: ParallaxOptions = {}
) {
    const ref = useRef<T>(null);

    const { yPercent = 20, ease = easings.smooth } = options;

    useGSAP(() => {
        if (!ref.current) return;

        gsap.to(ref.current, {
            yPercent,
            ease: "none",
            scrollTrigger: {
                trigger: ref.current.parentElement || ref.current,
                start: "top bottom",
                end: "bottom top",
                scrub: true,
            },
        });
    }, { scope: ref });

    return ref;
}
