import { Product } from "@/types"

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://lemnart.ro"

interface ProductSchemaProps {
    product: Product
}

const ProductSchema: React.FC<ProductSchemaProps> = ({ product }) => {
    const schema = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "Product",
                "@id": `${SITE_URL}/product/${product.id}#product`,
                name: product.name,
                image: product.images?.map((img) => img.url),
                description: `Mascare calorifer din lemn masiv — ${product.name}. Dimensiune: ${product.size?.value}. Culori: ${product.colors?.map((c) => c.name).join(", ") || "diverse"}.`,
                sku: product.id,
                brand: {
                    "@type": "Brand",
                    name: "LemnArt",
                },
                category: product.category?.name,
                material: "Lemn masiv",
                offers: {
                    "@type": "Offer",
                    url: `${SITE_URL}/product/${product.id}`,
                    priceCurrency: "RON",
                    price: product.price,
                    availability: "https://schema.org/InStock",
                    seller: {
                        "@id": `${SITE_URL}/#organization`,
                    },
                },
            },
            {
                "@type": "BreadcrumbList",
                itemListElement: [
                    {
                        "@type": "ListItem",
                        position: 1,
                        name: "Acasă",
                        item: `${SITE_URL}/`,
                    },
                    {
                        "@type": "ListItem",
                        position: 2,
                        name: product.category?.name,
                        item: `${SITE_URL}/category/${product.category?.id}`,
                    },
                    {
                        "@type": "ListItem",
                        position: 3,
                        name: product.name,
                    },
                ],
            },
        ],
    }

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
    )
}

export default ProductSchema
