import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'astro/config'
import sitemap from '@astrojs/sitemap'
import rehypeSlug from 'rehype-slug'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'

// Vite's scss additionalData is prepended to each consuming file's own source
// and resolved relative to *that file's* directory, not the project root. A
// single hardcoded relative string only works for files at one fixed depth
// under src/. Ported components and page routes live at different depths
// (e.g. src/components/*.astro vs src/pages/blog/[...slug].astro), so the
// path is computed per-file here instead. This stays 100% relative (derived
// from import.meta.url of this config file, which is portable across
// machines/CI) — it never bakes in a machine-specific absolute path.
const stylesPath = fileURLToPath(new URL('./assets/styles.scss', import.meta.url))

export default defineConfig({
  site: 'https://dogyeong.me',
  // 현재 사이트가 /blog/xxx/ 형태이므로 그대로 유지한다.
  trailingSlash: 'always',
  build: { format: 'directory' },
  integrations: [sitemap()],
  markdown: {
    // Nuxt 설정의 shiki 테마를 그대로 옮긴다.
    shikiConfig: { theme: 'github-dark' },
    rehypePlugins: [
      rehypeSlug,
      // 기존 ProseH1~H6이 하던 헤딩 앵커를 대체한다.
      [rehypeAutolinkHeadings, { behavior: 'wrap' }],
    ],
  },
  vite: {
    css: {
      preprocessorOptions: {
        // Nuxt의 additionalData와 동일. 전역 SCSS 변수를 모든 스타일에 주입한다.
        // 경로는 절대경로를 박지 않고, 매 파일마다 상대경로를 계산해 CI 러너에서도
        // 동일하게 동작하도록 한다.
        scss: {
          additionalData: (source, filename) => {
            const relativePath = path.relative(path.dirname(filename), stylesPath).split(path.sep).join('/')
            return `@use "${relativePath}" as *;\n${source}`
          },
        },
      },
    },
  },
})
