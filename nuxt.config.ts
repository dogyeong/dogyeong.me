// https://v3.nuxtjs.org/api/configuration/nuxt.confi
export default defineNuxtConfig({
  devtools: {
    enabled: true,
  },
  typescript: {
    strict: true,
  },
  modules: ['@nuxt/content', '@nuxtjs/robots', 'nuxt-svgo'],
  app: {
    pageTransition: { name: 'page', mode: 'out-in' },
  },
  nitro: {
    prerender: {
      routes: ['/sitemap.xml'],
    },
  },
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@use "@/assets/styles.scss" as *;',
        },
      },
    },
  },
  content: {
    highlight: {
      theme: 'github-dark',
      preload: [
        'bash',
        'css',
        'html',
        'javascript',
        'json',
        'markdown',
        'scss',
        'typescript',
        'jsx',
        'tsx',
        'yaml',
        'vue',
      ],
    },
  },
  svgo: {
    svgoConfig: {
      plugins: [
        { name: 'removeDimensions', params: true },
        { name: 'removeViewBox', params: false },
        {
          name: 'removeAttrs',
          params: {
            attrs: ['svg:fill', 'path:fill'],
          },
        },
      ],
    },
  },
})
