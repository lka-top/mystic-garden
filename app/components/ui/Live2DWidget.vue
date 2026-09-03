<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'

let oml2dInstance: any = null

onMounted(async () => {
  if (!import.meta.client) return

  // 移动端体验优化：屏幕宽度小于 768px 时静默不初始化以节省移动端带宽与算力
  if (window.innerWidth < 768) return

  try {
    console.log('[Live2D] 🚀 正在按官方规范加载 oh-my-live2d...')
    const { loadOml2d } = await import('oh-my-live2d')

    oml2dInstance = loadOml2d({
      dockedPosition: 'left',
      mobileDisplay: false,
      primaryColor: '#0ea5e9',
      sayHello: true,
      models: [
        {
          name: 'cat-black',
          path: 'https://model.oml2d.com/cat-black/model.json',
          scale: 0.15,
          position: [0, 20],
          stageStyle: {
            width: 320,
            height: 350
          }
        },
        {
          name: 'shizuku',
          path: 'https://model.oml2d.com/shizuku/shizuku.model.json',
          scale: 0.2,
          position: [70, 70],
          stageStyle: {
            width: 400,
            height: 370
          }
        },
        {
          name: 'senko',
          path: 'https://model.oml2d.com/Senko_Normals/senko.model3.json',
          position: [-10, 20],
          stageStyle: {
            width: 320,
            height: 380
          }
        },
        {
          name: 'pio',
          path: 'https://model.oml2d.com/Pio/model.json',
          scale: 0.4,
          position: [0, 50],
          stageStyle: {
            width: 320,
            height: 300
          }
        }
      ],
      tips: {
        idleTips: {
          wordTheDay: true
        }
      },
      menus: {
        disable: false,
        items: (defaultItems) => {
          // 官方默认 4 个标准按钮：
          // 1. Rest (休息)
          // 2. SwitchTexture (切换衣服)
          // 3. SwitchModel (切换模型)
          // 4. About (关于) -> 精准跳转至官方文档主页
          return defaultItems.map((item) => {
            if (item.id === 'About' || item.title === '关于' || item.title?.includes('关于')) {
              return {
                ...item,
                onClick: () => {
                  window.open('https://oml2d.hacxy.cn/', '_blank')
                }
              }
            }
            return item
          })
        }
      }
    })
  } catch (error) {
    console.warn('[Live2D] Failed to initialize oh-my-live2d:', error)
  }
})

onUnmounted(() => {
  if (import.meta.client) {
    const existingDom = document.getElementById('oml2d')
    if (existingDom) {
      existingDom.remove()
    }
    oml2dInstance = null
  }
})
</script>

<template>
  <div class="live2d-wrapper" />
</template>

<style>
/* 确保层级与暗色模式主题适配 */
#oml2d,
.oml2d-stage {
  z-index: 40 !important;
}

.dark .oml2d-tips {
  background-color: rgba(24, 24, 27, 0.92) !important;
  color: #f4f4f5 !important;
  border: 1px solid rgba(63, 63, 70, 0.6) !important;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.5) !important;
}

.dark .oml2d-menu {
  background-color: rgba(24, 24, 27, 0.85) !important;
  border: 1px solid rgba(63, 63, 70, 0.6) !important;
}
</style>
