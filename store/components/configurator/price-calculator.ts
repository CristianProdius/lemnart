import {
    ConfiguratorOptions,
    PriceBreakdown,
    PriceTier,
} from "@/types";

interface ConfigSelection {
    styleId: string;
    colorId: string;
    width: number;
    height: number;
    ventilationId: string;
    mountingId: string;
    sections: number;
    accessoryIds: string[];
}

function findMatchingTier(
    priceTiers: PriceTier[],
    styleId: string,
    colorId: string,
    width: number,
    height: number
): PriceTier | null {
    // 1. Try exact match: style + color + size range
    const colorSpecific = priceTiers.find(
        (t) =>
            t.styleId === styleId &&
            t.colorId === colorId &&
            width >= t.minWidth &&
            width <= t.maxWidth &&
            height >= t.minHeight &&
            height <= t.maxHeight
    );
    if (colorSpecific) return colorSpecific;

    // 2. Fallback: style + any color (colorId = null) + size range
    const generic = priceTiers.find(
        (t) =>
            t.styleId === styleId &&
            t.colorId === null &&
            width >= t.minWidth &&
            width <= t.maxWidth &&
            height >= t.minHeight &&
            height <= t.maxHeight
    );
    if (generic) return generic;

    // 3. No match
    return null;
}

export function calculatePrice(
    config: ConfigSelection,
    options: ConfiguratorOptions
): PriceBreakdown | null {
    const tier = findMatchingTier(
        options.priceTiers,
        config.styleId,
        config.colorId,
        config.width,
        config.height
    );

    if (!tier) return null;

    const basePrice = Number(tier.basePrice);

    const ventilation = options.ventilationPatterns.find(
        (v) => v.id === config.ventilationId
    );
    const ventilationModifier = ventilation
        ? Number(ventilation.priceModifier)
        : 0;

    const mounting = options.mountingTypes.find(
        (m) => m.id === config.mountingId
    );
    const mountingModifier = mounting ? Number(mounting.priceModifier) : 0;

    // Extra sections beyond the first one
    const extraSections = Math.max(0, config.sections - 1);
    const sectionsSurcharge = extraSections * Number(tier.pricePerSection);

    const selectedAccessories = options.accessories.filter((a) =>
        config.accessoryIds.includes(a.id)
    );
    const accessoriesTotal = selectedAccessories.reduce(
        (sum, a) => sum + Number(a.price),
        0
    );

    const grandTotal =
        basePrice +
        ventilationModifier +
        mountingModifier +
        sectionsSurcharge +
        accessoriesTotal;

    return {
        basePrice,
        ventilationModifier,
        mountingModifier,
        sectionsSurcharge,
        accessoriesTotal,
        grandTotal,
    };
}
