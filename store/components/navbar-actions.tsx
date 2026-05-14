"use client"
import useCart from '@/hooks/use-cart';
import { ShoppingBag } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import ThemeToggle from '@/components/ui/theme-toggle';

const NavbarActions = () => {
    const [isMounted, setIsMounted] = useState(false)

    useEffect(() => {
        setIsMounted(true);
    }, [])

    const cart = useCart();
    const router = useRouter();

    return (
        <div className="flex items-center ml-auto gap-x-3">
            <ThemeToggle />
            <button
                className="navbar-cart flex items-center px-4 py-2 rounded-full"
                onClick={() => router.push("/cart")}
                aria-label="Coș de cumpărături"
            >
                <ShoppingBag size={18} />
                <span className='ml-2 text-sm font-medium tabular-nums'>
                    {isMounted ? cart?.items?.length : 0}
                </span>
            </button>

            <a
                href="/contact"
                className="navbar-cta hidden lg:inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium"
                style={{ fontFamily: "var(--font-barlow)" }}
            >
                Solicită Ofertă
                <span className="navbar-cta-icon flex size-6 items-center justify-center rounded-full">
                    <svg
                        className="size-3"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2.5}
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M7 17L17 7M17 7H7M17 7v10"
                        />
                    </svg>
                </span>
            </a>
        </div>
    )
}

export default NavbarActions;
