import type { ApiResponse, User } from '~/types'

export function useAuth() {
  const token = useCookie<string | null>('luokai_token', {
    maxAge: 60 * 60 * 24 * 7,
    path: '/',
    sameSite: 'lax'
  })

  const userCookie = useCookie<User | null>('luokai_user', {
    maxAge: 60 * 60 * 24 * 7,
    path: '/',
    sameSite: 'lax'
  })

  const currentUser = useState<User | null>('currentUser', () => userCookie.value || null)
  const isAuthenticated = computed(() => !!token.value)

  async function fetchCurrentUser() {
    if (!token.value) {
      currentUser.value = null
      userCookie.value = null
      return null
    }
    try {
      const res = await $fetch<ApiResponse<User>>('/api/v1/auth/me', {
        headers: {
          Authorization: `Bearer ${token.value}`
        }
      })
      if (res.code === 200) {
        currentUser.value = res.data
        userCookie.value = res.data
        return res.data
      }
    } catch {
      token.value = null
      userCookie.value = null
      currentUser.value = null
    }
    return null
  }

  function setLogin(newToken: string, user: User) {
    token.value = newToken
    userCookie.value = user
    currentUser.value = user
  }

  function logout() {
    token.value = null
    userCookie.value = null
    currentUser.value = null
    navigateTo('/admin/login')
  }

  return {
    token,
    currentUser,
    isAuthenticated,
    fetchCurrentUser,
    setLogin,
    logout
  }
}
