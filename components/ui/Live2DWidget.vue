<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const isHidden = ref(false)
let oml2dInstance: any = null

onMounted(async () => {
  if (!import.meta.client) return

  // 1. 彻底清理旧版可能残留的死锁 localStorage 状态
  try {
    for (let i = localStorage.length - 1; i >= 0; i--) {
      const key = localStorage.key(i)
      if (key && (key.includes('oml2d') || key.includes('live2d'))) {
        localStorage.removeItem(key)
      }
    }
  } catch (error) {
    console.warn('[Live2D] Failed to clean up legacy localStorage keys:', error)
  }

  // 2. 清理页面上已存在的 DOM 节点（确保热重载或重新挂载时 100% 刷新）
  const existingDom = document.getElementById('oml2d')
  if (existingDom) {
    existingDom.remove()
  }

  // 3. 动态加载 oh-my-live2d
  try {
    console.log('[Live2D] 🚀 正在初始化 Live2D 看板娘...')
    const { loadOml2d } = await import('oh-my-live2d')

    oml2dInstance = loadOml2d({
      dockedPosition: 'left',
      mobileDisplay: false, // 移动端自动优雅隐藏
      primaryColor: '#0ea5e9', // 博客主题青蓝色
      sayHello: true,
      models: [
        {
          name: '小仙狐 Senko (高清动作·本地秒开)',
          path: '/live2d/Senko_Normals/senko.model3.json',
          scale: 0.12,
          position: [-10, 20],
          stageStyle: {
            width: 320,
            height: 380
          }
        },
        {
          name: '小黑猫 Cat (超萌宠物·本地秒开)',
          path: '/live2d/cat-black/model.json',
          scale: 0.15,
          position: [0, 20],
          stageStyle: {
            width: 320,
            height: 350
          }
        },
        {
          name: '雫 Shizuku (经典和服少女)',
          path: 'https://fastly.jsdelivr.net/gh/hacxy/l2d-models@main/models/shizuku/shizuku.model.json',
          scale: 0.2,
          position: [70, 70],
          stageStyle: {
            width: 380,
            height: 380
          }
        },
        {
          name: '小埋 Umaru',
          path: 'https://fastly.jsdelivr.net/gh/hacxy/l2d-models@main/models/umaru/model.json',
          scale: 0.18,
          position: [0, 0],
          stageStyle: {
            width: 320,
            height: 350
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
        items: (defaultItems) => {
          return defaultItems.map((item) => {
            if (item.id === 'Rest' || item.title === '休息' || item.title?.includes('休息')) {
              return {
                ...item,
                title: '收起看板娘',
                onClick: (instance) => {
                  instance.stageSlideOut()
                  isHidden.value = true
                }
              }
            }
            return item
          })
        }
      }
    })

    // 监听模型加载事件
    oml2dInstance.onLoad((status: string) => {
      console.log(`[Live2D] 📢 模型加载状态: ${status}`)
    })
  } catch (error) {
    console.error('[Live2D] ❌ 初始化看板娘失败:', error)
  }
})

// 🐾 点击原生 Vue 唤醒胶囊，0ms 瞬间滑入复原
const handleWakeUp = () => {
  if (oml2dInstance) {
    oml2dInstance.stageSlideIn()
    isHidden.value = false
  }
}

onUnmounted(() => {
  if (import.meta.client) {
    const existingDom = document.getElementById('oml2d')
    if (existingDom) {
      existingDom.remove()
    }
  }
})
</script>

<template>
  <div class="live2d-wrapper">
    <!-- 🐾 原生 Vue 响应式唤醒小胶囊 (带毛玻璃与微动效) -->
    <Transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="opacity-0 -translate-x-4 scale-95"
      enter-to-class="opacity-100 translate-x-0 scale-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="opacity-100 translate-x-0 scale-100"
      leave-to-class="opacity-0 -translate-x-4 scale-95"
    >
      <button
        v-if="isHidden"
        @click="handleWakeUp"
        class="fixed bottom-6 left-6 z-40 hidden md:flex items-center gap-2 px-3.5 py-2 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md border border-zinc-200/80 dark:border-zinc-800/80 rounded-full shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all text-xs font-medium text-sky-600 dark:text-sky-400 group cursor-pointer"
        title="点击唤醒看板娘"
      >
        <span class="text-sm group-hover:rotate-12 transition-transform">🐾</span>
        <span>唤醒看板娘</span>
      </button>
    </Transition>
  </div>
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
