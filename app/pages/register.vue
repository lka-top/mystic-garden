<script setup lang="ts">
import { ref } from 'vue'
import { UserPlus, User, Lock, Mail, Smile, CheckCircle2, ArrowRight } from 'lucide-vue-next'
import type { ApiResponse } from '~/types'
import { useAuth } from '~/composables/useAuth'
import { useGuestUser } from '~/composables/useGuestUser'
import Button from '~/components/ui/Button.vue'

definePageMeta({
  layout: false
})

const { setLogin } = useAuth()
const { getGuestUuid } = useGuestUser()

const form = ref({
  username: '',
  password: '',
  confirmPassword: '',
  nickname: '',
  email: ''
})

const loading = ref(false)
const errorMessage = ref('')
const isSuccess = ref(false)

async function handleRegister() {
  if (!form.value.username.trim()) {
    errorMessage.value = '请输入用户名'
    return
  }
  if (!form.value.nickname.trim()) {
    errorMessage.value = '请输入前台展示昵称'
    return
  }
  if (form.value.password.length < 6) {
    errorMessage.value = '密码长度至少需 6 位'
    return
  }
  if (form.value.password !== form.value.confirmPassword) {
    errorMessage.value = '两次输入的密码不一致'
    return
  }

  loading.value = true
  errorMessage.value = ''

  try {
    const guestUuid = getGuestUuid()
    const res = await $fetch<ApiResponse<{ token: string; user: any }>>('/api/v1/auth/register', {
      method: 'POST',
      body: {
        username: form.value.username.trim(),
        password: form.value.password,
        nickname: form.value.nickname.trim(),
        email: form.value.email.trim() || undefined,
        guestUuid
      }
    })

    if (res.code === 200) {
      setLogin(res.data.token, res.data.user)
      isSuccess.value = true
    }
  } catch (err: unknown) {
    const message = err instanceof Error && 'data' in err
      ? (err as { data?: { statusMessage?: string } }).data?.statusMessage
      : undefined
    errorMessage.value = message || '注册失败，请稍后重试'
  } finally {
    loading.value = false
  }
}

useSeoMeta({
  title: '用户注册 (预留) - 神秘花园'
})
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-zinc-100 dark:bg-zinc-950 px-4 py-12">
    <div class="w-full max-w-md p-8 rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xl space-y-6">
      
      <!-- 注册成功状态 -->
      <div v-if="isSuccess" class="text-center py-6 space-y-4">
        <div class="w-14 h-14 rounded-2xl bg-sky-500/10 text-sky-600 dark:text-sky-400 mx-auto flex items-center justify-center">
          <CheckCircle2 class="w-8 h-8" />
        </div>
        <div>
          <h2 class="text-lg font-bold text-zinc-900 dark:text-zinc-100">
            欢迎加入神秘花园！
          </h2>
          <p class="text-xs text-zinc-400 mt-1">
            您的账号已就绪，当前已自动登录。
          </p>
        </div>
        <div class="pt-2">
          <NuxtLink to="/">
            <Button variant="brand" class="w-full">
              进入花园探索
              <ArrowRight class="w-4 h-4 ml-1" />
            </Button>
          </NuxtLink>
        </div>
      </div>

      <!-- 注册表单状态 -->
      <template v-else>
        <div class="text-center space-y-2">
          <div class="w-12 h-12 rounded-2xl bg-brand-500/10 text-brand-600 dark:text-brand-400 mx-auto flex items-center justify-center">
            <UserPlus class="w-6 h-6" />
          </div>
          <h1 class="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            创建花友账号
          </h1>
          <p class="text-xs text-zinc-400 font-mono">
            Register your digital garden account
          </p>
        </div>

        <div v-if="errorMessage" class="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 text-xs font-medium border border-rose-200 dark:border-rose-800">
          {{ errorMessage }}
        </div>

        <form class="space-y-3.5" @submit.prevent="handleRegister">
          <div class="space-y-1">
            <label for="register-username" class="text-xs font-semibold text-zinc-700 dark:text-zinc-300">用户名 (唯一登录账号)</label>
            <div class="relative">
              <User class="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                id="register-username"
                v-model="form.username"
                type="text"
                required
                placeholder="例如: alex_walker"
                class="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
              >
            </div>
          </div>

          <div class="space-y-1">
            <label for="register-nickname" class="text-xs font-semibold text-zinc-700 dark:text-zinc-300">显示昵称</label>
            <div class="relative">
              <Smile class="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                id="register-nickname"
                v-model="form.nickname"
                type="text"
                required
                placeholder="例如: 晨曦探险家"
                class="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
              >
            </div>
          </div>

          <div class="space-y-1">
            <label for="register-email" class="text-xs font-semibold text-zinc-700 dark:text-zinc-300">电子邮箱 (选填，用于通知)</label>
            <div class="relative">
              <Mail class="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                id="register-email"
                v-model="form.email"
                type="email"
                placeholder="you@example.com"
                class="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
              >
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div class="space-y-1">
              <label for="register-password" class="text-xs font-semibold text-zinc-700 dark:text-zinc-300">设置密码</label>
              <div class="relative">
                <Lock class="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  id="register-password"
                  v-model="form.password"
                  type="password"
                  required
                  placeholder="至少 6 位"
                  class="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
                >
              </div>
            </div>

            <div class="space-y-1">
              <label for="register-password-confirm" class="text-xs font-semibold text-zinc-700 dark:text-zinc-300">确认密码</label>
              <div class="relative">
                <Lock class="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  id="register-password-confirm"
                  v-model="form.confirmPassword"
                  type="password"
                  required
                  placeholder="重复密码"
                  class="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
                >
              </div>
            </div>
          </div>

          <Button type="submit" variant="brand" class="w-full mt-3" :loading="loading">
            完成注册
          </Button>
        </form>

        <div class="text-center pt-2 flex items-center justify-between text-xs text-zinc-400">
          <NuxtLink to="/" class="hover:text-zinc-600 dark:hover:text-zinc-200">
            ← 返回博客首页
          </NuxtLink>
          <NuxtLink to="/admin/login" class="hover:text-zinc-600 dark:hover:text-zinc-200">
            已有管理员账号？
          </NuxtLink>
        </div>
      </template>
    </div>
  </div>
</template>
