'use client'

import { useState, useEffect, useRef } from 'react'
import Navbar from '@/components/Navbar'
import PropertyCard from '@/components/PropertyCard'
import AgentCard from '@/components/AgentCard'
import TestimonialCard from '@/components/TestimonialCard'
import InquiryModal from '@/components/InquiryModal'

interface Property {
  id: number
  name: string
  price: string
  location: string
  beds: number
  baths: number
  sqft: number
  image_url: string
  badge: string
  badge_class: string
}

interface Agent {
  id: number
  name: string
  role: string
  photo_url: string
  total_sold: number
  total_clients: number
}

interface Testimonial {
  id: number
  name: string
  initials: string
  text: string
  rating: number
  info: string
}

const locations = [
  'Manhattan', 'Brooklyn', 'The Hamptons', 'Hudson Valley', 'Greenwich',
  'Tribeca', 'Upper East Side', 'SoHo', 'Park Slope', 'Westchester'
]

export default function Home() {
  const [properties, setProperties] = useState<Property[]>([])
  const [agents, setAgents] = useState<Agent[]>([])
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [activeFilter, setActiveFilter] = useState('All')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedAgentId, setSelectedAgentId] = useState<number | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const obs = useRef<IntersectionObserver | null>(null)

  useEffect(() => {
    obs.current = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          const target = e.target as HTMLElement
          target.style.opacity = '1'
          target.style.transform = 'translateY(0)'
        }
      })
    }, { threshold: 0.1 })

    loadData()
  }, [])

  useEffect(() => {
    document.querySelectorAll('.prop-card,.agent-card,.tcard,.step,.why-point').forEach((el) => {
      el.style.opacity = '0'
      el.style.transform = 'translateY(24px)'
      el.style.transition = 'opacity 0.6s ease, transform 0.6s ease'
      obs.current?.observe(el)
    })
  }, [properties, agents, testimonials])

  const loadData = async () => {
    try {
      const [propsRes, agentsRes, testiRes] = await Promise.all([
        fetch('/api/properties'),
        fetch('/api/agents'),
        fetch('/api/testimonials')
      ])

      if (propsRes.ok) setProperties(await propsRes.json())
      if (agentsRes.ok) setAgents(await agentsRes.json())
      if (testiRes.ok) setTestimonials(await testiRes.json())
    } catch (e) {
      console.warn('API unavailable, waiting for backend')
    }
  }

  const handleSearch = async () => {
    if (!searchQuery.trim()) return
    try {
      const res = await fetch(`/api/properties?search=${encodeURIComponent(searchQuery)}`)
      if (res.ok) {
        setProperties(await res.json())
        document.getElementById('listings')?.scrollIntoView({ behavior: 'smooth' })
        setActiveFilter('All')
      }
    } catch (e) { }
  }

  const handleFilter = (filter: string) => {
    setActiveFilter(filter)
    if (filter === 'All') {
      loadData()
    } else if (filter === 'Buy') {
      setProperties(properties.filter(p => p.badge === 'For Sale' || p.badge === 'New Listing'))
    } else if (filter === 'Rent') {
      setProperties(properties.filter(p => p.badge_class === 'rent'))
    }
  }

  const handleContactAgent = (agentId: number) => {
    setSelectedAgentId(agentId)
    setIsModalOpen(true)
  }

  const handleSubmitInquiry = async (inline: boolean, data: { name: string; email: string; phone: string; message: string }) => {
    try {
      await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, agent_id: selectedAgentId, property_id: null })
      })
    } catch (e) { }
  }

  return (
    <>
      <Navbar onOpenModal={() => setIsModalOpen(true)} />

      <section className="hero">
        <div className="hero-left">
          <div className="hero-tag">Premium Real Estate · NYC & Beyond</div>
          <h1>Find Your <em>Perfect</em> Place to Call Home</h1>
          <p className="hero-sub">
            We connect discerning buyers and sellers with exceptional properties. From Manhattan
            penthouses to Hudson Valley estates — your dream home is closer than you think.
          </p>
          <div className="hero-search">
            <input 
              type="text" 
              placeholder="Search by neighborhood, city, or ZIP…" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
            <button onClick={handleSearch}>Search</button>
          </div>
          <div className="hero-stats">
            <div className="hstat"><strong>2,400+</strong><span>Properties Sold</span></div>
            <div className="hstat"><strong>$4.2B</strong><span>In Transactions</span></div>
            <div className="hstat"><strong>98%</strong><span>Client Satisfaction</span></div>
          </div>
        </div>
        <div className="hero-right">
          <img src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&auto=format&fit=crop&q=80" alt="Luxury Home" />
          <div className="hero-badge">
            <div className="badge-icon">🏆</div>
            <div className="badge-text">
              <strong>#1 Agency in NYC</strong>
              <span>Forbes Real Estate 2024</span>
            </div>
          </div>
          <div className="hero-scroll-hint">
            <div className="scroll-bar"></div>
            scroll
          </div>
        </div>
      </section>

      <div className="marquee-bar">
        <div className="marquee-track">
          {[...locations, ...locations].map((loc, i) => (
            <span key={i} className="marquee-item">{loc} <span>·</span></span>
          ))}
        </div>
      </div>

      <section className="listings-section" id="listings">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div className="label">Featured Listings</div>
            <h2 className="sec-title">Properties You'll <em>Love</em></h2>
          </div>
          <a href="#" style={{ color: 'var(--accent)', fontSize: '0.85rem', fontWeight: 600, textDecoration: 'none', letterSpacing: '0.05em' }}>View All Properties →</a>
        </div>
        <div className="filter-bar">
          {['All', 'Buy', 'Rent', 'New Development', 'Luxury', 'Commercial'].map((f) => (
            <button key={f} className={`filter ${activeFilter === f ? 'active' : ''}`} onClick={() => handleFilter(f)}>{f}</button>
          ))}
        </div>
        <div className="listings-grid">
          {properties.map((p) => (
            <PropertyCard key={p.id} property={p} />
          ))}
        </div>
      </section>

      <section className="why-section" id="why">
        <div className="why-grid">
          <div className="why-img-wrap">
            <img src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=900&auto=format&fit=crop&q=80" alt="Modern Interior" />
            <div className="why-float">
              <strong>18+</strong>
              <span>Years of<br />Excellence</span>
            </div>
          </div>
          <div>
            <div className="label">Why Meridian</div>
            <h2 className="sec-title">A Smarter Way to Buy, Sell & <em>Invest</em></h2>
            <p style={{ color: 'var(--muted)', lineHeight: 1.8, fontSize: '0.95rem' }}>
              We&apos;re not just agents — we&apos;re advisors, negotiators, and partners who stay with you from first search to final signature. Our track record speaks for itself.
            </p>
            <div className="why-points">
              <div className="why-point">
                <div className="why-num">01</div>
                <div>
                  <h4>Market Intelligence</h4>
                  <p>Data-driven insights, neighborhood trends, and off-market access that generic platforms can&apos;t offer.</p>
                </div>
              </div>
              <div className="why-point">
                <div className="why-num">02</div>
                <div>
                  <h4>Expert Negotiation</h4>
                  <p>Our agents average 4.7% below asking price for buyers — and 6.2% above list for sellers. Results matter.</p>
                </div>
              </div>
              <div className="why-point">
                <div className="why-num">03</div>
                <div>
                  <h4>White-Glove Service</h4>
                  <p>From virtual tours to concierge moving support — we handle every detail so you don&apos;t have to.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="agents-section" id="agents">
        <div style={{ textAlign: 'center', maxWidth: '560px', margin: '0 auto' }}>
          <div className="label" style={{ justifyContent: 'center' }}>Our Team</div>
          <h2 className="sec-title">Meet Your <em>Expert</em> Agents</h2>
          <p style={{ color: 'var(--muted)', fontSize: '0.9rem', lineHeight: 1.8 }}>
            Handpicked professionals with deep local knowledge and a passion for finding you the perfect home.
          </p>
        </div>
        <div className="agents-grid">
          {agents.map((a) => (
            <AgentCard key={a.id} agent={a} onContact={handleContactAgent} />
          ))}
        </div>
      </section>

      <section className="process-section" id="process">
        <div style={{ textAlign: 'center', maxWidth: '560px', margin: '0 auto' }}>
          <div className="label" style={{ justifyContent: 'center' }}>How It Works</div>
          <h2 className="sec-title">Simple Steps to Your <em>Dream Home</em></h2>
        </div>
        <div className="steps">
          <div className="step">
            <div className="step-num">01</div>
            <h4>Free Consultation</h4>
            <p>Tell us what you&apos;re looking for. We listen, we understand, and we craft a search strategy tailored to you.</p>
          </div>
          <div className="step">
            <div className="step-num">02</div>
            <h4>Curated Matches</h4>
            <p>We hand-pick properties that fit your brief — including off-market listings you won&apos;t find anywhere else.</p>
          </div>
          <div className="step">
            <div className="step-num">03</div>
            <h4>Tours & Negotiation</h4>
            <p>Private in-person or virtual tours. When you&apos;re ready, we negotiate fiercely on your behalf.</p>
          </div>
          <div className="step">
            <div className="step-num">04</div>
            <h4>Seamless Closing</h4>
            <p>We manage all paperwork, legals, and logistics — so you walk to closing day completely stress-free.</p>
          </div>
        </div>
      </section>

      <section className="testi-section">
        <div style={{ textAlign: 'center', maxWidth: '560px', margin: '0 auto' }}>
          <div className="label" style={{ justifyContent: 'center' }}>Client Stories</div>
          <h2 className="sec-title">Trusted by <em>Thousands</em></h2>
        </div>
        <div className="testi-grid">
          {testimonials.map((t) => (
            <TestimonialCard key={t.id} testimonial={t} />
          ))}
        </div>
      </section>

      <section className="contact-section" id="contact">
        <ContactForm />
      </section>

      <div className="cta-banner">
        <div className="cta-text">
          <h2>Ready to Find Your Next Home?</h2>
          <p>Book a free 30-minute consultation with one of our experts — no pressure, just answers.</p>
        </div>
        <div className="cta-btns">
          <button className="cta-btn-w" onClick={() => setIsModalOpen(true)}>Book Free Consultation</button>
          <button className="cta-btn-o" onClick={() => document.getElementById('listings')?.scrollIntoView({ behavior: 'smooth' })}>Browse All Listings</button>
        </div>
      </div>

      <footer>
        <div className="footer-top">
          <div className="footer-brand">
            <span className="footer-logo">Meridian <span>Properties</span></span>
            <p>NYC&apos;s most trusted real estate advisors since 2006. Buying, selling, and investing — done right.</p>
          </div>
          <div className="footer-col">
            <h4>Properties</h4>
            <ul>
              <li><a href="#">Buy</a></li>
              <li><a href="#">Rent</a></li>
              <li><a href="#">New Developments</a></li>
              <li><a href="#">Commercial</a></li>
              <li><a href="#">Luxury Collection</a></li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Company</h4>
            <ul>
              <li><a href="#">About Us</a></li>
              <li><a href="#">Our Agents</a></li>
              <li><a href="#">Careers</a></li>
              <li><a href="#">Press</a></li>
              <li><a href="#">Contact</a></li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Contact</h4>
            <ul>
              <li><a href="#">142 Fifth Ave, NYC</a></li>
              <li><a href="#">+1 (212) 888-0044</a></li>
              <li><a href="#">hello@meridianprops.com</a></li>
              <li><a href="#">Office Hours: 9–7 Daily</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© 2025 Meridian Properties. All rights reserved.</span>
          <div className="socials">
            <a href="#">Instagram</a>
            <a href="#">LinkedIn</a>
            <a href="#">Facebook</a>
            <a href="#">Zillow</a>
          </div>
        </div>
      </footer>

      <InquiryModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} agentId={selectedAgentId} />
    </>
  )
}

