<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { Sparkles, Heart, ChevronDown } from 'lucide-vue-next'
import ShadertoyBackdrop from '~/components/ui/ShadertoyBackdrop.vue'
import cloudSeaImageSource from '~/assets/shaders/cloud-sea/image.frag?raw'
import cloudSeaBufferSource from '~/assets/shaders/cloud-sea/buffer-a.frag?raw'

interface Props {
  title?: string
  subtitle?: string
  bgImage?: string
  bgImageLight?: string
  bgImageDark?: string
  height?: 'sm' | 'md' | 'lg' | 'full'
  showWave?: boolean
  showArrow?: boolean
  /** 是否启用 Shadertoy 云海动画层（渐进增强：静态壁纸仍为首屏兜底），默认关闭，仅在需要的页面显式开启 */
  useShader?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  title: '神秘花园 · 晴空之下',
  subtitle: '漫步夏日微风 · 记录全栈探索 · 沉淀技术与美学思考',
  bgImage: undefined,
  bgImageLight: '/images/banner-light.webp',
  bgImageDark: '/images/banner-night.webp',
  height: 'lg',
  showWave: true,
  showArrow: undefined,
  useShader: false
})

const lightBannerImage = computed(() => {
  if (props.bgImage && props.bgImage !== '/images/banner.webp') return props.bgImage
  return props.bgImageLight || '/images/banner-light.webp'
})

const darkBannerImage = computed(() => {
  if (props.bgImage && props.bgImage !== '/images/banner.webp') return props.bgImage
  return props.bgImageDark || '/images/banner-night.webp'
})

const isLarge = computed(() => props.height === 'lg' || props.height === 'full')

// 着色器首帧渲染成功后隐藏静态壁纸，避免两种画风在半透明区段混杂；
// 着色器未启用/初始化失败时该状态恒为 false，静态壁纸保持兜底
const shaderReady = ref(false)

// 日落 ↔ 星夜 混合系数（0=日落 1=深夜），跟随站点亮暗主题平滑过渡
const colorMode = useColorMode()
const isDark = computed(() => colorMode.value === 'dark')
const nightBlend = ref(0)
let blendTweenRaf = 0

const animateNightBlend = (target: number) => {
  cancelAnimationFrame(blendTweenRaf)
  const startTime = performance.now()
  const from = nightBlend.value
  const step = (now: number) => {
    const k = Math.min((now - startTime) / 900, 1)
    nightBlend.value = from + (target - from) * k
    if (k < 1) blendTweenRaf = requestAnimationFrame(step)
  }
  blendTweenRaf = requestAnimationFrame(step)
}

onMounted(() => {
  nightBlend.value = isDark.value ? 1 : 0
})

watch(isDark, (dark) => {
  animateNightBlend(dark ? 1 : 0)
})

onBeforeUnmount(() => cancelAnimationFrame(blendTweenRaf))

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
    <!-- 1. 白天/浅色模式壁纸 (纯 CSS 原生控制，0ms 响应，零水合延迟；着色器就绪后淡出) -->
    <div
      class="absolute inset-0 bg-cover bg-no-repeat transition-opacity duration-700 ease-out opacity-100 dark:opacity-0 pointer-events-none transform scale-100"
      :style="{
        backgroundImage: `url(${lightBannerImage})`,
        backgroundPosition: 'center 25%',
        maskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 45%, rgba(0,0,0,0) 100%)',
        WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 45%, rgba(0,0,0,0) 100%)',
        opacity: shaderReady ? 0 : undefined
      }"
    />

    <!-- 2. 黑夜/深色模式壁纸 (纯 CSS 原生控制，在 Night 模式打开瞬间 0 延迟生效；着色器就绪后淡出) -->
    <div
      class="absolute inset-0 bg-cover bg-no-repeat transition-opacity duration-700 ease-out opacity-0 dark:opacity-100 pointer-events-none transform scale-100"
      :style="{
        backgroundImage: `url(${darkBannerImage})`,
        backgroundPosition: 'center 25%',
        maskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 45%, rgba(0,0,0,0) 100%)',
        WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 45%, rgba(0,0,0,0) 100%)',
        opacity: shaderReady ? 0 : undefined
      }"
    />

    <!-- 2.5 ☁️ Shadertoy 云海动画层 (渐进增强：仅在客户端挂载，首帧渲染成功后渐入；
         静态壁纸保留在下层作为 0ms 首屏与降级兜底，本层失败/不支持时完全不影响页面) -->
    <ClientOnly v-if="useShader">
      <ShadertoyBackdrop
        :image-source="cloudSeaImageSource"
        :buffer-source="cloudSeaBufferSource"
        :night-blend="nightBlend"
        :buffer-channels="[
          { url: '/textures/blue_noise.png', wrap: 'repeat' },
          'feedback'
        ]"
        class="pointer-events-none"
        :style="{
          maskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 45%, rgba(0,0,0,0) 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 45%, rgba(0,0,0,0) 100%)'
        }"
        @ready="shaderReady = true"
      />
    </ClientOnly>

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
          <span class="bg-gradient-to-r from-white via-sky-100 to-rose-100 bg-clip-text text-transparent block dark:hidden">
            {{ title }}
          </span>
          <span class="bg-gradient-to-r from-white via-indigo-100 to-purple-200 bg-clip-text text-transparent hidden dark:block">
            {{ title === '神秘花园 · 晴空之下' ? '神秘花园 · 星夜之畔' : title }}
          </span>
        </h1>

        <!-- 副标题 / 描述 -->
        <p class="text-xs sm:text-sm text-sky-50/90 font-light drop-shadow-md tracking-wider max-w-xl mx-auto leading-relaxed block dark:hidden">
          {{ subtitle }}
        </p>
        <p class="text-xs sm:text-sm text-indigo-100/90 font-light drop-shadow-md tracking-wider max-w-xl mx-auto leading-relaxed hidden dark:block">
          {{ subtitle === '漫步夏日微风 · 记录全栈探索 · 沉淀技术与美学思考' ? '仰望浩瀚星海 · 记录全栈探索 · 沉淀技术与美学思考' : subtitle }}
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
