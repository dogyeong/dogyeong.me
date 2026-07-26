import { defineCollection, z } from 'astro:content'
import { glob } from 'astro/loaders'

const blog = defineCollection({
  // content/를 src/ 아래로 옮기지 않는다. thumbnail-placeholder 스크립트가
  // ../content/blog 경로를 하드코딩하고 있고, 48개 rename은 git 이력을 더럽힌다.
  loader: glob({ pattern: '**/*.md', base: './content/blog' }),
  schema: z.object({
    title: z.string(),
    publishedAt: z.coerce.date(),
    thumbnail: z.string().url(),
    thumbnailPlaceholder: z.string(),
  }),
})

const about = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './content/about' }),
  schema: z.object({}).passthrough(),
})

export const collections = { blog, about }
