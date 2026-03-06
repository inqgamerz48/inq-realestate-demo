'use client'

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

interface PropertyCardProps {
  property: Property
  onSave?: (id: number) => void
}

export default function PropertyCard({ property, onSave }: PropertyCardProps) {
  return (
    <div className="prop-card">
      <div className="prop-img">
        <img src={property.image_url} alt={property.name} loading="lazy" />
        {property.badge && (
          <span className={`prop-badge ${property.badge_class}`}>{property.badge}</span>
        )}
        <button
          className="prop-save"
          onClick={(e) => {
            e.stopPropagation()
            onSave?.(property.id)
          }}
        >
          ♡
        </button>
      </div>
      <div className="prop-body">
        <div className="prop-price">{property.price}</div>
        <div className="prop-name">{property.name}</div>
        <div className="prop-loc">📍 {property.location}</div>
        <div className="prop-features">
          <div className="prop-feat"><strong>{property.beds}</strong> Beds</div>
          <div className="prop-feat"><strong>{property.baths}</strong> Baths</div>
          <div className="prop-feat"><strong>{property.sqft?.toLocaleString()}</strong> sq ft</div>
        </div>
      </div>
    </div>
  )
}
