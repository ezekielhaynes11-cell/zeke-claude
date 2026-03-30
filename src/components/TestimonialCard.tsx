interface TestimonialCardProps {
  quote: string
  name: string
  location: string
  rating?: number
}

export default function TestimonialCard({
  quote,
  name,
  location,
  rating = 5,
}: TestimonialCardProps) {
  return (
    <div className="testimonial-card">
      <style>{`
        .testimonial-card {
          background: var(--bg-elevated);
          border: 1px solid var(--border);
          border-top: 2px solid var(--gold);
          padding: 32px;
          display: flex;
          flex-direction: column;
          gap: 16px;
          transition: transform var(--transition), box-shadow var(--transition);
        }
        .testimonial-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 0 20px rgba(201, 168, 76, 0.15);
        }
        .testimonial-card__stars {
          display: flex;
          gap: 4px;
        }
        .testimonial-card__star {
          color: var(--gold);
          font-size: 16px;
        }
        .testimonial-card__quote {
          font-size: 15px;
          font-style: italic;
          color: var(--text-secondary);
          line-height: 1.7;
          flex: 1;
        }
        .testimonial-card__quote::before {
          content: '"';
          font-family: var(--font-display);
          font-size: 40px;
          color: var(--gold);
          line-height: 0;
          vertical-align: -12px;
          margin-right: 4px;
        }
        .testimonial-card__attribution {
          border-top: 1px solid var(--border);
          padding-top: 16px;
        }
        .testimonial-card__name {
          font-family: var(--font-heading);
          font-size: 14px;
          font-weight: 700;
          color: var(--text-primary);
          letter-spacing: 0.05em;
          text-transform: uppercase;
        }
        .testimonial-card__location {
          font-size: 12px;
          color: var(--text-muted);
          margin-top: 2px;
        }
      `}</style>
      <div className="testimonial-card__stars">
        {Array.from({ length: rating }).map((_, i) => (
          <span key={i} className="testimonial-card__star">★</span>
        ))}
      </div>
      <p className="testimonial-card__quote">{quote}</p>
      <div className="testimonial-card__attribution">
        <p className="testimonial-card__name">{name}</p>
        <p className="testimonial-card__location">{location}</p>
      </div>
    </div>
  )
}
