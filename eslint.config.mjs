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
    // @nuxt/eslint-config는 no-console을 설정하지 않는다(resolved config에
    // 해당 규칙이 아예 없음을 확인함). 마이그레이션 전 .eslintrc는 모든 파일에
    // no-console: warn을 걸었고 실제로 thumbnail-placeholder/*.js에서 4번
    // 발생했다. 그 동작을 복원한다. error가 아닌 warn인 이유는 예전 설정 그대로를
    // 유지하기 위함이며, lint 스크립트에 --max-warnings 0이 없으므로 warn은
    // 배포를 막지 않는다.
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
  {
    // vue/first-attribute-linebreak는 layout 규칙(type: "layout",
    // fixable: "whitespace")이며 eslint-plugin-vue 자체의
    // no-layout-rules 목록에 포함되어 있다. 즉 외부 포맷터를 쓸 때는
    // 꺼야 하는 규칙으로 플러그인이 스스로 지정한 것이다. 하지만
    // eslint-config-prettier의 vue 비활성화 목록이 아직 이 규칙을
    // 따라잡지 못해 stylistic: false와 prettier 둘 다를 통과해
    // 살아남는다. 포맷은 Prettier가 전담하므로 여기서 직접 끈다.
    //
    // 이 객체가 prettier 뒤에 오는 것은 "prettier는 마지막이어야
    // 한다"는 규칙을 어기는 것이 아니다. 그 규칙은 prettier가 끈
    // 스타일 규칙을 뒤에서 다시 켜는 것을 막기 위한 것이고, 이
    // 객체는 규칙을 끄기만 하므로 뒤에 와도 안전하다. 순서를
    // "바로잡는다"며 prettier 앞으로 옮기지 말 것.
    rules: {
      'vue/first-attribute-linebreak': 'off',
    },
  },
)
