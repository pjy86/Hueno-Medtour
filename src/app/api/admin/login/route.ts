import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { prisma } from '@/lib/db'
import { resolveAdminJwtSecret } from '@/lib/admin-auth'
import { setAdminSessionCookie } from '@/lib/admin-session-cookie'
import { consumeLoginAttempt, getClientIp } from '@/lib/login-rate-limit'

export async function POST(request: NextRequest) {
  try {
    const secretResolved = resolveAdminJwtSecret()
    if ('response' in secretResolved) {
      return secretResolved.response
    }

    const ip = getClientIp(request)
    if (!consumeLoginAttempt(`login:${ip}`)) {
      return NextResponse.json(
        { error: 'Too many login attempts. Please try again later.' },
        { status: 429 }
      )
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

    const res = NextResponse.json({ ok: true })
    setAdminSessionCookie(res, token)
    return res
  } catch (error) {
    console.error('Admin Login Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
