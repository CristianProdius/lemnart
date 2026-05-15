"use client"
import Currency from '@/components/ui/currency';
import useCart, { isConfiguredItem, MAX_QTY, type CartLine } from '@/hooks/use-cart';
import { X } from 'lucide-react';
import Image from 'next/image';

interface CartItemProps {
    data: CartLine;
}

const CartItem: React.FC<CartItemProps> = ({ data }) => {
    const cart = useCart();

    const onRemove = () => {
        // Configured items use their own UUID as id; product lines use cartLineId for variant-aware removal.
        cart.removeItem(isConfiguredItem(data) ? data.id : data.cartLineId);
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
                        {(() => {
                            const selected = data.colors?.find((c) => c.id === data.selectedColorId) ?? data.colors?.[0];
                            return selected ? (
                                <>
                                    <div className="flex items-center gap-1.5">
                                        <span
                                            className="h-3.5 w-3.5 rounded-full border border-[var(--th-text-muted)]"
                                            style={{ backgroundColor: selected.value }}
                                        />
                                        <span>{selected.name}</span>
                                    </div>
                                    <span className="h-3 w-px bg-[var(--th-border-strong)]" />
                                </>
                            ) : null;
                        })()}
                        <span>{data.size.name}</span>
                    </div>
                    <div className="mt-3 flex items-center gap-2">
                        <button
                            type="button"
                            onClick={() => cart.setQuantity(data.cartLineId, data.quantity - 1)}
                            disabled={data.quantity <= 1}
                            aria-label="Scade cantitatea"
                            className="flex h-8 w-8 items-center justify-center border border-[var(--th-border)] text-sm hover:bg-[var(--th-bg-secondary)] disabled:cursor-not-allowed disabled:opacity-40"
                        >
                            −
                        </button>
                        <span className="min-w-[2ch] text-center text-sm tabular-nums" aria-live="polite">{data.quantity}</span>
                        <button
                            type="button"
                            onClick={() => cart.setQuantity(data.cartLineId, data.quantity + 1)}
                            disabled={data.quantity >= MAX_QTY}
                            aria-label="Crește cantitatea"
                            className="flex h-8 w-8 items-center justify-center border border-[var(--th-border)] text-sm hover:bg-[var(--th-bg-secondary)] disabled:cursor-not-allowed disabled:opacity-40"
                        >
                            +
                        </button>
                    </div>
                </div>
                <div className="mt-4 text-sm tabular-nums text-[var(--color-accent-light)]">
                    <Currency value={Number(data.price) * data.quantity} />
                </div>
            </div>
        </li>
    )
}

export default CartItem;
