"use client"
import Currency from '@/components/ui/currency';
import useCart, { isConfiguredItem } from '@/hooks/use-cart';
import { X } from 'lucide-react';
import Image from 'next/image';
import { CartItem as CartItemType } from '@/types';

interface CartItemProps {
    data: CartItemType;
}

const CartItem: React.FC<CartItemProps> = ({ data }) => {
    const cart = useCart();

    const onRemove = () => {
        cart.removeItem(data.id);
    }

    if (isConfiguredItem(data)) {
        return (
            <li className="flex gap-6 border-b border-[var(--th-border)] py-8">
                <div className="relative h-24 w-24 shrink-0 overflow-hidden bg-[var(--th-bg-secondary)] sm:h-40 sm:w-40">
                    {data.previewUrl ? (
                        <Image
                            fill
                            src={data.previewUrl}
                            alt={data.styleName}
                            className="object-cover object-center"
                        />
                    ) : (
                        <div className="flex h-full w-full items-center justify-center">
                            <span
                                className="text-xs text-[var(--th-text-tertiary)]"
                                style={{ fontFamily: "var(--font-barlow)" }}
                            >
                                Configurație
                            </span>
                        </div>
                    )}
                </div>
                <div className="relative flex flex-1 flex-col justify-between">
                    <button
                        onClick={onRemove}
                        className="absolute right-0 top-0 flex h-8 w-8 items-center justify-center text-[var(--th-text-muted)] transition hover:text-[rgb(var(--th-text))]"
                    >
                        <X size={16} />
                    </button>
                    <div className="pr-10">
                        <p
                            className="text-base font-medium text-[var(--th-text-secondary)]"
                            style={{ fontFamily: "var(--font-barlow)" }}
                        >
                            {data.styleName}
                        </p>
                        <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-[var(--th-text-tertiary)]">
                            <div className="flex items-center gap-1.5">
                                <span
                                    className="h-3.5 w-3.5 rounded-full border border-[var(--th-text-muted)]"
                                    style={{ backgroundColor: data.colorValue }}
                                />
                                <span>{data.colorName}</span>
                            </div>
                            <span className="h-3 w-px bg-[var(--th-border-strong)]" />
                            <span>{data.width} × {data.height} × {data.depth} cm</span>
                            {data.ventilationName && (
                                <>
                                    <span className="h-3 w-px bg-[var(--th-border-strong)]" />
                                    <span>{data.ventilationName}</span>
                                </>
                            )}
                            {data.mountingName && (
                                <>
                                    <span className="h-3 w-px bg-[var(--th-border-strong)]" />
                                    <span>{data.mountingName}</span>
                                </>
                            )}
                        </div>
                        {data.accessories.length > 0 && (
                            <p className="mt-1 text-xs text-[var(--th-text-tertiary)]" style={{ fontFamily: "var(--font-barlow)" }}>
                                + {data.accessories.map(a => a.name).join(", ")}
                            </p>
                        )}
                    </div>
                    <div className="mt-4 text-sm tabular-nums text-[var(--color-accent-light)]">
                        <Currency value={data.totalPrice} />
                    </div>
                </div>
            </li>
        )
    }

    return (
        <li className="flex gap-6 border-b border-[var(--th-border)] py-8">
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
                    className="absolute right-0 top-0 flex h-8 w-8 items-center justify-center text-[var(--th-text-muted)] transition hover:text-[rgb(var(--th-text))]"
                >
                    <X size={16} />
                </button>
                <div className="pr-10">
                    <p
                        className="text-base font-medium text-[var(--th-text-secondary)]"
                        style={{ fontFamily: "var(--font-barlow)" }}
                    >
                        {data.name}
                    </p>
                    <div className="mt-2 flex items-center gap-3 text-sm text-[var(--th-text-tertiary)]">
                        <span>{data.color.name}</span>
                        <span className="h-3 w-px bg-[var(--th-border-strong)]" />
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
