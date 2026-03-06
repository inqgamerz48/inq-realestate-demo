'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: '📊' },
  { href: '/admin/properties', label: 'Properties', icon: '🏠' },
  { href: '/admin/agents', label: 'Agents', icon: '👥' },
  { href: '/admin/testimonials', label: 'Testimonials', icon: '⭐' },
  { href: '/admin/inquiries', label: 'Inquiries', icon: '✉️' },
]

export default function Sidebar() {
  const pathname = usePathname()

  const handleLogout = async () => {
    document.cookie = 'admin_session=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;'
    window.location.href = '/admin/login'
  }

  return (
    <aside style={{
      width: '260px',
      background: 'var(--navy)',
      minHeight: '100vh',
      padding: '1.5rem',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <div style={{
        fontFamily: "'DM Serif Display', serif",
        fontSize: '1.4rem',
        color: '#fff',
        marginBottom: '2.5rem'
      }}>
        Meridian <span style={{ color: 'var(--accent)' }}>Admin</span>
      </div>

      <nav style={{ flex: 1 }}>
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href))
          return (
            <Link
              key={item.href}
              href={item.href}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.75rem 1rem',
                color: isActive ? 'var(--navy)' : 'rgba(255,255,255,0.6)',
                background: isActive ? 'var(--accent)' : 'transparent',
                textDecoration: 'none',
                borderRadius: '4px',
                marginBottom: '0.5rem',
                fontSize: '0.9rem',
                fontWeight: 500,
                transition: 'all 0.2s'
              }}
            >
              <span>{item.icon}</span>
              {item.label}
            </Link>
          )
        })}
      </nav>

      <button
        onClick={handleLogout}
        style={{
          padding: '0.75rem 1rem',
          background: 'transparent',
          border: '1px solid rgba(255,255,255,0.2)',
          color: 'rgba(255,255,255,0.6)',
          borderRadius: '4px',
          cursor: 'pointer',
          fontSize: '0.85rem',
          fontWeight: 500,
          transition: 'all 0.2s'
        }}
      >
        Logout
      </button>
    </aside>
  )
}
