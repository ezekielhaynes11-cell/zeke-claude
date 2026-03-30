import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'

function useAnimateIn() {
  const ref = useRef<HTMLElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible') }),
      { threshold: 0.1 }
    )
    el.querySelectorAll('.animate-in').forEach(t => observer.observe(t))
    return () => observer.disconnect()
  }, [])
  return ref
}

const upcomingEvents = [
  {
    title: 'MS Enhanced Concealed Carry Course',
    date: 'Date TBA — Check Back Soon',
    time: '8:00 AM – 5:00 PM',
    location: 'IntegriCorp Training Facility, Mississippi',
    description: 'Earn your Mississippi Enhanced Carry Permit in one full day. Includes classroom instruction, Mississippi carry law overview, and live-fire qualification. Firearm rental available.',
    spots: '12 spots available',
    type: 'Course',
  },
  {
    title: 'Gold Membership Enrollment Open',
    date: 'Rolling Enrollment — Limited Slots',
    time: 'Flexible scheduling',
    location: 'IntegriCorp Training Facility, Mississippi',
    description: 'Enroll in our 6-month Gold Membership Training Package. Personalized curriculum, 1-on-1 instruction, and measurable skill progression. Contact us to discuss your start date.',
    spots: '4 slots available',
    type: 'Membership',
  },
]

export default function Events() {
  const sectionRef = useAnimateIn()

  return (
    <div>
      <style>{`
        .events-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 28px;
          margin-bottom: 64px;
        }
        .event-card {
          background: var(--bg-secondary);
          border: 1px solid var(--border);
          border-top: 3px solid var(--gold);
          padding: 36px;
          display: flex;
          flex-direction: column;
          gap: 16px;
          transition: transform var(--transition), box-shadow var(--transition);
        }
        .event-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 0 20px rgba(201,168,76,0.2);
        }
        .event-card__type {
          display: inline-block;
          font-family: var(--font-heading);
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: #000;
          background: var(--gold);
          padding: 4px 10px;
          align-self: flex-start;
        }
        .event-card__title {
          font-family: var(--font-heading);
          font-size: 22px;
          font-weight: 700;
          color: var(--text-primary);
          line-height: 1.3;
        }
        .event-card__meta {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .event-card__meta-item {
          display: flex;
          align-items: flex-start;
          gap: 8px;
          font-size: 13px;
          color: var(--text-secondary);
        }
        .event-card__meta-label {
          color: var(--gold);
          font-family: var(--font-heading);
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          white-space: nowrap;
          flex-shrink: 0;
          padding-top: 1px;
        }
        .event-card__desc {
          font-size: 14px;
          color: var(--text-secondary);
          line-height: 1.7;
          flex: 1;
        }
        .event-card__spots {
          font-family: var(--font-heading);
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 0.08em;
          color: var(--gold);
          border: 1px solid var(--gold-dark);
          padding: 4px 12px;
          align-self: flex-start;
        }
        .events-notice {
          background: var(--bg-elevated);
          border: 1px solid var(--border);
          border-left: 4px solid var(--gold);
          padding: 36px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .events-notice h3 {
          font-family: var(--font-heading);
          font-size: 20px;
          font-weight: 700;
          color: var(--text-primary);
        }
        .events-notice p {
          font-size: 15px;
          color: var(--text-secondary);
          line-height: 1.7;
          max-width: 600px;
        }
        @media (max-width: 768px) {
          .events-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <div className="page-hero">
        <div className="container">
          <p className="eyebrow" style={{ marginBottom: 12 }}>Upcoming Events</p>
          <h1>Events & Schedule</h1>
          <p>Register for an upcoming course or contact us to discuss private and group training dates.</p>
        </div>
      </div>

      <section className="section" ref={sectionRef as React.RefObject<HTMLElement>}>
        <div className="container">
          <h2 className="section-heading animate-in">Upcoming Events</h2>
          <div className="events-grid">
            {upcomingEvents.map((event, i) => (
              <div
                key={event.title}
                className="event-card animate-in"
                style={{ transitionDelay: `${i * 120}ms` }}
              >
                <span className="event-card__type">{event.type}</span>
                <h3 className="event-card__title">{event.title}</h3>
                <div className="event-card__meta">
                  <div className="event-card__meta-item">
                    <span className="event-card__meta-label">Date</span>
                    <span>{event.date}</span>
                  </div>
                  <div className="event-card__meta-item">
                    <span className="event-card__meta-label">Time</span>
                    <span>{event.time}</span>
                  </div>
                  <div className="event-card__meta-item">
                    <span className="event-card__meta-label">Where</span>
                    <span>{event.location}</span>
                  </div>
                </div>
                <p className="event-card__desc">{event.description}</p>
                <span className="event-card__spots">{event.spots}</span>
                <Link to="/contact" className="btn-gold" style={{ alignSelf: 'flex-start' }}>Register</Link>
              </div>
            ))}
          </div>

          <div className="events-notice animate-in">
            <h3>Stay Up to Date</h3>
            <p>
              New dates are added regularly. Follow us on Facebook, Instagram, and TikTok for the latest
              schedule updates. You can also contact us directly to be added to our notification list.
            </p>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 8 }}>
              <Link to="/contact" className="btn-ghost">Get Notified</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
