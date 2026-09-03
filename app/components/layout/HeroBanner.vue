<script setup lang="ts">
import { computed } from 'vue'
import { Sparkles, Heart, ChevronDown } from 'lucide-vue-next'

interface Props {
  title?: string
  subtitle?: string
  bgImage?: string
  bgImageLight?: string
  bgImageDark?: string
  height?: 'sm' | 'md' | 'lg' | 'full'
  showWave?: boolean
  showArrow?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  title: '神秘花园 · 晴空之下',
  subtitle: '漫步夏日微风 · 记录全栈探索 · 沉淀技术与美学思考',
  bgImage: undefined,
  bgImageLight: '/images/banner-light.png',
  bgImageDark: '/images/banner-night.png',
  height: 'lg',
  showWave: true,
  showArrow: undefined
})

const colorMode = useColorMode()

const currentBgImage = computed(() => {
  const isDark = colorMode.value === 'dark'
  if (isDark) {
    if (props.bgImageDark) return props.bgImageDark
    if (props.bgImage && props.bgImage !== '/images/banner.png') return props.bgImage
    return '/images/banner-night.png'
  }
  if (props.bgImageLight) return props.bgImageLight
  if (props.bgImage && props.bgImage !== '/images/banner.png') return props.bgImage
  return '/images/banner-light.png'
})

const isLarge = computed(() => props.height === 'lg' || props.height === 'full')

const shouldShowArrow = computed(() => {
  if (props.showArrow !== undefined) return props.showArrow
  return isLarge.value
})

