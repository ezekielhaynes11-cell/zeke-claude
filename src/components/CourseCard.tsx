import { Link } from 'react-router-dom'

interface CourseCardProps {
  title: string
  description: string
  details?: string[]
  badge?: string
  ctaLabel?: string
  ctaTo?: string
  index?: number
}

export default function CourseCard({
  title,
  description,
  details,
  badge,
  ctaLabel = 'Register Now',
  ctaTo = '/courses',
  index = 0,
}: CourseCardProps) {
  return (
    <article
      className="course-card animate-in"
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      <style>{`
        .course-card {
          background: var(--bg-secondary);
          border: 1px solid var(--border);
          border-top: 3px solid var(--gold);
          padding: 32px;
          display: flex;
          flex-direction: column;
          gap: 16px;
          transition: transform var(--transition), box-shadow var(--transition);
          position: relative;
        }
        .course-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 0 20px rgba(201, 168, 76, 0.2);
        }
        .course-card__badge {
          display: inline-block;
          background: var(--gold);
          color: #000;
          font-family: var(--font-heading);
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          padding: 4px 10px;
          align-self: flex-start;
        }
        .course-card__title {
          font-family: var(--font-heading);
          font-size: 20px;
          font-weight: 700;
          color: var(--text-primary);
          letter-spacing: 0.02em;
          line-height: 1.3;
        }
        .course-card__desc {
          font-size: 14px;
          color: var(--text-secondary);
          line-height: 1.7;
          flex: 1;
        }
        .course-card__details {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .course-card__detail {
          font-size: 13px;
          color: var(--text-muted);
          display: flex;
          align-items: flex-start;
          gap: 8px;
        }
        .course-card__detail::before {
          content: '→';
          color: var(--gold);
          flex-shrink: 0;
        }
        .course-card__cta {
          margin-top: 8px;
          align-self: flex-start;
        }
      `}</style>
      {badge && <span className="course-card__badge">{badge}</span>}
      <h3 className="course-card__title">{title}</h3>
      <p className="course-card__desc">{description}</p>
      {details && details.length > 0 && (
        <ul className="course-card__details">
          {details.map((d, i) => (
            <li key={i} className="course-card__detail">{d}</li>
          ))}
        </ul>
      )}
      <div className="course-card__cta">
        <Link to={ctaTo} className="btn-gold">{ctaLabel}</Link>
      </div>
    </article>
  )
}
