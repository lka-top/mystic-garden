import { prisma } from '~~/server/utils/prisma'
import { successResponse } from '~~/server/utils/response'
import { getPrivateNotebookIds } from '~~/server/utils/note-visibility'

export default defineEventHandler(async (event) => {
  const isAdmin = !!tryGetAdminUser(event)
  const privateNotebookIds = isAdmin ? [] : await getPrivateNotebookIds()
  const notebooks = await prisma.notebook.findMany({
    where: isAdmin ? {} : { id: { notIn: privateNotebookIds } },
    orderBy: [
      { sortOrder: 'asc' },
      { createdAt: 'asc' }
    ],
    include: {
      _count: {
        select: { notes: { where: isAdmin
          ? { isPublished: true }
          : { isPublished: true, isEncrypted: false } } }
      }
    }
  })

  const childrenByParentId = new Map<number | null, number[]>()
  for (const notebook of notebooks) {
    const siblings = childrenByParentId.get(notebook.parentId) || []
    siblings.push(notebook.id)
    childrenByParentId.set(notebook.parentId, siblings)
  }
  const notebooksById = new Map(notebooks.map(notebook => [notebook.id, notebook]))
  const countDescendantNotes = (notebookId: number): number => {
    const current = notebooksById.get(notebookId)
    if (!current) return 0
    return current._count.notes + (childrenByParentId.get(notebookId) || [])
      .reduce((total, childId) => total + countDescendantNotes(childId), 0)
  }

  return successResponse(notebooks.map(({ _count, ...notebook }) => ({
    ...notebook,
    noteCount: countDescendantNotes(notebook.id)
  })))
})
