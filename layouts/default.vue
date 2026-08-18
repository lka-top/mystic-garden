<script setup lang="ts">
import Navbar from '~/components/layout/Navbar.vue'
import Footer from '~/components/layout/Footer.vue'
</script>

<template>
  <div class="min-h-screen flex flex-col transition-colors selection:bg-brand-500/20 selection:text-brand-600 dark:selection:bg-brand-500/30 dark:selection:text-brand-300">
    <!-- 背景轻微点阵装饰 -->
    <div class="fixed inset-0 pointer-events-none bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] dark:bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] opacity-40 z-0" />

    <!-- 悬浮吸顶导航栏 (内置 Mizuki 原地伸缩搜索框与下拉联想) -->
    <Navbar />

    <!-- 主体内容槽 -->
    <main class="relative z-10 flex-1 w-full pb-16">
      <slot />
    </main>

    <Footer />
  </div>
</template>
