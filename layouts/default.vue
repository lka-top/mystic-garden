<script setup lang="ts">
import Navbar from '~/components/layout/Navbar.vue'
import Footer from '~/components/layout/Footer.vue'
</script>

<template>
  <div class="min-h-screen flex flex-col bg-[#fafafa] dark:bg-[#09090b] text-zinc-900 dark:text-zinc-100 transition-colors selection:bg-brand-500/20 selection:text-brand-700">
    <!-- 背景轻微点阵装饰 -->
    <div class="fixed inset-0 pointer-events-none bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] dark:bg-[radial-gradient(#27272a_1px,transparent_1px)] [background-size:24px_24px] opacity-60 z-0" />

    <Navbar />

    <main class="relative z-10 flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 pt-8 pb-16">
      <slot />
    </main>

    <Footer />
  </div>
</template>
