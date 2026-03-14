"use client"
import Button from '@/components/ui/button';
import useCart from '@/hooks/use-cart';
import { ShoppingBag } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const NavbarActions = () => {
    const [isMounted, setIsMounted] = useState(false)

    useEffect(() => {
        setIsMounted(true);
    }, [])

    const cart = useCart();
    const router = useRouter();

    if(!isMounted) {
        return null;
    }

    return (
        <div className="flex items-center ml-auto gap-x-3">
            <Button
                className="flex items-center px-4 py-2 rounded-full bg-[#1A1A1A] text-white transition-all duration-300 hover:bg-[#333]"
                onClick={() => router.push("/cart")}
            >
                <ShoppingBag size={18} />
                <span className='ml-2 text-sm font-medium'>
                    {cart?.items?.length}
                </span>
            </Button>

            {/* CTA with 45-degree arrow in circular housing */}
            <a
                href="/contact"
                className="hidden md:inline-flex items-center gap-2 rounded-full bg-[#222] px-5 py-2.5 text-sm font-medium text-white transition-all duration-300 hover:bg-[#333] hover:shadow-lg"
                style={{ fontFamily: "var(--font-barlow)" }}
            >
                Solicită Ofertă
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/15">
                    <svg
                        className="h-3 w-3 text-white"
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
