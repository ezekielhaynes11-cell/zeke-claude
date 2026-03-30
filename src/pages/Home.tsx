import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import CourseCard from '../components/CourseCard'
import KitCard from '../components/KitCard'
import KitRecommender from '../components/KitRecommender'
import TestimonialCard from '../components/TestimonialCard'
import StatsBar from '../components/StatsBar'
import AccordionItem from '../components/AccordionItem'

function useAnimateIn(threshold = 0.15) {
  const ref = useRef<HTMLElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible')
          }
        })
      },
      { threshold }
    )
    const targets = el.querySelectorAll('.animate-in')
    targets.forEach(t => observer.observe(t))
    observer.observe(el)
    return () => observer.disconnect()
  }, [threshold])
  return ref
}

const courses = [
  {
    title: 'MS Enhanced Concealed Carry Course',
    description: 'One-day state-recognized course. Earn your Mississippi Enhanced Carry Permit. Covers firearm safety, Mississippi carry laws, and live-fire qualification.',
    details: ['State-recognized certification', 'Firearm rental available', 'Ammunition available for purchase', 'One full day — classroom + range'],
  },
  {
    title: 'Gold Membership Training Package',
    description: '6-month personalized curriculum with rigorous drills, professional instruction, and measurable skill progression. The most comprehensive training we offer.',
    details: ['6-month individualized program', 'Regular 1-on-1 instructor sessions', 'Skill benchmarking and progression tracking', 'Priority range scheduling'],
    badge: 'MOST POPULAR',
  },
  {
    title: 'Youth Handgun Safety & Marksmanship',
    description: 'Designed for ages 12-17. Parent or legal guardian must be present throughout the course. Building safe, confident, and responsible young shooters.',
    details: ['Ages 12–17 only', 'Parent / guardian required', 'Fundamentals of safe handling', 'Live-fire marksmanship training'],
  },
]

const featuredKits = [
  {
    name: 'Combat Application Tourniquet (CAT)',
    description: 'Gen 7 windlass design with circumferential pressure — the gold standard in prehospital hemorrhage control.',
    forWho: 'First Responders | Military | Civilians',
    category: 'Tourniquets',
  },
  {
    name: 'Fox Eye Shield with Garter',
    description: 'Military-grade pre-hospital eye injury treatment for penetrating and blunt trauma — trusted by armed forces worldwide.',
    forWho: 'Military | Law Enforcement | Civilians',
    category: 'Eye / Trauma',
  },
  {
    name: 'Tactical Operator Response Kit (TORK)',
    description: 'Point-of-wounding self and buddy aid system. Compact, field-ready, and built for high-stress scenarios.',
    forWho: 'Law Enforcement | Military | Security',
    category: 'Multi-Kit',
  },
  {
    name: 'Bleeding Control Kit (Vacuum Sealed)',
    description: 'Tourniquets, hemostatic gauze, and pressure dressing — vacuum sealed for maximum shelf life and compact carry.',
    forWho: 'Civilians | First Responders | Outdoors',
    category: 'Bleeding Control',
  },
]

const testimonials = [
  {
    quote: 'The Gold Membership changed how I think about personal protection. Professional, rigorous, and worth every dollar.',
    name: 'James T.',
    location: 'Hattiesburg, MS',
  },
  {
    quote: 'My daughter completed the youth course and her confidence and safety awareness is completely transformed.',
    name: 'Michelle R.',
    location: 'Jackson, MS',
  },
  {
    quote: 'Best concealed carry training in the state. Instructor knows his craft and communicates clearly.',
    name: 'Derek W.',
    location: 'Meridian, MS',
  },
]

