// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },

  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxtjs/color-mode',
    '@vueuse/nuxt',
    '@vueuse/motion/nuxt'
  ],
  experimental: {
    appManifest: false
  },

  vite: {
    server: {
      allowedHosts: true
    }
  },

  colorMode: {
    classSuffix: '',
    preference: 'system',
    fallback: 'light',
  },

  css: ['~/assets/css/main.css'],

  runtimeConfig: {
    jwtSecret: process.env.JWT_SECRET || 'luokai-garden-secret-jwt-key-2025',
    databaseUrl: process.env.DATABASE_URL,
    public: {
      siteName: '神秘花园',
      siteDescription: '记录思考、探索技术、沉淀生活的一方数字花园',
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL || 'http://localhost:3000',
      authorName: '神秘人',
      authorBio: '全栈开发者 / 探索 Web 现代美学与工程架构'
    }
  },

  app: {
    pageTransition: {
      name: 'page',
      mode: 'out-in'
    },
    head: {
      title: '神秘花园 - 记录思考与沉淀生活',
      titleTemplate: '%s | 神秘花园',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: '神秘花园 - 记录思考、探索技术、沉淀生活的一方数字花园' },
        { name: 'keywords', content: '神秘人, 博客, Nuxt3, Vue3, 前端开发, 全栈开发, 技术随笔, Bento Grid' }
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }
      ]
    }
  }
})
