import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/db'
import { requireAdmin } from '@/lib/admin-auth'
import { BCRYPT_SALT_ROUNDS, validateNewAdminPassword } from '@/lib/admin-password-policy'

export async function POST(request: NextRequest) {
  const auth = requireAdmin(request)
  if (auth instanceof NextResponse) {
    return auth
  }

  try {
    const body = await request.json()
    const { currentPassword, newPassword } = body

    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { error: 'Missing currentPassword or newPassword' },
        { status: 400 }
      )
    }

    const pwErr = validateNewAdminPassword(newPassword)
    if (pwErr) {
      return NextResponse.json({ error: pwErr }, { status: 400 })
    }

    const admin = await prisma.admin.findUnique({
      where: { id: auth.adminId }
    })

    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const ok = await bcrypt.compare(currentPassword, admin.password)
    if (!ok) {
      return NextResponse.json({ error: 'Current password is incorrect' }, { status: 401 })
    }

    const hashed = await bcrypt.hash(newPassword, BCRYPT_SALT_ROUNDS)
    await prisma.admin.update({
      where: { id: auth.adminId },
      data: { password: hashed }
    })

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('Admin change password error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
