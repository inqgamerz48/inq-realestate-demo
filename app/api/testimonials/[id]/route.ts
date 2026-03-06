import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { testimonials } from '@/lib/schema';
import { eq } from 'drizzle-orm';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const item = await db.select().from(testimonials).where(eq(testimonials.id, parseInt(id)));
        
        if (!item.length) {
            return NextResponse.json({ error: 'Testimonial not found' }, { status: 404 });
        }
        
        return NextResponse.json(item[0]);
    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json({ error: 'Failed to fetch testimonial' }, { status: 500 });
    }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const body = await request.json();
        
        const existing = await db.select().from(testimonials).where(eq(testimonials.id, parseInt(id)));
        
        if (!existing.length) {
            return NextResponse.json({ error: 'Testimonial not found' }, { status: 404 });
        }
        
        const { name, initials, info, rating, text, active } = body;
        
        await db.update(testimonials).set({
            name: name ?? existing[0].name,
            initials: initials ?? existing[0].initials,
            info: info ?? existing[0].info,
            rating: rating ?? existing[0].rating,
            text: text ?? existing[0].text,
            active: active ?? existing[0].active
        }).where(eq(testimonials.id, parseInt(id)));
        
        return NextResponse.json({ message: 'Testimonial updated' });
    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json({ error: 'Failed to update testimonial' }, { status: 500 });
    }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        
        await db.delete(testimonials).where(eq(testimonials.id, parseInt(id)));
        
        return NextResponse.json({ message: 'Testimonial deleted' });
    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json({ error: 'Failed to delete testimonial' }, { status: 500 });
    }
}
