<script setup lang="ts">
onMounted(async () => {
  if (!import.meta.client) return

  // 动态异步引入 oh-my-live2d (保证 SSR 与首屏 100% 性能安全)
  try {
    const { loadOml2d } = await import('oh-my-live2d')

    loadOml2d({
      dockedPosition: 'left',
      mobileDisplay: false, // 移动端自动优雅隐藏
      primaryColor: '#0ea5e9', // 博客主题青蓝色
      sayHello: false,
      models: [
        {
          name: '小仙狐 Senko (Live2D Cubism 3 高清模型)',
          path: 'https://fastly.jsdelivr.net/gh/Eikanya/Live2d-model/Live2D/Senko_Normals/senko.model3.json',
          scale: 0.12,
          position: [-10, 20],
          stageStyle: {
            width: 280,
            height: 320
          }
        },
        {
          name: '雫 Shizuku (经典模型)',
          path: 'https://fastly.jsdelivr.net/gh/iCharlesZ/vscode-live2d-models/model/shizuku/shizuku.model.json',
          scale: 0.2,
          position: [0, 0],
          stageStyle: {
            width: 280,
            height: 320
          }
        },
        {
          name: '小春 Koharu (萝莉模型)',
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
          wordTheDay: true // 自动读取一言金句
        }
      },
      menus: {
        disable: false
      }
    })
  } catch (error) {
    console.warn('[Live2D] Failed to initialize oh-my-live2d:', error)
  }
})
</script>

<template>
  <div class="oml2d-wrapper" />
</template>

<style>
/* 确保菜单与气泡不与全站弹窗层级冲突 */
#oml2d,
.oml2d-stage {
  z-index: 40 !important;
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
