// 一次性迁移：将 Note.password 存量明文哈希为 bcrypt
// 用法：node scripts/hash-note-passwords.mjs
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const notes = await prisma.note.findMany({
    where: { password: { not: null } },
    select: { id: true, password: true }
  })
  console.log(`发现 ${notes.length} 条带密码的笔记`)
  for (const note of notes) {
    // bcrypt 哈希以 $2 开头，跳过已处理过的
    if (note.password.startsWith('$2')) continue
    await prisma.note.update({
      where: { id: note.id },
      data: { password: await bcrypt.hash(note.password, 10) }
    })
    console.log(`已哈希笔记 #${note.id}`)
  }
  console.log('迁移完成')
}

main().finally(() => prisma.$disconnect())
