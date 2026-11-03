import { getRequestIP, getRequestURL, proxyRequest } from 'h3'

/**
 * 渐进迁移网关中间件：
 * 当配置了 NUXT_BACKEND_URL（如本地开发 http://127.0.0.1:8081 或容器内 http://backend:8080）时，
 * 将 /api/**、/feed.xml、/sitemap.xml（含 Nuxt SSR 服务端预取请求）透明代理至 Spring Boot 后端；
 * 未配置时保持走本地 Nitro server/api，支持零停机双栈并行验证与一键回退。
 */
export default defineEventHandler((event) => {
  const config = useRuntimeConfig(event)
  const rawBackendUrl = typeof config.backendUrl === 'string' ? config.backendUrl.trim() : ''
  if (!rawBackendUrl) {
    return
  }

  const reqUrl = getRequestURL(event)
  const pathname = reqUrl.pathname
  const shouldProxy =
    pathname.startsWith('/api/') ||
    pathname === '/feed.xml' ||
    pathname === '/sitemap.xml'

  if (!shouldProxy) {
    return
  }

  const backendBase = rawBackendUrl.replace(/\/+$/, '')
  const target = `${backendBase}${pathname}${reqUrl.search}`
  const clientIp = getRequestIP(event, { xForwardedFor: true })

  return proxyRequest(event, target, {
    headers: clientIp ? { 'x-real-ip': clientIp } : undefined
  })
})
