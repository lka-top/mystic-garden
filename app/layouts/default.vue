<script setup lang="ts">
import Navbar from '~/components/layout/Navbar.vue'
import Footer from '~/components/layout/Footer.vue'
import Live2DWidget from '~/components/ui/Live2DWidget.vue'

// ⚡ 客户端空闲时智能静默预拉取热点数据 (提升导航点击时的 0ms 秒开率)
onMounted(() => {
  if (import.meta.client) {
    const prefetchHotData = () => {
      // 静默预热 Nitro SWR 缓存与网络通道
      Promise.allSettled([
        $fetch('/api/v1/articles', { params: { page: 1, pageSize: 8 } }),
        $fetch('/api/v1/notes', { params: { page: 1, pageSize: 15 } }),
        $fetch('/api/v1/categories')
      ]).catch(() => {})
    }

    if ('requestIdleCallback' in window) {
      // 在浏览器渲染空闲时静默执行
      window.requestIdleCallback(prefetchHotData, { timeout: 2000 })
    } else {
      setTimeout(prefetchHotData, 1500)
    }
  }
})
</script>

<template>
  <div class="min-h-screen flex flex-col relative selection:bg-brand-500/20 selection:text-brand-600 dark:selection:bg-brand-500/30 dark:selection:text-brand-300">
    <!-- 🖼️ 全局主视觉壁纸背景 (固定视口平铺) -->
    <div
      class="fixed inset-0 pointer-events-none bg-cover bg-center bg-no-repeat bg-fixed z-0 transition-opacity duration-700"
      style="background-image: url('/images/bg-main.webp');"
    />

    <!-- 🌌 通透毛玻璃与光影滤镜蒙层 (亮色晶莹通透 / 暗色深邃沉浸) -->
    <div class="fixed inset-0 pointer-events-none z-0 bg-white/45 dark:bg-[#070c18]/75 backdrop-blur-[2px] transition-colors duration-500" />
    <div class="fixed inset-0 pointer-events-none z-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sky-400/10 via-transparent to-rose-400/10 dark:from-sky-900/20 dark:to-transparent" />

    <!-- 悬浮吸顶导航栏 (内置 Mizuki 原地伸缩搜索框与下拉联想) -->
    <Navbar />

    <!-- 主体内容槽 -->
    <main class="relative z-10 flex-1 w-full pb-16">
      <slot />
    </main>

    <Footer />

    <!-- 🎭 Live2D 客户端看板娘 (SSR 水合安全) -->
    <ClientOnly>
      <Live2DWidget />
    </ClientOnly>
  </div>
</template>
