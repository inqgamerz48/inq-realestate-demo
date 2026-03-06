import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { inquiries } from '@/lib/schema';
import { eq } from 'drizzle-orm';

function checkAuth(request: Request): boolean {
    const authHeader = request.headers.get('authorization');
    return authHeader === `Bearer ${process.env.ADMIN_API_TOKEN}`;
}

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
    if (!checkAuth(request)) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    try {
        const { id } = await params;
        const item = await db.select().from(inquiries).where(eq(inquiries.id, parseInt(id)));
        
        if (!item.length) {
            return NextResponse.json({ error: 'Inquiry not found' }, { status: 404 });
        }
        
        return NextResponse.json(item[0]);
    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json({ error: 'Failed to fetch inquiry' }, { status: 500 });
    }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
    if (!checkAuth(request)) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    try {
        const { id } = await params;
        const body = await request.json();
        
        const existing = await db.select().from(inquiries).where(eq(inquiries.id, parseInt(id)));
        
        if (!existing.length) {
            return NextResponse.json({ error: 'Inquiry not found' }, { status: 404 });
        }
        
        const { name, email, phone, message, status } = body;
        
        await db.update(inquiries).set({
            name: name ?? existing[0].name,
            email: email ?? existing[0].email,
            phone: phone ?? existing[0].phone,
            message: message ?? existing[0].message,
            status: status ?? existing[0].status
        }).where(eq(inquiries.id, parseInt(id)));
        
        return NextResponse.json({ message: 'Inquiry updated' });
    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json({ error: 'Failed to update inquiry' }, { status: 500 });
    }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
    if (!checkAuth(request)) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    try {
        const { id } = await params;
        
        await db.delete(inquiries).where(eq(inquiries.id, parseInt(id)));
        
        return NextResponse.json({ message: 'Inquiry deleted' });
    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json({ error: 'Failed to delete inquiry' }, { status: 500 });
    }
}
