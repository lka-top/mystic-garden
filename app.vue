<script setup lang="ts">
useHead({
  titleTemplate: (titleChunk) => {
    return titleChunk ? `${titleChunk} | 神秘花园` : '神秘花园 - 记录思考与沉淀生活'
  }
})
</script>

<template>
  <div>
    <!-- 顶部流光加载进度条 (点击导航 0ms 启动) -->
    <NuxtLoadingIndicator color="#0ea5e9" :height="3" :duration="2000" />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>
