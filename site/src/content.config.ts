import { docsLoader, i18nLoader } from '@astrojs/starlight/loaders'
import { docsSchema, i18nSchema } from '@astrojs/starlight/schema'
import { defineCollection, z } from 'astro:content'
import { ExtendDocsSchema } from 'starlight-theme-black/schema'

export const collections = {
  docs: defineCollection({
    loader: docsLoader(),
    schema: docsSchema({
      extend: ExtendDocsSchema.extend({
        schema: z.record(z.any()).optional(),
      }),
    }),
  }),
  i18n: defineCollection({ loader: i18nLoader(), schema: i18nSchema() }),
}

