import { pgTable, text, serial, integer, timestamp } from 'drizzle-orm/pg-core';

export const properties = pgTable('properties', {
    id: serial('id').primaryKey(),
    imageUrl: text('image_url').notNull(),
    badge: text('badge'),
    badgeClass: text('badge_class'),
    price: text('price').notNull(),
    name: text('name').notNull(),
    location: text('location').notNull(),
    beds: integer('beds'),
    baths: integer('baths'),
    sqft: integer('sqft'),
    category: text('category').notNull(),
    featured: integer('featured').default(0),
    createdAt: timestamp('created_at').defaultNow()
});

export const agents = pgTable('agents', {
    id: serial('id').primaryKey(),
    name: text('name').notNull(),
    role: text('role').notNull(),
    photoUrl: text('photo_url').notNull(),
    totalSold: integer('total_sold').notNull(),
    totalClients: integer('total_clients').notNull(),
    sortOrder: integer('sort_order').default(0),
    createdAt: timestamp('created_at').defaultNow()
});

export const testimonials = pgTable('testimonials', {
    id: serial('id').primaryKey(),
    name: text('name').notNull(),
    initials: text('initials'),
    info: text('info'),
    rating: integer('rating').default(5),
    text: text('text').notNull(),
    active: integer('active').default(1),
    createdAt: timestamp('created_at').defaultNow()
});

export const inquiries = pgTable('inquiries', {
    id: serial('id').primaryKey(),
    name: text('name').notNull(),
    email: text('email').notNull(),
    phone: text('phone'),
    message: text('message').notNull(),
    propertyId: integer('property_id'),
    agentId: integer('agent_id'),
    status: text('status').default('pending'),
    createdAt: timestamp('created_at').defaultNow()
});
