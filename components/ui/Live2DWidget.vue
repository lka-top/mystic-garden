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
  } catch {}

  // 2. 🛡️ SPA 与开发热重载防多实例冲突守卫
  if ((window as any).__OML2D_MOUNTED__) return
  (window as any).__OML2D_MOUNTED__ = true

  try {
    const { loadOml2d } = await import('oh-my-live2d')

    oml2dInstance = loadOml2d({
      dockedPosition: 'left',
      mobileDisplay: false, // 移动端自动优雅隐藏
      primaryColor: '#0ea5e9', // 博客主题青蓝色
      sayHello: false,
      models: [
        {
          name: '雫 Shizuku (经典看板娘)',
          path: 'https://fastly.jsdelivr.net/gh/hacxy/l2d-models@main/models/shizuku/shizuku.model.json',
          scale: 0.2,
          position: [0, 0],
          stageStyle: {
            width: 280,
            height: 320
          }
        },
        {
          name: '提亚 Tia (萌系萝莉)',
          path: 'https://fastly.jsdelivr.net/gh/hacxy/l2d-models@main/models/tia/model.json',
          scale: 0.22,
          position: [0, 10],
          stageStyle: {
            width: 280,
            height: 320
          }
        },
        {
          name: '小黑猫 Cat (超萌宠物)',
          path: 'https://fastly.jsdelivr.net/gh/hacxy/l2d-models@main/models/cat-black/model.json',
          scale: 0.16,
          position: [0, 20],
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
        // ⚡ 点击收起时通知 Vue 状态，触发舞台滑出
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
      },
      statusBar: {
        disable: true // 禁用第三方容易报错的状态栏，改由我们原生 Vue 胶囊接管
      }
    })
  } catch (error) {
    console.warn('[Live2D] Failed to initialize oh-my-live2d:', error)
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
    (window as any).__OML2D_MOUNTED__ = false
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
