"use client"

import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"

interface NavbarScrollWrapperProps {
    children: React.ReactNode
}

const NavbarScrollWrapper: React.FC<NavbarScrollWrapperProps> = ({ children }) => {
    const [scrolled, setScrolled] = useState(false)
    const pathname = usePathname()
    const isHome = pathname === "/"

    useEffect(() => {
        if (!isHome) {
            setScrolled(true)
            return
        }

        const handleScroll = () => {
            setScrolled(window.scrollY > 50)
        }

        handleScroll()
        window.addEventListener("scroll", handleScroll, { passive: true })
        return () => window.removeEventListener("scroll", handleScroll)
    }, [isHome])

    const isFloating = isHome && !scrolled

    return (
        <div className="fixed top-0 left-0 right-0 z-50">
            <div
                className={`
                    transition-all duration-700 ease-[cubic-bezier(0.25,0.46,0.45,0.94)]
                    ${isFloating
                        ? "mt-5 mx-4 md:mx-auto md:max-w-5xl rounded-[16px] bg-white shadow-[0_4px_30px_rgba(0,0,0,0.08)]"
                        : scrolled
                            ? "bg-white/95 backdrop-blur-md border-b shadow-sm"
                            : ""
                    }
                `}
                style={{
                    borderColor: scrolled && !isFloating ? "var(--color-border)" : "transparent",
                }}
                data-scrolled="true"
            >
                {children}
            </div>
        </div>
    )
}

export default NavbarScrollWrapper
