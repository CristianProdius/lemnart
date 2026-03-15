"use client"

import { useEffect, useState } from "react"
import { useTheme } from "next-themes"
import { Sun, Moon } from "lucide-react"

const ThemeToggle = () => {
    const { theme, setTheme } = useTheme()
    const [mounted, setMounted] = useState(false)

    useEffect(() => setMounted(true), [])

    if (!mounted) return <div className="h-9 w-9" />

    const isDark = theme === "dark"

    return (
        <button
            onClick={() => setTheme(isDark ? "light" : "dark")}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--th-border)] text-[var(--th-text-secondary)] transition-colors hover:text-[rgb(var(--th-text))]"
            aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
        >
            {isDark ? <Sun size={16} /> : <Moon size={16} />}
        </button>
    )
}

export default ThemeToggle
