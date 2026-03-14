"use client"

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { easings, durations, scrollDefaults } from "@/lib/animations";

gsap.registerPlugin(ScrollTrigger);

interface ScrollAnimationOptions {
    start?: string;
    end?: string;
    scrub?: boolean | number;
    y?: number;
    opacity?: number;
    duration?: number;
    ease?: string;
}

export function useScrollAnimation<T extends HTMLElement = HTMLDivElement>(
    options: ScrollAnimationOptions = {}
) {
    const ref = useRef<T>(null);

    const {
        start = scrollDefaults.start,
        end = scrollDefaults.end,
        scrub = false,
        y = 40,
        opacity = 0,
        duration = durations.medium,
        ease = easings.smooth,
    } = options;

    useGSAP(() => {
        if (!ref.current) return;

        gsap.from(ref.current, {
            y,
            opacity,
            duration,
            ease,
            scrollTrigger: {
                trigger: ref.current,
                start,
                end,
                scrub,
                toggleActions: scrub ? undefined : scrollDefaults.toggleActions,
            },
        });
    }, { scope: ref });

    return ref;
}
