import { createConfigForNuxt } from '@nuxt/eslint-config/flat'
import prettier from 'eslint-config-prettier'
import globals from 'globals'

export default createConfigForNuxt({
  features: {
    // 포맷은 Prettier가 전담한다. ESLint의 스타일 규칙을 켜면 두 도구가 충돌한다.
    stylistic: false,
  },
}).append(
  {
    // 빌드 산출물과 생성 파일. .gitignore를 자동 반영하지 않으므로 직접 적는다.
    ignores: ['dist/', '.output/', '.nuxt/', 'node_modules/', '.superpowers/'],
  },
  {
    // thumbnail-placeholder/*.js 는 CommonJS Node 스크립트다.
    // require와 console.log는 여기서 올바른 코드이므로 파일을 고치지 않고
    // 환경을 선언해 처리한다.
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
)
