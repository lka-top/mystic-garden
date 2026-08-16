<script setup lang="ts">
import { ref } from 'vue'
import { Lock, User, ShieldCheck } from 'lucide-vue-next'
import type { ApiResponse } from '~/types'
import { useAuth } from '~/composables/useAuth'
import Button from '~/components/ui/Button.vue'

definePageMeta({
  layout: false
})

const { setLogin } = useAuth()
const username = ref('admin')
const password = ref('')
const loading = ref(false)
const errorMessage = ref('')

async function handleLogin() {
  if (!username.value || !password.value) {
    errorMessage.value = '请输入用户名和密码'
    return
  }

  loading.value = true
  errorMessage.value = ''

  try {
    const res = await $fetch<ApiResponse<{ token: string; user: any }>>('/api/v1/auth/login', {
      method: 'POST',
      body: {
        username: username.value,
        password: password.value
      }
    })

    if (res.code === 200) {
      setLogin(res.data.token, res.data.user)
      navigateTo('/admin')
    }
  } catch (err: any) {
    errorMessage.value = err?.data?.statusMessage || '登录失败，请检查账号密码'
  } finally {
    loading.value = false
  }
}

useSeoMeta({
  title: '管理员登录 - 神秘花园'
})
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-zinc-100 dark:bg-zinc-950 px-4">
    <div class="w-full max-w-md p-8 rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xl space-y-6">
      <div class="text-center space-y-2">
        <div class="w-12 h-12 rounded-2xl bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 mx-auto flex items-center justify-center shadow-sm">
          <ShieldCheck class="w-6 h-6" />
        </div>
        <h1 class="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
          管理控制台认证
        </h1>
        <p class="text-xs text-zinc-400 font-mono">
          Enter admin credentials to proceed
        </p>
      </div>

      <div v-if="errorMessage" class="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 text-xs font-medium border border-rose-200 dark:border-rose-800">
        {{ errorMessage }}
      </div>

      <form class="space-y-4" @submit.prevent="handleLogin">
        <div class="space-y-1.5">
          <label class="text-xs font-semibold text-zinc-700 dark:text-zinc-300">管理员账号</label>
          <div class="relative">
            <User class="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              v-model="username"
              type="text"
              required
              placeholder="admin"
              class="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-400"
            >
          </div>
        </div>

        <div class="space-y-1.5">
          <label class="text-xs font-semibold text-zinc-700 dark:text-zinc-300">管理密码</label>
          <div class="relative">
            <Lock class="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              v-model="password"
              type="password"
              required
              placeholder="••••••••"
              class="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-400"
            >
          </div>
        </div>

        <Button type="submit" variant="default" class="w-full mt-2" :loading="loading">
          立即登录
        </Button>
      </form>

      <div class="text-center pt-2">
        <NuxtLink to="/" class="text-xs text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200">
          ← 返回博客首页
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
