import js from '@eslint/js'
import tseslint from 'typescript-eslint'
import astro from 'eslint-plugin-astro'
import prettier from 'eslint-config-prettier'
import globals from 'globals'
import tsParser from '@typescript-eslint/parser'

export default [
  {
    // 빌드 산출물과 생성 파일. .gitignore를 자동 반영하지 않으므로 직접 적는다.
    // .astro/는 Astro의 content collection 타입 생성 디렉토리다.
    ignores: ['dist/', '.astro/', 'node_modules/', '.superpowers/'],
  },
  // 코어 규칙셋. eslint-plugin-astro의 recommended는 astro/* 규칙만 켜고
  // no-unused-vars·no-undef 같은 코어 규칙은 하나도 켜지 않는다. Nuxt 시절에는
  // @nuxt/eslint-config가 이걸 끌어왔으나 제거되면서 함께 사라졌다.
  js.configs.recommended,
  // TypeScript용. no-unused-vars 등 코어 규칙 중 TS에서 오탐이 나는 것들을
  // ts 전용 버전으로 교체한다. 타입 정보를 요구하지 않는 recommended를 쓴다.
  ...tseslint.configs.recommended,
  // eslint-plugin-astro의 recommended 설정. .astro 파일용 파서·플러그인 등록과
  // 기본 규칙셋을 포함한다. @typescript-eslint/parser가 설치되어 있으면
  // frontmatter 스크립트도 타입 인식 파싱으로 처리한다(선택적 peer).
  ...astro.configs.recommended,
  // jsx-a11y 규칙을 Astro 컴포넌트용으로 확장한 설정. eslint-plugin-jsx-a11y가
  // 설치되어 있어야 활성화된다.
  ...astro.configs['jsx-a11y-recommended'],
  {
    // 루트의 설정 파일들은 Node가 ESM으로 실행한다. no-undef를 켜기 전에는 아무도
    // 전역을 선언할 필요가 없었으나, 이제 astro.config.mjs가 쓰는 URL 같은 전역이
    // 선언되지 않으면 오탐이 된다.
    files: ['*.config.mjs'],
    languageOptions: {
      sourceType: 'module',
      globals: globals.node,
    },
  },
  {
    // eslint-plugin-astro의 base 설정은 .astro 파일(과 그 안의 embedded script)에만
    // 파서를 등록한다. 순수 .ts 파일(src/content.config.ts)은 어떤 config 객체의
    // files 패턴에도 걸리지 않아 ESLint가 아예 건너뛴다 — .astro가 겪던 것과 같은
    // 종류의 사각지대다. @typescript-eslint/parser는 astro 프론트매터 파싱용으로
    // 이미 설치돼 있으므로, 그걸 재사용해 .ts 파일도 실제로 파싱되게 한다.
    files: ['**/*.ts'],
    languageOptions: {
      parser: tsParser,
      sourceType: 'module',
    },
  },
  {
    // eslint-plugin-astro의 recommended/jsx-a11y-recommended는 no-console을
    // 설정하지 않는다. 마이그레이션 전 .eslintrc는 모든 파일에 no-console: warn을
    // 걸었고 실제로 thumbnail-placeholder/*.js에서 4번 발생했다. 그 동작을
    // 복원한다. error가 아닌 warn인 이유는 예전 설정 그대로를 유지하기 위함이며,
    // lint 스크립트에 --max-warnings 0이 없으므로 warn은 배포를 막지 않는다.
    rules: {
      'no-console': 'warn',
    },
  },
  {
    // thumbnail-placeholder/*.js 는 CommonJS Node 스크립트다.
    // require와 console.log는 여기서 올바른 코드이므로 파일을 고치지 않고
    // 환경을 선언해 처리한다.
    // no-console은 바로 위 규칙에서 전체 파일에 켰으므로(warn), 여기서는 그
    // 규칙을 이 파일들에 한해 다시 끈다 — CLI 스크립트라 콘솔 출력이 의도된
    // 동작이기 때문이다.
    files: ['thumbnail-placeholder/**/*.js'],
    languageOptions: {
      sourceType: 'commonjs',
      globals: globals.node,
    },
    rules: {
      '@typescript-eslint/no-require-imports': 'off',
      'no-console': 'off',
    },
  },
  // 반드시 마지막. Prettier와 충돌하는 규칙을 끈다.
  prettier,
]
