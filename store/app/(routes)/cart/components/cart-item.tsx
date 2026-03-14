"use client"
import Currency from '@/components/ui/currency';
import useCart from '@/hooks/use-cart';
import { X } from 'lucide-react';
import Image from 'next/image';
import { Product } from '@/types';

interface CartItemProps {
    data: Product;
}

const CartItem: React.FC<CartItemProps> = ({ data }) => {
    const cart = useCart();

    const onRemove = () => {
        cart.removeItem(data.id);
    }

    return (
        <li className="flex gap-6 border-b border-white/10 py-8">
            <div className="relative h-24 w-24 shrink-0 overflow-hidden sm:h-40 sm:w-40">
                <Image
                    fill
                    src={data.images[0].url}
                    alt={data.name}
                    className="object-cover object-center"
                />
            </div>
            <div className="relative flex flex-1 flex-col justify-between">
                <button
                    onClick={onRemove}
                    className="absolute right-0 top-0 flex h-8 w-8 items-center justify-center text-white/30 transition hover:text-white"
                >
                    <X size={16} />
                </button>
                <div className="pr-10">
                    <p
                        className="text-base font-medium text-white/90"
                        style={{ fontFamily: "var(--font-barlow)" }}
                    >
                        {data.name}
                    </p>
                    <div className="mt-2 flex items-center gap-3 text-sm text-white/40">
                        <span>{data.color.name}</span>
                        <span className="h-3 w-px bg-white/15" />
                        <span>{data.size.name}</span>
                    </div>
                </div>
                <div className="mt-4 text-sm tabular-nums text-[var(--color-accent-light)]">
                    <Currency value={data.price} />
                </div>
            </div>
        </li>
    )
}

export default CartItem;
