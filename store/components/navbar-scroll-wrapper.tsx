"use client"

import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"

interface NavbarScrollWrapperProps {
    children: React.ReactNode
}

const NavbarScrollWrapper: React.FC<NavbarScrollWrapperProps> = ({ children }) => {
    const pathname = usePathname()
    const isHome = pathname === "/"
    const [overHero, setOverHero] = useState(isHome)

    useEffect(() => {
        if (!isHome) {
            setOverHero(false)
            return
        }

        const onScroll = () => {
            setOverHero(window.scrollY < window.innerHeight * 0.8)
        }
        onScroll()
        window.addEventListener("scroll", onScroll, { passive: true })
        return () => window.removeEventListener("scroll", onScroll)
    }, [isHome])

    return (
        <div
            className={`fixed top-0 left-0 right-0 z-40${overHero ? " navbar-hero" : ""}`}
        >
            {children}
        </div>
    )
}

export default NavbarScrollWrapper
