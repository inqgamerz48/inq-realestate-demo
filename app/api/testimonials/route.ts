import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { testimonials } from '@/lib/schema';
import { eq, desc } from 'drizzle-orm';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const active = searchParams.get('active');
        
        let items;
        if (active !== null) {
            items = await db.select().from(testimonials).where(eq(testimonials.active, parseInt(active))).orderBy(desc(testimonials.createdAt));
        } else {
            items = await db.select().from(testimonials).orderBy(desc(testimonials.createdAt));
        }
        return NextResponse.json(items);
    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json({ error: 'Failed to fetch testimonials' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, initials, info, rating, text } = body;
        
        if (!name || !text) {
            return NextResponse.json({ error: 'name and text are required' }, { status: 400 });
        }
        
        const result = await db.insert(testimonials).values({
            name,
            initials: initials || name.split(' ').map((w: string) => w[0]).join('').substring(0, 2).toUpperCase(),
            info: info || '',
            rating: rating || 5,
            text
        }).returning({ id: testimonials.id });
        
        return NextResponse.json({ id: result[0].id, message: 'Testimonial created' }, { status: 201 });
    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json({ error: 'Failed to create testimonial' }, { status: 500 });
    }
}
