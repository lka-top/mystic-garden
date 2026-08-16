import { useAuth } from '~/composables/useAuth'

export default defineNuxtRouteMiddleware(async (to) => {
  // 仅对以 /admin 开头且不是登录页的路由生效
  if (to.path.startsWith('/admin') && to.path !== '/admin/login') {
    const { token, currentUser, fetchCurrentUser } = useAuth()

    // 1. 如果完全没有 Token，直接在前置路由守卫中拦截并重定向到登录页
    if (!token.value) {
      return navigateTo('/admin/login', { replace: true })
    }

    // 2. 如果有 Token 但未加载用户信息，校验并加载
    if (!currentUser.value) {
      const user = await fetchCurrentUser()
      if (!user || user.role !== 'admin') {
        return navigateTo('/admin/login', { replace: true })
      }
    }
  }

  // 如果已是登录状态却访问 /admin/login，自动跳进后台 /admin
  if (to.path === '/admin/login') {
    const { token, currentUser, fetchCurrentUser } = useAuth()
    if (token.value) {
      if (!currentUser.value) {
        await fetchCurrentUser()
      }
      if (currentUser.value?.role === 'admin') {
        return navigateTo('/admin', { replace: true })
      }
    }
  }
})
