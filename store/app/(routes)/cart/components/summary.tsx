"use client"

import Currency from '@/components/ui/currency';
import useCart, { isConfiguredItem } from '@/hooks/use-cart';
import axios from 'axios';
import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { ShoppingCart } from 'lucide-react';

const Summary = () => {
    const searchParams = useSearchParams();
    const items = useCart(state => state.items);
    const removeAll = useCart(state => state.removeAll);

    const totalPrice = items.reduce((total, item) => {
        if (isConfiguredItem(item)) {
            return total + item.totalPrice;
        }
        return total + Number(item.price);
    }, 0);

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
        const productIds = items
            .filter((item) => !isConfiguredItem(item))
            .map((item) => item.id);

        const configuredItems = items
            .filter(isConfiguredItem)
            .map((item) => ({
                styleName: item.styleName,
                colorName: item.colorName,
                colorValue: item.colorValue,
                width: item.width,
                height: item.height,
                depth: item.depth,
                ventilationName: item.ventilationName,
                mountingName: item.mountingName,
                sections: item.sections,
                accessories: item.accessories,
                unitPrice: item.totalPrice,
                configSnapshot: {
                    styleId: item.styleId,
                    colorId: item.colorId,
                    ventilationId: item.ventilationId,
                    mountingId: item.mountingId,
                    priceBreakdown: item.priceBreakdown,
                },
            }));

        const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/checkout`, {
            productIds: productIds.length > 0 ? productIds : undefined,
            configuredItems: configuredItems.length > 0 ? configuredItems : undefined,
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
