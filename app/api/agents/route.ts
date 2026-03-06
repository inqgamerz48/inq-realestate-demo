import { NextRequest, NextResponse } from 'next/server'
import { sql } from '@/lib/db'
import '@/lib/schema'

export async function GET() {
  try {
    const result = await sql`SELECT * FROM agents ORDER BY created_at DESC`
    return NextResponse.json(result)
  } catch (error) {
    console.error('Agents GET error:', error)
    return NextResponse.json({ error: 'Failed to fetch agents' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const cookieHeader = request.headers.get('cookie')
    if (!cookieHeader?.includes('admin_session=1')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { name, role, photo_url, total_sold, total_clients } = body

    const result = await sql`
      INSERT INTO agents (name, role, photo_url, total_sold, total_clients)
      VALUES (${name}, ${role}, ${photo_url}, ${total_sold}, ${total_clients})
      RETURNING *
    `

    return NextResponse.json(result[0])
  } catch (error) {
    console.error('Agents POST error:', error)
    return NextResponse.json({ error: 'Failed to create agent' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const cookieHeader = request.headers.get('cookie')
    if (!cookieHeader?.includes('admin_session=1')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { id, name, role, photo_url, total_sold, total_clients } = body

    const result = await sql`
      UPDATE agents 
      SET name = ${name}, role = ${role}, photo_url = ${photo_url}, 
          total_sold = ${total_sold}, total_clients = ${total_clients}
      WHERE id = ${id}
      RETURNING *
    `

    return NextResponse.json(result[0])
  } catch (error) {
    console.error('Agents PUT error:', error)
    return NextResponse.json({ error: 'Failed to update agent' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const cookieHeader = request.headers.get('cookie')
    if (!cookieHeader?.includes('admin_session=1')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'ID required' }, { status: 400 })
    }

    await sql`DELETE FROM agents WHERE id = ${parseInt(id)}`

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Agents DELETE error:', error)
    return NextResponse.json({ error: 'Failed to delete agent' }, { status: 500 })
  }
}
