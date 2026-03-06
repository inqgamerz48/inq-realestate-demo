import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { agents } from '@/lib/schema';
import { eq, asc } from 'drizzle-orm';

export async function GET() {
    try {
        const items = await db.select().from(agents).orderBy(asc(agents.sortOrder));
        return NextResponse.json(items);
    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json({ error: 'Failed to fetch agents' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, role, photo_url, total_sold, total_clients, sort_order } = body;
        
        if (!name || !role || !photo_url || !total_sold || !total_clients) {
            return NextResponse.json({ error: 'name, role, photo_url, total_sold, and total_clients are required' }, { status: 400 });
        }
        
        const result = await db.insert(agents).values({
            name,
            role,
            photoUrl: photo_url,
            totalSold: total_sold,
            totalClients: total_clients,
            sortOrder: sort_order || 0
        }).returning({ id: agents.id });
        
        return NextResponse.json({ id: result[0].id, message: 'Agent created' }, { status: 201 });
    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json({ error: 'Failed to create agent' }, { status: 500 });
    }
}
