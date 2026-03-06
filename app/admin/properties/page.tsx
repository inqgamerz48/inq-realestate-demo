'use client'

import { useState, useEffect } from 'react'
import DataTable from '@/components/admin/DataTable'
import Modal from '@/components/admin/Modal'

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
  category: string
}

const emptyProperty = {
  name: '',
  price: '',
  location: '',
  beds: 0,
  baths: 0,
  sqft: 0,
  image_url: '',
  badge: '',
  badge_class: '',
  category: ''
}

export default function PropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<Property | null>(null)
  const [formData, setFormData] = useState(emptyProperty)
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

  useEffect(() => {
    loadProperties()
  }, [])

  const loadProperties = async () => {
    try {
      const res = await fetch('/api/properties')
      if (res.ok) setProperties(await res.json())
    } catch (e) { }
    setLoading(false)
  }

  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({ type, message })
    setTimeout(() => setToast(null), 3000)
  }

  const handleOpenModal = (item?: Property) => {
    if (item) {
      setEditingItem(item)
      setFormData(item)
    } else {
      setEditingItem(null)
      setFormData(emptyProperty)
    }
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingItem(null)
    setFormData(emptyProperty)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const method = editingItem ? 'PUT' : 'POST'
    const body = editingItem ? { id: editingItem.id, ...formData } : formData

    try {
      const res = await fetch('/api/properties', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })

      if (res.ok) {
        showToast('success', editingItem ? 'Property updated' : 'Property created')
        loadProperties()
        handleCloseModal()
      } else {
        showToast('error', 'Failed to save property')
      }
    } catch {
      showToast('error', 'Failed to save property')
    }
  }

  const handleDelete = async (item: Property) => {
    if (!confirm(`Delete "${item.name}"?`)) return

    try {
      const res = await fetch(`/api/properties?id=${item.id}`, { method: 'DELETE' })
      if (res.ok) {
        showToast('success', 'Property deleted')
        loadProperties()
      } else {
        showToast('error', 'Failed to delete property')
      }
    } catch {
      showToast('error', 'Failed to delete property')
    }
  }

  const columns = [
    { key: 'image_url', label: 'Image', render: (item: Property) => (
      <img src={item.image_url} alt={item.name} style={{ width: 60, height: 40, objectFit: 'cover', borderRadius: 4 }} />
    )},
    { key: 'name', label: 'Name' },
    { key: 'price', label: 'Price' },
    { key: 'location', label: 'Location' },
    { key: 'beds', label: 'Beds' },
    { key: 'baths', label: 'Baths' },
    { key: 'badge', label: 'Badge' }
  ]

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: '2rem', color: 'var(--navy)' }}>Properties</h1>
        <button onClick={() => handleOpenModal()} style={{
          padding: '0.75rem 1.5rem',
          background: 'var(--navy)',
          color: '#fff',
          border: 'none',
          borderRadius: '4px',
          fontWeight: 600,
          cursor: 'pointer'
        }}>+ Add Property</button>
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

      <DataTable columns={columns} data={properties} keyExtractor={(item) => item.id} onEdit={handleOpenModal} onDelete={handleDelete} />

      <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={editingItem ? 'Edit Property' : 'Add Property'}>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.3rem' }}>Name</label>
            <input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required style={{ width: '100%', padding: '0.6rem', border: '1px solid var(--border)' }} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.3rem' }}>Price</label>
              <input value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} required style={{ width: '100%', padding: '0.6rem', border: '1px solid var(--border)' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.3rem' }}>Location</label>
              <input value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} required style={{ width: '100%', padding: '0.6rem', border: '1px solid var(--border)' }} />
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.3rem' }}>Beds</label>
              <input type="number" value={formData.beds} onChange={(e) => setFormData({ ...formData, beds: parseInt(e.target.value) || 0 })} required style={{ width: '100%', padding: '0.6rem', border: '1px solid var(--border)' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.3rem' }}>Baths</label>
              <input type="number" value={formData.baths} onChange={(e) => setFormData({ ...formData, baths: parseInt(e.target.value) || 0 })} required style={{ width: '100%', padding: '0.6rem', border: '1px solid var(--border)' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.3rem' }}>Sqft</label>
              <input type="number" value={formData.sqft} onChange={(e) => setFormData({ ...formData, sqft: parseInt(e.target.value) || 0 })} required style={{ width: '100%', padding: '0.6rem', border: '1px solid var(--border)' }} />
            </div>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.3rem' }}>Image URL</label>
            <input value={formData.image_url} onChange={(e) => setFormData({ ...formData, image_url: e.target.value })} required style={{ width: '100%', padding: '0.6rem', border: '1px solid var(--border)' }} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.3rem' }}>Badge</label>
              <input value={formData.badge} onChange={(e) => setFormData({ ...formData, badge: e.target.value })} style={{ width: '100%', padding: '0.6rem', border: '1px solid var(--border)' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.3rem' }}>Badge Class</label>
              <input value={formData.badge_class} onChange={(e) => setFormData({ ...formData, badge_class: e.target.value })} style={{ width: '100%', padding: '0.6rem', border: '1px solid var(--border)' }} />
            </div>
          </div>
          <button type="submit" style={{ padding: '0.8rem', background: 'var(--navy)', color: '#fff', border: 'none', borderRadius: '4px', fontWeight: 600, cursor: 'pointer', marginTop: '0.5rem' }}>
            {editingItem ? 'Update' : 'Create'} Property
          </button>
        </form>
      </Modal>
    </div>
  )
}