const faqs = [
  {
    q: 'Do you have to own a firearm to attend a course?',
    a: 'No. While firearm ownership is ideal, we offer handguns for rental and ammunition for purchase. You are welcome to attend without your own firearm.',
  },
  {
    q: 'What is your cancellation policy?',
    a: 'Cancel at least 2 weeks in advance for a full refund. Less than 2 weeks — no refund, but you may reschedule. If IntegriCorp cancels, you will receive a full refund or the option to reschedule at no additional cost.',
  },
  {
    q: 'Do you offer youth shooting courses?',
    a: 'Yes. We offer Youth Basic Handgun Safety and Marksmanship Fundamentals for students ages 12–17. A parent or legal guardian must be present at all times.',
  },
  {
    q: 'How long does the concealed carry course take?',
    a: 'The MS Enhanced Concealed Carry Course is typically completed in one full day, combining classroom instruction with live-fire range qualification.',
  },
  {
    q: 'Do I need a permit to carry in Mississippi?',
    a: 'Mississippi is a permitless carry state, meaning law-abiding citizens may carry without a permit. However, obtaining a permit enables reciprocity in other states. Our courses prepare you for both.',
  },
  {
    q: 'Are your medical kits ready to use?',
    a: 'Yes. All kits ship fully assembled and ready to deploy. No assembly is required — every component is organized and accessible for immediate use.',
  },
  {
    q: 'Can I purchase kits for my workplace or school?',
    a: 'Absolutely. Contact us for bulk and institutional pricing on bleeding control stations and TORK kits. We work with businesses, schools, and government agencies.',
  },
  {
    q: 'What certifications does IntegriCorp hold?',
    a: 'Our instructors hold current NRA certifications and meet all Mississippi state requirements for firearm instruction. We are committed to maintaining the highest professional standards.',
  },
]

