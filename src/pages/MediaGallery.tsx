import { useEffect, useRef, useState } from 'react'

function useAnimateIn() {
  const ref = useRef<HTMLElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible') }),
      { threshold: 0.05 }
    )
    el.querySelectorAll('.animate-in').forEach(t => observer.observe(t))
    return () => observer.disconnect()
  }, [])
  return ref
}

const photos = [
  { label: 'Training Photo 1', aspect: 'tall' },
  { label: 'Training Photo 2', aspect: 'wide' },
  { label: 'Training Photo 3', aspect: 'square' },
  { label: 'Training Photo 4', aspect: 'wide' },
  { label: 'Training Photo 5', aspect: 'tall' },
  { label: 'Training Photo 6', aspect: 'square' },
  { label: 'Training Photo 7', aspect: 'square' },
  { label: 'Training Photo 8', aspect: 'tall' },
  { label: 'Training Photo 9', aspect: 'wide' },
  { label: 'Training Photo 10', aspect: 'square' },
  { label: 'Training Photo 11', aspect: 'wide' },
  { label: 'Training Photo 12', aspect: 'tall' },
]

export default function MediaGallery() {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
  const sectionRef = useAnimateIn()

  // Keyboard navigation for lightbox
  useEffect(() => {
    if (lightboxIndex === null) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightboxIndex(null)
      if (e.key === 'ArrowRight') setLightboxIndex(i => i !== null ? (i + 1) % photos.length : null)
      if (e.key === 'ArrowLeft') setLightboxIndex(i => i !== null ? (i - 1 + photos.length) % photos.length : null)
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [lightboxIndex])

  return (
    <div>
      <style>{`
        .masonry-grid {
          columns: 3;
          column-gap: 16px;
        }
        .masonry-item {
          break-inside: avoid;
          margin-bottom: 16px;
          cursor: pointer;
          overflow: hidden;
          position: relative;
        }
        .masonry-item:hover .masonry-overlay {
          opacity: 1;
        }
        .masonry-placeholder {
          width: 100%;
          background: var(--bg-elevated);
          border: 1px solid var(--border);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-muted);
          font-family: var(--font-heading);
          font-size: 11px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          transition: filter var(--transition);
        }
        .masonry-item.tall .masonry-placeholder { height: 320px; }
        .masonry-item.wide .masonry-placeholder { height: 200px; }
        .masonry-item.square .masonry-placeholder { height: 260px; }
        .masonry-item:hover .masonry-placeholder {
          filter: brightness(0.7);
        }
        .masonry-overlay {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: opacity var(--transition);
        }
        .masonry-overlay svg {
          width: 40px;
          height: 40px;
          color: var(--gold);
        }
        /* Lightbox */
        .lightbox {
          position: fixed;
          inset: 0;
          z-index: 2000;
          background: rgba(0,0,0,0.92);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
          animation: fadeIn 0.2s ease;
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .lightbox__content {
          position: relative;
          max-width: 900px;
          width: 100%;
        }
        .lightbox__image {
          width: 100%;
          height: 500px;
          background: var(--bg-elevated);
          border: 1px solid var(--border);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-muted);
          font-family: var(--font-heading);
          font-size: 14px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }
        .lightbox__close {
          position: absolute;
          top: -48px;
          right: 0;
          background: none;
          border: none;
          color: var(--text-secondary);
          cursor: pointer;
          font-size: 32px;
          line-height: 1;
          transition: color var(--transition);
        }
        .lightbox__close:hover {
          color: var(--text-primary);
        }
        .lightbox__nav {
          display: flex;
          justify-content: space-between;
          margin-top: 16px;
        }
        .lightbox__nav button {
          font-family: var(--font-heading);
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: var(--text-secondary);
          background: none;
          border: 1px solid var(--border);
          padding: 10px 20px;
          cursor: pointer;
          transition: color var(--transition), border-color var(--transition);
        }
        .lightbox__nav button:hover {
          color: var(--gold);
          border-color: var(--gold);
        }
        .lightbox__counter {
          font-family: var(--font-heading);
          font-size: 13px;
          color: var(--text-muted);
          align-self: center;
        }
        @media (max-width: 768px) {
          .masonry-grid {
            columns: 2;
          }
        }
        @media (max-width: 480px) {
          .masonry-grid {
            columns: 1;
          }
        }
      `}</style>

      <div className="page-hero">
        <div className="container">
          <p className="eyebrow" style={{ marginBottom: 12 }}>On the Range</p>
          <h1>Media Gallery</h1>
          <p>A look at training, instruction, and the IntegriCorp community in action.</p>
        </div>
      </div>

      <section className="section" ref={sectionRef as React.RefObject<HTMLElement>}>
        <div className="container">
          <div className="masonry-grid">
            {photos.map((photo, i) => (
              <div
                key={i}
                className={`masonry-item ${photo.aspect} animate-in`}
                style={{ transitionDelay: `${i * 60}ms` }}
                onClick={() => setLightboxIndex(i)}
                role="button"
                tabIndex={0}
                onKeyDown={e => e.key === 'Enter' && setLightboxIndex(i)}
                aria-label={`Open ${photo.label}`}
              >
                <div className="masonry-placeholder">{photo.label}</div>
                <div className="masonry-overlay">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                    <line x1="11" y1="8" x2="11" y2="14" />
                    <line x1="8" y1="11" x2="14" y2="11" />
                  </svg>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {lightboxIndex !== null && (
        <div
          className="lightbox"
          onClick={e => { if (e.target === e.currentTarget) setLightboxIndex(null) }}
          role="dialog"
          aria-modal="true"
          aria-label="Image lightbox"
        >
          <div className="lightbox__content">
            <button
              className="lightbox__close"
              onClick={() => setLightboxIndex(null)}
              aria-label="Close lightbox"
            >
              ×
            </button>
            <div className="lightbox__image">
              {photos[lightboxIndex].label}
            </div>
            <div className="lightbox__nav">
              <button onClick={() => setLightboxIndex(i => i !== null ? (i - 1 + photos.length) % photos.length : null)}>
                ← Prev
              </button>
              <span className="lightbox__counter">
                {lightboxIndex + 1} / {photos.length}
              </span>
              <button onClick={() => setLightboxIndex(i => i !== null ? (i + 1) % photos.length : null)}>
                Next →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
