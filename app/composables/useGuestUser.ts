import { ref, onMounted } from 'vue'

const GUEST_UUID_STORAGE_KEY = 'luokai_guest_uuid'

export function useGuestUser() {
  const guestUuid = ref<string>('')

  function initGuestUuid(): string {
    if (typeof window === 'undefined') return ''
    
    let id = localStorage.getItem(GUEST_UUID_STORAGE_KEY)
    if (!id) {
      if (typeof crypto !== 'undefined' && crypto.randomUUID) {
        id = crypto.randomUUID()
      } else {
        id = 'guest_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 10)
      }
      localStorage.setItem(GUEST_UUID_STORAGE_KEY, id)
    }
    guestUuid.value = id
    return id
  }

  onMounted(() => {
    initGuestUuid()
  })

  function getGuestUuid(): string {
    if (guestUuid.value) return guestUuid.value
    return initGuestUuid()
  }

  return {
    guestUuid,
    getGuestUuid
  }
}
