// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },

  modules: [
    '@nuxt/eslint',
    '@nuxtjs/tailwindcss',
    '@nuxtjs/color-mode',
    '@vueuse/nuxt',
    '@vueuse/motion/nuxt'
  ],
  experimental: {
    appManifest: false
  },

  // 全站 SWR 内存高速缓存与路由性能规则
  routeRules: {
    // 1. 公开数据接口开启 SWR 内存缓存 (Stale-While-Revalidate)
    '/api/v1/stats/**': { swr: 60, cache: { maxAge: 60 } },
    '/api/v1/categories/**': { swr: 120, cache: { maxAge: 120 } },
    '/api/v1/notebooks/**': { swr: 120, cache: { maxAge: 120 } },
    '/api/v1/tags/**': { swr: 120, cache: { maxAge: 120 } },
    '/api/v1/articles/**': { swr: 30, cache: { maxAge: 30 } },
    '/api/v1/notes/**': { swr: 30, cache: { maxAge: 30 } },
    '/api/v1/essays/**': { swr: 30, cache: { maxAge: 30 } },

    // 2. 后台管理面板走纯客户端 SPA 模式，确保实时管理
    '/admin/**': { ssr: false }
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
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL || 'http://mysgarden.top',
      icpNumber: process.env.NUXT_PUBLIC_ICP_NUMBER || '蜀ICP备2026049694号',
      authorName: 'lka',
      authorBio: '全栈开发者 / 探索 Web 现代美学与工程架构'
    }
  },

  app: {
    pageTransition: {
      name: 'page',
      mode: 'out-in'
    },
    layoutTransition: {
      name: 'layout',
      mode: 'out-in'
    },
    head: {
      title: '神秘花园 - 记录思考与沉淀生活',
      titleTemplate: '%s | 神秘花园',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: '神秘花园 - 记录思考、探索技术、沉淀生活的一方数字花园' },
        { name: 'keywords', content: 'lka, 博客, Nuxt3, Vue3, 前端开发, 全栈开发, 技术随笔, Bento Grid' }
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        { rel: 'alternate', type: 'application/rss+xml', title: '神秘花园 RSS Feed', href: '/feed.xml' },
        { rel: 'sitemap', type: 'application/xml', title: 'Sitemap', href: '/sitemap.xml' }
      ]
    }
  }
})
