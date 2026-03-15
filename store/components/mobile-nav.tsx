"use client"

import { useState } from "react"
import { Dialog } from "@headlessui/react"
import { Menu, X, ArrowRight } from "lucide-react"
import { Category } from "@/types"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

interface MobileNavProps {
    categories: Category[]
}

const MobileNav: React.FC<MobileNavProps> = ({ categories }) => {
    const [open, setOpen] = useState(false)
    const pathname = usePathname()

    const routes = categories.map((route) => ({
        href: `/category/${route.id}`,
        label: route.name,
        active: pathname === `/category/${route.id}`,
    }))

    return (
        <>
            <button
                onClick={() => setOpen(true)}
                className="flex size-10 items-center justify-center lg:hidden"
                aria-label="Deschide meniul"
            >
                <Menu size={20} />
            </button>

            <Dialog
                open={open}
                as="div"
                className="relative z-50 lg:hidden"
                onClose={() => setOpen(false)}
            >
                {/* Backdrop */}
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" />

                {/* Panel */}
                <div className="fixed inset-0 z-50 flex justify-end">
                    <Dialog.Panel className="relative flex w-full max-w-sm flex-col overflow-y-auto bg-[var(--th-surface)] shadow-2xl">
                        {/* Header */}
                        <div className="flex items-center justify-between border-b border-[var(--th-border)] px-6 py-5">
                            <p
                                className="text-xs font-medium uppercase tracking-[0.3em] text-[var(--th-text-tertiary)]"
                                style={{ fontFamily: "var(--font-barlow)" }}
                            >
                                Meniu
                            </p>
                            <button
                                onClick={() => setOpen(false)}
                                className="flex size-8 items-center justify-center text-[var(--th-text-tertiary)] transition hover:text-[rgb(var(--th-text))]"
                                aria-label="Închide meniul"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        {/* Links */}
                        <nav className="flex flex-col px-6 py-8">
                            {routes.map((route) => (
                                <Link
                                    key={route.href}
                                    href={route.href}
                                    onClick={() => setOpen(false)}
                                    className={cn(
                                        "border-b border-[var(--th-border)] py-4 text-sm font-medium transition",
                                        route.active
                                            ? "text-[rgb(var(--th-text))]"
                                            : "text-[var(--th-text-tertiary)] hover:text-[rgb(var(--th-text))]"
                                    )}
                                    style={{ fontFamily: "var(--font-barlow)" }}
                                >
                                    {route.label}
                                </Link>
                            ))}
                            <Link
                                href="/configurator"
                                onClick={() => setOpen(false)}
                                className={cn(
                                    "border-b border-[var(--th-border)] py-4 text-sm font-medium transition",
                                    pathname === "/configurator"
                                        ? "text-[rgb(var(--th-text))]"
                                        : "text-[var(--th-text-tertiary)] hover:text-[rgb(var(--th-text))]"
                                )}
                                style={{ fontFamily: "var(--font-barlow)" }}
                            >
                                Configurator
                            </Link>
                            <Link
                                href="/blog"
                                onClick={() => setOpen(false)}
                                className={cn(
                                    "border-b border-[var(--th-border)] py-4 text-sm font-medium transition",
                                    pathname === "/blog"
                                        ? "text-[rgb(var(--th-text))]"
                                        : "text-[var(--th-text-tertiary)] hover:text-[rgb(var(--th-text))]"
                                )}
                                style={{ fontFamily: "var(--font-barlow)" }}
                            >
                                Blog
                            </Link>
                        </nav>

                        {/* Mobile CTA */}
                        <div className="mt-auto border-t border-[var(--th-border)] px-6 py-6">
                            <a
                                href="/contact"
                                onClick={() => setOpen(false)}
                                className="navbar-cta flex w-full items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-medium"
                                style={{ fontFamily: "var(--font-barlow)" }}
                            >
                                Solicită Ofertă
                                <ArrowRight className="size-4" />
                            </a>
                        </div>
                    </Dialog.Panel>
                </div>
            </Dialog>
        </>
    )
}

export default MobileNav
