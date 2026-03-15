import { z } from "zod";

export const blogPostRowSchema = z.object({
    id: z.string(),
    title: z.string(),
    slug: z.string(),
    excerpt: z.string(),
    content: z.string(),
    coverImage: z.string(),
    category: z.string(),
    readTime: z.string(),
    authorName: z.string(),
    authorRole: z.string(),
    isPublished: z.boolean(),
    sortOrder: z.number(),
    publishedAt: z.string().nullable(),
    createdAt: z.string(),
    updatedAt: z.string(),
});

export type BlogPostRow = z.infer<typeof blogPostRowSchema>;
