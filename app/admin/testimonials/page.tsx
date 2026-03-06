'use client'

import { useState, useEffect } from 'react'
import DataTable from '@/components/admin/DataTable'
import Modal from '@/components/admin/Modal'

interface Testimonial {
  id: number
  name: string
  initials: string
  text: string
  rating: number
  info: string
  active: boolean
}

const emptyTestimonial = {
  name: '',
  initials: '',
  text: '',
  rating: 5,
  info: '',
  active: true
}

export default function TestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<Testimonial | null>(null)
  const [formData, setFormData] = useState(emptyTestimonial)
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

  useEffect(() => {
    loadTestimonials()
  }, [])

  const loadTestimonials = async () => {
    try {
      const res = await fetch('/api/testimonials')
      if (res.ok) setTestimonials(await res.json())
    } catch (e) { }
    setLoading(false)
  }

  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({ type, message })
    setTimeout(() => setToast(null), 3000)
  }

  const handleOpenModal = (item?: Testimonial) => {
    if (item) {
      setEditingItem(item)
      setFormData(item)
    } else {
      setEditingItem(null)
      setFormData(emptyTestimonial)
    }
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingItem(null)
    setFormData(emptyTestimonial)
  }

  const handleToggleActive = async (item: Testimonial) => {
    try {
      const res = await fetch('/api/testimonials', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...item, active: !item.active })
      })

      if (res.ok) {
        showToast('success', `Testimonial ${item.active ? 'deactivated' : 'activated'}`)
        loadTestimonials()
      } else {
        showToast('error', 'Failed to update testimonial')
      }
    } catch {
      showToast('error', 'Failed to update testimonial')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const method = editingItem ? 'PUT' : 'POST'
    const body = editingItem ? { id: editingItem.id, ...formData } : formData

    try {
      const res = await fetch('/api/testimonials', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })

      if (res.ok) {
        showToast('success', editingItem ? 'Testimonial updated' : 'Testimonial created')
        loadTestimonials()
        handleCloseModal()
      } else {
        showToast('error', 'Failed to save testimonial')
      }
    } catch {
      showToast('error', 'Failed to save testimonial')
    }
  }

  const handleDelete = async (item: Testimonial) => {
    if (!confirm(`Delete "${item.name}"?`)) return

    try {
      const res = await fetch(`/api/testimonials?id=${item.id}`, { method: 'DELETE' })
      if (res.ok) {
        showToast('success', 'Testimonial deleted')
        loadTestimonials()
      } else {
        showToast('error', 'Failed to delete testimonial')
      }
    } catch {
      showToast('error', 'Failed to delete testimonial')
    }
  }

  const columns = [
    { key: 'name', label: 'Name' },
    { key: 'initials', label: 'Initials' },
    { key: 'rating', label: 'Rating' },
    { key: 'info', label: 'Info' },
    { key: 'active', label: 'Active', render: (item: Testimonial) => (
      <span style={{ 
        padding: '0.25rem 0.75rem', 
        borderRadius: '12px', 
        fontSize: '0.75rem',
        fontWeight: 600,
        background: item.active ? '#d4edda' : '#f8d7da',
        color: item.active ? '#155724' : '#721c24'
      }}>
        {item.active ? 'Active' : 'Inactive'}
      </span>
    )}
  ]

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: '2rem', color: 'var(--navy)' }}>Testimonials</h1>
        <button onClick={() => handleOpenModal()} style={{
          padding: '0.75rem 1.5rem',
          background: 'var(--navy)',
          color: '#fff',
          border: 'none',
          borderRadius: '4px',
          fontWeight: 600,
          cursor: 'pointer'
        }}>+ Add Testimonial</button>
      </div>

      {toast && (
        <div style={{
          position: 'fixed',
          top: '1rem',
          right: '1rem',
          padding: '1rem 1.5rem',
          background: toast.type === 'success' ? '#27ae60' : '#e74c3c',
          color: '#fff',
          borderRadius: '4px',
          fontWeight: 500,
          zIndex: 1000
        }}>
          {toast.message}
        </div>
      )}

      <DataTable columns={columns} data={testimonials} keyExtractor={(item) => item.id} onEdit={handleOpenModal} onDelete={handleDelete} />

      <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={editingItem ? 'Edit Testimonial' : 'Add Testimonial'}>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.3rem' }}>Name</label>
              <input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required style={{ width: '100%', padding: '0.6rem', border: '1px solid var(--border)' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.3rem' }}>Initials</label>
              <input value={formData.initials} onChange={(e) => setFormData({ ...formData, initials: e.target.value })} required style={{ width: '100%', padding: '0.6rem', border: '1px solid var(--border)' }} maxLength={2} />
            </div>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.3rem' }}>Text</label>
            <textarea value={formData.text} onChange={(e) => setFormData({ ...formData, text: e.target.value })} required style={{ width: '100%', padding: '0.6rem', border: '1px solid var(--border)', minHeight: '100px', resize: 'vertical' }} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.3rem' }}>Rating (1-5)</label>
              <input type="number" value={formData.rating} onChange={(e) => setFormData({ ...formData, rating: Math.min(5, Math.max(1, parseInt(e.target.value) || 5)) })} required min={1} max={5} style={{ width: '100%', padding: '0.6rem', border: '1px solid var(--border)' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.3rem' }}>Info</label>
              <input value={formData.info} onChange={(e) => setFormData({ ...formData, info: e.target.value })} style={{ width: '100%', padding: '0.6rem', border: '1px solid var(--border)' }} />
            </div>
          </div>
          <div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', fontWeight: 600 }}>
              <input type="checkbox" checked={formData.active} onChange={(e) => setFormData({ ...formData, active: e.target.checked })} />
              Active
            </label>
          </div>
          <button type="submit" style={{ padding: '0.8rem', background: 'var(--navy)', color: '#fff', border: 'none', borderRadius: '4px', fontWeight: 600, cursor: 'pointer', marginTop: '0.5rem' }}>
            {editingItem ? 'Update' : 'Create'} Testimonial
          </button>
        </form>
      </Modal>
    </div>
  )
}
