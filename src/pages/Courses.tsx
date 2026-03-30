import { useEffect, useRef } from 'react'
import CourseCard from '../components/CourseCard'

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

const courses = [
  {
    title: 'MS Enhanced Concealed Carry Course',
    description: 'This one-day, state-recognized course prepares students for the Mississippi Enhanced Carry Permit. You will cover Mississippi firearms laws, safe handling, and complete a live-fire qualification on the range.',
    details: [
      'State-recognized Mississippi certification',
      'Full day — classroom + live-fire range',
      'Firearm rental available',
      'Ammunition available for purchase',
      'Minimum age: 21 (or 18 with military ID)',
      'Lunch break included',
    ],
  },
  {
    title: 'Gold Membership Training Package',
    description: 'Our most comprehensive offering. Over 6 months, you will train under a rigorous, individualized curriculum built around your goals, current skill level, and lifestyle. Regular 1-on-1 sessions with a certified instructor, skill benchmarking, and measurable progression at every stage.',
    details: [
      '6-month personalized curriculum',
      'Weekly 1-on-1 instructor sessions',
      'Skill benchmarking and progression tracking',
      'Priority range scheduling',
      'Includes concealed carry certification',
      'Defensive shooting, low-light, and scenario drills',
    ],
    badge: 'MOST POPULAR',
  },
  {
    title: 'Youth Handgun Safety & Marksmanship',
    description: 'Designed specifically for students ages 12–17, this course builds a safe, responsible foundation in firearm handling and marksmanship. A parent or legal guardian must be present throughout the entire course.',
    details: [
      'Ages 12–17 only',
      'Parent or legal guardian required at all times',
      'Fundamentals of safe handling and storage',
      'Live-fire marksmanship training',
      'NRA-aligned curriculum',
      'Certificate of completion awarded',
    ],
  },
]

export default function Courses() {
  const sectionRef = useAnimateIn()

  return (
    <div>
      <style>{`
        .courses-page-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 28px;
          margin-bottom: 64px;
        }
        .custom-training {
          background: var(--bg-elevated);
          border: 1px solid var(--border);
          border-left: 4px solid var(--gold);
          padding: 48px;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .custom-training h2 {
          font-family: var(--font-heading);
          font-size: 28px;
          font-weight: 700;
          color: var(--text-primary);
        }
        .custom-training p {
          font-size: 16px;
          color: var(--text-secondary);
          line-height: 1.7;
          max-width: 600px;
        }
        @media (max-width: 1024px) {
          .courses-page-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <div className="page-hero">
        <div className="container">
          <p className="eyebrow" style={{ marginBottom: 12 }}>NRA Certified Instruction</p>
          <h1>Our Courses</h1>
          <p>Hands-on training for every level — from first-time shooters to experienced carriers looking to sharpen their edge.</p>
        </div>
      </div>

      <section className="section" ref={sectionRef as React.RefObject<HTMLElement>}>
        <div className="container">
          <div className="courses-page-grid">
            {courses.map((c, i) => (
              <CourseCard key={c.title} {...c} index={i} />
            ))}
          </div>

          <div className="custom-training animate-in">
            <h2>Need Custom or Group Training?</h2>
            <p>
              IntegriCorp offers private instruction and custom group training programs for law enforcement agencies,
              security firms, businesses, and organizations. Whether you need a one-time workshop or an ongoing
              program, we will design a curriculum around your specific needs.
            </p>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 8 }}>
              <a href="/contact" className="btn-gold">Contact Us</a>
              <a href="tel:6013362054" className="btn-ghost">Call 601-336-2054</a>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
