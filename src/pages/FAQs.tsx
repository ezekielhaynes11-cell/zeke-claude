import { useEffect, useRef, useState } from 'react'
import AccordionItem from '../components/AccordionItem'

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

const faqs = [
  {
    category: 'Courses & Training',
    items: [
      {
        q: 'Do you have to own a firearm to attend a course?',
        a: 'No. While firearm ownership is ideal, we offer handguns for rental and ammunition for purchase. You are welcome to attend any course without your own firearm.',
      },
      {
        q: 'What is your cancellation policy?',
        a: 'Cancel at least 2 weeks in advance for a full refund. Less than 2 weeks — no refund, but you may reschedule. If IntegriCorp cancels, you will receive a full refund or the option to reschedule at no additional cost.',
      },
      {
        q: 'Do you offer youth shooting courses?',
        a: 'Yes. We offer Youth Basic Handgun Safety and Marksmanship Fundamentals for students ages 12–17. A parent or legal guardian must be present at all times throughout the entire course.',
      },
      {
        q: 'How long does the concealed carry course take?',
        a: 'The MS Enhanced Concealed Carry Course is typically completed in one full day, combining classroom instruction with a live-fire range qualification. Plan for approximately 8 hours.',
      },
      {
        q: 'Do I need a permit to carry in Mississippi?',
        a: 'Mississippi is a permitless carry state, meaning law-abiding citizens may carry without a permit. However, obtaining an Enhanced Carry Permit enables reciprocity in other states that recognize Mississippi permits. Our courses prepare you for both.',
      },
      {
        q: 'What certifications does IntegriCorp hold?',
        a: 'Our instructors hold current NRA certifications and meet all Mississippi state requirements for firearm instruction. We are committed to maintaining the highest professional standards in every course we teach.',
      },
      {
        q: 'Do you offer private or group instruction?',
        a: 'Yes. We offer private 1-on-1 instruction as well as custom group training programs for businesses, law enforcement agencies, and organizations. Contact us to discuss your needs and scheduling.',
      },
      {
        q: 'What should I bring to class?',
        a: 'Bring a valid government-issued photo ID, comfortable closed-toe shoes, and eye and ear protection if you own them (we have loaners available). If you have your own firearm, bring it unloaded in a case along with your ammunition. Water and snacks are recommended for full-day courses.',
      },
    ],
  },
  {
    category: 'Medical Kits',
    items: [
      {
        q: 'Are your medical kits ready to use?',
        a: 'Yes. All kits ship fully assembled and ready to deploy. No assembly is required — every component is organized and accessible for immediate use in an emergency.',
      },
      {
        q: 'Can I purchase kits for my workplace or school?',
        a: 'Absolutely. Contact us for bulk and institutional pricing on bleeding control stations and TORK kits. We work with businesses, schools, government agencies, and other institutions.',
      },
      {
        q: 'Do I need training to use a bleeding control kit?',
        a: 'While formal Stop the Bleed training is always recommended, our kits are designed to be intuitive even for individuals with minimal training. Each kit includes clear instructions, and we encourage everyone to take a basic hemorrhage control course.',
      },
      {
        q: 'What is the shelf life of the medical kit contents?',
        a: 'Most components have a shelf life of 2–5 years depending on the product. We recommend inspecting your kit every 6 months and replacing expired items. Our vacuum-sealed kits are specifically designed to maximize shelf life.',
      },
    ],
  },
]

export default function FAQs() {
  const [openKey, setOpenKey] = useState<string | null>(null)
  const sectionRef = useAnimateIn()

  return (
    <div>
      <style>{`
        .faq-category {
          margin-bottom: 48px;
        }
        .faq-category-heading {
          font-family: var(--font-heading);
          font-size: 14px;
          font-weight: 700;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: var(--gold);
          margin-bottom: 20px;
          padding-bottom: 12px;
          border-bottom: 1px solid var(--border);
        }
        .contact-cta-box {
          background: var(--bg-elevated);
          border: 1px solid var(--border);
          border-left: 4px solid var(--gold);
          padding: 40px;
          margin-top: 16px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .contact-cta-box h3 {
          font-family: var(--font-heading);
          font-size: 22px;
          font-weight: 700;
          color: var(--text-primary);
        }
        .contact-cta-box p {
          font-size: 15px;
          color: var(--text-secondary);
          line-height: 1.7;
          max-width: 560px;
        }
      `}</style>

      <div className="page-hero">
        <div className="container">
          <p className="eyebrow" style={{ marginBottom: 12 }}>Have Questions?</p>
          <h1>Frequently Asked Questions</h1>
          <p>Everything you need to know about our courses, medical kits, and policies.</p>
        </div>
      </div>

      <section className="section" ref={sectionRef as React.RefObject<HTMLElement>}>
        <div className="container" style={{ maxWidth: 860 }}>
          {faqs.map(group => (
            <div key={group.category} className="faq-category animate-in">
              <p className="faq-category-heading">{group.category}</p>
              <div>
                {group.items.map((item, i) => {
                  const key = `${group.category}-${i}`
                  return (
                    <AccordionItem
                      key={key}
                      question={item.q}
                      answer={item.a}
                      isOpen={openKey === key}
                      onToggle={() => setOpenKey(openKey === key ? null : key)}
                      index={i}
                    />
                  )
                })}
              </div>
            </div>
          ))}

          <div className="contact-cta-box animate-in">
            <h3>Still Have Questions?</h3>
            <p>
              If you didn't find your answer above, we're happy to help. Reach out by phone, email, or use the contact form and we'll get back to you as soon as possible.
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
