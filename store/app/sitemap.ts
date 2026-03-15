import type { MetadataRoute } from "next"
import { getAllBlogPosts } from "@/lib/blog-data"
import getCategories from "@/actions/get-categories"
import getProducts from "@/actions/get-products"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://lemnart.ro"

    const staticPages: MetadataRoute.Sitemap = [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: "weekly",
            priority: 1.0,
        },
        {
            url: `${baseUrl}/category/all`,
            lastModified: new Date(),
            changeFrequency: "daily",
            priority: 0.9,
        },
        {
            url: `${baseUrl}/blog`,
            lastModified: new Date(),
            changeFrequency: "weekly",
            priority: 0.8,
        },
        {
            url: `${baseUrl}/contact`,
            lastModified: new Date(),
            changeFrequency: "monthly",
            priority: 0.5,
        },
    ]

    const blogPosts = getAllBlogPosts()
    const blogPages: MetadataRoute.Sitemap = blogPosts.map((post) => ({
        url: `${baseUrl}/blog/${post.slug}`,
        lastModified: new Date(post.date),
        changeFrequency: "monthly" as const,
        priority: 0.7,
    }))

    let categoryPages: MetadataRoute.Sitemap = []
    try {
        const categories = await getCategories()
        categoryPages = categories.map((category) => ({
            url: `${baseUrl}/category/${category.id}`,
            lastModified: new Date(),
            changeFrequency: "weekly" as const,
            priority: 0.8,
        }))
    } catch (error) {
        console.log("[SITEMAP_CATEGORIES]", error)
    }

    let productPages: MetadataRoute.Sitemap = []
    try {
        const products = await getProducts({})
        productPages = products.map((product) => ({
            url: `${baseUrl}/product/${product.id}`,
            lastModified: new Date(),
            changeFrequency: "weekly" as const,
            priority: 0.9,
        }))
    } catch (error) {
        console.log("[SITEMAP_PRODUCTS]", error)
    }

    return [
        ...staticPages,
        ...blogPages,
        ...categoryPages,
        ...productPages,
    ]
}
