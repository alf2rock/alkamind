import { defineContentConfig, defineCollection, z } from '@nuxt/content'

export default defineContentConfig({
  collections: {
    pages: defineCollection({
      type: 'page',
      source: 'pages/*.md',
      schema: z.object({
        subtitle: z.string().optional(),
        ctaText: z.string().optional(),
        ctaLink: z.string().optional()
      })
    }),
    blog: defineCollection({
      type: 'page',
      source: 'blog/*.md',
      schema: z.object({
        date: z.string(),
        author: z.string().optional(),
        summary: z.string().optional(),
        slug: z.string().optional(),
        attachments: z.array(z.object({
          label: z.string(),
          file: z.string()
        })).optional()
      })
    })
  }
})
