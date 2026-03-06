'use client'

interface Testimonial {
  id: number
  name: string
  initials: string
  text: string
  rating: number
  info: string
}

interface TestimonialCardProps {
  testimonial: Testimonial
}

export default function TestimonialCard({ testimonial }: TestimonialCardProps) {
  const stars = '★'.repeat(testimonial.rating) + '☆'.repeat(5 - (testimonial.rating || 5))

  return (
    <div className="tcard">
      <div className="tcard-stars">{stars}</div>
      <p>{testimonial.text}</p>
      <div className="tcard-author">
        <div className="tcard-av">{testimonial.initials}</div>
        <div>
          <div className="tcard-name">{testimonial.name}</div>
          <div className="tcard-info">{testimonial.info || ''}</div>
        </div>
      </div>
    </div>
  )
}
