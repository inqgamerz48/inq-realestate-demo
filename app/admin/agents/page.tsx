'use client'

import { useState, useEffect } from 'react'
import DataTable from '@/components/admin/DataTable'
import Modal from '@/components/admin/Modal'

interface Agent {
  id: number
  name: string
  role: string
  photo_url: string
  total_sold: number
  total_clients: number
}

const emptyAgent = {
  name: '',
  role: '',
  photo_url: '',
  total_sold: 0,
  total_clients: 0
}

export default function AgentsPage() {
  const [agents, setAgents] = useState<Agent[]>([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<Agent | null>(null)
  const [formData, setFormData] = useState(emptyAgent)
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

  useEffect(() => {
    loadAgents()
  }, [])

  const loadAgents = async () => {
    try {
      const res = await fetch('/api/agents')
      if (res.ok) setAgents(await res.json())
    } catch (e) { }
    setLoading(false)
  }

  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({ type, message })
    setTimeout(() => setToast(null), 3000)
  }

  const handleOpenModal = (item?: Agent) => {
    if (item) {
      setEditingItem(item)
      setFormData(item)
    } else {
      setEditingItem(null)
      setFormData(emptyAgent)
    }
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingItem(null)
    setFormData(emptyAgent)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const method = editingItem ? 'PUT' : 'POST'
    const body = editingItem ? { id: editingItem.id, ...formData } : formData

    try {
      const res = await fetch('/api/agents', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })

      if (res.ok) {
        showToast('success', editingItem ? 'Agent updated' : 'Agent created')
        loadAgents()
        handleCloseModal()
      } else {
        showToast('error', 'Failed to save agent')
      }
    } catch {
      showToast('error', 'Failed to save agent')
    }
  }

  const handleDelete = async (item: Agent) => {
    if (!confirm(`Delete "${item.name}"?`)) return

    try {
      const res = await fetch(`/api/agents?id=${item.id}`, { method: 'DELETE' })
      if (res.ok) {
        showToast('success', 'Agent deleted')
        loadAgents()
      } else {
        showToast('error', 'Failed to delete agent')
      }
    } catch {
      showToast('error', 'Failed to delete agent')
    }
  }

  const columns = [
    { key: 'photo_url', label: 'Photo', render: (item: Agent) => (
      <img src={item.photo_url} alt={item.name} style={{ width: 50, height: 50, borderRadius: '50%', objectFit: 'cover' }} />
    )},
    { key: 'name', label: 'Name' },
    { key: 'role', label: 'Role' },
    { key: 'total_sold', label: 'Sales' },
    { key: 'total_clients', label: 'Clients' }
  ]

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: '2rem', color: 'var(--navy)' }}>Agents</h1>
        <button onClick={() => handleOpenModal()} style={{
          padding: '0.75rem 1.5rem',
          background: 'var(--navy)',
          color: '#fff',
          border: 'none',
          borderRadius: '4px',
          fontWeight: 600,
          cursor: 'pointer'
        }}>+ Add Agent</button>
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

      <DataTable columns={columns} data={agents} keyExtractor={(item) => item.id} onEdit={handleOpenModal} onDelete={handleDelete} />

      <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={editingItem ? 'Edit Agent' : 'Add Agent'}>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.3rem' }}>Name</label>
            <input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required style={{ width: '100%', padding: '0.6rem', border: '1px solid var(--border)' }} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.3rem' }}>Role</label>
            <input value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value })} required style={{ width: '100%', padding: '0.6rem', border: '1px solid var(--border)' }} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.3rem' }}>Photo URL</label>
            <input value={formData.photo_url} onChange={(e) => setFormData({ ...formData, photo_url: e.target.value })} required style={{ width: '100%', padding: '0.6rem', border: '1px solid var(--border)' }} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.3rem' }}>Total Sold</label>
              <input type="number" value={formData.total_sold} onChange={(e) => setFormData({ ...formData, total_sold: parseInt(e.target.value) || 0 })} required style={{ width: '100%', padding: '0.6rem', border: '1px solid var(--border)' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.3rem' }}>Total Clients</label>
              <input type="number" value={formData.total_clients} onChange={(e) => setFormData({ ...formData, total_clients: parseInt(e.target.value) || 0 })} required style={{ width: '100%', padding: '0.6rem', border: '1px solid var(--border)' }} />
            </div>
          </div>
          <button type="submit" style={{ padding: '0.8rem', background: 'var(--navy)', color: '#fff', border: 'none', borderRadius: '4px', fontWeight: 600, cursor: 'pointer', marginTop: '0.5rem' }}>
            {editingItem ? 'Update' : 'Create'} Agent
          </button>
        </form>
      </Modal>
    </div>
  )
}
