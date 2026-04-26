import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient({
  datasources: { db: { url: process.env.DATABASE_URL } }
})

async function main() {
  const subs = ['feature_1_subtitle', 'feature_2_subtitle', 'feature_3_subtitle']
  for (const key of subs) {
    const existing = await prisma.content.findUnique({ where: { key } })
    if (!existing) {
      await prisma.content.create({ data: { key, en: '', zh: '', id_text: '' } })
      console.log('Created:', key)
    } else {
      console.log('Already exists:', key)
    }
  }
}

main()
  .then(() => prisma.$disconnect())
  .catch(e => { console.error(e); prisma.$disconnect(); process.exit(1) })
