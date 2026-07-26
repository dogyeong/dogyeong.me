# AGENTS.md

This file provides guidance to Claude Code (claude.ai/code) and other coding agents when working with code in this repository. `CLAUDE.md`은 이 파일을 가리키는 심링크다.

## 프로젝트 개요

[dogyeong.me](https://dogyeong.me) 개인 기술 블로그. **Astro 7** 기반 **정적 사이트**(SSG)이며, main 브랜치에 push하면 GitHub Actions가 Firebase Hosting(`devpass-30165`)으로 배포한다. 글은 모두 한국어다.

## 명령어

```bash
pnpm dev                            # 개발 서버
pnpm build                          # 정적 빌드 → dist
pnpm preview                        # 빌드 결과 미리보기
pnpm generate-thumbnail-placeholder # 썸네일 플레이스홀더 생성 (아래 참고, 보통 CI에서만 실행)
pnpm lint                           # ESLint (배포 게이트)
pnpm format:check                   # Prettier 검사 (배포 게이트)
```

- 패키지 매니저는 **pnpm 11** (`packageManager` 필드가 유일한 버전 소스이며, 로컬은 corepack으로 활성화하고 CI는 `pnpm/action-setup`이 같은 필드를 읽는다). npm/yarn 사용 금지.
- `node_modules`는 pnpm 기본값인 격리 레이아웃이다. `package.json`에 선언하지 않은 패키지는 import할 수 없다. 필요하면 의존성으로 추가한다.
- 의존성이 설치 시 빌드 스크립트를 실행해야 하면 `pnpm-workspace.yaml`의 `allowBuilds`에 명시해야 한다. pnpm은 기본적으로 이를 차단하며, 미검토 항목이 남아 있으면 `pnpm install`이 실패한다.
- lint는 `pnpm lint`(ESLint), 포맷은 `pnpm format:check` / `pnpm format`(Prettier)이다. 자동 수정은 `pnpm lint:fix`. **둘 다 배포 워크플로의 게이트이므로 실패하면 배포가 중단된다.** 테스트 프레임워크는 없다.
- ESLint 설정은 `eslint.config.mjs`(flat config) 하나뿐이다. `.eslintrc.json`은 없다. `eslint-plugin-astro`의 recommended·jsx-a11y-recommended 설정을 기반으로 하며 포맷 규칙은 끄고 Prettier(`eslint-config-prettier`)에 맡긴다.
- `thumbnail-placeholder/**/*.js`는 CommonJS Node 스크립트로 예외 처리되어 있다. `require`와 `console.log`가 허용된다.
- Prettier는 `content/`의 마크다운도 포맷한다. `.prettierignore`에는 빌드 산출물을 적지 않는다 — Prettier 3이 `.gitignore`를 기본 참조하기 때문이다.
- 배포 파이프라인은 `.github/workflows/firebase-hosting-merge.yml` 하나뿐이다: Node 24.18.0에서 `pnpm install --frozen-lockfile` → `pnpm lint` → `pnpm format:check` → `pnpm generate-thumbnail-placeholder` → `pnpm build` 후 `dist/`를 Firebase Hosting(`firebase.json`의 `hosting.public`)에 배포한다. `firebase.json`의 `hosting.redirects`에는 Nuxt→Astro 마이그레이션으로 슬러그가 바뀐 23편의 301 리다이렉트가 있다 — **기존 글의 `slug`를 바꿀 때는 이 목록도 같이 고쳐야 한다.**
- Node 버전은 `.nvmrc`(`24.18.0`)가 CI 핀과 같은 값을 가리킨다. nvm/fnm을 쓰면 `nvm use`로 맞출 수 있다. `package.json`의 `engines`는 실제 하한(`node >=22.13`, `pnpm >=11`)을 선언한 것이고 핀이 아니다. 하한은 pnpm 11이 정하며 Astro(`>=22.12.0`)와 sqip(`>=18.12.1`)보다 높다.
- **하한에 어긋나면 `pnpm install`이 `ERR_PNPM_UNSUPPORTED_ENGINE`으로 실패한다.** `pnpm-workspace.yaml`의 `engineStrict: true` 때문이다. 이 값이 없으면 pnpm은 경고만 내고 설치를 마치므로, 버전이 어긋난 채로 빌드가 진행되어 뒤늦게 이상한 곳에서 터진다. Node를 올리거나 내려야 하면 `.nvmrc`, `engines`, CI 워크플로의 `node-version` 세 곳을 같이 고쳐야 한다.

## 콘텐츠 구조

글은 코드가 아니라 `content/` 아래 마크다운으로 관리되고, `src/content.config.ts`의 `blog` 컬렉션(`astro/loaders`의 `glob`, base `./content/blog`)이 이를 읽는다. **파일 경로는 라우트를 결정하지 않는다 — URL은 프론트매터의 `slug` 필드가 결정한다.** Astro의 `glob` 로더는 프론트매터에 `slug`가 있으면 그 값을 엔트리 id로 쓰고, `src/pages/blog/[...slug].astro`의 `getStaticPaths`가 그 id(`post.id`)로 라우트를 만든다 — 파일명 자체는 무엇이든 상관없다. **`slug`를 잘못 정하면 의도하지 않은 URL로 글이 올라간다.**

- `content/blog/*.md` (파일명은 자유, 관례상 `NNN-제목.md`) → 프론트매터의 `slug`가 그대로 `/blog/<slug>/`가 된다.
- `content/about/index.md` → `/about/`
- `src/pages/index.astro`가 `getCollection('blog')`를 `publishedAt` 내림차순으로 정렬해 목록을 만든다.

### 새 글 추가 절차

1. `content/blog/`에서 가장 큰 번호 + 1로 `NNN-제목.md` 생성 (번호는 3자리, 이미지 파일명 접두사로도 쓰인다). 파일명은 라우트에 영향을 주지 않지만 관례를 유지한다.
2. 프론트매터에 다음 5필드를 모두 채운다:
   ```markdown
   ---
   title: '글 제목'
   slug: NNN-my-post-slug
   publishedAt: 2026-06-20
   thumbnail: https://res.cloudinary.com/dpefbi4ts/image/upload/v.../thumb/NNN-thumb.png
   thumbnailPlaceholder: WILL_BE_REPLACED
   ---
   ```
   `slug`가 실제 URL(`/blog/<slug>/`)이 된다. 한 번 배포된 글의 `slug`를 바꾸려면 `firebase.json`의 `hosting.redirects`에도 301 리다이렉트를 추가해야 한다.
3. 본문에 h1(`# 제목`)을 쓰지 않는다. 제목은 프론트매터의 `title`을 `ArticleLayout.astro`가 렌더하므로, 본문은 `##`(h2) 이하로 시작한다.
4. 본문 이미지는 `public/images/NNN-01.png` 로 넣고 `![](/images/NNN-01.png)` 로 참조한다. 썸네일만 Cloudinary에 올린다 (`BlurrableImage`가 Cloudinary URL의 `/upload/` 를 쪼개 `w_*,q_auto,f_auto` srcset을 생성하므로, 썸네일은 반드시 Cloudinary URL이어야 반응형 이미지가 동작한다).
5. 커밋 전 `pnpm format`을 실행한다. Prettier는 이제 `content/`의 마크다운도 검사하고, `pnpm format:check`는 배포 게이트다 — 새 글이 Prettier 기준에 어긋나면 배포가 그 자리에서 막힌다. `pnpm format`은 공백만 건드리는 게 아니라 마크다운 소스 자체를 고칠 수 있다(이 브랜치에서 실제로 `~취소선~`이 `~~취소선~~`로 바뀐 사례가 있다). 그러니 실행 후 diff를 다시 읽고 의도한 내용이 맞는지 확인한다.

### thumbnailPlaceholder는 손대지 않는다

`thumbnailPlaceholder: WILL_BE_REPLACED`는 **저장소에 그대로 커밋된 상태로 둔다.** 빌드 시 `thumbnail-placeholder/generator.js`가 썸네일을 내려받아 SQIP로 10px SVG 데이터 URI를 만들고, 마크다운 파일의 이 값을 in-place로 치환한다. 캐시는 `public/thumbnail-placeholder-cache.json`에 etag와 함께 저장되며, 이전 캐시는 **배포된 사이트에서 fetch해온다**(`https://dogyeong.me/thumbnail-placeholder-cache.json`) — 로컬 상태가 아니다. `BlurrableImage`는 값이 `WILL_BE_REPLACED`면 개발 모드로 간주해 블러 배경을 건너뛴다.

로컬에서 이 스크립트를 실행하면 마크다운 파일들이 수정되므로 커밋 전에 되돌려야 한다. 단, `git restore content/`는 **git이 추적하는 파일만 복구한다** — 아직 커밋하지 않은 초안(untracked)이 `content/blog/`에 있으면 그대로 덮어써진다. `git status`는 실행 전후 동일하게 `?? <파일>`만 보여주므로 손상 여부가 드러나지 않는다. 실행 전 추적되지 않은 초안을 먼저 백업해둔다:

```bash
git -c core.quotePath=false ls-files --others --exclude-standard content/ \
  | tar -czf /tmp/content-drafts.tar.gz -T -
# (생성기 실행)
git restore content/                          # 추적 파일만 원복
tar -xzf /tmp/content-drafts.tar.gz           # untracked 초안 복구
rm -f public/thumbnail-placeholder-cache.json # git 미추적·미ignore 상태라 git add . 시 실수로 커밋될 수 있다
```

## 아키텍처 관례

- **스타일**: 전역 SCSS 변수 파일(`assets/styles.scss`, 프로젝트 루트)이 `astro.config.mjs`의 Vite `css.preprocessorOptions.scss.additionalData` 설정으로 모든 `<style lang="scss">`에 자동 주입된다. 따라서 import 없이 `$grey-0~9`, `$indigo-0~9` 와 브레이크포인트를 바로 쓴다. 미디어 쿼리는 `@media ($tablet)`, `@media ($desktop)` 형태(변수 안에 `min-width: ...` 문자열이 들어있다). 컴포넌트 스타일은 `.astro` 파일의 스코프드 `<style>` 블록을 쓴다(Astro가 클래스명을 자동으로 스코프하므로 Vue의 CSS Modules 같은 별도 문법이 필요 없다).
- **내부 링크**: 평범한 `<a href="...">`를 쓴다 — `Link.ts`나 `NuxtLink` 같은 래퍼는 없다. 사이트 전체가 trailing slash URL 기준이므로 내부 링크는 끝에 `/`를 붙인다(`astro.config.mjs`의 `trailingSlash: 'always'`, `build.format: 'directory'`). sitemap도 같은 규칙을 따른다.
- **마크다운 렌더링**: `components/content/Prose*.vue` 대신 `src/styles/prose.scss` 하나가 `.prose` 컨테이너 안 마크다운 출력(코드블록, 표, 헤딩 등)의 모양을 담당한다. `ArticleLayout.astro`가 렌더된 `<Content />`를 `.prose`로 감싼다. 코드블록은 Astro 내장 Shiki(`astro.config.mjs`의 `markdown.shikiConfig`, 테마 `github-dark`)가 처리하며, 언어 배지는 커스텀 shiki transformer(`codeBlockLanguageBadge`)가 붙인다. 헤딩 앵커는 `rehype-slug` + `rehype-autolink-headings`.
- **sitemap**: `@astrojs/sitemap` 인테그레이션(`astro.config.mjs`의 `integrations`)이 빌드 시 자동 생성한다. 커스텀 서버 라우트는 없다.
- **Firebase**: `src/layouts/BaseLayout.astro`에서 analytics만 초기화하며 `import.meta.env.PROD`일 때만 동작한다. 다른 Firebase 기능은 쓰지 않는다.
- TypeScript strict 모드. Prettier는 세미콜론 없음 / 싱글쿼트 / printWidth 110. `.astro` 파일 포맷은 `prettier-plugin-astro`가 처리한다.

## 커밋

기존 히스토리 컨벤션을 따른다: `feat: add article 0NN`, `content: polish article 0NN`, `chore: ...`, `fix: ...`.
