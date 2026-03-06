import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { properties } from '@/lib/schema';
import { eq } from 'drizzle-orm';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const category = searchParams.get('category');
        const featured = searchParams.get('featured');
        
        let items;
        if (category) {
            items = await db.select().from(properties).where(eq(properties.category, category));
        } else if (featured) {
            items = await db.select().from(properties).where(eq(properties.featured, parseInt(featured)));
        } else {
            items = await db.select().from(properties);
        }
        return NextResponse.json(items);
    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json({ error: 'Failed to fetch properties' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { image_url, badge, badge_class, price, name, location, beds, baths, sqft, category, featured } = body;
        
        if (!image_url || !price || !name || !location || !category) {
            return NextResponse.json({ error: 'image_url, price, name, location, and category are required' }, { status: 400 });
        }
        
        const result = await db.insert(properties).values({
            imageUrl: image_url,
            badge: badge || '',
            badgeClass: badge_class || '',
            price,
            name,
            location,
            beds: beds || null,
            baths: baths || null,
            sqft: sqft || null,
            category,
            featured: featured || 0
        }).returning({ id: properties.id });
        
        return NextResponse.json({ id: result[0].id, message: 'Property created' }, { status: 201 });
    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json({ error: 'Failed to create property' }, { status: 500 });
    }
}
