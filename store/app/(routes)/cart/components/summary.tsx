"use client"

import Currency from '@/components/ui/currency';
import useCart from '@/hooks/use-cart';
import axios from 'axios';
import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { ShoppingCart } from 'lucide-react';

const Summary = () => {
    const searchParams = useSearchParams();
    const items = useCart(state => state.items);
    const removeAll = useCart(state => state.removeAll);
    const totalPrice = items.reduce((total, item) => total + Number(item.price), 0)

    useEffect(() => {
        if(searchParams.get('success')) {
            toast.success("Plata a fost efectuată cu succes.");
            removeAll();
        }
        if(searchParams.get("canceled")) {
            toast.error("Ceva nu a funcționat.")
        }
    }, [searchParams, removeAll])

    const onCheckout = async () => {
        const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/checkout`, {
            productIds: items.map(item => item.id),
        });

        window.location = response.data.url
    }

    return (
        <div className="mt-16 border border-[var(--th-border)] p-6 lg:col-span-5 lg:mt-0 lg:p-8">
            <h2
                className="text-xs font-medium uppercase tracking-[0.3em] text-[var(--th-text-tertiary)]"
                style={{ fontFamily: "var(--font-barlow)" }}
            >
                Sumar comandă
            </h2>
            <div className="mt-8 space-y-4">
                <div className="flex items-center justify-between border-t border-[var(--th-border)] pt-6">
                    <span
                        className="text-sm text-[var(--th-text-tertiary)]"
                        style={{ fontFamily: "var(--font-barlow)" }}
                    >
                        Total
                    </span>
                    <span className="text-lg tabular-nums text-[var(--color-accent-light)]">
                        <Currency value={totalPrice} />
                    </span>
                </div>
            </div>
            <button
                disabled={items.length === 0}
                onClick={onCheckout}
                className="mt-8 flex w-full items-center justify-center gap-3 bg-[var(--color-accent-light)] px-8 py-4 text-sm font-semibold text-[var(--th-btn-inverse-text)] transition-all duration-200 hover:bg-[var(--color-accent)] disabled:cursor-not-allowed disabled:opacity-40"
                style={{ fontFamily: "var(--font-barlow)" }}
            >
                Finalizează comanda
                <ShoppingCart size={18} />
            </button>
        </div>
    );
}

export default Summary;
