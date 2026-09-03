<script setup lang="ts">
import { computed } from 'vue'
import {
  siOpenjdk,
  siPython,
  siJavascript,
  siTypescript,
  siHtml5,
  siCss,
  siNuxt,
  siVuedotjs,
  siTailwindcss,
  siVite,
  siSpringboot,
  siNodedotjs,
  siMysql,
  siRedis,
  siPrisma,
  siDocker,
  siLinux,
  siGit,
  siZod,
  siBilibili,
  siGithub,
  type SimpleIcon
} from 'simple-icons'
import { cn } from '~/utils/cn'

export type BrandName =
  | 'java'
  | 'python'
  | 'javascript'
  | 'typescript'
  | 'html'
  | 'css'
  | 'nuxt'
  | 'vue'
  | 'tailwindcss'
  | 'vite'
  | 'spring'
  | 'nodejs'
  | 'mysql'
  | 'redis'
  | 'prisma'
  | 'docker'
  | 'linux'
  | 'git'
  | 'zod'
  | 'bilibili'
  | 'github'

interface Props {
  name: BrandName
  size?: number | string
  className?: string
}

const props = withDefaults(defineProps<Props>(), {
  size: 20,
  className: ''
})

// 开源 Simple Icons 官方技术图标字典映射表
const ICONS_DICTIONARY: Record<BrandName, SimpleIcon> = {
  java: siOpenjdk,
  python: siPython,
  javascript: siJavascript,
  typescript: siTypescript,
  html: siHtml5,
  css: siCss,
  nuxt: siNuxt,
  vue: siVuedotjs,
  tailwindcss: siTailwindcss,
  vite: siVite,
  spring: siSpringboot,
  nodejs: siNodedotjs,
  mysql: siMysql,
  redis: siRedis,
  prisma: siPrisma,
  docker: siDocker,
  linux: siLinux,
  git: siGit,
  zod: siZod,
  bilibili: siBilibili,
  github: siGithub
}

const currentIcon = computed(() => ICONS_DICTIONARY[props.name] || siJavascript)
const sizePx = computed(() => (typeof props.size === 'number' ? `${props.size}px` : props.size))
const iconFillColor = computed(() => `#${currentIcon.value.hex}`)
</script>

<template>
  <span
    :class="cn('inline-flex items-center justify-center shrink-0 select-none', className)"
    :style="{ width: sizePx, height: sizePx }"
    :title="currentIcon.title"
  >
    <!-- 单一标准 SVG 模板：直接渲染开源 simple-icons 官方矢量 Path 与原版品牌色 -->
    <svg
      role="img"
      viewBox="0 0 24 24"
      class="w-full h-full"
      :style="{ fill: iconFillColor }"
    >
      <path :d="currentIcon.path" />
    </svg>
  </span>
</template>
