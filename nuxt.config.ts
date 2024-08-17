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
    head: {
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
      htmlAttrs: { lang: 'ko' },
      title: 'dogyeong.me',
      link: [
        { rel: 'apple-touch-icon-precomposed', sizes: '57x57', href: '/favicon/apple-touch-icon-57x57.png' },
        {
          rel: 'apple-touch-icon-precomposed',
          sizes: '114x114',
          href: '/favicon/apple-touch-icon-114x114.png',
        },
        { rel: 'apple-touch-icon-precomposed', sizes: '72x72', href: '/favicon/apple-touch-icon-72x72.png' },
        {
          rel: 'apple-touch-icon-precomposed',
          sizes: '144x144',
          href: '/favicon/apple-touch-icon-144x144.png',
        },
        { rel: 'apple-touch-icon-precomposed', sizes: '60x60', href: '/favicon/apple-touch-icon-60x60.png' },
        {
          rel: 'apple-touch-icon-precomposed',
          sizes: '120x120',
          href: '/favicon/apple-touch-icon-120x120.png',
        },
        { rel: 'apple-touch-icon-precomposed', sizes: '76x76', href: '/favicon/apple-touch-icon-76x76.png' },
        {
          rel: 'apple-touch-icon-precomposed',
          sizes: '152x152',
          href: '/favicon/apple-touch-icon-152x152.png',
        },
        { rel: 'icon', type: 'image/png', href: '/favicon/favicon-196x196.png', sizes: '196x196' },
        { rel: 'icon', type: 'image/png', href: '/favicon/favicon-96x96.png', sizes: '96x96' },
        { rel: 'icon', type: 'image/png', href: '/favicon/favicon-32x32.png', sizes: '32x32' },
        { rel: 'icon', type: 'image/png', href: '/favicon/favicon-16x16.png', sizes: '16x16' },
        { rel: 'icon', type: 'image/png', href: '/favicon/favicon-128.png', sizes: '128x128' },
      ],
      meta: [
        { name: 'application-name', content: 'dogyeong.me' },
        { name: 'msapplication-TileColor', content: '#FFFFFF' },
        { name: 'msapplication-TileImage', content: '/favicon/mstile-144x144.png' },
        { name: 'msapplication-square70x70logo', content: '/favicon/mstile-70x70.png' },
        { name: 'msapplication-square150x150logo', content: '/favicon/mstile-150x150.png' },
        { name: 'msapplication-wide310x150logo', content: '/favicon/mstile-310x150.png' },
        { name: 'msapplication-square310x310logo', content: '/favicon/mstile-310x310.png' },
      ],
    },
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

  compatibilityDate: '2024-08-17',
})
