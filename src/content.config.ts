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
  }),
});

export const collections = { blog };
