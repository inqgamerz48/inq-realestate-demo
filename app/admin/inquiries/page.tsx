'use client'

import { useState, useEffect } from 'react'
import DataTable from '@/components/admin/DataTable'

interface Inquiry {
  id: number
  name: string
  email: string
  phone: string
  message: string
  agent_id: number | null
  property_id: number | null
  created_at: string
}

export default function InquiriesPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadInquiries()
  }, [])

  const loadInquiries = async () => {
    try {
      const res = await fetch('/api/inquiries')
      if (res.ok) setInquiries(await res.json())
    } catch (e) { }
    setLoading(false)
  }

  const columns = [
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: 'phone', label: 'Phone' },
    { key: 'message', label: 'Message', render: (item: Inquiry) => (
      <span style={{ maxWidth: '200px', display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
        {item.message}
      </span>
    )},
    { key: 'agent_id', label: 'Agent ID' },
    { key: 'property_id', label: 'Property ID' },
    { key: 'created_at', label: 'Date', render: (item: Inquiry) => (
      new Date(item.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    )}
  ]

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: '2rem', color: 'var(--navy)' }}>Inquiries</h1>
        <span style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>{inquiries.length} total</span>
      </div>

      <DataTable columns={columns} data={inquiries} keyExtractor={(item) => item.id} />
    </div>
  )
}
