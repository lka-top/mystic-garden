import type { ApiResponse, User } from '~/types'

/** Cookie 只保留展示与鉴权必需的最小字段，避免序列化冗余与篡改面 */
export type CookieUser = Pick<User, 'id' | 'username' | 'nickname' | 'avatar' | 'role'>

function toCookieUser(user: User): CookieUser {
  return {
    id: user.id,
    username: user.username,
    nickname: user.nickname,
    avatar: user.avatar,
    role: user.role
  }
}

export function useAuth() {
  const token = useCookie<string | null>('luokai_token', {
    maxAge: 60 * 60 * 24 * 7,
    path: '/',
    sameSite: 'lax'
  })

  const userCookie = useCookie<CookieUser | null>('luokai_user', {
    maxAge: 60 * 60 * 24 * 7,
    path: '/',
    sameSite: 'lax'
  })

  const currentUser = useState<CookieUser | null>('currentUser', () => userCookie.value || null)
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
        userCookie.value = toCookieUser(res.data)
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
    userCookie.value = toCookieUser(user)
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
