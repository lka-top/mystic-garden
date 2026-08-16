import { defineEventHandler, getRouterParam, createError, setHeader } from 'h3'
import { readFileSync, existsSync } from 'node:fs'
import { resolve } from 'node:path'

export default defineEventHandler((event) => {
  const filePath = resolve(process.cwd(), 'public/database-er-diagram.svg')
  if (!existsSync(filePath)) {
    throw createError({ statusCode: 404, statusMessage: 'ER Diagram SVG Not Found' })
  }

  const svgContent = readFileSync(filePath, 'utf-8')
  setHeader(event, 'Content-Type', 'image/svg+xml; charset=utf-8')
  setHeader(event, 'Cache-Control', 'public, max-age=3600')
  return svgContent
})