const heightClass = computed(() => {
  switch (props.height) {
    case 'sm': return 'h-60 sm:h-72 min-h-[260px]'
    case 'md': return 'h-[44vh] sm:h-[48vh] min-h-[360px] sm:min-h-[400px]'
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
    <!-- 1. 背景壁纸大图 + 底部渐隐羽化蒙版 (从清晰到完全透明渐隐，透出下方全局壁纸) -->
    <div
      class="absolute inset-0 bg-cover bg-no-repeat transition-all duration-700 ease-out transform scale-100"
      :style="{
        backgroundImage: `url(${currentBgImage})`,
        backgroundPosition: 'center 25%',
        maskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 45%, rgba(0,0,0,0) 100%)',
        WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 45%, rgba(0,0,0,0) 100%)'
      }"
    />

    <!-- 2. 半透明玻璃遮罩与主色调微光渐变 -->
    <div class="absolute inset-0 bg-gradient-to-b from-sky-950/40 via-transparent to-sky-950/50 pointer-events-none" />

    <!-- 3. 光晕装饰微粒 (蔚蓝 + 珊瑚粉双色光晕) -->
    <div class="absolute top-1/4 left-1/4 w-96 h-96 bg-sky-400/20 rounded-full blur-3xl pointer-events-none" />
    <div class="absolute top-1/3 right-1/4 w-80 h-80 bg-rose-400/15 rounded-full blur-3xl pointer-events-none" />

    <!-- 4. 居中文案内容 -->
    <div class="relative h-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-center items-center text-center pt-24 sm:pt-28 pb-14 sm:pb-20 z-10">
      <div
        v-motion
        :initial="{ opacity: 0, y: 24 }"
        :enter="{ opacity: 1, y: 0, transition: { duration: 600, ease: 'easeOut' } }"
        class="space-y-3 text-white max-w-2xl"
      >
        <!-- 标签气泡 -->
        <div class="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-mono bg-white/20 dark:bg-black/40 backdrop-blur-md border border-white/30 text-white shadow-md">
          <Sparkles class="w-3.5 h-3.5 text-sky-300 animate-pulse" />
          <span class="tracking-widest font-semibold">MYSTIC GARDEN · AZURE POP</span>
          <Heart class="w-3 h-3 text-rose-400 fill-rose-400" />
        </div>

        <!-- 标题 -->
        <h1
          :class="[
            'font-black tracking-tight drop-shadow-xl text-white',
            isLarge
              ? 'text-3xl sm:text-5xl lg:text-6xl'
              : 'text-2xl sm:text-3xl lg:text-4xl'
          ]"
        >
          <span class="bg-gradient-to-r from-white via-sky-100 to-rose-100 bg-clip-text text-transparent">
            {{ title }}
          </span>
        </h1>

        <!-- 副标题 / 描述 -->
        <p class="text-xs sm:text-sm text-sky-50/90 font-light drop-shadow-md tracking-wider max-w-xl mx-auto leading-relaxed">
          {{ subtitle }}
        </p>

        <!-- 向下滚动指引箭头 -->
        <div v-if="shouldShowArrow" class="pt-3">
          <button
            type="button"
            class="p-2 rounded-full bg-white/20 hover:bg-white/30 text-white backdrop-blur-md transition-all duration-300 hover:scale-110 animate-bounce"
            title="向下浏览"
            @click="scrollToContent"
          >
            <ChevronDown class="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>

    <!-- 5. 🌊 纯透明动态波浪过渡层 (波浪向底部 0% 透明度渐隐，作为自然过渡桥梁) -->
    <div
      v-if="showWave"
      class="absolute bottom-0 inset-x-0 w-full h-14 sm:h-20 lg:h-24 pointer-events-none z-20 overflow-hidden leading-none"
    >
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
          <!-- 亮色透明过渡波浪渐变 (顶部带白光，底部 100% 透明) -->
          <linearGradient id="wave-grad-light-1" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#ffffff" stop-opacity="0.25" />
            <stop offset="100%" stop-color="#ffffff" stop-opacity="0" />
          </linearGradient>
          <linearGradient id="wave-grad-light-2" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#ffffff" stop-opacity="0.4" />
            <stop offset="100%" stop-color="#ffffff" stop-opacity="0" />
          </linearGradient>
          <linearGradient id="wave-grad-light-3" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#ffffff" stop-opacity="0.6" />
            <stop offset="100%" stop-color="#ffffff" stop-opacity="0" />
          </linearGradient>
          <linearGradient id="wave-grad-light-4" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#ffffff" stop-opacity="0.8" />
            <stop offset="100%" stop-color="#ffffff" stop-opacity="0" />
          </linearGradient>

          <!-- 暗色透明过渡波浪渐变 (顶部冷青微光，底部 100% 透明) -->
          <linearGradient id="wave-grad-dark-1" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#38bdf8" stop-opacity="0.15" />
            <stop offset="100%" stop-color="#070c18" stop-opacity="0" />
          </linearGradient>
          <linearGradient id="wave-grad-dark-2" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#38bdf8" stop-opacity="0.25" />
            <stop offset="100%" stop-color="#070c18" stop-opacity="0" />
          </linearGradient>
          <linearGradient id="wave-grad-dark-3" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#070c18" stop-opacity="0.5" />
            <stop offset="100%" stop-color="#070c18" stop-opacity="0" />
          </linearGradient>
          <linearGradient id="wave-grad-dark-4" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#070c18" stop-opacity="0.8" />
            <stop offset="100%" stop-color="#070c18" stop-opacity="0" />
          </linearGradient>
        </defs>

        <!-- 亮色模式透明波浪 -->
        <g class="parallax dark:hidden">
          <use xlink:href="#gentle-wave" x="48" y="0" fill="url(#wave-grad-light-1)" class="wave-layer-1" />
          <use xlink:href="#gentle-wave" x="48" y="3" fill="url(#wave-grad-light-2)" class="wave-layer-2" />
          <use xlink:href="#gentle-wave" x="48" y="5" fill="url(#wave-grad-light-3)" class="wave-layer-3" />
          <use xlink:href="#gentle-wave" x="48" y="7" fill="url(#wave-grad-light-4)" class="wave-layer-4" />
        </g>

        <!-- 暗色模式透明波浪 -->
        <g class="parallax hidden dark:block">
          <use xlink:href="#gentle-wave" x="48" y="0" fill="url(#wave-grad-dark-1)" class="wave-layer-1" />
          <use xlink:href="#gentle-wave" x="48" y="3" fill="url(#wave-grad-dark-2)" class="wave-layer-2" />
          <use xlink:href="#gentle-wave" x="48" y="5" fill="url(#wave-grad-dark-3)" class="wave-layer-3" />
          <use xlink:href="#gentle-wave" x="48" y="7" fill="url(#wave-grad-dark-4)" class="wave-layer-4" />
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
