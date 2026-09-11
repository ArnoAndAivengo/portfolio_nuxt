import { defineCollection, defineContentConfig, z } from '@nuxt/content'

export default defineContentConfig({
  collections: {
    home: defineCollection({
      type: 'page',
      source: 'home.md',
      schema: z.object({
        name: z.string(),
        role: z.string(),
        roleEn: z.string(),
        status: z.string(),
        eyebrow: z.string(),
        lead: z.string(),
        experienceYears: z.string(),
        updated: z.string(),
        seoTitle: z.string(),
        seoDescription: z.string(),
        ogImage: z.string(),
        canonical: z.string(),
        telegram: z.string(),
        email: z.string(),
        phone: z.string(),
        phoneHref: z.string(),
        maxUrl: z.string(),
        github: z.string(),
        gitlab: z.string(),
        skills: z.array(z.object({
          label: z.string(),
          items: z.array(z.string()),
        })),
      }),
    }),
    projects: defineCollection({
      type: 'page',
      source: 'projects/*.md',
      schema: z.object({
        title: z.string(),
        href: z.string(),
        repo: z.string().optional(),
        badge: z.string().optional(),
        status: z.enum(['Private', 'Public']),
        featured: z.boolean(),
        current: z.boolean(),
        spa: z.boolean().optional(),
        variant: z.string().optional(),
        order: z.number(),
        tags: z.array(z.string()),
      }),
    }),
    articles: defineCollection({
      type: 'page',
      source: 'articles/**/*.md',
    }),
    resume: defineCollection({
      type: 'page',
      source: 'resume.md',
      schema: z.object({
        seoTitle: z.string(),
        seoDescription: z.string(),
        canonical: z.string(),
      }),
    }),
    resumeMeta: defineCollection({
      type: 'data',
      source: 'resume-meta.yml',
      schema: z.object({
        highlights: z.array(z.object({
          lead: z.string(),
          text: z.string(),
        })),
        contributions: z.array(z.object({
          label: z.string(),
          text: z.string(),
        })),
        skillGroups: z.array(z.object({
          label: z.string(),
          note: z.string(),
          items: z.array(z.string()),
        })),
        education: z.array(z.object({
          year: z.string(),
          title: z.string(),
          org: z.string(),
        })),
        training: z.array(z.object({
          year: z.string(),
          title: z.string(),
          org: z.string(),
          diploma: z.string().optional(),
          diplomaAlt: z.string().optional(),
        })),
        languages: z.array(z.object({
          name: z.string(),
          level: z.string(),
        })),
        extra: z.array(z.string()),
        goals: z.array(z.object({
          label: z.string(),
          text: z.string(),
        })),
      }),
    }),
    jobs: defineCollection({
      type: 'data',
      source: 'jobs/*.yml',
      schema: z.object({
        company: z.string(),
        position: z.string(),
        period: z.string(),
        location: z.string(),
        sites: z.array(z.string()).optional(),
        current: z.boolean(),
        badge: z.string().optional(),
        order: z.number(),
        tags: z.array(z.string()),
        teaser: z.string(),
        duties: z.array(z.object({
          label: z.string().optional(),
          text: z.string(),
        })),
        results: z.array(z.string()),
      }),
    }),
  },
})
