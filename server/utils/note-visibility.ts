import type { Prisma } from '@prisma/client'
import { prisma } from '~~/server/utils/prisma'

export async function getPrivateNotebookIds(): Promise<number[]> {
  const notebooks = await prisma.notebook.findMany({
    select: { id: true, parentId: true, isPrivate: true }
  })
  const byId = new Map(notebooks.map(notebook => [notebook.id, notebook]))

  return notebooks.filter((notebook) => {
    let currentId: number | null = notebook.id
    const visited = new Set<number>()
    while (currentId !== null && !visited.has(currentId)) {
      visited.add(currentId)
      const current = byId.get(currentId)
      if (!current) break
      if (current.isPrivate) return true
      currentId = current.parentId
    }
    return false
  }).map(notebook => notebook.id)
}

export async function getPublicNoteWhere(): Promise<Prisma.NoteWhereInput> {
  const privateNotebookIds = await getPrivateNotebookIds()
  return {
    isPublished: true,
    isEncrypted: false,
    ...(privateNotebookIds.length > 0 && {
      AND: [{ OR: [
        { notebookId: null },
        { notebookId: { notIn: privateNotebookIds } }
      ] }]
    })
  }
}
