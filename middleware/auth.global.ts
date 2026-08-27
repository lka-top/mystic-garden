import { useAuth } from '~/composables/useAuth'

/** /auth/me 复验间隔：避免每次 admin 导航都发起网络请求 */
const ME_REVERIFY_TTL = 5 * 60 * 1000

export default defineNuxtRouteMiddleware(async (to) => {
  // 仅对以 /admin 开头且不是登录页的路由生效
  if (to.path.startsWith('/admin') && to.path !== '/admin/login') {
    const { token, currentUser, fetchCurrentUser } = useAuth()
    const lastVerifiedAt = useState<number>('authLastVerifiedAt', () => 0)

    // 1. 如果完全没有 Token，直接在前置路由守卫中拦截并重定向到登录页
    if (!token.value) {
      return navigateTo('/admin/login', { replace: true })
    }

    // 2. 如果有 Token 但未加载用户信息，校验并加载
    if (!currentUser.value) {
      const user = await fetchCurrentUser()
      lastVerifiedAt.value = Date.now()
      if (!user || user.role !== 'admin') {
        return navigateTo('/admin/login', { replace: true })
      }
    } else if (Date.now() - lastVerifiedAt.value > ME_REVERIFY_TTL) {
      // 已有用户信息且距上次复验超过 TTL：后台静默复验角色是否仍有效
      lastVerifiedAt.value = Date.now()
      fetchCurrentUser().then((user) => {
        if (user && user.role !== 'admin') {
          navigateTo('/admin/login', { replace: true })
        }
      })
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
