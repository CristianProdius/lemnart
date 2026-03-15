import { BlogPost } from "@/lib/blog-data"

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://lemnart.ro"

interface BlogPostingSchemaProps {
    post: BlogPost
}

const BlogPostingSchema: React.FC<BlogPostingSchemaProps> = ({ post }) => {
    const plainContent = post.content.replace(/<[^>]*>/g, "").trim()
    const wordCount = plainContent.split(/\s+/).length

    const schema = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "BlogPosting",
                "@id": `${SITE_URL}/blog/${post.slug}#article`,
                headline: post.title,
                description: post.excerpt,
                image: `${SITE_URL}${post.coverImage}`,
                datePublished: post.date,
                dateModified: post.date,
                wordCount,
                articleSection: post.category,
                inLanguage: "ro-RO",
                author: {
                    "@type": "Organization",
                    name: post.author.name,
                    url: SITE_URL,
                },
                publisher: {
                    "@id": `${SITE_URL}/#organization`,
                },
                mainEntityOfPage: {
                    "@type": "WebPage",
                    "@id": `${SITE_URL}/blog/${post.slug}`,
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
                        name: "Blog",
                        item: `${SITE_URL}/blog`,
                    },
                    {
                        "@type": "ListItem",
                        position: 3,
                        name: post.title,
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

export default BlogPostingSchema
