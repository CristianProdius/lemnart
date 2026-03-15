import { Product, Category } from "@/types"

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://lemnart.ro"

interface CategorySchemaProps {
    category: Category | null
    products: Product[]
    isAll: boolean
}

const CategorySchema: React.FC<CategorySchemaProps> = ({
    category,
    products,
    isAll,
}) => {
    const categoryName = isAll ? "Toate Produsele" : category?.name ?? ""
    const categoryUrl = isAll
        ? `${SITE_URL}/category/all`
        : `${SITE_URL}/category/${category?.id}`

    const schema = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "CollectionPage",
                "@id": `${categoryUrl}#webpage`,
                name: `${categoryName} — LemnArt`,
                url: categoryUrl,
                isPartOf: { "@id": `${SITE_URL}/#website` },
                inLanguage: "ro-RO",
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
                        name: categoryName,
                    },
                ],
            },
            {
                "@type": "ItemList",
                itemListElement: products.map((product, index) => ({
                    "@type": "ListItem",
                    position: index + 1,
                    url: `${SITE_URL}/product/${product.id}`,
                })),
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

export default CategorySchema
