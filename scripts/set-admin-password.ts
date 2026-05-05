/**
 * Reset an admin password (ops recovery). Usage:
 *   npx tsx scripts/set-admin-password.ts <username> <newPassword>
 * Requires DATABASE_URL. New password must meet MIN_ADMIN_PASSWORD_LENGTH.
 */
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import {
  BCRYPT_SALT_ROUNDS,
  validateNewAdminPassword
} from '../src/lib/admin-password-policy'

async function main() {
  const username = process.argv[2]
  const newPassword = process.argv[3]

  if (!username || !newPassword) {
    console.error('Usage: npx tsx scripts/set-admin-password.ts <username> <newPassword>')
    process.exit(1)
  }

  const err = validateNewAdminPassword(newPassword)
  if (err) {
    console.error(err)
    process.exit(1)
  }

  const prisma = new PrismaClient()
  try {
    const admin = await prisma.admin.findUnique({ where: { username } })
    if (!admin) {
      console.error(`No admin with username "${username}"`)
      process.exit(1)
    }
    const hashed = await bcrypt.hash(newPassword, BCRYPT_SALT_ROUNDS)
    await prisma.admin.update({
      where: { id: admin.id },
      data: { password: hashed }
    })
    console.log(`Password updated for "${username}".`)
  } finally {
    await prisma.$disconnect()
  }
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
