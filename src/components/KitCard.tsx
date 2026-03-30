interface KitCardProps {
  name: string
  description: string
  forWho: string
  category: string
  index?: number
  onLearnMore?: () => void
}

export default function KitCard({
  name,
  description,
  forWho,
  index = 0,
  onLearnMore,
}: KitCardProps) {
  return (
    <article
      className="kit-card animate-in"
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      <style>{`
        .kit-card {
          background: var(--bg-secondary);
          border: 1px solid var(--border);
          display: flex;
          flex-direction: column;
          transition: transform var(--transition), box-shadow var(--transition);
          overflow: hidden;
        }
        .kit-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 0 20px rgba(201, 168, 76, 0.2);
        }
        .kit-card__image {
          width: 100%;
          height: 220px;
          background: var(--bg-elevated);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-muted);
          font-family: var(--font-heading);
          font-size: 12px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          border-bottom: 1px solid var(--border);
          flex-shrink: 0;
        }
        .kit-card__body {
          padding: 24px;
          display: flex;
          flex-direction: column;
          gap: 12px;
          flex: 1;
        }
        .kit-card__name {
          font-family: var(--font-heading);
          font-size: 16px;
          font-weight: 700;
          color: var(--text-primary);
          letter-spacing: 0.02em;
          line-height: 1.3;
        }
        .kit-card__desc {
          font-size: 13px;
          color: var(--text-secondary);
          line-height: 1.6;
          flex: 1;
        }
        .kit-card__badge {
          font-family: var(--font-heading);
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--gold);
          border: 1px solid var(--gold-dark);
          padding: 3px 8px;
          align-self: flex-start;
        }
        .kit-card__actions {
          display: flex;
          gap: 8px;
          margin-top: 8px;
          flex-wrap: wrap;
        }
        .kit-card__actions .btn-gold,
        .kit-card__actions .btn-ghost {
          font-size: 12px;
          padding: 10px 16px;
          flex: 1;
          min-width: 100px;
        }
      `}</style>
      <div className="kit-card__image">
        <span>Product Image</span>
      </div>
      <div className="kit-card__body">
        <h3 className="kit-card__name">{name}</h3>
        <p className="kit-card__desc">{description}</p>
        <span className="kit-card__badge">{forWho}</span>
        <div className="kit-card__actions">
          <button className="btn-gold">Build My Kit</button>
          <button className="btn-ghost" onClick={onLearnMore}>Learn More</button>
        </div>
      </div>
    </article>
  )
}
