import { prisma } from '~~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event)
  const siteUrl = (config.public.siteUrl || 'http://localhost:3000').replace(/\/$/, '')
  const siteName = config.public.siteName || '神秘花园'
  const siteDescription = config.public.siteDescription || '记录思考、探索技术、沉淀生活的一方数字花园'

  const articles = await prisma.article.findMany({
    where: { isPublished: true },
    orderBy: { createdAt: 'desc' },
    take: 20,
    select: {
      id: true,
      slug: true,
      title: true,
      summary: true,
      createdAt: true,
      author: {
        select: { nickname: true }
      },
      category: {
        select: { name: true }
      }
    }
  })

  const itemsXml = articles.map(item => {
    const link = `${siteUrl}/articles/${item.slug}`
    const pubDate = new Date(item.createdAt).toUTCString()
    const author = item.author?.nickname || config.public.authorName || 'lka'
    const category = item.category?.name ? `<category><![CDATA[${item.category.name}]]></category>` : ''

    return `
    <item>
      <title><![CDATA[${item.title}]]></title>
      <link>${link}</link>
      <guid isPermaLink="true">${link}</guid>
      <description><![CDATA[${item.summary || ''}]]></description>
      <author><![CDATA[${author}]]></author>
      ${category}
      <pubDate>${pubDate}</pubDate>
    </item>`
  }).join('')

  const rssFeed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title><![CDATA[${siteName}]]></title>
    <link>${siteUrl}</link>
    <description><![CDATA[${siteDescription}]]></description>
    <language>zh-CN</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${siteUrl}/feed.xml" rel="self" type="application/rss+xml"/>
    ${itemsXml}
  </channel>
</rss>`

  setHeader(event, 'Content-Type', 'application/xml; charset=utf-8')
  setHeader(event, 'Cache-Control', 'public, max-age=3600, s-maxage=3600')
  return rssFeed
})
