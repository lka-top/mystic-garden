<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import type { Widget } from 'l2d-widget'

let widgetInstance: Widget | null = null
let currentModelIndex = 0

const models = [
  {
    path: 'https://model.hacxy.cn/cat-black/model.json',
    scale: 0.15,
    offset: [0, 0] as [number, number],
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
    path: 'https://model.hacxy.cn/shizuku/shizuku.model.json',
    scale: 0.2,
    offset: [0, 0] as [number, number],
    tips: {
      welcomeMessage: ['你好呀，欢迎来到神秘花园！'],
      messages: ['今天也要元气满满哦~', '有任何想了解的技术都可以去关于页面看看呢~']
    }
  },
  {
    path: 'https://model.hacxy.cn/umaru/model.json',
    scale: 0.18,
    offset: [0, 0] as [number, number],
    tips: {
      welcomeMessage: ['可乐！薯片！还有神秘花园！'],
      messages: ['今天也要开开心心！', '累了就去读读博主的随笔吧~']
    }
  }
]

onMounted(async () => {
  if (!import.meta.client) return

  // 移动端体验优化：屏幕宽度小于 768px 时静默不初始化以节省移动端带宽与算力
  if (window.innerWidth < 768) return

  try {
    console.log('[Live2D] 🚀 正在按全量接管规范加载 l2d-widget...')
    const { createWidget } = await import('l2d-widget')

    widgetInstance = createWidget({
      position: 'bottom-left',
      size: { width: 300, height: 360 },
      primaryColor: '#0ea5e9',
      transitionType: 'slide',
      transitionDuration: 800,
      model: models,
      menus: {
        align: 'right',
        items: [
          {
            icon: 'mdi:shuffle-variant',
            label: '切换模型',
            onClick(widget) {
              currentModelIndex = (currentModelIndex + 1) % models.length
              widget.switchModel(currentModelIndex)
            }
          },
          {
            icon: 'mdi:bed',
            label: '休眠',
            onClick(widget) {
              widget.sleep()
            }
          },
          {
            icon: 'mdi:github',
            label: 'GitHub 仓库',
            onClick() {
              window.open('https://github.com/hacxy/l2d-widget', '_blank')
            }
          },
          {
            icon: 'mdi:information-outline',
            label: '官方文档',
            onClick() {
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
