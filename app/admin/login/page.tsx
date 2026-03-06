'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [token, setToken] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token })
      })

      if (res.ok) {
        router.push('/admin')
      } else {
        const data = await res.json()
        setError(data.error || 'Invalid token')
      }
    } catch {
      setError('An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--bg)'
    }}>
      <div style={{
        background: '#fff',
        padding: '3rem',
        borderRadius: '8px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
        width: '90%',
        maxWidth: '400px'
      }}>
        <div style={{
          fontFamily: "'DM Serif Display', serif",
          fontSize: '1.8rem',
          color: 'var(--navy)',
          marginBottom: '0.5rem',
          textAlign: 'center'
        }}>
          Meridian <span style={{ color: 'var(--accent)' }}>Admin</span>
        </div>
        <p style={{ textAlign: 'center', color: 'var(--muted)', marginBottom: '2rem', fontSize: '0.9rem' }}>
          Enter your admin token to continue
        </p>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--navy)', marginBottom: '0.5rem' }}>
              Admin Token
            </label>
            <input
              type="password"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '0.8rem',
                border: '1px solid var(--border)',
                fontFamily: 'inherit',
                fontSize: '1rem',
                outline: 'none'
              }}
              placeholder="Enter your token"
            />
          </div>

          {error && (
            <div style={{ color: '#e74c3c', fontSize: '0.85rem', marginBottom: '1rem', textAlign: 'center' }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '0.9rem',
              background: 'var(--navy)',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              fontWeight: 600,
              fontFamily: 'inherit',
              fontSize: '0.95rem',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1,
              transition: 'background 0.3s'
            }}
          >
            {loading ? 'Verifying...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  )
}