export default function Home() {
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [activeTestimonial, setActiveTestimonial] = useState(0)

  const statsRef = useAnimateIn()
  const coursesRef = useAnimateIn()
  const kitsRef = useAnimateIn()
  const recommenderRef = useAnimateIn()
  const testimonialsRef = useAnimateIn()
  const faqRef = useAnimateIn()

  // Mobile testimonial carousel
  useEffect(() => {
    const id = setInterval(() => {
      setActiveTestimonial(i => (i + 1) % testimonials.length)
    }, 3000)
    return () => clearInterval(id)
  }, [])

  return (
    <div className="home">
      <style>{`
        /* ── Hero ── */
        .hero {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--bg-primary);
          position: relative;
          overflow: hidden;
          text-align: center;
          padding: 120px 24px 80px;
        }
        .hero__content {
          position: relative;
          z-index: 1;
          max-width: 900px;
        }
        .hero__eyebrow {
          font-variant: small-caps;
          font-family: var(--font-heading);
          font-size: 13px;
          font-weight: 600;
          letter-spacing: 0.3em;
          color: var(--gold);
          display: block;
          margin-bottom: 24px;
          opacity: 0;
          animation: fadeSlideUp 0.6s ease 0.1s both;
        }
        .hero__headline {
          font-family: var(--font-display);
          font-size: clamp(56px, 9vw, 96px);
          color: var(--text-primary);
          line-height: 0.95;
          margin-bottom: 28px;
          opacity: 0;
          animation: fadeSlideUp 0.6s ease 0.3s both;
        }
        .hero__sub {
          font-size: 18px;
          color: var(--text-secondary);
          max-width: 560px;
          margin: 0 auto 40px;
          line-height: 1.7;
          opacity: 0;
          animation: fadeSlideUp 0.6s ease 0.5s both;
        }
        .hero__ctas {
          display: flex;
          gap: 16px;
          justify-content: center;
          flex-wrap: wrap;
          opacity: 0;
          animation: fadeSlideUp 0.6s ease 0.7s both;
        }
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }

        /* ── Section headings ── */
        .home-section {
          padding: var(--section-gap) 0;
        }

        /* ── Courses grid ── */
        .courses-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
        }

        /* ── Kits grid ── */
        .kits-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 24px;
          margin-bottom: 32px;
        }
        .kits-viewall {
          display: flex;
          justify-content: center;
        }

        /* ── Testimonials ── */
        .testimonials-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
        }

        /* ── FAQ ── */
        .faq-list {
          display: flex;
          flex-direction: column;
          gap: 0;
        }

        @media (max-width: 1024px) {
          .kits-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        @media (max-width: 768px) {
          .courses-grid,
          .testimonials-grid {
            grid-template-columns: 1fr;
          }
          .testimonials-grid > * {
            display: none;
          }
          .testimonials-grid > .active {
            display: block;
          }
          .kits-grid {
            grid-template-columns: 1fr;
          }
          .hero__ctas .btn-gold,
          .hero__ctas .btn-ghost {
            width: 100%;
            max-width: 300px;
          }
        }
      `}</style>

      {/* Hero */}
      <section className="hero">
        <div className="noise-overlay" />
        <div className="hero__content">
          <span className="hero__eyebrow">Mississippi's Premier Firearms Training Center</span>
          <h1 className="hero__headline">Protect What Matters.<br />Train With Confidence.</h1>
          <p className="hero__sub">
            Empowering citizens with the knowledge and skills to protect themselves and those they love.
          </p>
          <div className="hero__ctas">
            <Link to="/courses" className="btn-gold">Book a Course</Link>
            <Link to="/medical-kits" className="btn-ghost">Shop Medical Kits</Link>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section ref={statsRef as React.RefObject<HTMLElement>}>
        <StatsBar />
      </section>

      {/* Courses */}
      <section className="home-section" ref={coursesRef as React.RefObject<HTMLElement>}>
        <div className="container">
          <h2 className="section-heading animate-in">Courses</h2>
          <div className="courses-grid">
            {courses.map((c, i) => (
              <CourseCard key={c.title} {...c} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Featured Medical Kits */}
      <section className="home-section" ref={kitsRef as React.RefObject<HTMLElement>} style={{ background: 'var(--bg-secondary)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
        <div className="container">
          <h2 className="section-heading animate-in">Medical Kits</h2>
          <div className="kits-grid">
            {featuredKits.map((k, i) => (
              <KitCard key={k.name} {...k} index={i} />
            ))}
          </div>
          <div className="kits-viewall">
            <Link to="/medical-kits" className="btn-ghost">View All Kits</Link>
          </div>
        </div>
      </section>

      {/* Kit Recommender */}
      <section className="home-section" ref={recommenderRef as React.RefObject<HTMLElement>}>
        <div className="container">
          <h2 className="section-heading animate-in" style={{ textAlign: 'center', alignItems: 'center' }}>Find Your Kit</h2>
          <KitRecommender />
        </div>
      </section>

      {/* Testimonials */}
      <section className="home-section" ref={testimonialsRef as React.RefObject<HTMLElement>} style={{ background: 'var(--bg-secondary)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
        <div className="container">
          <h2 className="section-heading animate-in">What Our Students Say</h2>
          <div className="testimonials-grid">
            {testimonials.map((t, i) => (
              <div
                key={t.name}
                className={`animate-in${i === activeTestimonial ? ' active' : ''}`}
                style={{ transitionDelay: `${i * 100}ms` }}
              >
                <TestimonialCard {...t} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Accordion */}
      <section className="home-section" ref={faqRef as React.RefObject<HTMLElement>}>
        <div className="container">
          <h2 className="section-heading animate-in">Frequently Asked Questions</h2>
          <div className="faq-list" style={{ maxWidth: 800 }}>
            {faqs.map((faq, i) => (
              <AccordionItem
                key={i}
                question={faq.q}
                answer={faq.a}
                isOpen={openFaq === i}
                onToggle={() => setOpenFaq(openFaq === i ? null : i)}
                index={i}
              />
            ))}
          </div>
          <div style={{ marginTop: 32 }}>
            <Link to="/faqs" className="btn-ghost">View All FAQs</Link>
          </div>
        </div>
      </section>
    </div>
  )
}
