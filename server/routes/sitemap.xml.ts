import { prisma } from '~~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event)
  const siteUrl = (config.public.siteUrl || 'http://localhost:3000').replace(/\/$/, '')

  const [articles, notes] = await Promise.all([
    prisma.article.findMany({
      where: { isPublished: true },
      select: { slug: true, updatedAt: true, createdAt: true }
    }),
    prisma.note.findMany({
      where: { isPublished: true },
      select: { slug: true, updatedAt: true, createdAt: true }
    })
  ])

  const staticRoutes = [
    { url: '/', changefreq: 'daily', priority: '1.0' },
    { url: '/articles', changefreq: 'daily', priority: '0.9' },
    { url: '/essays', changefreq: 'daily', priority: '0.8' },
    { url: '/notes', changefreq: 'daily', priority: '0.8' },
    { url: '/archive', changefreq: 'weekly', priority: '0.7' },
    { url: '/about', changefreq: 'monthly', priority: '0.7' }
  ]

  const staticXml = staticRoutes.map(route => `
  <url>
    <loc>${siteUrl}${route.url}</loc>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>`).join('')

  const articleXml = articles.map(art => `
  <url>
    <loc>${siteUrl}/articles/${art.slug}</loc>
    <lastmod>${new Date(art.updatedAt || art.createdAt).toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`).join('')

  const noteXml = notes.map(note => `
  <url>
    <loc>${siteUrl}/notes/${note.slug}</loc>
    <lastmod>${new Date(note.updatedAt || note.createdAt).toISOString()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`).join('')

  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${staticXml}
  ${articleXml}
  ${noteXml}
</urlset>`

  setHeader(event, 'Content-Type', 'application/xml; charset=utf-8')
  setHeader(event, 'Cache-Control', 'public, max-age=3600, s-maxage=3600')
  return sitemapXml
})
