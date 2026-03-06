import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { agents } from '@/lib/schema';
import { eq } from 'drizzle-orm';

function checkAuth(request: Request): boolean {
    const authHeader = request.headers.get('authorization');
    return authHeader === `Bearer ${process.env.ADMIN_API_TOKEN}`;
}

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const item = await db.select().from(agents).where(eq(agents.id, parseInt(id)));
        
        if (!item.length) {
            return NextResponse.json({ error: 'Agent not found' }, { status: 404 });
        }
        
        return NextResponse.json(item[0]);
    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json({ error: 'Failed to fetch agent' }, { status: 500 });
    }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
    if (!checkAuth(request)) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    try {
        const { id } = await params;
        const body = await request.json();
        
        const existing = await db.select().from(agents).where(eq(agents.id, parseInt(id)));
        
        if (!existing.length) {
            return NextResponse.json({ error: 'Agent not found' }, { status: 404 });
        }
        
        const { name, role, photo_url, total_sold, total_clients, sort_order } = body;
        
        await db.update(agents).set({
            name: name ?? existing[0].name,
            role: role ?? existing[0].role,
            photoUrl: photo_url ?? existing[0].photoUrl,
            totalSold: total_sold ?? existing[0].totalSold,
            totalClients: total_clients ?? existing[0].totalClients,
            sortOrder: sort_order ?? existing[0].sortOrder
        }).where(eq(agents.id, parseInt(id)));
        
        return NextResponse.json({ message: 'Agent updated' });
    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json({ error: 'Failed to update agent' }, { status: 500 });
    }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
    if (!checkAuth(request)) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    try {
        const { id } = await params;
        
        await db.delete(agents).where(eq(agents.id, parseInt(id)));
        
        return NextResponse.json({ message: 'Agent deleted' });
    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json({ error: 'Failed to delete agent' }, { status: 500 });
    }
}
