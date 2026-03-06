'use client'

import { ReactNode } from 'react'

interface Column<T> {
  key: string
  label: string
  render?: (item: T) => ReactNode
}

interface DataTableProps<T> {
  columns: Column<T>[]
  data: T[]
  onEdit?: (item: T) => void
  onDelete?: (item: T) => void
  keyExtractor: (item: T) => string | number
}

export default function DataTable<T>({ columns, data, onEdit, onDelete, keyExtractor }: DataTableProps<T>) {
  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{
        width: '100%',
        borderCollapse: 'collapse',
        background: '#fff',
        borderRadius: '8px',
        overflow: 'hidden'
      }}>
        <thead>
          <tr style={{ background: 'var(--surface)' }}>
            {columns.map((col) => (
              <th key={col.key} style={{
                padding: '1rem',
                textAlign: 'left',
                fontSize: '0.75rem',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                color: 'var(--muted)',
                borderBottom: '1px solid var(--border)'
              }}>
                {col.label}
              </th>
            ))}
            {(onEdit || onDelete) && (
              <th style={{
                padding: '1rem',
                textAlign: 'right',
                fontSize: '0.75rem',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                color: 'var(--muted)',
                borderBottom: '1px solid var(--border)'
              }}>
                Actions
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={keyExtractor(item)} style={{
              borderBottom: '1px solid var(--border)',
              transition: 'background 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = 'var(--surface)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
            >
              {columns.map((col) => (
                <td key={col.key} style={{
                  padding: '1rem',
                  fontSize: '0.9rem',
                  color: 'var(--text)'
                }}>
                  {col.render ? col.render(item) : (item as Record<string, unknown>)[col.key] as ReactNode}
                </td>
              ))}
              {(onEdit || onDelete) && (
                <td style={{ padding: '1rem', textAlign: 'right' }}>
                  {onEdit && (
                    <button
                      onClick={() => onEdit(item)}
                      style={{
                        background: 'var(--navy)',
                        color: '#fff',
                        border: 'none',
                        padding: '0.4rem 0.8rem',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '0.8rem',
                        fontWeight: 500,
                        marginRight: '0.5rem'
                      }}
                    >
                      Edit
                    </button>
                  )}
                  {onDelete && (
                    <button
                      onClick={() => onDelete(item)}
                      style={{
                        background: '#e74c3c',
                        color: '#fff',
                        border: 'none',
                        padding: '0.4rem 0.8rem',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '0.8rem',
                        fontWeight: 500
                      }}
                    >
                      Delete
                    </button>
                  )}
                </td>
              )}
            </tr>
          ))}
          {data.length === 0 && (
            <tr>
              <td colSpan={columns.length + (onEdit || onDelete ? 1 : 0)} style={{
                padding: '3rem',
                textAlign: 'center',
                color: 'var(--muted)'
              }}>
                No data available
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
