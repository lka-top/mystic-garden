<script setup lang="ts">
onMounted(() => {
  if (!import.meta.client) return

  // 避免 SPA 路由切换时重复加载
  if (document.getElementById('live2d-autoload-script')) return

  const script = document.createElement('script')
  script.id = 'live2d-autoload-script'
  script.src = 'https://fastly.jsdelivr.net/gh/stevenjoezhang/live2d-widget@latest/autoload.js'
  script.async = true
  script.crossOrigin = 'anonymous'
  document.body.appendChild(script)
})

onUnmounted(() => {
  if (import.meta.client) {
    // 页面销毁时清理 DOM 节点
    const waifu = document.getElementById('waifu')
    if (waifu) waifu.remove()
    const script = document.getElementById('live2d-autoload-script')
    if (script) script.remove()
  }
})
</script>

<template>
  <div class="live2d-widget-container" />
</template>

<style>
/* 移动端与平板（<768px）隐藏看板娘，避免遮挡正文与底部导航 */
@media (max-width: 768px) {
  #waifu {
    display: none !important;
  }
}

/* 确保看板娘层级合适，不遮挡弹窗与搜索抽屉 (z-index < 50) */
#waifu {
  z-index: 40 !important;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* 暗色模式下微调气泡提示背景 */
.dark #waifu-tips {
  background-color: rgba(24, 24, 27, 0.92) !important;
  color: #f4f4f5 !important;
  border-color: rgba(63, 63, 70, 0.6) !important;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.5) !important;
}

.dark #waifu-tool span {
  color: #a1a1aa !important;
}

.dark #waifu-tool span:hover {
  color: #38bdf8 !important;
}
</style>
