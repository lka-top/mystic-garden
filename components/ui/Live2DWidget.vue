<script setup lang="ts">
onMounted(async () => {
  if (!import.meta.client) return

  // 🛡️ SPA 与 Vite 开发热重载防多实例冲突守卫
  if ((window as any).__OML2D_INITIALIZED__) return
  (window as any).__OML2D_INITIALIZED__ = true

  try {
    const { loadOml2d } = await import('oh-my-live2d')

    const oml2d = loadOml2d({
      dockedPosition: 'left',
      mobileDisplay: false, // 移动端自动优雅隐藏
      primaryColor: '#0ea5e9', // 博客主题青蓝色
      sayHello: false,
      models: [
        {
          name: '小仙狐 Senko',
          path: 'https://fastly.jsdelivr.net/gh/Eikanya/Live2d-model/Live2D/Senko_Normals/senko.model3.json',
          scale: 0.12,
          position: [-10, 20],
          stageStyle: {
            width: 280,
            height: 320
          }
        },
        {
          name: '雫 Shizuku',
          path: 'https://fastly.jsdelivr.net/gh/iCharlesZ/vscode-live2d-models/model/shizuku/shizuku.model.json',
          scale: 0.2,
          position: [0, 0],
          stageStyle: {
            width: 280,
            height: 320
          }
        },
        {
          name: '小春 Koharu',
          path: 'https://fastly.jsdelivr.net/gh/iCharlesZ/vscode-live2d-models/model/koharu/koharu.model.json',
          scale: 0.18,
          position: [0, 0],
          stageStyle: {
            width: 280,
            height: 320
          }
        }
      ],
      tips: {
        style: {
          width: 230,
          height: 100,
          left: 'calc(50% - 20px)',
          top: '-90px'
        },
        idleTips: {
          wordTheDay: true // 自动读取每日一言
        }
      },
      menus: {
        disable: false,
        // ⚡ 核心修复：重写休息/隐藏按钮，采用舞台滑动进出（不销毁 WebGL 上下文，确保 0ms 瞬间二次唤醒）
        items: (defaultItems) => {
          return defaultItems.map((item) => {
            if (item.id === 'Rest' || item.title === '休息' || item.title?.includes('休息')) {
              return {
                ...item,
                title: '收起看板娘',
                onClick: (instance) => {
                  instance.stageSlideOut()
                  instance.statusBarOpen('🐾 点击唤醒看板娘')
                  instance.setStatusBarClickEvent(() => {
                    instance.stageSlideIn()
                    instance.statusBarClose()
                  })
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
    (window as any).__OML2D_INITIALIZED__ = false
  }
})
</script>

<template>
  <div class="oml2d-wrapper" />
</template>

<style>
/* 确保状态条与看板娘层级合适 */
#oml2d,
.oml2d-stage,
.oml2d-status-bar {
  z-index: 40 !important;
}

/* 状态条美化与圆角阴影 */
.oml2d-status-bar {
  border-radius: 0 8px 8px 0 !important;
  cursor: pointer !important;
  font-weight: 500 !important;
  box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.15) !important;
  transition: all 0.3s ease !important;
}

.oml2d-status-bar:hover {
  transform: scale(1.05) translateX(3px) !important;
}

/* 适配博客暗色模式气泡框与操作栏 */
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

.dark .oml2d-menu-item {
  color: #a1a1aa !important;
}

.dark .oml2d-menu-item:hover {
  color: #38bdf8 !important;
}
</style>
