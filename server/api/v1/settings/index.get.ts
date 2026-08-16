import { prisma } from '~/server/utils/prisma'
import { successResponse } from '~/server/utils/response'

export default defineEventHandler(async () => {
  const settingsList = await prisma.setting.findMany()
  const settingsMap: Record<string, string> = {}

  for (const s of settingsList) {
    settingsMap[s.key] = s.value
  }

  return successResponse(settingsMap)
})
