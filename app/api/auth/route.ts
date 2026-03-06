import { NextRequest, NextResponse } from 'next/server'
import { sql } from '@/lib/db'
import '@/lib/schema'

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json()
    
    if (!token) {
      return NextResponse.json({ error: 'Token required' }, { status: 400 })
    }

    if (token !== process.env.NEXT_PUBLIC_ADMIN_TOKEN) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    const response = NextResponse.json({ success: true })
    
    response.cookies.set('admin_session', '1', {
      path: '/',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7
    })

    return response
  } catch (error) {
    console.error('Auth error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
