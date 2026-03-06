'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

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
  const [properties, setProperties] = useState<Property[]>([]);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [activeFilter, setActiveFilter] = useState('All');
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetch('/api/properties')
      .then(res => res.json())
      .then(data => setProperties(data))
      .catch(console.error);

    fetch('/api/agents')
      .then(res => res.json())
      .then(data => setAgents(data))
      .catch(console.error);

    fetch('/api/testimonials')
      .then(res => res.json())
      .then(data => setTestimonials(data.filter((t: Testimonial) => t.active)))
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
    if (searchQuery) {
      const filtered = properties.filter(p => 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.location.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setProperties(filtered);
    }
  };

  return (
    <main>
      {/* NAV */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-[6%] py-5 bg-[rgba(248,246,242,0.92)] backdrop-blur-md border-b border-[#e2ddd6]">
        <div className="font-display text-2xl text-[#1a2332]">
          Meridian <span className="text-[#c8965a]">Properties</span>
        </div>
        <ul className="hidden md:flex gap-10 list-none">
          <li><a href="#listings" className="text-[#7a8394] text-sm font-medium tracking-widest uppercase hover:text-[#1a2332] transition-colors">Listings</a></li>
          <li><a href="#why" className="text-[#7a8394] text-sm font-medium tracking-widest uppercase hover:text-[#1a2332] transition-colors">Why Us</a></li>
          <li><a href="#agents" className="text-[#7a8394] text-sm font-medium tracking-widest uppercase hover:text-[#1a2332] transition-colors">Agents</a></li>
          <li><a href="#process" className="text-[#7a8394] text-sm font-medium tracking-widest uppercase hover:text-[#1a2332] transition-colors">Process</a></li>
        </ul>
        <div className="flex items-center gap-4">
          <span className="hidden md:block text-[#7a8394] text-sm font-medium">+1 (212) 888-0044</span>
          <button onClick={() => setShowModal(true)} className="bg-[#1a2332] text-white px-5 py-2.5 border-none cursor-pointer font-semibold text-sm tracking-widest uppercase hover:bg-[#c8965a] transition-colors">
            Book Consultation
          </button>
        </div>
      </nav>

      {/* HERO */}
      <section className="min-h-screen grid grid-cols-1 md:grid-cols-2 pt-[72px]">
        <div className="flex flex-col justify-center px-[8%] py-20 bg-white">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-2 text-[#c8965a] text-xs tracking-[0.2em] uppercase font-semibold mb-8"
          >
            <span className="w-[30px] h-[1px] bg-[#c8965a]"></span>
            Premium Real Estate · NYC & Beyond
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-display text-5xl md:text-6xl text-[#1a2332] leading-tight mb-6"
          >
            Find Your <em className="italic text-[#c8965a] not-italic">Perfect</em> Place to Call Home
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-[#7a8394] text-base leading-relaxed max-w-[440px] mb-10 font-light"
          >
            We connect discerning buyers and sellers with exceptional properties. From Manhattan penthouses to Hudson Valley estates — your dream home is closer than you think.
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex gap-3 mb-10"
          >
            <input 
              type="text" 
              placeholder="Search by neighborhood, city, or ZIP…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 border border-[#e2ddd6] bg-transparent px-4 py-3 text-sm outline-none"
            />
            <button onClick={handleSearch} className="bg-[#1a2332] text-white px-6 py-3 border-none cursor-pointer font-semibold text-sm hover:bg-[#c8965a] transition-colors whitespace-nowrap">
              Search
            </button>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex gap-10"
          >
            <div><strong className="block font-display text-2xl text-[#1a2332]">2,400+</strong><span className="text-xs text-[#7a8394] tracking-wider">Properties Sold</span></div>
            <div><strong className="block font-display text-2xl text-[#1a2332]">$4.2B</strong><span className="text-xs text-[#7a8394] tracking-wider">In Transactions</span></div>
            <div><strong className="block font-display text-2xl text-[#1a2332]">98%</strong><span className="text-xs text-[#7a8394] tracking-wider">Client Satisfaction</span></div>
          </motion.div>
        </div>
        <div className="relative overflow-hidden">
          <img 
            src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&auto=format&fit=crop&q=80" 
            alt="Luxury Home" 
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-10 left-8 bg-white p-5 shadow-lg flex items-center gap-4">
            <span className="text-3xl">🏆</span>
            <div><strong className="block text-sm font-semibold text-[#1a2332]">#1 Agency in NYC</strong><span className="text-xs text-[#7a8394]">Forbes Real Estate 2024</span></div>
          </div>
          <div className="absolute bottom-10 right-8 flex flex-col items-center text-white/60 text-xs tracking-widest uppercase">
            <div className="w-[1px] h-12 bg-gradient-to-b from-white/60 to-transparent mb-2"></div>
            scroll
          </div>
        </div>
      </section>

      {/* MARQUEE */}
      <div className="bg-[#1a2332] text-white/50 py-4 overflow-hidden">
        <div className="flex animate-marquee whitespace-nowrap">
          {['Manhattan ·', 'Brooklyn ·', 'The Hamptons ·', 'Hudson Valley ·', 'Greenwich ·', 'Tribeca ·', 'Upper East Side ·', 'SoHo ·', 'Park Slope ·', 'Westchester ·'].map((item, i) => (
            <span key={i} className="text-xs tracking-[0.15em] uppercase mx-6">{item}<span className="text-[#c8965a]">·</span></span>
          ))}
          {['Manhattan ·', 'Brooklyn ·', 'The Hamptons ·', 'Hudson Valley ·', 'Greenwich ·', 'Tribeca ·', 'Upper East Side ·', 'SoHo ·', 'Park Slope ·', 'Westchester ·'].map((item, i) => (
            <span key={i + 10} className="text-xs tracking-[0.15em] uppercase mx-6">{item}<span className="text-[#c8965a]">·</span></span>
          ))}
        </div>
      </div>

      {/* LISTINGS */}
      <section id="listings" className="py-24 px-[8%] bg-white">
        <div className="flex justify-between items-end flex-wrap gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-[#c8965a] text-xs tracking-[0.2em] uppercase font-semibold mb-2">
              <span className="w-6 h-[1px] bg-[#c8965a]"></span> Featured Listings
            </div>
            <h2 className="font-display text-4xl text-[#1a2332]">Properties You'll <em className="italic text-[#c8965a] not-italic">Love</em></h2>
          </div>
          <a href="#" className="text-[#c8965a] text-sm font-semibold tracking-wider no-underline">View All Properties →</a>
        </div>

        <div className="flex gap-2 flex-wrap mb-12">
          {['All', 'Buy', 'Rent', 'New Development', 'Luxury', 'Commercial'].map(filter => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-6 py-2.5 border text-sm tracking-wider transition-all ${
                activeFilter === filter 
                ? 'bg-[#1a2332] text-white border-[#1a2332]' 
                : 'border-[#e2ddd6] text-[#7a8394] hover:bg-[#1a2332] hover:text-white hover:border-[#1a2332]'
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
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="border border-[#e2ddd6] overflow-hidden hover:-translate-y-2 hover:shadow-xl transition-all cursor-pointer group"
            >
              <div className="relative h-60 overflow-hidden">
                <img src={property.imageUrl} alt={property.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                {property.badge && (
                  <span className={`absolute top-4 left-4 bg-[#c8965a] text-white text-xs font-bold tracking-widest uppercase px-3 py-1 ${property.badgeClass === 'rent' ? 'bg-[#1a2332]' : ''} ${property.badgeClass === 'new' ? 'bg-[#27ae60]' : ''}`}>
                    {property.badge}
                  </span>
                )}
                <button className="absolute top-4 right-4 bg-white/90 w-9 h-9 flex items-center justify-center text-lg hover:bg-[#c8965a] hover:text-white transition-all">♡</button>
              </div>
              <div className="p-6">
                <div className="font-display text-2xl text-[#1a2332] mb-1">{property.price}</div>
                <div className="font-semibold text-sm mb-1">{property.name}</div>
                <div className="text-[#7a8394] text-sm mb-4">📍 {property.location}</div>
                <div className="flex gap-6 pt-4 border-t border-[#e2ddd6]">
                  <span className="text-sm text-[#7a8394]"><strong className="text-[#2d3748]">{property.beds}</strong> Beds</span>
                  <span className="text-sm text-[#7a8394]"><strong className="text-[#2d3748]">{property.baths}</strong> Baths</span>
                  <span className="text-sm text-[#7a8394]"><strong className="text-[#2d3744]">{property.sqft?.toLocaleString()}</strong> sq ft</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* WHY US */}
      <section id="why" className="py-24 px-[8%] bg-[#f8f6f2]">
        <div className="max-w-[1200px] mx-auto grid md:grid-cols-2 gap-20 items-center">
          <div className="relative">
            <img src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=900&auto=format&fit=crop&q=80" alt="Modern Interior" className="w-full h-[540px] object-cover" />
            <div className="absolute top-8 -right-8 bg-[#1a2332] text-white p-6 text-center">
              <strong className="block font-display text-3xl text-[#c8965a]">18+</strong>
              <span className="text-xs tracking-widest">Years of<br />Excellence</span>
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2 text-[#c8965a] text-xs tracking-[0.2em] uppercase font-semibold mb-2">
              <span className="w-6 h-[1px] bg-[#c8965a]"></span> Why Meridian
            </div>
            <h2 className="font-display text-4xl text-[#1a2332] mb-4">A Smarter Way to Buy, Sell & <em className="italic text-[#c8965a] not-italic">Invest</em></h2>
            <p className="text-[#7a8394] leading-relaxed mb-8">We're not just agents — we're advisors, negotiators, and partners who stay with you from first search to final signature. Our track record speaks for itself.</p>
            
            {[
              { num: '01', title: 'Market Intelligence', desc: 'Data-driven insights, neighborhood trends, and off-market access that generic platforms can\'t offer.' },
              { num: '02', title: 'Expert Negotiation', desc: 'Our agents average 4.7% below asking price for buyers — and 6.2% above list for sellers.' },
              { num: '03', title: 'White-Glove Service', desc: 'From virtual tours to concierge moving support — we handle every detail so you don\'t have to.' },
            ].map((point, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex gap-4 mb-6"
              >
                <div className="w-10 h-10 bg-[#c8965a] text-white flex items-center justify-center font-bold text-sm shrink-0">{point.num}</div>
                <div>
                  <h4 className="font-semibold text-sm mb-1">{point.title}</h4>
                  <p className="text-[#7a8394] text-sm leading-relaxed">{point.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* AGENTS */}
      <section id="agents" className="py-24 px-[8%] bg-white">
        <div className="text-center max-w-[560px] mx-auto mb-12">
          <div className="flex items-center justify-center gap-2 text-[#c8965a] text-xs tracking-[0.2em] uppercase font-semibold mb-2">
            <span className="w-6 h-[1px] bg-[#c8965a]"></span> Our Team
          </div>
          <h2 className="font-display text-4xl text-[#1a2332] mb-4">Meet Your <em className="italic text-[#c8965a] not-italic">Expert</em> Agents</h2>
          <p className="text-[#7a8394] text-sm leading-relaxed">Handpicked professionals with deep local knowledge and a passion for finding you the perfect home.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-[1200px] mx-auto">
          {agents.map((agent, i) => (
            <motion.div
              key={agent.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center p-8 border border-[#e2ddd6] hover:border-[#c8965a] hover:-translate-y-1 hover:shadow-lg transition-all"
            >
              <div className="w-24 h-24 mx-auto rounded-full overflow-hidden mb-5 border-4 border-[#c8965a]">
                <img src={agent.photoUrl} alt={agent.name} className="w-full h-full object-cover" />
              </div>
              <div className="font-semibold text-lg mb-1">{agent.name}</div>
              <div className="text-[#c8965a] text-xs tracking-widest uppercase mb-4">{agent.role}</div>
              <div className="flex justify-center gap-6 mb-4 text-sm">
                <div><strong className="font-bold text-[#1a2332]">{agent.totalSold}</strong><span className="text-[#7a8394] ml-1">Sales</span></div>
                <div><strong className="font-bold text-[#1a2332]">{agent.totalClients}</strong><span className="text-[#7a8394] ml-1">Clients</span></div>
              </div>
              <button onClick={() => setShowModal(true)} className="w-full bg-[#1a2332] text-white py-2.5 border-none font-semibold text-sm hover:bg-[#c8965a] transition-colors">
                Contact {agent.name.split(' ')[0]}
              </button>
            </motion.div>
          ))}
        </div>
      </section>

      {/* PROCESS */}
      <section id="process" className="py-24 px-[8%] bg-[#1a2332] text-white">
        <div className="text-center max-w-[560px] mx-auto mb-16">
          <div className="flex items-center justify-center gap-2 text-[#c8965a] text-xs tracking-[0.2em] uppercase font-semibold mb-2">
            <span className="w-6 h-[1px] bg-[#c8965a]"></span> How It Works
          </div>
          <h2 className="font-display text-4xl">Simple Steps to Your <em className="italic text-[#c8965a] not-italic">Dream Home</em></h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-[1200px] mx-auto relative">
          <div className="absolute top-8 left-[15%] right-[15%] h-px bg-white/10 hidden md:block"></div>
          {[
            { num: '01', title: 'Free Consultation', desc: 'Tell us what you\'re looking for. We listen, we understand, and we craft a search strategy tailored to you.' },
            { num: '02', title: 'Curated Matches', desc: 'We hand-pick properties that fit your brief — including off-market listings you won\'t find anywhere else.' },
            { num: '03', title: 'Tours & Negotiation', desc: 'Private in-person or virtual tours. When you\'re ready, we negotiate fiercely on your behalf.' },
            { num: '04', title: 'Seamless Closing', desc: 'We manage all paperwork, legals, and logistics — so you walk to closing day completely stress-free.' },
          ].map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center relative"
            >
              <div className="w-14 h-14 bg-[#c8965a] text-white flex items-center justify-center font-display text-xl mx-auto mb-6 relative z-10">
                {step.num}
              </div>
              <h4 className="font-semibold text-sm mb-2">{step.title}</h4>
              <p className="text-white/50 text-sm leading-relaxed">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-24 px-[8%] bg-[#f8f6f2]">
        <div className="text-center max-w-[560px] mx-auto mb-12">
          <div className="flex items-center justify-center gap-2 text-[#c8965a] text-xs tracking-[0.2em] uppercase font-semibold mb-2">
            <span className="w-6 h-[1px] bg-[#c8965a]"></span> Client Stories
          </div>
          <h2 className="font-display text-4xl text-[#1a2332]">Trusted by <em className="italic text-[#c8965a] not-italic">Thousands</em></h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-[1200px] mx-auto">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-white border border-[#e2ddd6] p-8 hover:shadow-lg transition-shadow"
            >
              <div className="text-[#c8965a] text-lg mb-4">{'★'.repeat(t.rating)}{'☆'.repeat(5 - t.rating)}</div>
              <p className="text-[#7a8394] text-sm leading-relaxed italic mb-6">{t.text}</p>
              <div className="flex items-center gap-4 pt-4 border-t border-[#e2ddd6]">
                <div className="w-12 h-12 bg-[#c8965a] text-white rounded-full flex items-center justify-center font-bold">
                  {t.initials}
                </div>
                <div>
                  <div className="font-semibold text-sm">{t.name}</div>
                  <div className="text-xs text-[#7a8394]">{t.info}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="py-24 px-[6%] bg-[#f8f6f2] flex justify-center">
        <div className="w-full max-w-[700px] bg-white border border-[#e2ddd6] p-12">
          <div className="flex items-center justify-center gap-2 text-[#c8965a] text-xs tracking-[0.2em] uppercase font-semibold mb-2">
            <span className="w-6 h-[1px] bg-[#c8965a]"></span> Get In Touch
          </div>
          <h2 className="font-display text-3xl text-center text-[#1a2332] mb-2">Send an <em className="italic text-[#c8965a] not-italic">Inquiry</em></h2>
          <p className="text-[#7a8394] text-center mb-10">Interested in a property, or looking to sell? Drop us a message.</p>
          
          <InquiryForm />
        </div>
      </section>

      {/* CTA BANNER */}
      <div className="bg-[#c8965a] px-[8%] py-20 flex items-center justify-between flex-wrap gap-8">
        <div>
          <h2 className="font-display text-3xl text-white mb-2">Ready to Find Your Next Home?</h2>
          <p className="text-white/75 text-sm">Book a free 30-minute consultation with one of our experts — no pressure, just answers.</p>
        </div>
        <div className="flex gap-4 flex-wrap">
          <button onClick={() => setShowModal(true)} className="bg-white text-[#c8965a] px-10 py-4 border-none font-bold text-sm hover:bg-[#1a2332] hover:text-white transition-colors">
            Book Free Consultation
          </button>
          <button onClick={() => document.getElementById('listings')?.scrollIntoView({ behavior: 'smooth' })} className="bg-transparent text-white px-10 py-4 border-2 border-white/50 font-semibold text-sm hover:bg-white/10 transition-colors">
            Browse All Listings
          </button>
        </div>
      </div>

      {/* FOOTER */}
      <footer className="bg-[#1a2332] text-white/60 px-[8%] py-20">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-16 max-w-[1200px] mx-auto">
          <div>
            <div className="font-display text-2xl text-white mb-4">Meridian <span className="text-[#c8965a]">Properties</span></div>
            <p className="text-sm leading-relaxed max-w-[260px]">NYC's most trusted real estate advisors since 2006. Buying, selling, and investing — done right.</p>
          </div>
          <div>
            <h4 className="text-xs tracking-[0.15em] uppercase text-white font-semibold mb-4">Properties</h4>
            <ul className="space-y-2 list-none">
              <li><a href="#" className="text-white/50 text-sm hover:text-[#c8965a] transition-colors no-underline">Buy</a></li>
              <li><a href="#" className="text-white/50 text-sm hover:text-[#c8965a] transition-colors no-underline">Rent</a></li>
              <li><a href="#" className="text-white/50 text-sm hover:text-[#c8965a] transition-colors no-underline">New Developments</a></li>
              <li><a href="#" className="text-white/50 text-sm hover:text-[#c8965a] transition-colors no-underline">Commercial</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs tracking-[0.15em] uppercase text-white font-semibold mb-4">Company</h4>
            <ul className="space-y-2 list-none">
              <li><a href="#" className="text-white/50 text-sm hover:text-[#c8965a] transition-colors no-underline">About Us</a></li>
              <li><a href="#" className="text-white/50 text-sm hover:text-[#c8965a] transition-colors no-underline">Our Agents</a></li>
              <li><a href="#" className="text-white/50 text-sm hover:text-[#c8965a] transition-colors no-underline">Careers</a></li>
              <li><a href="#" className="text-white/50 text-sm hover:text-[#c8965a] transition-colors no-underline">Contact</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs tracking-[0.15em] uppercase text-white font-semibold mb-4">Contact</h4>
            <ul className="space-y-2 list-none">
              <li className="text-sm">142 Fifth Ave, NYC</li>
              <li className="text-sm">+1 (212) 888-0044</li>
              <li className="text-sm">hello@meridianprops.com</li>
              <li className="text-sm">Office Hours: 9–7 Daily</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/10 pt-8 flex justify-between items-center flex-wrap gap-4 text-sm">
          <span>© 2025 Meridian Properties. All rights reserved.</span>
          <div className="flex gap-6">
            <a href="#" className="text-white/40 hover:text-[#c8965a] transition-colors no-underline">Instagram</a>
            <a href="#" className="text-white/40 hover:text-[#c8965a] transition-colors no-underline">LinkedIn</a>
            <a href="#" className="text-white/40 hover:text-[#c8965a] transition-colors no-underline">Facebook</a>
          </div>
        </div>
      </footer>

      {/* INQUIRY MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 z-[999] flex items-center justify-center backdrop-blur-sm" onClick={() => setShowModal(false)}>
          <div className="bg-white w-[90%] max-w-[480px] p-10 relative" onClick={e => e.stopPropagation()}>
            <button onClick={() => setShowModal(false)} className="absolute top-4 right-6 bg-none border-none text-3xl text-[#7a8394] cursor-pointer">&times;</button>
            <h3 className="font-display text-2xl text-[#1a2332] mb-2">Get in Touch</h3>
            <p className="text-[#7a8394] text-sm mb-8">Let us know how we can help you today.</p>
            <InquiryForm modal onClose={() => setShowModal(false)} />
          </div>
        </div>
      )}
    </main>
  );
}

function InquiryForm({ modal, onClose }: { modal?: boolean; onClose?: () => void }) {
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(false);

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
      } else {
        setError(true);
      }
    } catch {
      setError(true);
    }
  };

  if (submitted) {
    return <div className="text-green-600 font-semibold text-center mt-4">Thank you! Your message has been sent.</div>;
  }

  return (
    <form onSubmit={handleSubmit} className={modal ? 'flex flex-col gap-4' : 'grid grid-cols-1 md:grid-cols-2 gap-4'}>
      <div>
        <label className="block text-sm font-semibold text-[#1a2332] mb-1">Full Name</label>
        <input name="name" required className="w-full p-3 border border-[#e2ddd6] outline-none focus:border-[#c8965a]" />
      </div>
      <div>
        <label className="block text-sm font-semibold text-[#1a2332] mb-1">Email Address</label>
        <input name="email" type="email" required className="w-full p-3 border border-[#e2ddd6] outline-none focus:border-[#c8965a]" />
      </div>
      <div>
        <label className="block text-sm font-semibold text-[#1a2332] mb-1">Phone (Optional)</label>
        <input name="phone" className="w-full p-3 border border-[#e2ddd6] outline-none focus:border-[#c8965a]" />
      </div>
      {!modal && (
        <div>
          <label className="block text-sm font-semibold text-[#1a2332] mb-1">Interested In</label>
          <select name="interest" className="w-full p-3 border border-[#e2ddd6] outline-none focus:border-[#c8965a]">
            <option value="">General Inquiry</option>
            <option value="Buying">Buying a Property</option>
            <option value="Selling">Selling a Property</option>
            <option value="Renting">Renting</option>
          </select>
        </div>
      )}
      <div className={modal ? '' : 'md:col-span-2'}>
        <label className="block text-sm font-semibold text-[#1a2332] mb-1">Message</label>
        <textarea name="message" rows={4} required className="w-full p-3 border border-[#e2ddd6] outline-none focus:border-[#c8965a] resize-none"></textarea>
      </div>
      <button type="submit" className={`bg-[#1a2332] text-white py-4 border-none font-semibold text-sm hover:bg-[#c8965a] transition-colors ${modal ? 'mt-2' : 'md:col-span-2'}`}>
        Send Message
      </button>
      {error && <div className="text-red-500 text-sm text-center md:col-span-2">Error submitting. Please try again.</div>}
    </form>
  );
}
