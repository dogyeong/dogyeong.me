import { defineCollection, z } from 'astro:content'
import { glob } from 'astro/loaders'

const blog = defineCollection({
  // content/를 src/ 아래로 옮기지 않는다. 48개 rename은 git 이력을 더럽히고,
  // 파일 경로는 라우트에 영향을 주지 않으므로(URL은 프론트매터의 slug가 결정한다)
  // 옮겨서 얻는 것도 없다.
  loader: glob({ pattern: '**/*.md', base: './content/blog' }),
  schema: z.object({
    title: z.string(),
    publishedAt: z.coerce.date(),
  }),
})

const about = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './content/about' }),
  schema: z.object({}).passthrough(),
})

export const collections = { blog, about }
