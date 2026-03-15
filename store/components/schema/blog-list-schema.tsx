import { BlogPost } from "@/lib/blog-data"

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://lemnart.ro"

interface BlogListSchemaProps {
    posts: BlogPost[]
}

const BlogListSchema: React.FC<BlogListSchemaProps> = ({ posts }) => {
    const schema = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "CollectionPage",
                "@id": `${SITE_URL}/blog#webpage`,
                name: "Blog — LemnArt",
                description:
                    "Articole despre mascări calorifere din lemn, tendințe în design interior, ghiduri de alegere și inspirație pentru casa ta.",
                url: `${SITE_URL}/blog`,
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
                        name: "Blog",
                    },
                ],
            },
            {
                "@type": "ItemList",
                itemListElement: posts.map((post, index) => ({
                    "@type": "ListItem",
                    position: index + 1,
                    url: `${SITE_URL}/blog/${post.slug}`,
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

export default BlogListSchema
