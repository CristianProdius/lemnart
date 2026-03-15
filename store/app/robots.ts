import type { MetadataRoute } from "next"

export default function robots(): MetadataRoute.Robots {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://lemnart.ro"

    return {
        rules: [
            {
                userAgent: "*",
                allow: "/",
                disallow: ["/cart", "/api/"],
            },
        ],
        sitemap: `${baseUrl}/sitemap.xml`,
    }
}
