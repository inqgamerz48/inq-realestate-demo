import { NextRequest, NextResponse } from 'next/server'
import { sql } from '@/lib/db'
import '@/lib/schema'

export async function GET() {
  try {
    const result = await sql`SELECT * FROM testimonials WHERE active = true ORDER BY created_at DESC`
    return NextResponse.json(result)
  } catch (error) {
    console.error('Testimonials GET error:', error)
    return NextResponse.json({ error: 'Failed to fetch testimonials' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const cookieHeader = request.headers.get('cookie')
    if (!cookieHeader?.includes('admin_session=1')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { name, initials, text, rating, info, active } = body

    const result = await sql`
      INSERT INTO testimonials (name, initials, text, rating, info, active)
      VALUES (${name}, ${initials}, ${text}, ${rating}, ${info}, ${active ?? true})
      RETURNING *
    `

    return NextResponse.json(result[0])
  } catch (error) {
    console.error('Testimonials POST error:', error)
    return NextResponse.json({ error: 'Failed to create testimonial' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const cookieHeader = request.headers.get('cookie')
    if (!cookieHeader?.includes('admin_session=1')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { id, name, initials, text, rating, info, active } = body

    const result = await sql`
      UPDATE testimonials 
      SET name = ${name}, initials = ${initials}, text = ${text}, 
          rating = ${rating}, info = ${info}, active = ${active}
      WHERE id = ${id}
      RETURNING *
    `

    return NextResponse.json(result[0])
  } catch (error) {
    console.error('Testimonials PUT error:', error)
    return NextResponse.json({ error: 'Failed to update testimonial' }, { status: 500 })
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

    await sql`DELETE FROM testimonials WHERE id = ${parseInt(id)}`

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Testimonials DELETE error:', error)
    return NextResponse.json({ error: 'Failed to delete testimonial' }, { status: 500 })
  }
}
