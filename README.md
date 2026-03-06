# Meridian Properties - Real Estate Next.js App

A modern real estate website with full CMS powered by Next.js, Neon PostgreSQL, and Drizzle ORM.

## Features

- **Properties Management** - Add, edit, delete property listings with images, prices, badges
- **Agents Management** - Manage real estate agents with photos and stats
- **Testimonials** - Customer reviews with ratings
- **Inquiries** - Contact form submissions with status tracking
- **Full Admin Panel** at `/admin` with token authentication

## Tech Stack

- **Framework:** Next.js 16
- **Database:** Neon PostgreSQL
- **ORM:** Drizzle ORM
- **Styling:** Tailwind CSS
- **Icons:** Lucide React

## Getting Started

### 1. Clone and Install

```bash
npm install
```

### 2. Setup Database

Create a PostgreSQL database on [Neon](https://neon.tech) and get your connection string.

```bash
# Copy env file
cp .env.example .env

# Add your DATABASE_URL to .env
DATABASE_URL=your_neon_connection_string
```

### 3. Push Database Schema

```bash
npx drizzle-kit push
```

### 4. Run Development Server

```bash
npm run dev
```

Visit http://localhost:3000

## Admin Panel

Access at http://localhost:3000/admin

You'll need to set an admin token (any string works for now - can be enhanced with proper auth later).

## API Routes

- `GET /api/properties` - List all properties
- `POST /api/properties` - Create property
- `GET /api/properties/[id]` - Get property
- `PUT /api/properties/[id]` - Update property
- `DELETE /api/properties/[id]` - Delete property

- `GET /api/agents` - List all agents
- `POST /api/agents` - Create agent
- `GET /api/agents/[id]` - Get agent
- `PUT /api/agents/[id]` - Update agent
- `DELETE /api/agents/[id]` - Delete agent

- `GET /api/testimonials` - List testimonials
- `POST /api/testimonials` - Create testimonial
- `GET /api/testimonials/[id]` - Get testimonial
- `PUT /api/testimonials/[id]` - Update testimonial
- `DELETE /api/testimonials/[id]` - Delete testimonial

- `GET /api/inquiries` - List inquiries
- `POST /api/inquiries` - Create inquiry
- `GET /api/inquiries/[id]` - Get inquiry
- `PUT /api/inquiries/[id]` - Update inquiry
- `DELETE /api/inquiries/[id]` - Delete inquiry

## Deployment

Deploy to Vercel:

1. Push to GitHub
2. Import project in Vercel
3. Add `DATABASE_URL` environment variable
4. Deploy!

## License

MIT
