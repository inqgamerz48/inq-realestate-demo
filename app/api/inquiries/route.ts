import { NextRequest, NextResponse } from 'next/server'
import { sql } from '@/lib/db'
import '@/lib/schema'

export async function GET(request: NextRequest) {
  try {
    const cookieHeader = request.headers.get('cookie')
    if (!cookieHeader?.includes('admin_session=1')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const result = await sql`SELECT * FROM inquiries ORDER BY created_at DESC`
    return NextResponse.json(result)
  } catch (error) {
    console.error('Inquiries GET error:', error)
    return NextResponse.json({ error: 'Failed to fetch inquiries' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, phone, message, agent_id, property_id } = body

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Name, email, and message are required' }, { status: 400 })
    }

    const result = await sql`
      INSERT INTO inquiries (name, email, phone, message, agent_id, property_id)
      VALUES (${name}, ${email}, ${phone}, ${message}, ${agent_id}, ${property_id})
      RETURNING *
    `

    return NextResponse.json(result[0])
  } catch (error) {
    console.error('Inquiries POST error:', error)
    return NextResponse.json({ error: 'Failed to submit inquiry' }, { status: 500 })
  }
}
