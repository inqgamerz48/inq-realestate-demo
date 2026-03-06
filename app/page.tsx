'use client';
import { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';

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

function Reveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}

export default function Home() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [activeFilter, setActiveFilter] = useState('All');
  const [showModal, setShowModal] = useState(false);
  const [scrolled, setScrolled] = useState(false);

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

    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
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

  return (
    <main className="min-h-screen bg-[#0a0908] text-[#f5f0e8]">
      {/* NAV - Elegant minimal */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? 'bg-[#0a0908]/95 backdrop-blur-xl border-b border-[#1f1a16]' : 'bg-transparent'
      }`}>
        <div className="flex items-center justify-between px-8 py-6 max-w-[1600px] mx-auto">
          <div className="font-serif text-2xl tracking-wide">
            Meridian <span className="text-[#c9a55c] italic">Properties</span>
          </div>
          
          <ul className="hidden lg:flex gap-12 list-none">
            {['Collection', 'Philosophy', 'Team', 'Process'].map(item => (
              <li key={item}>
                <a 
                  href={`#${item.toLowerCase()}`} 
                  className="text-sm text-[#8a8279] hover:text-[#f5f0e8] transition-colors duration-300 underline-animate"
                >
                  {item}
                </a>
              </li>
            ))}
          </ul>

          <button 
            onClick={() => setShowModal(true)}
            className="bg-[#c9a55c] text-[#0a0908] px-8 py-3 text-sm font-medium tracking-wider hover:bg-[#ddb76a] transition-all duration-300"
          >
            INQUIRE
          </button>
        </div>
      </nav>

      {/* HERO - Cinematic */}
      <section className="relative min-h-screen flex items-center">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1920&auto=format&fit=crop&q=80" 
            alt="Luxury Estate"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0a0908] via-[#0a0908]/70 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0908] via-transparent to-[#0a0908]/30" />
        </div>

        <div className="relative z-10 px-8 py-32 max-w-[900px]">
          <Reveal>
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-[1px] bg-[#c9a55c]" />
              <span className="text-xs tracking-[0.3em] text-[#c9a55c] uppercase">Est. 2006</span>
            </div>
          </Reveal>
          
          <Reveal delay={0.1}>
            <h1 className="font-serif text-6xl md:text-8xl leading-[0.95] mb-8">
              Where <span className="italic text-[#c9a55c]">Extraordinary</span><br />
              Meets Home
            </h1>
          </Reveal>

          <Reveal delay={0.2}>
            <p className="text-lg text-[#a09a90] max-w-[500px] leading-relaxed mb-12 font-light">
              Curating the world's most exceptional properties for those who understand that home is not just a place—it's a statement.
            </p>
          </Reveal>

          <Reveal delay={0.3}>
            <div className="flex gap-6">
              <a 
                href="#collection"
                className="bg-[#c9a55c] text-[#0a0908] px-10 py-4 text-sm font-medium tracking-wider hover:bg-[#ddb76a] transition-all duration-300"
              >
                VIEW COLLECTION
              </a>
              <a 
                href="#philosophy"
                className="border border-[#3d3530] text-[#f5f0e8] px-10 py-4 text-sm font-medium tracking-wider hover:border-[#c9a55c] hover:text-[#c9a55c] transition-all duration-300"
              >
                OUR PHILOSOPHY
              </a>
            </div>
          </Reveal>
        </div>

        {/* Stats */}
        <div className="absolute bottom-12 left-8 right-8 max-w-[1600px] mx-auto">
          <div className="flex gap-16">
            {[
              { num: '$4.2B', label: 'In Transactions' },
              { num: '2,400+', label: 'Properties Sold' },
              { num: '98%', label: 'Client Satisfaction' }
            ].map((stat, i) => (
              <Reveal key={i} delay={0.4 + i * 0.1}>
                <div>
                  <div className="font-serif text-3xl text-[#c9a55c]">{stat.num}</div>
                  <div className="text-xs tracking-widest text-[#6a635a] uppercase">{stat.label}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* MARQUEE */}
      <div className="bg-[#c9a55c] text-[#0a0908] py-4 overflow-hidden">
        <div className="flex whitespace-nowrap animate-marquee">
          {[...Array(4)].map((_, i) => (
            <span key={i} className="text-xs tracking-[0.3em] uppercase mx-12 font-medium">
              Manhattan · Brooklyn · Hamptons · Hudson Valley · Greenwich · Tribeca · Upper East Side · SoHo · 
            </span>
          ))}
        </div>
      </div>

      {/* COLLECTION */}
      <section id="collection" className="py-32 px-8 bg-[#0a0908]">
        <div className="max-w-[1600px] mx-auto">
          <Reveal>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-8 h-[1px] bg-[#c9a55c]" />
              <span className="text-xs tracking-[0.3em] text-[#c9a55c] uppercase">The Collection</span>
            </div>
          </Reveal>
          
          <Reveal delay={0.1}>
            <h2 className="font-serif text-5xl md:text-7xl mb-16">Curated <span className="italic text-[#c9a55c]">Properties</span></h2>
          </Reveal>

          {/* Filters */}
          <div className="flex gap-3 mb-16 flex-wrap">
            {['All', 'Buy', 'Rent', 'Luxury', 'Commercial'].map(filter => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-8 py-3 text-sm tracking-wider transition-all duration-300 ${
                  activeFilter === filter 
                  ? 'bg-[#c9a55c] text-[#0a0908]' 
                  : 'border border-[#2a2520] text-[#8a8279] hover:border-[#c9a55c] hover:text-[#f5f0e8]'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>

          {/* Properties Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProperties.map((property, i) => (
              <Reveal key={property.id} delay={i * 0.1}>
                <motion.div 
                  whileHover={{ y: -8 }}
                  className="group cursor-pointer"
                >
                  <div className="relative overflow-hidden aspect-[4/5] mb-6">
                    <img 
                      src={property.imageUrl} 
                      alt={property.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    {property.badge && (
                      <span className={`absolute top-6 left-6 px-4 py-1.5 text-xs tracking-widest uppercase ${
                        property.badgeClass === 'new' ? 'bg-[#4a7c59]' : 
                        property.badgeClass === 'rent' ? 'bg-[#2a2a3a]' : 'bg-[#c9a55c] text-[#0a0908]'
                      }`}>
                        {property.badge}
                      </span>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0908]/60 via-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="font-serif text-2xl text-[#f5f0e8] group-hover:text-[#c9a55c] transition-colors duration-300">
                      {property.price}
                    </div>
                    <div className="font-medium text-[#f5f0e8]">{property.name}</div>
                    <div className="text-sm text-[#6a635a]">{property.location}</div>
                    <div className="flex gap-6 pt-3 text-sm text-[#8a8279]">
                      <span>{property.beds} Beds</span>
                      <span>{property.baths} Baths</span>
                      <span>{property.sqft?.toLocaleString()} sqft</span>
                    </div>
                  </div>
                </motion.div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* PHILOSOPHY */}
      <section id="philosophy" className="py-32 px-8 bg-[#0f0d0b]">
        <div className="max-w-[1600px] mx-auto grid lg:grid-cols-2 gap-20 items-center">
          <div className="relative">
            <img 
              src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=900&auto=format&fit=crop&q=80" 
              alt="Interior"
              className="w-full h-[600px] object-cover"
            />
            <div className="absolute -bottom-10 -right-10 bg-[#c9a55c] text-[#0a0908] p-8 hidden lg:block">
              <div className="font-serif text-5xl">18+</div>
              <div className="text-xs tracking-widest uppercase mt-1">Years of Excellence</div>
            </div>
          </div>

          <div>
            <Reveal>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-8 h-[1px] bg-[#c9a55c]" />
                <span className="text-xs tracking-[0.3em] text-[#c9a55c] uppercase">Our Philosophy</span>
              </div>
            </Reveal>
            
            <Reveal delay={0.1}>
              <h2 className="font-serif text-5xl md:text-6xl leading-tight mb-8">
                Excellence in <span className="italic text-[#c9a55c]">Every</span> Detail
              </h2>
            </Reveal>

            <Reveal delay={0.2}>
              <p className="text-[#a09a90] leading-relaxed mb-8 font-light text-lg">
                We don't just sell properties—we curate lifestyles. Each home in our collection represents a unique blend of architectural significance, location prestige, and unparalleled craftsmanship.
              </p>
            </Reveal>

            <Reveal delay={0.3}>
              <div className="space-y-8">
                {[
                  { title: 'Market Intelligence', desc: 'Data-driven insights and off-market access unavailable elsewhere.' },
                  { title: 'Expert Negotiation', desc: 'Average 4.7% below ask for buyers, 6.2% above for sellers.' },
                  { title: 'White-Glove Service', desc: 'From virtual tours to concierge moving support—every detail handled.' }
                ].map((item, i) => (
                  <div key={i} className="flex gap-6">
                    <div className="w-12 h-12 bg-[#1a1715] flex items-center justify-center text-[#c9a55c] font-serif text-xl shrink-0">
                      0{i + 1}
                    </div>
                    <div>
                      <h4 className="font-medium text-[#f5f0e8] mb-1">{item.title}</h4>
                      <p className="text-sm text-[#6a635a]">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* TEAM */}
      <section id="team" className="py-32 px-8 bg-[#0a0908]">
        <div className="max-w-[1400px] mx-auto text-center mb-20">
          <Reveal>
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="w-8 h-[1px] bg-[#c9a55c]" />
              <span className="text-xs tracking-[0.3em] text-[#c9a55c] uppercase">The Team</span>
            </div>
          </Reveal>
          
          <Reveal delay={0.1}>
            <h2 className="font-serif text-5xl md:text-6xl">Meet Your <span className="italic text-[#c9a55c]">Advisors</span></h2>
          </Reveal>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-[1400px] mx-auto">
          {agents.map((agent, i) => (
            <Reveal key={agent.id} delay={i * 0.15}>
              <motion.div 
                whileHover={{ y: -8 }}
                className="group text-center"
              >
                <div className="relative overflow-hidden aspect-square mb-6 mx-auto max-w-[320px]">
                  <img 
                    src={agent.photoUrl}
                    alt={agent.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a0908] via-transparent to-transparent opacity-60" />
                </div>
                <h3 className="font-serif text-2xl text-[#f5f0e8] mb-1">{agent.name}</h3>
                <p className="text-xs tracking-widest text-[#c9a55c] uppercase mb-4">{agent.role}</p>
                <div className="flex justify-center gap-8 text-sm text-[#6a635a]">
                  <span><strong className="text-[#f5f0e8]">{agent.totalSold}</strong> Sales</span>
                  <span><strong className="text-[#f5f0e8]">{agent.totalClients}</strong> Clients</span>
                </div>
              </motion.div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-32 px-8 bg-[#0f0d0b]">
        <div className="max-w-[1200px] mx-auto">
          <Reveal>
            <div className="text-center mb-16">
              <div className="flex items-center justify-center gap-4 mb-6">
                <div className="w-8 h-[1px] bg-[#c9a55c]" />
                <span className="text-xs tracking-[0.3em] text-[#c9a55c] uppercase">Client Stories</span>
              </div>
              <h2 className="font-serif text-5xl md:text-6xl">Trusted by <span className="italic text-[#c9a55c]">Discerning</span> Clients</h2>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((t, i) => (
              <Reveal key={t.id} delay={i * 0.1}>
                <div className="bg-[#1a1715] p-10 border border-[#2a2520] hover:border-[#c9a55c]/30 transition-colors duration-500">
                  <div className="text-[#c9a55c] text-lg mb-6">{'★'.repeat(t.rating)}</div>
                  <p className="text-[#a09a90] leading-relaxed italic mb-8 font-light">"{t.text}"</p>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-[#c9a55c] text-[#0a0908] flex items-center justify-center font-semibold">
                      {t.initials}
                    </div>
                    <div>
                      <div className="font-medium text-[#f5f0e8]">{t.name}</div>
                      <div className="text-xs text-[#6a635a]">{t.info}</div>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-32 px-8 bg-[#c9a55c]">
        <div className="max-w-[800px] mx-auto text-center">
          <h2 className="font-serif text-5xl md:text-6xl text-[#0a0908] mb-6">
            Begin Your Journey
          </h2>
          <p className="text-[#0a0908]/70 mb-12 text-lg font-light">
            Schedule a private consultation with our advisors. No obligation, just expertise.
          </p>
          <button 
            onClick={() => setShowModal(true)}
            className="bg-[#0a0908] text-[#f5f0e8] px-12 py-5 text-sm tracking-wider hover:bg-[#1a1715] transition-colors duration-300"
          >
            REQUEST CONSULTATION
          </button>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#0a0908] border-t border-[#1f1a16] px-8 py-20">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-16">
          <div>
            <div className="font-serif text-2xl mb-6">
              Meridian <span className="text-[#c9a55c] italic">Properties</span>
            </div>
            <p className="text-[#6a635a] text-sm leading-relaxed font-light">
              NYC's premier real estate advisory since 2006. Excellence in every transaction.
            </p>
          </div>

          <div>
            <h4 className="text-xs tracking-[0.2em] text-[#c9a55c] uppercase mb-6">Properties</h4>
            <ul className="space-y-3 list-none">
              {['Buy', 'Rent', 'Developments', 'Commercial', 'Luxury'].map(item => (
                <li key={item}><a href="#" className="text-[#6a635a] hover:text-[#f5f0e8] transition-colors text-sm">{item}</a></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs tracking-[0.2em] text-[#c9a55c] uppercase mb-6">Company</h4>
            <ul className="space-y-3 list-none">
              {['About', 'Agents', 'Careers', 'Press', 'Contact'].map(item => (
                <li key={item}><a href="#" className="text-[#6a635a] hover:text-[#f5f0e8] transition-colors text-sm">{item}</a></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs tracking-[0.2em] text-[#c9a55c] uppercase mb-6">Contact</h4>
            <ul className="space-y-3 text-sm text-[#6a635a]">
              <li>142 Fifth Avenue, NYC</li>
              <li>+1 (212) 888-0044</li>
              <li>hello@meridianprops.com</li>
              <li>9am – 7pm Daily</li>
            </ul>
          </div>
        </div>

        <div className="max-w-[1400px] mx-auto mt-20 pt-8 border-t border-[#1f1a16] flex justify-between items-center text-xs text-[#4a4540]">
          <span>© 2025 Meridian Properties. All rights reserved.</span>
          <div className="flex gap-6">
            {['Instagram', 'LinkedIn', 'Facebook'].map(social => (
              <a key={social} href="#" className="hover:text-[#c9a55c] transition-colors">{social}</a>
            ))}
          </div>
        </div>
      </footer>

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/80 backdrop-blur-sm" onClick={() => setShowModal(false)}>
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-[#0f0d0b] border border-[#2a2520] p-12 max-w-lg w-full mx-4"
            onClick={e => e.stopPropagation()}
          >
            <button onClick={() => setShowModal(false)} className="absolute top-6 right-6 text-3xl text-[#6a635a] hover:text-[#f5f0e8]">&times;</button>
            
            <h3 className="font-serif text-3xl text-[#f5f0e8] mb-2">Begin the Conversation</h3>
            <p className="text-[#6a635a] mb-8 font-light">Tell us about your vision.</p>
            
            <InquiryForm onClose={() => setShowModal(false)} />
          </motion.div>
        </div>
      )}
    </main>
  );
}

function InquiryForm({ onClose }: { onClose: () => void }) {
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
        setTimeout(onClose, 3000);
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (submitted) {
    return <div className="text-[#c9a55c] text-center py-8 font-medium">Thank you. We'll be in touch shortly.</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <input name="name" placeholder="Your Name" required 
          className="w-full bg-[#1a1715] border border-[#2a2520] p-4 text-[#f5f0e8] placeholder-[#4a4540] outline-none focus:border-[#c9a55c] transition-colors" />
      </div>
      <div>
        <input name="email" type="email" placeholder="Email Address" required 
          className="w-full bg-[#1a1715] border border-[#2a2520] p-4 text-[#f5f0e8] placeholder-[#4a4540] outline-none focus:border-[#c9a55c] transition-colors" />
      </div>
      <div>
        <input name="phone" placeholder="Phone (Optional)" 
          className="w-full bg-[#1a1715] border border-[#2a2520] p-4 text-[#f5f0e8] placeholder-[#4a4540] outline-none focus:border-[#c9a55c] transition-colors" />
      </div>
      <div>
        <textarea name="message" placeholder="Tell us about your requirements..." rows={4} required
          className="w-full bg-[#1a1715] border border-[#2a2520] p-4 text-[#f5f0e8] placeholder-[#4a4540] outline-none focus:border-[#c9a55c] transition-colors resize-none" />
      </div>
      <button type="submit" className="w-full bg-[#c9a55c] text-[#0a0908] py-4 font-medium tracking-wider hover:bg-[#ddb76a] transition-colors">
        SEND INQUIRY
      </button>
    </form>
  );
}
