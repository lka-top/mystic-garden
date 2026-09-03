<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import type { Widget } from 'l2d-widget'

let widgetInstance: Widget | null = null

onMounted(async () => {
  if (!import.meta.client) return

  // 移动端体验优化：屏幕宽度小于 768px 时静默不初始化以节省移动端带宽与算力
  if (window.innerWidth < 768) return

  try {
    console.log('[Live2D] 🚀 正在按官方规范加载 l2d-widget...')
    const { createWidget } = await import('l2d-widget')

    widgetInstance = createWidget({
      position: 'bottom-left',
      size: { width: 300, height: 360 },
      primaryColor: '#0ea5e9',
      transitionType: 'slide',
      transitionDuration: 800,
      model: [
        {
          path: '/live2d/Senko_Normals/senko.model3.json',
          scale: 0.12,
          offset: [-0.05, 0.05],
          tips: {
            welcomeMessage: [
              '欢迎来到神秘花园！',
              '今天也是充满美好的一天呢~',
              '漫步在数字花园中，记录全栈探索与生活思考。'
            ],
            messages: [
              '漫步在数字花园中，享受技术与美学吧~',
              '博客采用 Nuxt 4 + TailwindCSS 架构构建哦~',
              '累了的话就稍微喝杯红茶休息一下吧~'
            ],
            duration: 3500,
            interval: 6000
          }
        },
        {
          path: '/live2d/cat-black/model.json',
          scale: 0.15,
          offset: [0, 0.05],
          tips: {
            welcomeMessage: ['喵呜~ 欢迎来到神秘花园！', '蹭蹭你的手手~'],
            messages: [
              '呼噜呼噜~',
              '今天也抓到小鱼干了吗？',
              '喵喵~ 今天也要元气满满哦！'
            ],
            duration: 3500,
            interval: 6000
          }
        },
        {
          path: 'https://fastly.jsdelivr.net/gh/hacxy/l2d-models@main/models/shizuku/shizuku.model.json',
          scale: 0.2,
          offset: [0.15, 0.15],
          tips: {
            welcomeMessage: ['你好呀，欢迎来到神秘花园！'],
            messages: ['今天也要元气满满哦~', '有任何想了解的技术都可以去关于页面看看呢~']
          }
        }
      ],
      menus: {
        align: 'right',
        extraItems: [
          {
            label: '关于看板娘',
            icon: 'mdi:information-outline',
            onClick: () => {
              window.open('https://oml2d.hacxy.cn/', '_blank')
            }
          }
        ]
      }
    })
  } catch (error) {
    console.warn('[Live2D] Failed to initialize l2d-widget:', error)
  }
})

onUnmounted(() => {
  if (widgetInstance) {
    try {
      widgetInstance.destroy()
    } catch (_) {}
    widgetInstance = null
  }
})
</script>

<template>
  <div class="live2d-widget-container select-none pointer-events-none" />
</template>
