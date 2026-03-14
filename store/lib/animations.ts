// GSAP Animation Presets

export const easings = {
    smooth: "power2.out",
    luxury: "power3.inOut",
    bounce: "back.out(1.7)",
    sharp: "power4.out",
} as const;

export const durations = {
    fast: 0.3,
    medium: 0.6,
    slow: 1.2,
    hero: 2.4,
} as const;

export const stagger = {
    cards: 0.1,
    list: 0.05,
    grid: {
        amount: 0.15,
        grid: "auto" as const,
        from: "center" as const,
    },
} as const;

export const parallax = {
    hero: { yPercent: 30 },
    image: { yPercent: 20 },
    text: { yPercent: -10 },
} as const;

export const scrollDefaults = {
    start: "top 85%",
    end: "bottom 15%",
    toggleActions: "play none none reverse",
} as const;
