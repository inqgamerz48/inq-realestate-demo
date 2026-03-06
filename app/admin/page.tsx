'use client'

import { useState, useEffect } from 'react'

interface Stats {
  properties: number
  agents: number
  testimonials: number
  inquiries: number
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({ properties: 0, agents: 0, testimonials: 0, inquiries: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async () => {
    try {
      const [propsRes, agentsRes, testiRes, inqRes] = await Promise.all([
        fetch('/api/properties'),
        fetch('/api/agents'),
        fetch('/api/testimonials'),
        fetch('/api/inquiries')
      ])

      setStats({
        properties: propsRes.ok ? (await propsRes.json()).length : 0,
        agents: agentsRes.ok ? (await agentsRes.json()).length : 0,
        testimonials: testiRes.ok ? (await testiRes.json()).length : 0,
        inquiries: inqRes.ok ? (await inqRes.json()).length : 0
      })
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  const cards = [
    { label: 'Properties', value: stats.properties, icon: '🏠', color: 'var(--navy)' },
    { label: 'Agents', value: stats.agents, icon: '👥', color: 'var(--accent)' },
    { label: 'Inquiries', value: stats.inquiries, icon: '✉️', color: '#27ae60' },
    { label: 'Testimonials', value: stats.testimonials, icon: '⭐', color: '#9b59b6' }
  ]

  return (
    <div>
      <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: '2rem', color: 'var(--navy)', marginBottom: '2rem' }}>
        Dashboard
      </h1>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem' }}>
        {cards.map((card) => (
          <div key={card.label} style={{
            background: '#fff',
            padding: '1.5rem',
            borderRadius: '8px',
            border: '1px solid var(--border)',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem'
          }}>
            <div style={{
              width: '50px',
              height: '50px',
              background: card.color,
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.5rem'
            }}>
              {card.icon}
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {card.label}
              </div>
              <div style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--navy)' }}>
                {loading ? '...' : card.value}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: '3rem', background: '#fff', padding: '2rem', borderRadius: '8px', border: '1px solid var(--border)' }}>
        <h2 style={{ fontSize: '1.2rem', color: 'var(--navy)', marginBottom: '1rem' }}>Quick Actions</h2>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <a href="/admin/properties" style={{
            padding: '0.75rem 1.5rem',
            background: 'var(--navy)',
            color: '#fff',
            borderRadius: '4px',
            textDecoration: 'none',
            fontSize: '0.9rem',
            fontWeight: 500
          }}>Manage Properties</a>
          <a href="/admin/agents" style={{
            padding: '0.75rem 1.5rem',
            background: 'var(--accent)',
            color: '#fff',
            borderRadius: '4px',
            textDecoration: 'none',
            fontSize: '0.9rem',
            fontWeight: 500
          }}>Manage Agents</a>
          <a href="/admin/testimonials" style={{
            padding: '0.75rem 1.5rem',
            background: 'var(--navy)',
            color: '#fff',
            borderRadius: '4px',
            textDecoration: 'none',
            fontSize: '0.9rem',
            fontWeight: 500
          }}>Manage Testimonials</a>
          <a href="/admin/inquiries" style={{
            padding: '0.75rem 1.5rem',
            background: '#27ae60',
            color: '#fff',
            borderRadius: '4px',
            textDecoration: 'none',
            fontSize: '0.9rem',
            fontWeight: 500
          }}>View Inquiries</a>
        </div>
      </div>
    </div>
  )
}
