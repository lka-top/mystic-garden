<script setup lang="ts">
import { computed } from 'vue'
import { Sparkles, Heart, ChevronDown } from 'lucide-vue-next'

interface Props {
  title?: string
  subtitle?: string
  bgImage?: string
  height?: 'sm' | 'md' | 'lg' | 'full'
  showWave?: boolean
  showArrow?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  title: '神秘花园 · 晴空之下',
  subtitle: '漫步夏日微风 · 记录全栈探索 · 沉淀技术与美学思考',
  bgImage: '',
  height: 'lg',
  showWave: true,
  showArrow: undefined
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

// 判断是否传入了特定自定义封面 (如文章特有封面)；若无则直接透出全局无缝壁纸
const isCustomCover = computed(() => Boolean(props.bgImage && props.bgImage !== '/images/bg-main.png'))

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
    <!-- 1. 背景层 (仅在文章拥有专属特色大图时渲染独立封面并带柔和渐隐；默认透出全局壁纸) -->
    <div
      v-if="isCustomCover"
      class="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-1000 ease-out transform scale-100"
      :style="{ backgroundImage: `url(${props.bgImage})` }"
    />

    <!-- 2. 半透明通透遮罩与微光光晕 (柔和融入全局壁纸) -->
    <div class="absolute inset-0 bg-gradient-to-b from-black/25 via-transparent to-black/35 dark:from-black/45 dark:via-transparent dark:to-black/60" />

    <!-- 3. 光晕装饰微粒 (蔚蓝 + 珊瑚粉双色光晕) -->
    <div class="absolute top-1/4 left-1/4 w-96 h-96 bg-sky-400/15 rounded-full blur-3xl pointer-events-none" />
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

    <!-- 5. 通透毛玻璃动态波浪过渡层 (半透光材质，告别实体纯色遮挡，与全局壁纸无缝融为一体) -->
    <div v-if="showWave" class="absolute bottom-0 inset-x-0 w-full h-12 sm:h-18 lg:h-20 pointer-events-none z-20 overflow-hidden leading-none">
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
          <!-- 波浪层 1 (透光微波) -->
          <use
            xlink:href="#gentle-wave"
            x="48"
            y="0"
            class="fill-white/10 dark:fill-white/5 wave-layer-1"
          />
          <!-- 波浪层 2 -->
          <use
            xlink:href="#gentle-wave"
            x="48"
            y="3"
            class="fill-white/15 dark:fill-slate-900/20 wave-layer-2"
          />
          <!-- 波浪层 3 -->
          <use
            xlink:href="#gentle-wave"
            x="48"
            y="5"
            class="fill-white/25 dark:fill-slate-900/35 wave-layer-3"
          />
          <!-- 波浪层 4 (柔和半透光毛玻璃层) -->
          <use
            xlink:href="#gentle-wave"
            x="48"
            y="7"
            class="fill-white/35 dark:fill-slate-900/50 wave-layer-4"
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
