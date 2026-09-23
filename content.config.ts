import { defineCollection, defineContentConfig } from '@nuxt/content';
import { z } from 'zod';

export default defineContentConfig({
  collections: {
    roles: defineCollection({
      type: 'page',
      source: 'roles/**',
      schema: z.object({
        title: z.string(),
        subtitle: z.string(),
        kicker: z.string(),
        index: z.string(),
        code: z.string(),
        grade: z.string(),
        desc: z.string(),
        listed: z.boolean().default(true),
        badge: z.string().optional(),
        greek: z.array(z.string()).optional(),
        tags: z.array(z.object({ text: z.string(), hot: z.boolean().optional() })).default([]),
        marquee: z.array(z.string()),
        leadBold: z.boolean().default(false),
        dimLast: z.boolean().default(false),
      }),
    }),
    site: defineCollection({
      type: 'page',
      source: 'site/**',
      schema: z.object({
        title: z.string(),
        kicker: z.string().optional(),
        subtitle: z.string().optional(),
        typer: z.array(z.string()).default([]),
        heroSub: z.array(z.string()).default([]),
        departments: z.array(z.object({
          label: z.string(),
          title: z.string(),
          desc: z.string(),
          href: z.string().optional(),
          linkText: z.string().optional(),
        })).default([]),
        marquee: z.array(z.string()).default([]),
        footKicker: z.string().optional(),
        footDesc: z.string().optional(),
      }),
    }),
  },
});
