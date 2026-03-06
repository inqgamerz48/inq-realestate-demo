import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { properties } from '@/lib/schema';
import { eq } from 'drizzle-orm';

function checkAuth(request: Request): boolean {
    const authHeader = request.headers.get('authorization');
    return authHeader === `Bearer ${process.env.ADMIN_API_TOKEN}`;
}

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const item = await db.select().from(properties).where(eq(properties.id, parseInt(id)));
        
        if (!item.length) {
            return NextResponse.json({ error: 'Property not found' }, { status: 404 });
        }
        
        return NextResponse.json(item[0]);
    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json({ error: 'Failed to fetch property' }, { status: 500 });
    }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
    if (!checkAuth(request)) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    try {
        const { id } = await params;
        const body = await request.json();
        
        const existing = await db.select().from(properties).where(eq(properties.id, parseInt(id)));
        
        if (!existing.length) {
            return NextResponse.json({ error: 'Property not found' }, { status: 404 });
        }
        
        const { image_url, badge, badge_class, price, name, location, beds, baths, sqft, category, featured } = body;
        
        await db.update(properties).set({
            imageUrl: image_url ?? existing[0].imageUrl,
            badge: badge ?? existing[0].badge,
            badgeClass: badge_class ?? existing[0].badgeClass,
            price: price ?? existing[0].price,
            name: name ?? existing[0].name,
            location: location ?? existing[0].location,
            beds: beds ?? existing[0].beds,
            baths: baths ?? existing[0].baths,
            sqft: sqft ?? existing[0].sqft,
            category: category ?? existing[0].category,
            featured: featured ?? existing[0].featured
        }).where(eq(properties.id, parseInt(id)));
        
        return NextResponse.json({ message: 'Property updated' });
    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json({ error: 'Failed to update property' }, { status: 500 });
    }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
    if (!checkAuth(request)) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    try {
        const { id } = await params;
        
        await db.delete(properties).where(eq(properties.id, parseInt(id)));
        
        return NextResponse.json({ message: 'Property deleted' });
    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json({ error: 'Failed to delete property' }, { status: 500 });
    }
}
