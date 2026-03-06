import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { properties, agents, testimonials } from '@/lib/schema';

export async function GET() {
    try {
        // Check if data already exists
        const existingProps = await db.select().from(properties);
        if (existingProps.length > 0) {
            return NextResponse.json({ message: 'Database already seeded' });
        }

        // Seed properties
        await db.insert(properties).values([
            { imageUrl: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&auto=format&fit=crop&q=80', badge: 'New Listing', badgeClass: 'new', price: '$2,450,000', name: 'The Glasshouse Estate', location: 'Beverly Hills, CA', beds: 5, baths: 6, sqft: 6200, category: 'luxury', featured: 1 },
            { imageUrl: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&auto=format&fit=crop&q=80', badge: 'Just Sold', badgeClass: 'sold', price: '$1,850,000', name: 'Modern Minimalist Villa', location: 'Hollywood Hills, CA', beds: 4, baths: 4, sqft: 4100, category: 'modern', featured: 0 },
            { imageUrl: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=800&auto=format&fit=crop&q=80', badge: 'Open House', badgeClass: 'open', price: '$3,200,000', name: 'Waterfront Mansion', location: 'Malibu, CA', beds: 6, baths: 8, sqft: 8500, category: 'luxury', featured: 1 },
            { imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop&q=80', badge: '', badgeClass: '', price: '$950,000', name: 'Urban Loft Space', location: 'Downtown LA, CA', beds: 2, baths: 2, sqft: 1800, category: 'residential', featured: 0 },
            { imageUrl: 'https://images.unsplash.com/photo-1600566753086-00f18efc2291?w=800&auto=format&fit=crop&q=80', badge: 'Price Drop', badgeClass: 'new', price: '$1,450,000', name: 'Classic Family Home', location: 'Pasadena, CA', beds: 4, baths: 3, sqft: 3200, category: 'residential', featured: 0 },
            { imageUrl: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800&auto=format&fit=crop&q=80', badge: '', badgeClass: '', price: '$8,500,000', name: 'The Crown Penthouse', location: 'Century City, CA', beds: 3, baths: 4, sqft: 4500, category: 'commercial', featured: 1 }
        ]);

        // Seed agents
        await db.insert(agents).values([
            { name: 'Sarah Jenkins', role: 'Principal Broker', photoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80', totalSold: 142, totalClients: 300, sortOrder: 0 },
            { name: 'Michael Chen', role: 'Luxury Specialist', photoUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&auto=format&fit=crop&q=80', totalSold: 85, totalClients: 150, sortOrder: 1 },
            { name: 'Elena Rodriguez', role: 'Commercial Director', photoUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&auto=format&fit=crop&q=80', totalSold: 64, totalClients: 120, sortOrder: 2 }
        ]);

        // Seed testimonials
        await db.insert(testimonials).values([
            { name: 'James & Emily W.', initials: 'JW', info: 'Bought in Beverly Hills', rating: 5, text: 'Sarah and her team made finding our dream home incredibly seamless. Their knowledge of the luxury market is unmatched.', active: 1 },
            { name: 'David Foster', initials: 'DF', info: 'Sold in Malibu', rating: 5, text: 'Meridian sold my property above asking price in just 14 days. The marketing and staging were absolutely world-class.', active: 1 },
            { name: 'Lisa Martinez', initials: 'LM', info: 'Bought in Pasadena', rating: 5, text: "As a first-time luxury buyer, I appreciated Michael's patience and expertise. He negotiated a fantastic deal for us.", active: 1 }
        ]);

        return NextResponse.json({ message: 'Database seeded successfully' });
    } catch (error) {
        console.error('Seed Error:', error);
        return NextResponse.json({ error: 'Failed to seed database', details: String(error) }, { status: 500 });
    }
}
