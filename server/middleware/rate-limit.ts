import type { H3Event } from 'h3'

interface RateLimitRule {
  path: string
  method: string
  limit: number
  windowMs: number
}

interface ClientRecord {
  timestamps: number[]
}

// 针对关键高风险接口的滑动窗口限流规则
const rules: RateLimitRule[] = [
  { path: '/api/v1/auth/login', method: 'POST', limit: 5, windowMs: 60 * 1000 },
  { path: '/api/v1/auth/register', method: 'POST', limit: 3, windowMs: 60 * 1000 },
  { path: '/api/v1/comments', method: 'POST', limit: 10, windowMs: 60 * 1000 },
  { path: '/api/v1/upload', method: 'POST', limit: 15, windowMs: 60 * 1000 }
]

// 内存 IP 记录表
const ipRecords = new Map<string, ClientRecord>()

// 定期清理过期记录，防止内存泄漏 (每 5 分钟清理一次)
const CLEANUP_INTERVAL = 5 * 60 * 1000
let lastCleanup = Date.now()

function cleanupExpiredRecords(now: number) {
  const maxWindow = 60 * 1000
  for (const [key, record] of ipRecords.entries()) {
    record.timestamps = record.timestamps.filter(ts => now - ts < maxWindow)
    if (record.timestamps.length === 0) {
      ipRecords.delete(key)
    }
  }
  lastCleanup = now
}

export default defineEventHandler((event: H3Event) => {
  const path = getRequestPath(event)
  const method = event.method

  // 匹配是否命中限流规则
  const matchedRule = rules.find(
    r => r.method === method && (path === r.path || path.startsWith(`${r.path}/`))
  )

  if (!matchedRule) return

  const now = Date.now()
  if (now - lastCleanup > CLEANUP_INTERVAL) {
    cleanupExpiredRecords(now)
  }

  const clientIp = getRequestIP(event, { xForwardedFor: true }) || '127.0.0.1'
  const key = `${matchedRule.method}:${matchedRule.path}:${clientIp}`

  let record = ipRecords.get(key)
  if (!record) {
    record = { timestamps: [] }
    ipRecords.set(key, record)
  }

  // 过滤掉当前滑动窗口之前的旧请求
  record.timestamps = record.timestamps.filter(ts => now - ts < matchedRule.windowMs)

  if (record.timestamps.length >= matchedRule.limit) {
    const earliestTime = record.timestamps[0]
    const resetSeconds = Math.ceil((matchedRule.windowMs - (now - earliestTime)) / 1000)

    setResponseHeader(event, 'Retry-After', resetSeconds)
    throw createError({
      statusCode: 429,
      statusMessage: `请求过于频繁，请在 ${resetSeconds} 秒后再试`
    })
  }

  record.timestamps.push(now)
})
