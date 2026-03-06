'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type Property = {
  id: number;
  name: string;
  price: string;
  location: string;
  beds: number;
  baths: number;
  sqft: number;
  imageUrl: string;
  badge: string;
  badgeClass: string;
  category: string;
};

type Agent = {
  id: number;
  name: string;
  role: string;
  photoUrl: string;
  totalSold: number;
  totalClients: number;
};

type Testimonial = {
  id: number;
  name: string;
  initials: string;
  info: string;
  rating: number;
  text: string;
  active: number;
};

export default function Home() {
  const [darkMode, setDarkMode] = useState(false);
  const [properties, setProperties] = useState<Property[]>([]);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [activeFilter, setActiveFilter] = useState('All');
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  useEffect(() => {
    fetch('/api/properties')
      .then(res => res.json())
      .then(data => Array.isArray(data) && setProperties(data))
      .catch(console.error);

    fetch('/api/agents')
      .then(res => res.json())
      .then(data => Array.isArray(data) && setAgents(data))
      .catch(console.error);

    fetch('/api/testimonials')
      .then(res => res.json())
      .then(data => Array.isArray(data) && setTestimonials(data.filter((t: Testimonial) => t.active)))
      .catch(console.error);
  }, []);

  const filteredProperties = activeFilter === 'All' 
    ? properties 
    : properties.filter(p => {
        if (activeFilter === 'Buy') return p.badge === 'For Sale' || p.badge === 'New Listing' || p.category === 'residential';
        if (activeFilter === 'Rent') return p.badgeClass === 'rent';
        if (activeFilter === 'Luxury') return p.category === 'luxury';
        if (activeFilter === 'Commercial') return p.category === 'commercial';
        return true;
      });

  const handleSearch = () => {
    // Search handled client-side
  };

  return (
    <main className="min-h-screen bg-[var(--bg)] text-[var(--text)] transition-colors duration-300">
      {/* NAV */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-[6%] py-5 bg-[var(--bg)]/95 backdrop-blur-md border-b border-[var(--border)]">
        <div className="font-display text-xl text-[var(--navy)]">
          Meridian <span className="text-[var(--accent)]">Properties</span>
        </div>
        
        <ul className="hidden md:flex gap-10 list-none">
          <li><a href="#listings" className="text-[var(--muted)] text-sm font-medium tracking-widest uppercase hover:text-[var(--navy)] transition-colors">Listings</a></li>
          <li><a href="#why" className="text-[var(--muted)] text-sm font-medium tracking-widest uppercase hover:text-[var(--navy)] transition-colors">Why Us</a></li>
          <li><a href="#agents" className="text-[var(--muted)] text-sm font-medium tracking-widest uppercase hover:text-[var(--navy)] transition-colors">Agents</a></li>
          <li><a href="#process" className="text-[var(--muted)] text-sm font-medium tracking-widest uppercase hover:text-[var(--navy)] transition-colors">Process</a></li>
        </ul>
        
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setDarkMode(!darkMode)}
            className="w-10 h-10 rounded-full border border-[var(--border)] flex items-center justify-center text-[var(--muted)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors"
          >
            {darkMode ? '☀️' : '🌙'}
          </button>
          <span className="hidden md:block text-[var(--muted)] text-sm font-medium">+1 (212) 888-0044</span>
          <button onClick={() => setShowModal(true)} className="bg-[var(--navy)] text-white px-5 py-2.5 border-none cursor-pointer font-semibold text-sm tracking-widest uppercase hover:bg-[var(--accent)] transition-colors">
            Book Consultation
          </button>
        </div>
      </nav>

      {/* HERO */}
      <section className="min-h-screen grid grid-cols-1 md:grid-cols-2 pt-[72px]">
        <div className="flex flex-col justify-center px-[8%] py-20 bg-[var(--surface)]">
          <div className="flex items-center gap-2 text-[var(--accent)] text-xs tracking-[0.2em] uppercase font-semibold mb-8">
            <span className="w-[30px] h-[1px] bg-[var(--accent)]"></span>
            Premium Real Estate · NYC & Beyond
          </div>
          <h1 className="font-display text-5xl md:text-6xl text-[var(--navy)] leading-tight mb-6">
            Find Your <em className="italic text-[var(--accent)] not-italic">Perfect</em> Place to Call Home
          </h1>
          <p className="text-[var(--muted)] text-base leading-relaxed max-w-[440px] mb-10 font-light">
            We connect discerning buyers and sellers with exceptional properties. From Manhattan penthouses to Hudson Valley estates — your dream home is closer than you think.
          </p>
          <div className="flex gap-3 mb-10">
            <input 
              type="text" 
              placeholder="Search by neighborhood, city, or ZIP…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 border border-[var(--border)] bg-[var(--bg)] px-4 py-3 text-sm outline-none"
            />
            <button onClick={handleSearch} className="bg-[var(--navy)] text-white px-6 py-3 border-none cursor-pointer font-semibold text-sm hover:bg-[var(--accent)] transition-colors whitespace-nowrap">
              Search
            </button>
          </div>
          <div className="flex gap-10">
            <div><strong className="block font-display text-2xl text-[var(--navy)]">2,400+</strong><span className="text-xs text-[var(--muted)] tracking-wider">Properties Sold</span></div>
            <div><strong className="block font-display text-2xl text-[var(--navy)]">$4.2B</strong><span className="text-xs text-[var(--muted)] tracking-wider">In Transactions</span></div>
            <div><strong className="block font-display text-2xl text-[var(--navy)]">98%</strong><span className="text-xs text-[var(--muted)] tracking-wider">Client Satisfaction</span></div>
          </div>
        </div>
        <div className="relative overflow-hidden">
          <img 
            src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&auto=format&fit=crop&q=80" 
            alt="Luxury Home" 
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-10 left-8 bg-white p-5 shadow-lg flex items-center gap-4">
            <span className="text-3xl">🏆</span>
            <div><strong className="block text-sm font-semibold text-[var(--navy)]">#1 Agency in NYC</strong><span className="text-xs text-[var(--muted)]">Forbes Real Estate 2024</span></div>
          </div>
          <div className="absolute bottom-10 right-8 flex flex-col items-center text-white/60 text-xs tracking-widest uppercase">
            <div className="w-[1px] h-12 bg-gradient-to-b from-white/60 to-transparent mb-2"></div>
            scroll
          </div>
        </div>
      </section>

      {/* MARQUEE */}
      <div className="bg-[var(--navy)] text-white/50 py-4 overflow-hidden">
        <div className="flex animate-marquee whitespace-nowrap">
          {['Manhattan ·', 'Brooklyn ·', 'The Hamptons ·', 'Hudson Valley ·', 'Greenwich ·', 'Tribeca ·', 'Upper East Side ·', 'SoHo ·', 'Park Slope ·', 'Westchester ·'].map((item, i) => (
            <span key={i} className="text-xs tracking-[0.15em] uppercase mx-6">{item}<span className="text-[var(--accent)]">·</span></span>
          ))}
          {['Manhattan ·', 'Brooklyn ·', 'The Hamptons ·', 'Hudson Valley ·', 'Greenwich ·', 'Tribeca ·', 'Upper East Side ·', 'SoHo ·', 'Park Slope ·', 'Westchester ·'].map((item, i) => (
            <span key={i + 10} className="text-xs tracking-[0.15em] uppercase mx-6">{item}<span className="text-[var(--accent)]">·</span></span>
          ))}
        </div>
      </div>

      {/* LISTINGS */}
      <section id="listings" className="py-24 px-[8%] bg-[var(--surface)]">
        <div className="flex justify-between items-end flex-wrap gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-[var(--accent)] text-xs tracking-[0.2em] uppercase font-semibold mb-2">
              <span className="w-6 h-[1px] bg-[var(--accent)]"></span> Featured Listings
            </div>
            <h2 className="font-display text-4xl text-[var(--navy)]">Properties You'll <em className="italic text-[var(--accent)] not-italic">Love</em></h2>
          </div>
          <a href="#" className="text-[var(--accent)] text-sm font-semibold tracking-wider no-underline">View All properties →</a>
        </div>

        <div className="flex gap-2 flex-wrap mb-12">
          {['All', 'Buy', 'Rent', 'New Development', 'Luxury', 'Commercial'].map(filter => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-6 py-2.5 border text-sm tracking-wider transition-all ${
                activeFilter === filter 
                ? 'bg-[var(--navy)] text-white border-[var(--navy)]' 
                : 'border-[var(--border)] text-[var(--muted)] hover:bg-[var(--navy)] hover:text-white hover:border-[var(--navy)]'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProperties.map((property, i) => (
            <motion.div
              key={property.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="border border-[var(--border)] overflow-hidden hover:-translate-y-2 hover:shadow-xl transition-all cursor-pointer group"
            >
              <div className="relative h-60 overflow-hidden">
                <img src={property.imageUrl} alt={property.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                {property.badge && (
                  <span className={`absolute top-4 left-4 bg-[var(--accent)] text-white text-xs font-bold tracking-widest uppercase px-3 py-1 ${property.badgeClass === 'rent' ? 'bg-[var(--navy)]' : ''} ${property.badgeClass === 'new' ? 'bg-green-600' : ''}`}>
                    {property.badge}
                  </span>
                )}
                <button className="absolute top-4 right-4 bg-white/90 w-9 h-9 flex items-center justify-center text-lg hover:bg-[var(--accent)] hover:text-white transition-all">♡</button>
              </div>
              <div className="p-6 bg-[var(--surface)]">
                <div className="font-display text-2xl text-[var(--navy)] mb-1">{property.price}</div>
                <div className="font-semibold text-sm mb-1">{property.name}</div>
                <div className="text-[var(--muted)] text-sm mb-4">📍 {property.location}</div>
                <div className="flex gap-6 pt-4 border-t border-[var(--border)]">
                  <span className="text-sm text-[var(--muted)]"><strong className="text-[var(--text)]">{property.beds}</strong> Beds</span>
                  <span className="text-sm text-[var(--muted)]"><strong className="text-[var(--text)]">{property.baths}</strong> Baths</span>
                  <span className="text-sm text-[var(--muted)]"><strong className="text-[var(--text)]">{property.sqft?.toLocaleString()}</strong> sq ft</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* WHY US */}
      <section id="why" className="py-24 px-[8%] bg-[var(--surface-alt)]">
        <div className="max-w-[1200px] mx-auto grid md:grid-cols-2 gap-20 items-center">
          <div className="relative">
            <img src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=900&auto=format&fit=crop&q=80" alt="Modern Interior" className="w-full h-[540px] object-cover" />
            <div className="absolute top-8 -right-8 bg-[var(--navy)] text-white p-6 text-center hidden md:block">
              <strong className="block font-display text-3xl text-[var(--accent)]">18+</strong>
              <span className="text-xs tracking-widest">Years of<br />Excellence</span>
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2 text-[var(--accent)] text-xs tracking-[0.2em] uppercase font-semibold mb-2">
              <span className="w-6 h-[1px] bg-[var(--accent)]"></span> Why Meridian
            </div>
            <h2 className="font-display text-4xl text-[var(--navy)] mb-4">A Smarter Way to Buy, Sell & <em className="italic text-[var(--accent)] not-italic">Invest</em></h2>
            <p className="text-[var(--muted)] leading-relaxed mb-8">We're not just agents — we're advisors, negotiators, and partners who stay with you from first search to final signature.</p>
            
            {[
              { num: '01', title: 'Market Intelligence', desc: 'Data-driven insights, neighborhood trends, and off-market access.' },
              { num: '02', title: 'Expert Negotiation', desc: 'Our agents average 4.7% below asking for buyers, 6.2% above for sellers.' },
              { num: '03', title: 'White-Glove Service', desc: 'From virtual tours to concierge moving support.' },
            ].map((point, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex gap-4 mb-6"
              >
                <div className="w-10 h-10 bg-[var(--accent)] text-white flex items-center justify-center font-bold text-sm shrink-0">{point.num}</div>
                <div>
                  <h4 className="font-semibold text-sm mb-1">{point.title}</h4>
                  <p className="text-[var(--muted)] text-sm leading-relaxed">{point.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* AGENTS */}
      <section id="agents" className="py-24 px-[8%] bg-[var(--surface)]">
        <div className="text-center max-w-[560px] mx-auto mb-12">
          <div className="flex items-center justify-center gap-2 text-[var(--accent)] text-xs tracking-[0.2em] uppercase font-semibold mb-2">
            <span className="w-6 h-[1px] bg-[var(--accent)]"></span> Our Team
          </div>
          <h2 className="font-display text-4xl text-[var(--navy)] mb-4">Meet Your <em className="italic text-[var(--accent)] not-italic">Expert</em> Agents</h2>
          <p className="text-[var(--muted)] text-sm leading-relaxed">Handpicked professionals with deep local knowledge.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-[1200px] mx-auto">
          {agents.map((agent, i) => (
            <motion.div
              key={agent.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center p-8 border border-[var(--border)] hover:border-[var(--accent)] hover:-translate-y-1 hover:shadow-lg transition-all"
            >
              <div className="w-24 h-24 mx-auto rounded-full overflow-hidden mb-5 border-4 border-[var(--accent)]">
                <img src={agent.photoUrl} alt={agent.name} className="w-full h-full object-cover" />
              </div>
              <div className="font-semibold text-lg mb-1">{agent.name}</div>
              <div className="text-[var(--accent)] text-xs tracking-widest uppercase mb-4">{agent.role}</div>
              <div className="flex justify-center gap-6 mb-4 text-sm">
                <div><strong className="font-bold text-[var(--navy)]">{agent.totalSold}</strong><span className="text-[var(--muted)] ml-1">Sales</span></div>
                <div><strong className="font-bold text-[var(--navy)]">{agent.totalClients}</strong><span className="text-[var(--muted)] ml-1">Clients</span></div>
              </div>
              <button onClick={() => setShowModal(true)} className="w-full bg-[var(--navy)] text-white py-2.5 border-none font-semibold text-sm hover:bg-[var(--accent)] transition-colors">
                Contact {agent.name.split(' ')[0]}
              </button>
            </motion.div>
          ))}
        </div>
      </section>

      {/* PROCESS */}
      <section id="process" className="py-24 px-[8%] bg-[var(--navy)] text-white">
        <div className="text-center max-w-[560px] mx-auto mb-16">
          <div className="flex items-center justify-center gap-2 text-[var(--accent)] text-xs tracking-[0.2em] uppercase font-semibold mb-2">
            <span className="w-6 h-[1px] bg-[var(--accent)]"></span> How It Works
          </div>
          <h2 className="font-display text-4xl">Simple Steps to Your <em className="italic text-[var(--accent)] not-italic">Dream Home</em></h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-[1200px] mx-auto relative">
          <div className="absolute top-8 left-[15%] right-[15%] h-px bg-white/10 hidden md:block"></div>
          {[
            { num: '01', title: 'Free Consultation', desc: 'Tell us what you\'re looking for. We listen and craft a search strategy.' },
            { num: '02', title: 'Curated Matches', desc: 'We hand-pick properties that fit your brief.' },
            { num: '03', title: 'Tours & Negotiation', desc: 'Private tours. We negotiate fiercely on your behalf.' },
            { num: '04', title: 'Seamless Closing', desc: 'We manage all paperwork and logistics.' },
          ].map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center relative"
            >
              <div className="w-14 h-14 bg-[var(--accent)] text-white flex items-center justify-center font-display text-xl mx-auto mb-6 relative z-10">
                {step.num}
              </div>
              <h4 className="font-semibold text-sm mb-2">{step.title}</h4>
              <p className="text-white/50 text-sm leading-relaxed">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-24 px-[8%] bg-[var(--surface-alt)]">
        <div className="text-center max-w-[560px] mx-auto mb-12">
          <div className="flex items-center justify-center gap-2 text-[var(--accent)] text-xs tracking-[0.2em] uppercase font-semibold mb-2">
            <span className="w-6 h-[1px] bg-[var(--accent)]"></span> Client Stories
          </div>
          <h2 className="font-display text-4xl text-[var(--navy)]">Trusted by <em className="italic text-[var(--accent)] not-italic">Thousands</em></h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-[1200px] mx-auto">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-[var(--surface)] border border-[var(--border)] p-8 hover:shadow-lg transition-shadow"
            >
              <div className="text-[var(--accent)] text-lg mb-4">{'★'.repeat(t.rating)}{'☆'.repeat(5 - t.rating)}</div>
              <p className="text-[var(--muted)] text-sm leading-relaxed italic mb-6">{t.text}</p>
              <div className="flex items-center gap-4 pt-4 border-t border-[var(--border)]">
                <div className="w-12 h-12 bg-[var(--accent)] text-white rounded-full flex items-center justify-center font-bold">
                  {t.initials}
                </div>
                <div>
                  <div className="font-semibold text-sm">{t.name}</div>
                  <div className="text-xs text-[var(--muted)]">{t.info}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="py-24 px-[6%] bg-[var(--surface-alt)] flex justify-center">
        <div className="w-full max-w-[700px] bg-[var(--surface)] border border-[var(--border)] p-12">
          <div className="flex items-center justify-center gap-2 text-[var(--accent)] text-xs tracking-[0.2em] uppercase font-semibold mb-2">
            <span className="w-6 h-[1px] bg-[var(--accent)]"></span> Get In Touch
          </div>
          <h2 className="font-display text-3xl text-center text-[var(--navy)] mb-2">Send an <em className="italic text-[var(--accent)] not-italic">Inquiry</em></h2>
          <p className="text-[var(--muted)] text-center mb-10">Interested in a property, or looking to sell? Drop us a message.</p>
          
          <InquiryForm />
        </div>
      </section>

      {/* CTA BANNER */}
      <div className="bg-[var(--accent)] px-[8%] py-20 flex items-center justify-between flex-wrap gap-8">
        <div>
          <h2 className="font-display text-3xl text-white mb-2">Ready to Find Your Next Home?</h2>
          <p className="text-white/75 text-sm">Book a free 30-minute consultation.</p>
        </div>
        <div className="flex gap-4 flex-wrap">
          <button onClick={() => setShowModal(true)} className="bg-white text-[var(--accent)] px-10 py-4 border-none font-bold text-sm hover:bg-[var(--navy)] hover:text-white transition-colors">
            Book Free Consultation
          </button>
          <button onClick={() => document.getElementById('listings')?.scrollIntoView({ behavior: 'smooth' })} className="bg-transparent text-white px-10 py-4 border-2 border-white/50 font-semibold text-sm hover:bg-white/10 transition-colors">
            Browse All Listings
          </button>
        </div>
      </div>

      {/* FOOTER */}
      <footer className="bg-[var(--navy)] text-white/60 px-[8%] py-20">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-16 max-w-[1200px] mx-auto">
          <div>
            <div className="font-display text-2xl text-white mb-4">Meridian <span className="text-[var(--accent)]">Properties</span></div>
            <p className="text-sm leading-relaxed max-w-[260px]">NYC's most trusted real estate advisors since 2006.</p>
          </div>
          <div>
            <h4 className="text-xs tracking-[0.15em] uppercase text-white font-semibold mb-4">Properties</h4>
            <ul className="space-y-2 list-none">
              <li><a href="#" className="text-white/50 text-sm hover:text-[var(--accent)] transition-colors no-underline">Buy</a></li>
              <li><a href="#" className="text-white/50 text-sm hover:text-[var(--accent)] transition-colors no-underline">Rent</a></li>
              <li><a href="#" className="text-white/50 text-sm hover:text-[var(--accent)] transition-colors no-underline">Commercial</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs tracking-[0.15em] uppercase text-white font-semibold mb-4">Company</h4>
            <ul className="space-y-2 list-none">
              <li><a href="#" className="text-white/50 text-sm hover:text-[var(--accent)] transition-colors no-underline">About Us</a></li>
              <li><a href="#" className="text-white/50 text-sm hover:text-[var(--accent)] transition-colors no-underline">Our Agents</a></li>
              <li><a href="#" className="text-white/50 text-sm hover:text-[var(--accent)] transition-colors no-underline">Contact</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs tracking-[0.15em] uppercase text-white font-semibold mb-4">Contact</h4>
            <ul className="space-y-2 list-none text-sm">
              <li>142 Fifth Ave, NYC</li>
              <li>+1 (212) 888-0044</li>
              <li>hello@meridianprops.com</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/10 pt-8 flex justify-between items-center flex-wrap gap-4 text-sm max-w-[1200px] mx-auto">
          <span>© 2025 Meridian Properties. All rights reserved.</span>
          <div className="flex gap-6">
            <a href="#" className="text-white/40 hover:text-[var(--accent)] transition-colors no-underline">Instagram</a>
            <a href="#" className="text-white/40 hover:text-[var(--accent)] transition-colors no-underline">LinkedIn</a>
          </div>
        </div>
      </footer>

      {/* MODAL */}
      <AnimatePresence>
        {showModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-[999] flex items-center justify-center backdrop-blur-sm"
            onClick={() => setShowModal(false)}
          >
            <motion.div 
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="bg-white w-[90%] max-w-[480px] p-10 relative"
              onClick={e => e.stopPropagation()}
            >
              <button onClick={() => setShowModal(false)} className="absolute top-4 right-6 bg-none border-none text-3xl text-[var(--muted)] cursor-pointer">&times;</button>
              <h3 className="font-display text-2xl text-[var(--navy)] mb-2">Get in Touch</h3>
              <p className="text-[var(--muted)] text-sm mb-8">Let us know how we can help you today.</p>
              <InquiryForm modal onClose={() => setShowModal(false)} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}

function InquiryForm({ modal, onClose }: { modal?: boolean; onClose?: () => void }) {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = {
      name: (form.elements.namedItem('name') as HTMLInputElement).value,
      email: (form.elements.namedItem('email') as HTMLInputElement).value,
      phone: (form.elements.namedItem('phone') as HTMLInputElement).value,
      message: (form.elements.namedItem('message') as HTMLTextAreaElement).value,
    };

    try {
      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        setSubmitted(true);
        if (onClose) setTimeout(onClose, 3000);
      }
    } catch {
      console.error('Error submitting inquiry');
    }
  };

  if (submitted) {
    return <div className="text-green-600 font-semibold text-center mt-4">Thank you! Your message has been sent.</div>;
  }

  return (
    <form onSubmit={handleSubmit} className={modal ? 'flex flex-col gap-4' : 'grid grid-cols-1 md:grid-cols-2 gap-4'}>
      <div>
        <label className="block text-sm font-semibold text-[var(--navy)] mb-1">Full Name</label>
        <input name="name" required className="w-full p-3 border border-[var(--border)] outline-none focus:border-[var(--accent)]" />
      </div>
      <div>
        <label className="block text-sm font-semibold text-[var(--navy)] mb-1">Email Address</label>
        <input name="email" type="email" required className="w-full p-3 border border-[var(--border)] outline-none focus:border-[var(--accent)]" />
      </div>
      <div>
        <label className="block text-sm font-semibold text-[var(--navy)] mb-1">Phone (Optional)</label>
        <input name="phone" className="w-full p-3 border border-[var(--border)] outline-none focus:border-[var(--accent)]" />
      </div>
      {!modal && (
        <div>
          <label className="block text-sm font-semibold text-[var(--navy)] mb-1">Interested In</label>
          <select name="interest" className="w-full p-3 border border-[var(--border)] outline-none focus:border-[var(--accent)]">
            <option value="">General Inquiry</option>
            <option value="Buying">Buying a Property</option>
            <option value="Selling">Selling a Property</option>
            <option value="Renting">Renting</option>
          </select>
        </div>
      )}
      <div className={modal ? '' : 'md:col-span-2'}>
        <label className="block text-sm font-semibold text-[var(--navy)] mb-1">Message</label>
        <textarea name="message" rows={4} required className="w-full p-3 border border-[var(--border)] outline-none focus:border-[var(--accent)] resize-none"></textarea>
      </div>
      <button type="submit" className={`bg-[var(--navy)] text-white py-4 border-none font-semibold text-sm hover:bg-[var(--accent)] transition-colors ${modal ? 'mt-2' : 'md:col-span-2'}`}>
        Send Message
      </button>
    </form>
  );
}