function ContactForm() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [interest, setInterest] = useState('')
  const [message, setMessage] = useState('')
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(false)
    setSuccess(false)

    let msg = message
    if (interest) msg = `[Interest: ${interest}]\n` + msg

    try {
      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone, message: msg, property_id: null, agent_id: null })
      })

      if (res.ok) {
        setSuccess(true)
        setName('')
        setEmail('')
        setPhone('')
        setMessage('')
        setInterest('')
      } else {
        setError(true)
      }
    } catch {
      setError(true)
    }
  }

  return (
    <div className="contact-inner">
      <div className="label" style={{ justifyContent: 'center' }}>Get In Touch</div>
      <h2 className="sec-title">Send an <em>Inquiry</em></h2>
      <p>Interested in a property, or looking to sell? Drop us a message.</p>

      <form className="contact-form" onSubmit={handleSubmit}>
        <div>
          <label>Full Name</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div>
          <label>Email Address</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div>
          <label>Phone (Optional)</label>
          <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} />
        </div>
        <div>
          <label>Interested In</label>
          <select value={interest} onChange={(e) => setInterest(e.target.value)}>
            <option value="">General Inquiry</option>
            <option value="Buying">Buying a Property</option>
            <option value="Selling">Selling a Property</option>
            <option value="Renting">Renting</option>
          </select>
        </div>
        <div className="full-width">
          <label>Message</label>
          <textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={4} required />
        </div>
        <button type="submit" className="contact-btn">Send Message</button>
        {success && <div id="inline-success" style={{ display: 'block', color: '#27ae60', fontWeight: 600, textAlign: 'center', gridColumn: '1/-1' }}>Thank you! Your message has been sent.</div>}
        {error && <div id="inline-error" style={{ display: 'block', color: '#e74c3c', fontWeight: 600, textAlign: 'center', gridColumn: '1/-1' }}>Error submitting inquiry. Please try again.</div>}
      </form>
    </div>
  )
}
