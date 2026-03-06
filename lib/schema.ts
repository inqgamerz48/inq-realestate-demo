import { sql } from './db'

async function initSchema() {
  await sql`
    CREATE TABLE IF NOT EXISTS properties (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      price TEXT,
      location TEXT,
      beds INT DEFAULT 0,
      baths INT DEFAULT 0,
      sqft INT DEFAULT 0,
      image_url TEXT,
      badge TEXT,
      badge_class TEXT,
      category TEXT,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `
  
  await sql`
    CREATE TABLE IF NOT EXISTS agents (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      role TEXT,
      photo_url TEXT,
      total_sold INT DEFAULT 0,
      total_clients INT DEFAULT 0,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `
  
  await sql`
    CREATE TABLE IF NOT EXISTS testimonials (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      initials TEXT,
      text TEXT,
      rating INT DEFAULT 5,
      info TEXT,
      active BOOLEAN DEFAULT true,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `
  
  await sql`
    CREATE TABLE IF NOT EXISTS inquiries (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT,
      phone TEXT,
      message TEXT,
      agent_id INT,
      property_id INT,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `

  const existingProps = await sql`SELECT COUNT(*) as count FROM properties`
  if (Number(existingProps[0].count) === 0) {
    await sql`
      INSERT INTO properties (name, price, location, beds, baths, sqft, image_url, badge, badge_class, category) VALUES
      ('Tribeca Penthouse Loft', '$3,450,000', 'Tribeca, Manhattan', 3, 3, 2850, 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&auto=format&fit=crop&q=80', 'For Sale', '', 'residential'),
      ('Central Park South 2BR', '$2,875,000', 'Central Park South, NYC', 2, 2, 1650, 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop&q=80', 'New Listing', '', 'residential'),
      ('SoHo Designer Loft', '$5,200,000', 'SoHo, Manhattan', 4, 4, 3200, 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&auto=format&fit=crop&q=80', 'Luxury', '', 'residential'),
      ('Brooklyn Heights Brownstone', '$4,100,000', 'Brooklyn Heights', 5, 4, 4100, 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&auto=format&fit=crop&q=80', 'For Sale', '', 'residential'),
      ('Hudson Yards Studio', '$1,250,000', 'Hudson Yards, Manhattan', 1, 1, 750, 'https://images.unsplash.com/photo-1600573472550-8090b5e0745e?w=800&auto=format&fit=crop&q=80', 'For Sale', '', 'residential'),
      ('Upper East Side Classic', '$3,900,000', 'Upper East Side, NYC', 3, 3, 2400, 'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800&auto=format&fit=crop&q=80', 'For Sale', '', 'residential'),
      ('Chelsea Art District Loft', '$2,100,000', 'Chelsea, Manhattan', 2, 2, 1400, 'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800&auto=format&fit=crop&q=80', 'For Sale', '', 'residential'),
      ('Hamptons Beach Estate', '$12,500,000', 'East Hampton, NY', 6, 7, 6500, 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800&auto=format&fit=crop&q=80', 'Luxury', '', 'residential'),
      ('Gramercy Park 1BR', '$1,450,000', 'Gramercy, Manhattan', 1, 1, 900, 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800&auto=format&fit=crop&q=80', 'For Sale', '', 'residential'),
      ('Financial District Tower', '$1,875,000', 'Financial District, NYC', 2, 2, 1200, 'https://images.unsplash.com/photo-1600607687644-c7171b42498b?w=800&auto=format&fit=crop&q=80', 'New Development', '', 'residential')
    `
  }

  const existingAgents = await sql`SELECT COUNT(*) as count FROM agents`
  if (Number(existingAgents[0].count) === 0) {
    await sql`
      INSERT INTO agents (name, role, photo_url, total_sold, total_clients) VALUES
      ('Sarah Mitchell', 'Senior Broker', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80', 245, 180),
      ('James Chen', 'Luxury Specialist', 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&auto=format&fit=crop&q=80', 312, 225),
      ('Emily Rodriguez', 'Residential Expert', 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&auto=format&fit=crop&q=80', 189, 156),
      ('Michael Thompson', 'Investment Advisor', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&auto=format&fit=crop&q=80', 278, 198)
    `
  }

  const existingTesti = await sql`SELECT COUNT(*) as count FROM testimonials`
  if (Number(existingTesti[0].count) === 0) {
    await sql`
      INSERT INTO testimonials (name, initials, text, rating, info) VALUES
      ('David & Jennifer Park', 'DP', 'Meridian Properties made our first home buying experience seamless. Their market knowledge is unparalleled and they found us the perfect apartment in Brooklyn.', 5, 'Bought in Brooklyn Heights'),
      ('Amanda Wright', 'AW', 'Selling my Manhattan condo was stress-free thanks to the incredible team. They got me above asking price within a week!', 5, 'Sold in Tribeca'),
      ('Robert Kim', 'RK', 'As an investor, I need agents who understand the market. This team delivers consistently exceptional results.', 5, 'Investor · 5 properties'),
      ('Lisa Martinez', 'LM', 'They listened to exactly what we wanted and found us a dream home in the Hamptons. Could not recommend more highly!', 5, 'Bought in East Hampton')
    `
  }

  console.log('Database schema initialized')
}

initSchema().catch(console.error)
