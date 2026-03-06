import { NextRequest, NextResponse } from 'next/server'
import { sql } from '@/lib/db'
import '@/lib/schema'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search')

    let result
    if (search) {
      result = await sql`
        SELECT * FROM properties 
        WHERE name ILIKE ${`%${search}%`} OR location ILIKE ${`%${search}%`} OR price ILIKE ${`%${search}%`}
        ORDER BY created_at DESC
      `
    } else {
      result = await sql`SELECT * FROM properties ORDER BY created_at DESC`
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error('Properties GET error:', error)
    return NextResponse.json({ error: 'Failed to fetch properties' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const cookieHeader = request.headers.get('cookie')
    if (!cookieHeader?.includes('admin_session=1')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { name, price, location, beds, baths, sqft, image_url, badge, badge_class, category } = body

    const result = await sql`
      INSERT INTO properties (name, price, location, beds, baths, sqft, image_url, badge, badge_class, category)
      VALUES (${name}, ${price}, ${location}, ${beds}, ${baths}, ${sqft}, ${image_url}, ${badge}, ${badge_class}, ${category})
      RETURNING *
    `

    return NextResponse.json(result[0])
  } catch (error) {
    console.error('Properties POST error:', error)
    return NextResponse.json({ error: 'Failed to create property' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const cookieHeader = request.headers.get('cookie')
    if (!cookieHeader?.includes('admin_session=1')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { id, name, price, location, beds, baths, sqft, image_url, badge, badge_class, category } = body

    const result = await sql`
      UPDATE properties 
      SET name = ${name}, price = ${price}, location = ${location}, beds = ${beds}, 
          baths = ${baths}, sqft = ${sqft}, image_url = ${image_url}, badge = ${badge}, 
          badge_class = ${badge_class}, category = ${category}
      WHERE id = ${id}
      RETURNING *
    `

    return NextResponse.json(result[0])
  } catch (error) {
    console.error('Properties PUT error:', error)
    return NextResponse.json({ error: 'Failed to update property' }, { status: 500 })
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

    await sql`DELETE FROM properties WHERE id = ${parseInt(id)}`

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Properties DELETE error:', error)
    return NextResponse.json({ error: 'Failed to delete property' }, { status: 500 })
  }
}
