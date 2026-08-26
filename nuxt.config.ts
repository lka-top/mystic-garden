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
    // ⚠️ 仅可对「纯 GET 只读」接口开启 SWR：
    // Nitro 的 routeRules 缓存不区分 HTTP 方法（POST/PUT 会读到 GET 的缓存体），
    // 且会剥离请求头（Authorization 丢失 → 写接口恒 401）。
    // articles/notes/essays/categories/tags/notebooks 等带写方法的资源路径禁止配置缓存。
    '/api/v1/stats/**': { swr: 60, cache: { maxAge: 60 } },

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
    jwtSecret: process.env.JWT_SECRET,
    databaseUrl: process.env.DATABASE_URL,
    public: {
      siteName: '神秘花园',
      siteDescription: '记录思考、探索技术、沉淀生活的一方数字花园',
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL || 'http://mysgarden.top',
      icpNumber: process.env.NUXT_PUBLIC_ICP_NUMBER || '蜀ICP备2026049694号',
      authorName: '神秘人',
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
        { name: 'keywords', content: '神秘人, 博客, Nuxt3, Vue3, 前端开发, 全栈开发, 技术随笔, Bento Grid' }
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        { rel: 'alternate', type: 'application/rss+xml', title: '神秘花园 RSS Feed', href: '/feed.xml' },
        { rel: 'sitemap', type: 'application/xml', title: 'Sitemap', href: '/sitemap.xml' }
      ]
    }
  }
})
