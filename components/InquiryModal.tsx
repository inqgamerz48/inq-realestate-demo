'use client'

import { useState, useEffect, useRef } from 'react'

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

interface InquiryModalProps {
  isOpen: boolean
  onClose: () => void
  agentId?: number | null
  propertyId?: number | null
}

export default function InquiryModal({ isOpen, onClose, agentId = null, propertyId = null }: InquiryModalProps) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [message, setMessage] = useState('')
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState(false)
  const modalRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = ''
    }
  }, [isOpen, onClose])

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === modalRef.current) onClose()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(false)
    setSuccess(false)

    try {
      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone, message, agent_id: agentId, property_id: propertyId })
      })

      if (res.ok) {
        setSuccess(true)
        setName('')
        setEmail('')
        setPhone('')
        setMessage('')
        setTimeout(() => {
          onClose()
          setSuccess(false)
        }, 3000)
      } else {
        setError(true)
      }
    } catch {
      setError(true)
    }
  }

  if (!isOpen) return null

  return (
    <div
      ref={modalRef}
      onClick={handleBackdropClick}
      style={{
        display: 'flex',
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: 'rgba(0,0,0,0.6)',
        zIndex: 999,
        alignItems: 'center',
        justifyContent: 'center',
        backdropFilter: 'blur(4px)'
      }}
    >
      <div style={{
        background: '#fff',
        width: '90%',
        maxWidth: '480px',
        padding: '2.5rem',
        position: 'relative',
        borderRadius: '4px'
      }}>
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '1rem',
            right: '1.5rem',
            background: 'none',
            border: 'none',
            fontSize: '1.5rem',
            cursor: 'pointer',
            color: 'var(--muted)'
          }}
        >
          &times;
        </button>
        <h3 style={{
          fontFamily: "'DM Serif Display', serif",
          fontSize: '1.8rem',
          color: 'var(--navy)',
          marginBottom: '0.5rem'
        }}>
          Get in Touch
        </h3>
        <p style={{ color: 'var(--muted)', fontSize: '0.9rem', marginBottom: '2rem' }}>
          Let us know how we can help you today.
        </p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.4rem', color: 'var(--navy)' }}>
              Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              style={{ width: '100%', padding: '0.8rem', border: '1px solid var(--border)', fontFamily: 'inherit', outline: 'none' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.4rem', color: 'var(--navy)' }}>
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{ width: '100%', padding: '0.8rem', border: '1px solid var(--border)', fontFamily: 'inherit', outline: 'none' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.4rem', color: 'var(--navy)' }}>
              Phone (Optional)
            </label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              style={{ width: '100%', padding: '0.8rem', border: '1px solid var(--border)', fontFamily: 'inherit', outline: 'none' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.4rem', color: 'var(--navy)' }}>
              Message
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              required
              style={{ width: '100%', padding: '0.8rem', border: '1px solid var(--border)', fontFamily: 'inherit', outline: 'none', resize: 'vertical' }}
            />
          </div>

          <button
            type="submit"
            style={{
              background: 'var(--navy)',
              color: '#fff',
              padding: '1rem',
              border: 'none',
              fontWeight: 600,
              fontFamily: 'inherit',
              cursor: 'pointer',
              marginTop: '0.5rem',
              transition: 'background 0.3s'
            }}
          >
            Send Inquiry
          </button>
        </form>
        {success && (
          <div style={{ display: 'block', color: '#27ae60', fontWeight: 600, marginTop: '1rem', textAlign: 'center' }}>
            Thank you! Your inquiry has been sent.
          </div>
        )}
        {error && (
          <div style={{ display: 'block', color: '#e74c3c', fontWeight: 600, marginTop: '1rem', textAlign: 'center' }}>
            Error submitting inquiry. Please try again.
          </div>
        )}
      </div>
    </div>
  )
}
