import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'astro/config'
import sitemap from '@astrojs/sitemap'
import rehypeSlug from 'rehype-slug'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'

// ProseCode.vue(components/content/)는 코드블록마다 우측 하단에 작은 언어 이름
// 배지를 그렸다: `<div class="codeblock"><pre>…</pre><span class="lang">bash</span></div>`.
// Astro 내장 Shiki는 <pre>만 emit하고 이 wrapper div·배지 span은 만들어주지 않으므로,
// Task 5 완료 후 스크린샷 대조에서 놓쳤던 이 배지가 fix round 1에서 회귀로 지적됐다.
//
// rehype 플러그인 대신 shiki transformer를 고른 이유: 이미 렌더된 hast 트리를 다시
// 순회하며 <pre>의 부모를 찾아 갈아끼우는 rehype 플러그인보다, shiki의 `pre()` 훅이
// 훨씬 직접적이다 — 이 훅은 다른 transformer 훅들과 같은 규약으로 반환값이 <pre> 노드
// 자체를 교체하므로(@shikijs/core의 tokensToHast: `preNode = transformer.pre(preNode)
// || preNode`), 그 안에서 <pre>를 감싸는 div와 배지 span을 만들어 반환하면 그대로
// 최종 트리에 반영된다. 언어 이름은 `this.options.lang`으로 그 코드펜스의 실제 언어를
// 읽어온다(하드코딩 아님) — 코드펜스마다 별도로 highlight()가 호출되므로 매번 그
// 블록의 언어로 정확히 채워진다.
const codeBlockLanguageBadge = {
  name: 'code-block-language-badge',
  pre(node) {
    // @astrojs/markdown-remark(highlight.js)는 언어 미지정 코드펜스를 "plaintext"로
    // 정규화해서 넘긴다. 이 저장소의 글들 중 실제로 ```plaintext라고 쓴 곳은 없다(grep으로
    // 확인) — 즉 "plaintext"는 전부 "언어 미지정" 케이스다. 원본 ProseCode.vue는
    // `language` prop이 null이면 빈 문자열을 렌더했으므로 그 동작을 그대로 맞춘다.
    const lang = this.options.lang
    const label = lang === 'plaintext' ? '' : lang

    return {
      type: 'element',
      tagName: 'div',
      properties: { class: 'codeblock' },
      children: [
        node,
        {
          type: 'element',
          tagName: 'span',
          properties: { class: 'lang' },
          children: [{ type: 'text', value: label }],
        },
      ],
    }
  },
}

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
    // @astrojs/markdown-remark는 remark-smartypants를 기본으로 켜서 곧은 따옴표,
    // 아포스트로피, 말줄임표(...), 대시(--)를 각각 굽은 따옴표, 줄임표, 대시 기호로
    // 바꾼다. Nuxt Content는 이런 변환을 하지 않았으므로 끄지 않으면 글 본문 텍스트
    // 자체가 바뀐다(fix round 2: 47개 글 중 15개에서 실측됨, 예: 014-cors의 곧은
    // 따옴표로 감싼 문장이 굽은 따옴표로 렌더됨).
    smartypants: false,
    // Nuxt 설정의 shiki 테마를 그대로 옮긴다.
    shikiConfig: { theme: 'github-dark', transformers: [codeBlockLanguageBadge] },
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
