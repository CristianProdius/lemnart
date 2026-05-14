export interface Billboard {
    id: string;
    label: string;
    imageUrl: string;
}

export interface Category {
    id: string;
    name: string;
    billboard: Billboard;
}

export interface Product {
    id: string;
    category: Category;
    name: string;
    price: string;
    isFeatured: boolean;
    size: Size;
    colors: Color[];
    images: Image[];
    /** Cart-only — never set by the API. The customer's chosen color for this cart line. */
    selectedColorId?: string | null;
}

export interface Image {
    id: string;
    url: string;
    colorId: string | null;
}

export interface Size {
    id: string;
    name: string;
    value: string;
}
export interface Color {
    id: string;
    name: string;
    value: string;
}

// Configurator types
export interface ConfigStyle {
    id: string;
    name: string;
    slug: string;
    description: string;
    modelUrl: string;
    previewUrl: string;
}

export interface VentilationPattern {
    id: string;
    name: string;
    slug: string;
    previewUrl: string;
    priceModifier: string;
}

export interface MountingType {
    id: string;
    name: string;
    slug: string;
    priceModifier: string;
}

export interface ConfigAccessory {
    id: string;
    name: string;
    slug: string;
    previewUrl: string;
    price: string;
}

export interface PriceTier {
    id: string;
    styleId: string;
    colorId: string | null;
    minWidth: number;
    maxWidth: number;
    minHeight: number;
    maxHeight: number;
    basePrice: string;
    pricePerSection: string;
}

export interface ConfiguratorOptions {
    styles: ConfigStyle[];
    colors: Color[];
    ventilationPatterns: VentilationPattern[];
    mountingTypes: MountingType[];
    accessories: ConfigAccessory[];
    priceTiers: PriceTier[];
}

export interface PriceBreakdown {
    basePrice: number;
    ventilationModifier: number;
    mountingModifier: number;
    sectionsSurcharge: number;
    accessoriesTotal: number;
    grandTotal: number;
}

export interface ConfiguredItem {
    id: string;
    type: "configured";
    styleName: string;
    styleId: string;
    colorName: string;
    colorId: string;
    colorValue: string;
    width: number;
    height: number;
    depth: number;
    ventilationName: string;
    ventilationId: string;
    mountingName: string;
    mountingId: string;
    sections: number;
    accessories: Array<{ id: string; name: string; price: number }>;
    priceBreakdown: PriceBreakdown;
    totalPrice: number;
    previewUrl: string;
}

export type CartItem = Product | ConfiguredItem;

export interface BlogPost {
    id: string;
    storeId: string;
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    coverImage: string;
    category: string;
    readTime: string;
    authorName: string;
    authorRole: string;
    isPublished: boolean;
    sortOrder: number;
    publishedAt: string | null;
    createdAt: string;
    updatedAt: string;
}