import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { prisma } from '@/lib/db'
import { resolveAdminJwtSecret } from '@/lib/admin-auth'

export async function POST(request: NextRequest) {
  try {
    const secretResolved = resolveAdminJwtSecret()
    if ('response' in secretResolved) {
      return secretResolved.response
    }

    const { username, password } = await request.json()

    if (!username || !password) {
      return NextResponse.json(
        { error: 'Missing credentials' },
        { status: 400 }
      )
    }

    const admin = await prisma.admin.findUnique({
      where: { username }
    })

    if (!admin) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    const isValid = await bcrypt.compare(password, admin.password)

    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    const token = jwt.sign(
      { adminId: admin.id, username: admin.username },
      secretResolved.secret,
      { expiresIn: '7d' }
    )

    return NextResponse.json({ token })
  } catch (error) {
    console.error('Admin Login Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
