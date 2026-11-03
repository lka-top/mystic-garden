// https://nuxt.com/docs/api/configuration/nuxt-config
import { fileURLToPath } from 'node:url'

const resolvedBackendUrl = (
  process.env.NUXT_BACKEND_URL
  ?? process.env.BACKEND_URL
  ?? (process.env.NODE_ENV !== 'production' ? 'http://127.0.0.1:8080' : '')
).trim()

export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  future: {
    compatibilityVersion: 4
  },
  alias: {
    '~/types': fileURLToPath(new URL('./shared/types', import.meta.url)),
    '#shared': fileURLToPath(new URL('./shared', import.meta.url)),
    '~/server': fileURLToPath(new URL('./server', import.meta.url))
  },
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

  // 路由规则：API 缓存统一由 Spring Boot Caffeine (@Cacheable / @CacheEvict) 托管，
  // 禁用 Nitro 层 /api/** 二级 SWR 缓存，避免双层缓存不一致及开发态旧磁盘缓存污染。
  routeRules: {
    '/api/**': { cache: false },

    // 后台管理面板走纯客户端 SPA 模式，确保实时管理
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
    backendUrl: resolvedBackendUrl,
    jwtSecret: process.env.JWT_SECRET || '',
    databaseUrl: process.env.DATABASE_URL,
    noteSyncToken: process.env.NUXT_NOTE_SYNC_TOKEN || process.env.NOTE_SYNC_TOKEN,
    public: {
      siteName: '神秘花园',
      siteDescription: '记录游戏体验、兴趣爱好、知识笔记和生活随想，偶尔分享一些技术内容',
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL || 'http://mysgarden.top',
      icpNumber: process.env.NUXT_PUBLIC_ICP_NUMBER || '蜀ICP备2026049694号',
      authorName: 'lka',
      authorBio: '喜欢游戏和各种有意思的事，也偶尔写点代码',
      authorAvatar: '/images/avatar.webp'
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
      title: '神秘花园 - 游戏、兴趣与日常',
      titleTemplate: '%s | 神秘花园',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: '神秘花园 - 记录游戏体验、兴趣爱好、知识笔记和生活随想' },
        { name: 'keywords', content: 'lka, 个人博客, 游戏随笔, 游戏攻略, 兴趣分享, 知识笔记, 技术记录' }
      ],
      link: [
        { rel: 'icon', type: 'image/png', href: '/favicon.png' },
        { rel: 'alternate', type: 'application/rss+xml', title: '神秘花园 RSS Feed', href: '/feed.xml' },
        { rel: 'sitemap', type: 'application/xml', title: 'Sitemap', href: '/sitemap.xml' }
      ]
    }
  }
})
