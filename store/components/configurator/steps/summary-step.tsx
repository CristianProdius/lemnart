"use client";

import { cn } from "@/lib/utils";
import { ConfiguratorOptions, ConfiguredItem } from "@/types";
import { calculatePrice } from "@/components/configurator/price-calculator";
import useConfigurator from "@/hooks/use-configurator";
import useCart from "@/hooks/use-cart";
import toast from "react-hot-toast";

interface SummaryStepProps {
    options: ConfiguratorOptions;
}

const SummaryStep: React.FC<SummaryStepProps> = ({ options }) => {
    const config = useConfigurator();
    const cart = useCart();

    const style = options.styles.find((s) => s.id === config.styleId);
    const color = options.colors.find((c) => c.id === config.colorId);
    const ventilation = options.ventilationPatterns.find(
        (v) => v.id === config.ventilationId
    );
    const mounting = options.mountingTypes.find(
        (m) => m.id === config.mountingId
    );
    const selectedAccessories = options.accessories.filter((a) =>
        config.accessoryIds.includes(a.id)
    );

    const priceBreakdown = calculatePrice(
        {
            styleId: config.styleId,
            colorId: config.colorId,
            width: config.width,
            height: config.height,
            ventilationId: config.ventilationId,
            mountingId: config.mountingId,
            sections: config.sections,
            accessoryIds: config.accessoryIds,
        },
        options
    );

    const handleAddToCart = () => {
        if (!priceBreakdown) {
            toast.error("Prețul nu poate fi calculat. Contactați-ne.");
            return;
        }

        if (!style || !color) {
            toast.error("Configurare incompletă.");
            return;
        }

        const item: ConfiguredItem = {
            id: crypto.randomUUID(),
            type: "configured",
            styleName: style.name,
            styleId: config.styleId,
            colorName: color.name,
            colorId: config.colorId,
            colorValue: color.value,
            width: config.width,
            height: config.height,
            depth: config.depth,
            ventilationName: ventilation?.name ?? "—",
            ventilationId: config.ventilationId,
            mountingName: mounting?.name ?? "—",
            mountingId: config.mountingId,
            sections: config.sections,
            accessories: selectedAccessories.map((a) => ({
                id: a.id,
                name: a.name,
                price: Number(a.price),
            })),
            priceBreakdown,
            totalPrice: priceBreakdown.grandTotal,
            previewUrl: style.previewUrl,
        };

        cart.addItem(item);
        config.reset();
    };

    const rows = [
        { label: "Stil", value: style?.name ?? "—" },
        {
            label: "Culoare",
            value: color ? (
                <span className="flex items-center gap-2">
                    <span
                        className="inline-block h-4 w-4 rounded-full border border-black/10"
                        style={{ backgroundColor: color.value }}
                    />
                    {color.name}
                </span>
            ) : (
                "—"
            ),
        },
        {
            label: "Dimensiuni",
            value: `${config.width} x ${config.height} x ${config.depth} cm`,
        },
        { label: "Ventilație", value: ventilation?.name ?? "—" },
        { label: "Montare", value: mounting?.name ?? "—" },
        { label: "Secțiuni", value: String(config.sections) },
        {
            label: "Accesorii",
            value:
                selectedAccessories.length > 0
                    ? selectedAccessories.map((a) => a.name).join(", ")
                    : "Niciun accesoriu",
        },
    ];

    return (
        <div>
            <p
                className="mb-4 text-xs font-medium uppercase tracking-[0.2em] text-[var(--th-text-tertiary)]"
                style={{ fontFamily: "var(--font-barlow)" }}
            >
                Sumar configurare
            </p>

            {/* Configuration recap */}
            <div className="mb-6 border border-[var(--th-border-strong)]">
                {rows.map((row, i) => (
                    <div
                        key={row.label}
                        className={cn(
                            "flex items-center justify-between px-4 py-3",
                            i < rows.length - 1 &&
                                "border-b border-[var(--th-border-strong)]"
                        )}
                    >
                        <span
                            className="text-xs font-medium uppercase tracking-[0.15em] text-[var(--th-text-tertiary)]"
                            style={{ fontFamily: "var(--font-barlow)" }}
                        >
                            {row.label}
                        </span>
                        <span
                            className="text-sm text-[rgb(var(--th-text))]"
                            style={{ fontFamily: "var(--font-barlow)" }}
                        >
                            {row.value}
                        </span>
                    </div>
                ))}
            </div>

            {/* Price breakdown */}
            {priceBreakdown ? (
                <div className="mb-6 border border-[var(--th-border-strong)]">
                    <div className="border-b border-[var(--th-border-strong)] px-4 py-3">
                        <span
                            className="text-xs font-medium uppercase tracking-[0.2em] text-[var(--th-text-tertiary)]"
                            style={{ fontFamily: "var(--font-barlow)" }}
                        >
                            Detalii preț
                        </span>
                    </div>
                    {[
                        {
                            label: "Preț de bază",
                            amount: priceBreakdown.basePrice,
                        },
                        {
                            label: "Ventilație",
                            amount: priceBreakdown.ventilationModifier,
                        },
                        {
                            label: "Montare",
                            amount: priceBreakdown.mountingModifier,
                        },
                        {
                            label: "Secțiuni suplimentare",
                            amount: priceBreakdown.sectionsSurcharge,
                        },
                        {
                            label: "Accesorii",
                            amount: priceBreakdown.accessoriesTotal,
                        },
                    ]
                        .filter((item) => item.amount > 0)
                        .map((item) => (
                            <div
                                key={item.label}
                                className="flex items-center justify-between border-b border-[var(--th-border-strong)] px-4 py-2"
                            >
                                <span
                                    className="text-xs text-[var(--th-text-tertiary)]"
                                    style={{
                                        fontFamily: "var(--font-barlow)",
                                    }}
                                >
                                    {item.label}
                                </span>
                                <span
                                    className="text-sm text-[rgb(var(--th-text))]"
                                    style={{
                                        fontFamily: "var(--font-barlow)",
                                    }}
                                >
                                    {item.amount} RON
                                </span>
                            </div>
                        ))}
                    <div className="flex items-center justify-between px-4 py-3">
                        <span
                            className="text-sm font-medium uppercase tracking-[0.15em] text-[rgb(var(--th-text))]"
                            style={{ fontFamily: "var(--font-barlow)" }}
                        >
                            Total
                        </span>
                        <span
                            className="text-lg font-semibold text-[var(--color-accent-light)]"
                            style={{ fontFamily: "var(--font-barlow)" }}
                        >
                            {priceBreakdown.grandTotal} RON
                        </span>
                    </div>
                </div>
            ) : (
                <div className="mb-6 border border-[var(--th-border-strong)] px-4 py-6 text-center">
                    <p
                        className="text-sm text-[var(--th-text-tertiary)]"
                        style={{ fontFamily: "var(--font-barlow)" }}
                    >
                        Contactați-ne pentru preț
                    </p>
                </div>
            )}

            {/* Add to cart button */}
            <button
                onClick={handleAddToCart}
                disabled={!priceBreakdown}
                className={cn(
                    "w-full py-3 text-sm font-medium uppercase tracking-[0.2em] transition-all duration-200",
                    priceBreakdown
                        ? "bg-[var(--color-accent-light)] text-white hover:opacity-90"
                        : "cursor-not-allowed bg-[var(--th-border-strong)] text-[var(--th-text-muted)]"
                )}
                style={{ fontFamily: "var(--font-barlow)" }}
            >
                Adaugă în coș
            </button>
        </div>
    );
};

export default SummaryStep;
