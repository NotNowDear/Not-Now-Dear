import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    updated: z.coerce.date().optional(),
    featuredImage: z.string(), // e.g. /images/women-on-globe-1.png
    featuredImageAlt: z.string().default(''),
    summary: z.string(),
    categories: z.array(z.string()).default([]),
    tags: z.array(z.string()).default([]),
    seoTitle: z.string().optional(),
    metaDescription: z.string().optional(),
    ogImage: z.string().optional(),
    author: z.string().default('Tristan Coates'),
    draft: z.boolean().default(false),
    // Optional academic metadata. When present, the blog template emits
    // Google Scholar (Highwire) citation_ meta tags + ScholarlyArticle JSON-LD.
    scholarly: z
      .object({
        doi: z.string(),
        pdfUrl: z.string(),
        landingUrl: z.string().optional(),
        publisher: z.string().default('Zenodo'),
        publicationDate: z.string(), // e.g. "2025" or "2025/08/10"
        authorOrcid: z.string().optional(),
        abstract: z.string().optional(),
        keywords: z.array(z.string()).default([]),
      })
      .optional(),
  }),
});

export const collections = { blog };
