import type { ApiResponse } from '~/types'

/**
 * 统一的认证 API 客户端：
 * - 自动携带 Authorization: Bearer 头（读取 luokai_token cookie）
 * - 401 时自动清空登录态并跳转登录页
 * - 响应类型统一为 ApiResponse<T>
 *
 * 用法：const api = useApi(); const res = await api<Stats>('/api/v1/stats')
 */
export function useApi() {
  const token = useCookie<string | null>('luokai_token')

  const api = $fetch.create<ApiResponse<unknown>>({
    baseURL: '',
    onRequest({ options }) {
      if (token.value) {
        options.headers = new Headers(options.headers)
        options.headers.set('Authorization', `Bearer ${token.value}`)
      }
    },
    async onResponseError({ response }) {
      // 令牌失效：清除本地登录态，跳转登录页重新认证
      if (response.status === 401 && token.value) {
        token.value = null
        const userCookie = useCookie('luokai_user')
        userCookie.value = null
        useState<unknown>('currentUser', () => null).value = null
        await navigateTo('/admin/login')
      }
    }
  }) as (<T>(url: string, opts?: Parameters<typeof $fetch>[1]) => Promise<ApiResponse<T>>)

  return api
}
