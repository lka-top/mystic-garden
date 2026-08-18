<script setup lang="ts">
import { Sparkles, Heart } from 'lucide-vue-next'

interface Props {
  title?: string
  subtitle?: string
  bgImage?: string
  height?: 'sm' | 'md' | 'lg'
}

const props = withDefaults(defineProps<Props>(), {
  title: '神秘花园 · 晴空之下',
  subtitle: '漫步夏日微风 · 记录全栈探索 · 沉淀技术与美学思考',
  bgImage: '/images/banner.jpg',
  height: 'md'
})

const heightClass = computed(() => {
  switch (props.height) {
    case 'sm': return 'h-48 sm:h-56'
    case 'lg': return 'h-80 sm:h-96'
    default: return 'h-64 sm:h-80'
  }
})
</script>

<template>
  <div :class="['relative w-full overflow-hidden select-none transition-all duration-500 rounded-b-3xl sm:rounded-b-4xl shadow-lg', heightClass]">
    <!-- 1. 背景壁纸大图 + 缓慢视差缩放 -->
    <div
      class="absolute inset-0 bg-cover bg-center transition-transform duration-1000 ease-out transform scale-105"
      :style="{ backgroundImage: `url(${bgImage})` }"
    />

    <!-- 2. 半透明玻璃遮罩与主色调渐变 -->
    <div class="absolute inset-0 bg-gradient-to-b from-sky-950/40 via-black/20 to-[#f6f9fc] dark:to-[#0b1120]" />

    <!-- 3. 光晕装饰微粒 (蔚蓝 + 珊瑚粉双色光晕) -->
    <div class="absolute top-1/4 left-1/4 w-80 h-80 bg-sky-400/25 rounded-full blur-3xl pointer-events-none" />
    <div class="absolute top-1/3 right-1/4 w-72 h-72 bg-rose-400/20 rounded-full blur-3xl pointer-events-none" />

    <!-- 4. 居中/底部标题与标语文案 -->
    <div class="relative h-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-end pb-8 sm:pb-12 z-10">
      <div
        v-motion
        :initial="{ opacity: 0, y: 20 }"
        :enter="{ opacity: 1, y: 0, transition: { duration: 600, ease: 'easeOut' } }"
        class="space-y-2 text-white"
      >
        <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono bg-white/20 dark:bg-black/30 backdrop-blur-md border border-white/25 text-white/90 shadow-xs">
          <Sparkles class="w-3.5 h-3.5 text-sky-300 animate-pulse" />
          <span class="tracking-wider">AZURE POP & DIGITAL GARDEN</span>
          <Heart class="w-3 h-3 text-rose-400 fill-rose-400" />
        </div>
        <h1 class="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight drop-shadow-lg text-white">
          <span class="bg-gradient-to-r from-white via-sky-100 to-rose-100 bg-clip-text text-transparent">
            {{ title }}
          </span>
        </h1>
        <p class="text-xs sm:text-sm text-sky-50/90 font-light max-w-xl drop-shadow-xs tracking-wide">
          {{ subtitle }}
        </p>
      </div>
    </div>

    <!-- 5. 底部羽化渐变遮罩 (无缝交融到底部容器) -->
    <div class="absolute bottom-0 inset-x-0 h-16 bg-gradient-to-t from-[#f6f9fc] dark:from-[#0b1120] to-transparent pointer-events-none" />
  </div>
</template>
