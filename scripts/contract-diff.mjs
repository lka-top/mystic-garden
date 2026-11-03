#!/usr/bin/env node
/**
 * 新旧后端（Nuxt Nitro vs Spring Boot 4）实时契约对比脚本。
 *
 * 用法：
 *   node scripts/contract-diff.mjs --old http://127.0.0.1:3001 --new http://127.0.0.1:8080
 */

function parseArg(flag, envKey, fallback) {
  const idx = process.argv.indexOf(flag)
  if (idx !== -1 && process.argv[idx + 1]) {
    return process.argv[idx + 1].replace(/\/+$/, '')
  }
  return (process.env[envKey] || fallback).replace(/\/+$/, '')
}

const OLD_BASE = parseArg('--old', 'OLD_BASE_URL', 'http://127.0.0.1:3001')
const NEW_BASE = parseArg('--new', 'NEW_BASE_URL', 'http://127.0.0.1:8080')

/**
 * 递归深比较两个 JSON 值，返回差异路径列表。
 * ignorePaths 支持跳过详情页异步阅读量自增导致的 views 瞬时 +1 抖动。
 */
function diffJson(oldVal, newVal, path = '$', ignoreKeys = new Set(), diffs = []) {
  if (Object.is(oldVal, newVal)) return diffs

  if (oldVal === null || newVal === null || typeof oldVal !== typeof newVal) {
    diffs.push(`${path}: old=${JSON.stringify(oldVal)} vs new=${JSON.stringify(newVal)}`)
    return diffs
  }

  if (Array.isArray(oldVal) || Array.isArray(newVal)) {
    if (!Array.isArray(oldVal) || !Array.isArray(newVal)) {
      diffs.push(`${path}: array type mismatch`)
      return diffs
    }
    if (oldVal.length !== newVal.length) {
      diffs.push(`${path}.length: old=${oldVal.length} vs new=${newVal.length}`)
    }
    const len = Math.min(oldVal.length, newVal.length)
    for (let i = 0; i < len; i++) {
      diffJson(oldVal[i], newVal[i], `${path}[${i}]`, ignoreKeys, diffs)
    }
    return diffs
  }

  if (typeof oldVal === 'object') {
    const oldKeys = Object.keys(oldVal).sort()
    const newKeys = Object.keys(newVal).sort()

    for (const k of oldKeys) {
      if (!(k in newVal)) {
        diffs.push(`${path}.${k}: missing in NEW (old=${JSON.stringify(oldVal[k])})`)
      }
    }
    for (const k of newKeys) {
      if (!(k in oldVal)) {
        diffs.push(`${path}.${k}: extra key in NEW (new=${JSON.stringify(newVal[k])})`)
      }
    }
    for (const k of oldKeys) {
      if (k in newVal && !ignoreKeys.has(k)) {
        diffJson(oldVal[k], newVal[k], `${path}.${k}`, ignoreKeys, diffs)
      }
    }
    return diffs
  }

  diffs.push(`${path}: old=${JSON.stringify(oldVal)} vs new=${JSON.stringify(newVal)}`)
  return diffs
}

async function fetchPair(endpoint, init = {}) {
  const [oldRes, newRes] = await Promise.all([
    fetch(`${OLD_BASE}${endpoint}`, init),
    fetch(`${NEW_BASE}${endpoint}`, init)
  ])
  return { oldRes, newRes }
}

async function compareJsonEndpoint(label, endpoint, options = {}) {
  const { init = {}, ignoreKeys = new Set(), expectedStatus = 200 } = options
  const { oldRes, newRes } = await fetchPair(endpoint, init)

  if (oldRes.status !== expectedStatus || newRes.status !== expectedStatus) {
    throw new Error(
      `[${label}] HTTP status mismatch on ${endpoint}: old=${oldRes.status}, new=${newRes.status} (expected ${expectedStatus})`
    )
  }

  const [oldJson, newJson] = await Promise.all([oldRes.json(), newRes.json()])
  const diffs = diffJson(oldJson, newJson, '$', ignoreKeys)
  if (diffs.length > 0) {
    const preview = diffs.slice(0, 12).join('\n  - ')
    throw new Error(`[${label}] JSON contract diff on ${endpoint} (${diffs.length} diffs):\n  - ${preview}`)
  }
  console.log(`✅ [PASS] ${label} (${endpoint}) -> HTTP ${newRes.status}, 100% JSON match`)
  return newJson
}

