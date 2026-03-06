import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { inquiries } from '@/lib/schema';
import { eq } from 'drizzle-orm';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const status = searchParams.get('status');
        
        let items;
        if (status) {
            items = await db.select().from(inquiries).where(eq(inquiries.status, status));
        } else {
            items = await db.select().from(inquiries);
        }
        return NextResponse.json(items);
    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json({ error: 'Failed to fetch inquiries' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, email, phone, message, property_id, agent_id } = body;
        
        if (!name || !email || !message) {
            return NextResponse.json({ error: 'name, email, and message are required' }, { status: 400 });
        }
        
        const result = await db.insert(inquiries).values({
            name,
            email,
            phone: phone || '',
            message,
            propertyId: property_id || null,
            agentId: agent_id || null,
            status: 'pending'
        }).returning({ id: inquiries.id });
        
        return NextResponse.json({ id: result[0].id, message: 'Inquiry created' }, { status: 201 });
    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json({ error: 'Failed to create inquiry' }, { status: 500 });
    }
}
