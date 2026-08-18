<script setup lang="ts">
import { Sparkles, Heart, ChevronDown } from 'lucide-vue-next'

interface Props {
  title?: string
  subtitle?: string
  bgImage?: string
  height?: 'sm' | 'md' | 'lg' | 'full'
  showWave?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  title: '神秘花园 · 晴空之下',
  subtitle: '漫步夏日微风 · 记录全栈探索 · 沉淀技术与美学思考',
  bgImage: '/images/banner.png',
  height: 'lg',
  showWave: true
})

const heightClass = computed(() => {
  switch (props.height) {
    case 'sm': return 'h-56 sm:h-64'
    case 'md': return 'h-72 sm:h-88'
    case 'full': return 'h-screen min-h-[640px]'
    case 'lg':
    default:
      return 'h-[65vh] sm:h-[75vh] lg:h-[82vh] min-h-[520px]'
  }
})

function scrollToContent() {
  const contentEl = document.getElementById('main-content')
  if (contentEl) {
    contentEl.scrollIntoView({ behavior: 'smooth' })
  } else {
    window.scrollTo({ top: window.innerHeight * 0.75, behavior: 'smooth' })
  }
}
</script>

<template>
  <div :class="['relative w-full overflow-hidden select-none transition-all duration-500', heightClass]">
    <!-- 1. 背景壁纸大图 + 视差微缩放 -->
    <div
      class="absolute inset-0 bg-cover bg-no-repeat transition-transform duration-1000 ease-out transform scale-100"
      :style="{ backgroundImage: `url(${bgImage})`, backgroundPosition: 'center 25%' }"
    />

    <!-- 2. 半透明玻璃遮罩与主色调微光渐变 -->
    <div class="absolute inset-0 bg-gradient-to-b from-sky-950/40 via-transparent to-sky-950/60" />

    <!-- 3. 光晕装饰微粒 (蔚蓝 + 珊瑚粉双色光晕) -->
    <div class="absolute top-1/4 left-1/4 w-96 h-96 bg-sky-400/25 rounded-full blur-3xl pointer-events-none" />
    <div class="absolute top-1/3 right-1/4 w-80 h-80 bg-rose-400/20 rounded-full blur-3xl pointer-events-none" />

    <!-- 4. 居中文案内容 -->
    <div class="relative h-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-center items-center text-center pb-16 sm:pb-24 z-10">
      <div
        v-motion
        :initial="{ opacity: 0, y: 30 }"
        :enter="{ opacity: 1, y: 0, transition: { duration: 700, ease: 'easeOut' } }"
        class="space-y-4 text-white max-w-2xl"
      >
        <div class="inline-flex items-center gap-1.5 px-4 py-1 rounded-full text-xs font-mono bg-white/20 dark:bg-black/40 backdrop-blur-md border border-white/30 text-white shadow-md">
          <Sparkles class="w-3.5 h-3.5 text-sky-300 animate-pulse" />
          <span class="tracking-widest font-semibold">MYSTIC GARDEN · AZURE SUMMER</span>
          <Heart class="w-3 h-3 text-rose-400 fill-rose-400" />
        </div>

        <h1 class="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight drop-shadow-xl text-white">
          <span class="bg-gradient-to-r from-white via-sky-100 to-rose-100 bg-clip-text text-transparent">
            {{ title }}
          </span>
        </h1>

        <p class="text-sm sm:text-base text-sky-50/95 font-light drop-shadow-md tracking-wider max-w-xl mx-auto">
          {{ subtitle }}
        </p>

        <!-- 向下滚动指引箭头 -->
        <div class="pt-4">
          <button
            type="button"
            class="p-2.5 rounded-full bg-white/20 hover:bg-white/30 text-white backdrop-blur-md transition-all duration-300 hover:scale-110 animate-bounce"
            title="向下浏览"
            @click="scrollToContent"
          >
            <ChevronDown class="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>

    <!-- 5. Mizuki 风格动态波浪过渡层 (Animated SVG Waves) -->
    <div v-if="showWave" class="absolute bottom-0 inset-x-0 w-full h-14 sm:h-20 lg:h-24 pointer-events-none z-20 overflow-hidden leading-none">
      <svg
        class="waves w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink"
        viewBox="0 24 150 28"
        preserveAspectRatio="none"
        shape-rendering="auto"
      >
        <defs>
          <path
            id="gentle-wave"
            d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z"
          />
        </defs>
        <g class="parallax">
          <!-- 波浪层 1 -->
          <use
            xlink:href="#gentle-wave"
            x="48"
            y="0"
            class="fill-[#f6f9fc] dark:fill-[#0b1120] opacity-25 wave-layer-1"
          />
          <!-- 波浪层 2 -->
          <use
            xlink:href="#gentle-wave"
            x="48"
            y="3"
            class="fill-[#f6f9fc] dark:fill-[#0b1120] opacity-50 wave-layer-2"
          />
          <!-- 波浪层 3 -->
          <use
            xlink:href="#gentle-wave"
            x="48"
            y="5"
            class="fill-[#f6f9fc] dark:fill-[#0b1120] opacity-75 wave-layer-3"
          />
          <!-- 波浪层 4 (100% 实体无缝衔接底色) -->
          <use
            xlink:href="#gentle-wave"
            x="48"
            y="7"
            class="fill-[#f6f9fc] dark:fill-[#0b1120] opacity-100 wave-layer-4"
          />
        </g>
      </svg>
    </div>
  </div>
</template>

<style scoped>
@keyframes move-forever {
  0% {
    transform: translate3d(-90px, 0, 0);
  }
  100% {
    transform: translate3d(85px, 0, 0);
  }
}

.wave-layer-1 {
  animation: move-forever 25s cubic-bezier(0.55, 0.5, 0.45, 0.5) infinite;
}
.wave-layer-2 {
  animation: move-forever 18s cubic-bezier(0.55, 0.5, 0.45, 0.5) -5s infinite;
}
.wave-layer-3 {
  animation: move-forever 12s cubic-bezier(0.55, 0.5, 0.45, 0.5) -3s infinite;
}
.wave-layer-4 {
  animation: move-forever 7s cubic-bezier(0.55, 0.5, 0.45, 0.5) -2s infinite;
}
</style>