async function compareXmlEndpoint(label, endpoint, rootTag, itemTag) {
  const { oldRes, newRes } = await fetchPair(endpoint)
  if (oldRes.status !== 200 || newRes.status !== 200) {
    throw new Error(`[${label}] XML HTTP status mismatch: old=${oldRes.status}, new=${newRes.status}`)
  }
  const newCt = newRes.headers.get('content-type') || ''
  if (!newCt.includes('xml')) {
    throw new Error(`[${label}] Expected XML Content-Type on NEW, got: ${newCt}`)
  }
  const [oldXml, newXml] = await Promise.all([oldRes.text(), newRes.text()])
  if (!newXml.includes(`<${rootTag}`)) {
    throw new Error(`[${label}] Missing <${rootTag}> in NEW XML output`)
  }
  const countTag = (xml, tag) => (xml.match(new RegExp(`<${tag}[>\\s]`, 'g')) || []).length
  const oldCount = countTag(oldXml, itemTag)
  const newCount = countTag(newXml, itemTag)
  if (oldCount !== newCount) {
    throw new Error(`[${label}] <${itemTag}> count mismatch: old=${oldCount} vs new=${newCount}`)
  }
  console.log(`✅ [PASS] ${label} (${endpoint}) -> HTTP 200, XML <${itemTag}>=${newCount} matched`)
}

async function compareErrorContract(label, endpoint, init, expectedStatus) {
  const { oldRes, newRes } = await fetchPair(endpoint, init)
  if (oldRes.status !== expectedStatus || newRes.status !== expectedStatus) {
    throw new Error(
      `[${label}] Error HTTP status mismatch: old=${oldRes.status}, new=${newRes.status} (expected ${expectedStatus})`
    )
  }
  const [oldErr, newErr] = await Promise.all([oldRes.json(), newRes.json()])
  if (oldErr.statusCode !== newErr.statusCode || oldErr.statusMessage !== newErr.statusMessage) {
    throw new Error(
      `[${label}] Error payload mismatch:\n  old=${JSON.stringify(oldErr)}\n  new=${JSON.stringify(newErr)}`
    )
  }
  console.log(`✅ [PASS] ${label} (${endpoint}) -> HTTP ${expectedStatus} "${newErr.statusMessage}"`)
}

async function main() {
  console.log(`🔍 Starting API Contract Comparison`)
  console.log(`   OLD (Nuxt Nitro) : ${OLD_BASE}`)
  console.log(`   NEW (Spring Boot): ${NEW_BASE}\n`)

  let failures = 0
  const run = async (fn) => {
    try {
      await fn()
    } catch (err) {
      failures++
      console.error(`❌ [FAIL] ${err instanceof Error ? err.message : String(err)}`)
    }
  }

  await run(() => compareJsonEndpoint('Stats Overview', '/api/v1/stats/overview', { ignoreKeys: new Set(['views', 'totalViews']) }))
  await run(() => compareJsonEndpoint('Categories & Tags Overview', '/api/v1/categories'))
  await run(() => compareJsonEndpoint('Tags List', '/api/v1/tags'))
  await run(() => compareJsonEndpoint('Notebooks Tree', '/api/v1/notebooks'))

  let firstArticleSlug = null
  await run(async () => {
    const res = await compareJsonEndpoint('Articles Page 1', '/api/v1/articles?page=1&pageSize=10', {
      ignoreKeys: new Set(['views'])
    })
    firstArticleSlug = res?.data?.list?.[0]?.slug || null
  })

  if (firstArticleSlug) {
    await run(() =>
      compareJsonEndpoint('Article Detail', `/api/v1/articles/${encodeURIComponent(firstArticleSlug)}`, {
        ignoreKeys: new Set(['views'])
      })
    )
  }

  let firstNoteSlug = null
  await run(async () => {
    const res = await compareJsonEndpoint('Notes Page 1', '/api/v1/notes?page=1&pageSize=10', {
      ignoreKeys: new Set(['views'])
    })
    firstNoteSlug = res?.data?.list?.[0]?.slug || null
  })

  if (firstNoteSlug) {
    await run(() =>
      compareJsonEndpoint('Note Detail', `/api/v1/notes/${encodeURIComponent(firstNoteSlug)}`, {
        ignoreKeys: new Set(['views'])
      })
    )
  }

  await run(() => compareJsonEndpoint('Essays Page 1', '/api/v1/essays?page=1&pageSize=10'))
  await run(() => compareJsonEndpoint('Guestbook Comments', '/api/v1/comments?targetType=guestbook&page=1&pageSize=20'))
  await run(() => compareJsonEndpoint('Global Search', '/api/v1/search?q=a'))
  await run(() => compareJsonEndpoint('Dynamic Settings', '/api/v1/settings'))

  await run(() => compareXmlEndpoint('RSS 2.0 Feed', '/feed.xml', 'rss', 'item'))
  await run(() => compareXmlEndpoint('Sitemap XML', '/sitemap.xml', 'urlset', 'url'))

  await run(() => compareErrorContract('Auth Missing Token (401)', '/api/v1/auth/me', {}, 401))
  await run(() =>
    compareErrorContract(
      'Auth Invalid Token (401)',
      '/api/v1/auth/me',
      { headers: { Authorization: 'Bearer invalid.jwt.token' } },
      401
    )
  )

  console.log('\n--------------------------------------------------')
  if (failures > 0) {
    console.error(`💥 Contract comparison completed with ${failures} failure(s).`)
    process.exit(1)
  }
  console.log('🎉 All compared endpoints matched 100% between Nuxt Nitro and Spring Boot!')
}

main()
