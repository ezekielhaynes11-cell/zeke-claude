import { useEffect, useRef } from 'react'

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

const values = [
  {
    label: 'Integrity',
    description: 'We conduct every course, every interaction, and every sale with the highest standards of honesty and professionalism.',
  },
  {
    label: 'Readiness',
    description: 'We believe preparation is not optional. We equip our students and clients to respond confidently when it matters most.',
  },
  {
    label: 'Community',
    description: 'Rooted in Mississippi, we are committed to the safety and empowerment of our community — one student at a time.',
  },
  {
    label: 'Precision',
    description: 'From firearm handling to medical kit assembly, precision is the standard we hold ourselves and our students to.',
  },
]

export default function About() {
  const missionRef = useAnimateIn()
  const instructorRef = useAnimateIn()
  const valuesRef = useAnimateIn()

  return (
    <div>
      <style>{`
        .about-mission {
          max-width: 760px;
        }
        .about-mission p {
          font-size: 18px;
          color: var(--text-secondary);
          line-height: 1.8;
          margin-bottom: 24px;
        }
        .about-mission p strong {
          color: var(--text-primary);
        }
        .instructor-card {
          display: flex;
          gap: 40px;
          align-items: flex-start;
          background: var(--bg-elevated);
          border: 1px solid var(--border);
          border-top: 3px solid var(--gold);
          padding: 40px;
          max-width: 860px;
        }
        .instructor-photo {
          width: 200px;
          height: 240px;
          flex-shrink: 0;
          background: var(--bg-secondary);
          border: 1px solid var(--border);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-muted);
          font-family: var(--font-heading);
          font-size: 11px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }
        .instructor-info {
          flex: 1;
        }
        .instructor-info h3 {
          font-family: var(--font-heading);
          font-size: 24px;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 4px;
        }
        .instructor-info .role {
          font-family: var(--font-heading);
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: var(--gold);
          margin-bottom: 20px;
        }
        .instructor-info p {
          font-size: 15px;
          color: var(--text-secondary);
          line-height: 1.7;
          margin-bottom: 20px;
        }
        .cert-badges {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }
        .cert-badge {
          font-family: var(--font-heading);
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--gold);
          border: 1px solid var(--gold-dark);
          padding: 5px 12px;
        }
        .values-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 24px;
        }
        .value-card {
          background: var(--bg-secondary);
          border: 1px solid var(--border);
          border-top: 3px solid var(--gold);
          padding: 32px 24px;
        }
        .value-card__label {
          font-family: var(--font-display);
          font-size: 28px;
          color: var(--gold);
          margin-bottom: 12px;
        }
        .value-card p {
          font-size: 14px;
          color: var(--text-secondary);
          line-height: 1.7;
        }
        @media (max-width: 768px) {
          .instructor-card {
            flex-direction: column;
          }
          .instructor-photo {
            width: 100%;
          }
          .values-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        @media (max-width: 480px) {
          .values-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <div className="page-hero">
        <div className="container">
          <p className="eyebrow" style={{ marginBottom: 12 }}>Our Story</p>
          <h1>About IntegriCorp</h1>
          <p>Mississippi-born and community-driven. We exist to educate, train, and empower.</p>
        </div>
      </div>

      {/* Mission */}
      <section className="section" ref={missionRef as React.RefObject<HTMLElement>}>
        <div className="container">
          <h2 className="section-heading animate-in">Our Mission</h2>
          <div className="about-mission animate-in" style={{ transitionDelay: '100ms' }}>
            <p>
              IntegriCorp LLC was founded on a simple but powerful belief: <strong>every law-abiding citizen deserves access to professional-grade firearms education and tactical training.</strong>
            </p>
            <p>
              Based in Mississippi, we serve students from all walks of life — from first-time gun owners to experienced carriers, from concerned parents to law enforcement professionals. Our curriculum is built on NRA-certified instruction, Mississippi state standards, and real-world scenario training.
            </p>
            <p>
              Beyond firearms, we provide <strong>professional tactical medical kits</strong> that equip individuals, families, workplaces, and institutions with the tools to respond to emergencies — because protection extends beyond the trigger.
            </p>
            <p style={{ fontFamily: 'var(--font-display)', fontSize: 24, color: 'var(--gold)', letterSpacing: '0.05em' }}>
              Educate. Train. Empower.
            </p>
          </div>
        </div>
      </section>

      {/* Instructor */}
      <section className="section" ref={instructorRef as React.RefObject<HTMLElement>} style={{ background: 'var(--bg-secondary)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
        <div className="container">
          <h2 className="section-heading animate-in">Lead Instructor</h2>
          <div className="instructor-card animate-in" style={{ transitionDelay: '100ms' }}>
            <div className="instructor-photo">Headshot</div>
            <div className="instructor-info">
              <h3>Marlon Huddleston</h3>
              <p className="role">Founder & Lead Instructor</p>
              <p>
                With extensive experience in firearms instruction and a deep commitment to community safety,
                Marlon founded IntegriCorp to bring professional-grade training to everyday Mississippians.
                His background spans military-style tactical training, NRA-certified instruction, and emergency
                medical response — a combination that makes IntegriCorp's programs uniquely comprehensive.
              </p>
              <p>
                Marlon's philosophy is simple: confidence comes from preparation, and preparation comes from
                quality instruction. Every course he teaches reflects that conviction.
              </p>
              <div className="cert-badges">
                <span className="cert-badge">NRA Certified</span>
                <span className="cert-badge">MS State Approved</span>
                <span className="cert-badge">Tactical Medical</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section" ref={valuesRef as React.RefObject<HTMLElement>}>
        <div className="container">
          <h2 className="section-heading animate-in">Our Values</h2>
          <div className="values-grid">
            {values.map((v, i) => (
              <div
                key={v.label}
                className="value-card animate-in"
                style={{ transitionDelay: `${i * 100}ms` }}
              >
                <p className="value-card__label">{v.label}</p>
                <p>{v.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
