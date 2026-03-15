"use client"

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { easings, durations, stagger as staggerPresets, scrollDefaults } from "@/lib/animations";

gsap.registerPlugin(ScrollTrigger);

interface StaggerAnimationOptions {
    stagger?: number | gsap.StaggerVars;
    y?: number;
    opacity?: number;
    duration?: number;
    ease?: string;
    start?: string;
    childSelector?: string;
}

export function useStaggerAnimation<T extends HTMLElement = HTMLDivElement>(
    options: StaggerAnimationOptions = {}
) {
    const ref = useRef<T>(null);

    const {
        stagger = staggerPresets.cards,
        y = 30,
        opacity = 0,
        duration = durations.medium,
        ease = easings.smooth,
        start = scrollDefaults.start,
        childSelector = ":scope > *",
    } = options;

    useGSAP(() => {
        if (!ref.current) return;

        const children = ref.current.querySelectorAll(childSelector);
        if (children.length === 0) return;

        gsap.from(children, {
            y,
            opacity,
            duration,
            ease,
            stagger,
            scrollTrigger: {
                trigger: ref.current,
                start,
                toggleActions: scrollDefaults.toggleActions,
            },
        });
    }, { scope: ref });

    return ref;
}
