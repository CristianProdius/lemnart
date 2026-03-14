"use client"
import { useEffect, useState } from "react";
import useCart from "@/hooks/use-cart";
import CartItem from "./components/cart-item";
import Summary from "./components/summary";

const CartPage = () => {
    const [isMounted, setIsMounted] = useState(false);
    const cart = useCart();

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if(!isMounted) {
        return null
    }

    return (
        <div className="bg-[#1A1A1A]">
            <div className="mx-auto max-w-7xl px-6 py-12 md:py-20">
                {/* Breadcrumb */}
                <p
                    className="mb-10 text-xs font-medium uppercase tracking-[0.3em] text-[var(--color-accent-light)]"
                    style={{ fontFamily: "var(--font-barlow)" }}
                >
                    Acasă <span className="mx-2 text-white/20">/</span>
                    <span className="text-white/60">Coș de cumpărături</span>
                </p>

                {/* Heading */}
                <h1
                    className="text-4xl text-white md:text-5xl"
                    style={{
                        fontFamily: "var(--font-instrument-serif)",
                        fontStyle: "italic",
                    }}
                >
                    Coș de cumpărături
                </h1>

                <div className="mt-12 lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-16">
                    <div className="lg:col-span-7">
                        {cart?.items?.length === 0 && (
                            <div className="flex flex-col items-center justify-center py-20 text-center">
                                <p
                                    className="text-xs font-medium uppercase tracking-[0.3em] text-white/30"
                                    style={{ fontFamily: "var(--font-barlow)" }}
                                >
                                    Coșul este gol
                                </p>
                                <p className="mt-3 text-sm text-white/20">
                                    Adăugați produse pentru a continua.
                                </p>
                            </div>
                        )}
                        <ul>
                            {cart?.items?.map(item => (
                                <CartItem
                                    key={item.id}
                                    data={item}
                                />
                            ))}
                        </ul>
                    </div>
                    <Summary />
                </div>
            </div>
        </div>
    );
}

export default CartPage;
