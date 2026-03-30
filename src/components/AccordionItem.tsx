interface AccordionItemProps {
  question: string
  answer: string
  isOpen: boolean
  onToggle: () => void
  index: number
}

export default function AccordionItem({
  question,
  answer,
  isOpen,
  onToggle,
  index,
}: AccordionItemProps) {
  return (
    <div className={`accordion-item${isOpen ? ' open' : ''} animate-in`} style={{ transitionDelay: `${index * 60}ms` }}>
      <style>{`
        .accordion-item {
          border: 1px solid var(--border);
          border-radius: 0;
          background: var(--bg-secondary);
          overflow: hidden;
        }
        .accordion-item + .accordion-item {
          margin-top: 8px;
        }
        .accordion-item__trigger {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          padding: 20px 24px;
          background: none;
          border: none;
          cursor: pointer;
          text-align: left;
          font-family: var(--font-heading);
          font-size: 16px;
          font-weight: 500;
          color: var(--text-primary);
          letter-spacing: 0.02em;
          transition: color var(--transition), background var(--transition);
        }
        .accordion-item__trigger:hover {
          background: var(--bg-elevated);
          color: var(--gold);
        }
        .accordion-item.open .accordion-item__trigger {
          color: var(--gold);
        }
        .accordion-item__chevron {
          flex-shrink: 0;
          width: 20px;
          height: 20px;
          color: var(--gold);
          transition: transform 0.4s ease;
        }
        .accordion-item.open .accordion-item__chevron {
          transform: rotate(180deg);
        }
        .accordion-item__body {
          max-height: 0;
          overflow: hidden;
          transition: max-height 0.4s ease;
        }
        .accordion-item.open .accordion-item__body {
          max-height: 400px;
        }
        .accordion-item__content {
          padding: 0 24px 24px;
          font-size: 15px;
          color: var(--text-secondary);
          line-height: 1.7;
          border-top: 1px solid var(--border);
          padding-top: 20px;
        }
      `}</style>
      <button className="accordion-item__trigger" onClick={onToggle} aria-expanded={isOpen}>
        <span>{question}</span>
        <svg
          className="accordion-item__chevron"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>
      <div className="accordion-item__body">
        <p className="accordion-item__content">{answer}</p>
      </div>
    </div>
  )
}
