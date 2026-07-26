# AGENTS.md

This file provides guidance to Claude Code (claude.ai/code) and other coding agents when working with code in this repository. `CLAUDE.md`은 이 파일을 가리키는 심링크다.

## 프로젝트 개요

[dogyeong.me](https://dogyeong.me) 개인 기술 블로그. Nuxt 3 + `@nuxt/content` 기반 **정적 사이트**(SSG)이며, main 브랜치에 push하면 GitHub Actions가 Firebase Hosting(`devpass-30165`)으로 배포한다. 글은 모두 한국어다.

## 명령어

```bash
pnpm dev                            # 개발 서버 (브라우저 자동 오픈)
pnpm generate                       # 정적 빌드 → .output/public
pnpm preview                        # 빌드 결과 미리보기
pnpm serve                          # sirv로 .output/public 서빙
pnpm generate-thumbnail-placeholder # 썸네일 플레이스홀더 생성 (아래 참고, 보통 CI에서만 실행)
```

- 패키지 매니저는 **pnpm 11** (`packageManager` 필드가 유일한 버전 소스이며, 로컬은 corepack으로 활성화하고 CI는 `pnpm/action-setup`이 같은 필드를 읽는다). npm/yarn 사용 금지.
- `node_modules`는 pnpm 기본값인 격리 레이아웃이다. `package.json`에 선언하지 않은 패키지는 import할 수 없다. 필요하면 의존성으로 추가한다.
- 의존성이 설치 시 빌드 스크립트를 실행해야 하면 `pnpm-workspace.yaml`의 `allowBuilds`에 명시해야 한다. pnpm은 기본적으로 이를 차단하며, 미검토 항목이 남아 있으면 `pnpm install`이 실패한다.
- lint/test 스크립트는 정의되어 있지 않다. ESLint/Prettier 설정만 존재하므로 필요하면 `pnpm exec eslint .` / `pnpm exec prettier --write` 를 직접 호출한다. 테스트 프레임워크는 없다.
- 배포 파이프라인은 `.github/workflows/firebase-hosting-merge.yml` 하나뿐이다: Node 24.18.0에서 `pnpm install --frozen-lockfile` → `pnpm generate-thumbnail-placeholder` → `pnpm generate` 후 `.output/public` 배포.
- Node 버전은 `.nvmrc`(`24.18.0`)가 CI 핀과 같은 값을 가리킨다. nvm/fnm을 쓰면 `nvm use`로 맞출 수 있다. `package.json`의 `engines`는 실제 하한(`node >=22.13`, `pnpm >=11`)을 선언한 것이고 핀이 아니다. 하한은 pnpm 11이 정하며 Nuxt(`>=22.0.0`)와 sqip(`>=18.12.1`)보다 높다. 어긋나도 `pnpm install`은 경고만 내고 진행한다.

## 콘텐츠 구조

글은 코드가 아니라 `content/` 아래 마크다운으로 관리된다. 파일 경로가 곧 라우트다.

- `content/blog/NNN-slug.md` → `/blog/NNN-slug/` (`pages/blog/[...slug].vue`의 `<ContentDoc />`가 렌더)
- `content/about/index.md` → `/about/`
- `pages/index.vue`는 `queryContent('/blog').sort({ publishedAt: -1 })`로 목록을 만든다.

### 새 글 추가 절차

1. `content/blog/`에서 가장 큰 번호 + 1로 `NNN-제목.md` 생성 (번호는 3자리, 이미지 파일명 접두사로도 쓰인다).
2. 프론트매터는 항상 이 세 필드:
   ```markdown
   ---
   publishedAt: 2026-06-20
   thumbnail: https://res.cloudinary.com/dpefbi4ts/image/upload/v.../thumb/NNN-thumb.png
   thumbnailPlaceholder: WILL_BE_REPLACED
   ---
   ```
3. 본문은 `# 제목`으로 시작한다. `title`은 프론트매터에 두지 않고 `@nuxt/content`가 첫 h1에서 추론한다 (목록 카드가 `article.title`을 쓴다).
4. h1 바로 뒤에 MDC 컴포넌트 두 줄을 넣는다:
   ```markdown
   :PublishDate{:date="publishedAt"}

   :PostThumbnail{:src="thumbnail" :placeholder-data-uri="thumbnailPlaceholder"}
   ```
5. 본문 이미지는 `public/images/NNN-01.png` 로 넣고 `![](/images/NNN-01.png)` 로 참조한다. 썸네일만 Cloudinary에 올린다 (`BlurrableImage`가 Cloudinary URL의 `/upload/` 를 쪼개 `w_*,q_auto,f_auto` srcset을 생성하므로, 썸네일은 반드시 Cloudinary URL이어야 반응형 이미지가 동작한다).

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

- **스타일**: 전역 SCSS 변수 파일(`assets/styles.scss`)이 Vite `additionalData`로 모든 `<style lang="scss">`에 자동 주입된다. 따라서 import 없이 `$grey-0~9`, `$indigo-0~9` 와 브레이크포인트를 바로 쓴다. 미디어 쿼리는 `@media ($tablet)`, `@media ($desktop)` 형태(변수 안에 `min-width: ...` 문자열이 들어있다). 컴포넌트 스타일은 CSS Modules(`<style module>` + `:class="$style.x"`)를 쓴다.
- **내부 링크**: `NuxtLink` 대신 `components/Link.ts`(`defineNuxtLink({ trailingSlash: 'append' })`)를 import해서 쓴다. 사이트 전체가 trailing slash URL 기준이며 sitemap도 `_path + '/'`로 생성된다.
- **Prose 컴포넌트**: `components/content/Prose*.vue`가 `@nuxt/content`의 기본 마크다운 렌더링을 전부 오버라이드한다. 마크다운 출력 모양(코드블록, 표, 헤딩 등)을 바꾸려면 이 파일들을 수정한다. 같은 디렉토리의 `PublishDate.vue`/`PostThumbnail.vue`는 MDC 문법으로 본문에서 직접 호출되는 컴포넌트다.
- **SVG**: `nuxt-svgo`로 `import Logo from '~/assets/svg/logo.svg'` 하면 컴포넌트가 된다. svgo 설정이 `fill` 속성을 제거하므로 색은 CSS(`fill`/`color`)로 지정한다. 타입은 `svg.d.ts`가 선언한다.
- **sitemap**: `server/routes/sitemap.xml.ts`가 모든 문서를 훑어 생성하고, `nitro.prerender.routes`에 등록되어 정적 빌드에 포함된다.
- **Firebase**: `app.vue`에서 analytics만 초기화하며 `NODE_ENV !== 'development'` 일 때만 동작한다. 다른 Firebase 기능은 쓰지 않는다.
- TypeScript strict 모드. Prettier는 세미콜론 없음 / 싱글쿼트 / printWidth 110.

## 커밋

기존 히스토리 컨벤션을 따른다: `feat: add article 0NN`, `content: polish article 0NN`, `chore: ...`, `fix: ...`.
