import { useEffect, useRef, useState } from 'react'

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

type Interest = 'Courses' | 'Medical Kits' | 'Both' | 'Other'

interface FormState {
  name: string
  email: string
  phone: string
  interest: Interest
  message: string
}

const initialForm: FormState = {
  name: '',
  email: '',
  phone: '',
  interest: 'Courses',
  message: '',
}

export default function Contact() {
  const [form, setForm] = useState<FormState>(initialForm)
  const [submitted, setSubmitted] = useState(false)
  const sectionRef = useAnimateIn()

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <div>
      <style>{`
        .contact-layout {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 64px;
          align-items: start;
        }
        /* Form styles */
        .contact-form {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        .form-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .form-label {
          font-family: var(--font-heading);
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--text-secondary);
        }
        .form-input,
        .form-select,
        .form-textarea {
          width: 100%;
          background: var(--bg-elevated);
          border: 1px solid var(--border);
          color: var(--text-primary);
          font-family: var(--font-body);
          font-size: 15px;
          padding: 14px 16px;
          outline: none;
          transition: border-color var(--transition);
          appearance: none;
        }
        .form-input:focus,
        .form-select:focus,
        .form-textarea:focus {
          border-color: var(--gold);
        }
        .form-input::placeholder,
        .form-textarea::placeholder {
          color: var(--text-muted);
        }
        .form-textarea {
          resize: vertical;
          min-height: 140px;
        }
        .form-select {
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23606060' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 14px center;
          padding-right: 40px;
          cursor: pointer;
        }
        .form-select option {
          background: var(--bg-elevated);
          color: var(--text-primary);
        }
        .success-message {
          background: var(--bg-elevated);
          border: 1px solid var(--gold);
          padding: 40px;
          text-align: center;
          animation: fadeIn 0.4s ease;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .success-message h3 {
          font-family: var(--font-display);
          font-size: 32px;
          color: var(--gold);
          margin-bottom: 12px;
        }
        .success-message p {
          color: var(--text-secondary);
          font-size: 15px;
          line-height: 1.7;
        }
        /* Info panel */
        .contact-info {
          display: flex;
          flex-direction: column;
          gap: 36px;
        }
        .info-section-heading {
          font-family: var(--font-heading);
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: var(--gold);
          margin-bottom: 16px;
          padding-bottom: 10px;
          border-bottom: 1px solid var(--border);
        }
        .hours-table {
          width: 100%;
          border-collapse: collapse;
        }
        .hours-table td {
          padding: 8px 0;
          font-size: 14px;
          border-bottom: 1px solid var(--border);
        }
        .hours-table td:first-child {
          color: var(--text-primary);
          width: 55%;
        }
        .hours-table td:last-child {
          color: var(--text-secondary);
          text-align: right;
        }
        .hours-table tr:last-child td {
          border-bottom: none;
        }
        .hours-table .closed td:last-child {
          color: var(--text-muted);
        }
        .contact-detail {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .contact-detail-item {
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 14px;
          color: var(--text-secondary);
        }
        .contact-detail-item a {
          color: var(--text-secondary);
          transition: color var(--transition);
        }
        .contact-detail-item a:hover {
          color: var(--gold);
        }
        .contact-detail-label {
          font-family: var(--font-heading);
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--gold);
          width: 60px;
          flex-shrink: 0;
        }
        .social-links {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }
        .social-link {
          font-family: var(--font-heading);
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--text-secondary);
          border: 1px solid var(--border);
          padding: 8px 16px;
          transition: color var(--transition), border-color var(--transition);
        }
        .social-link:hover {
          color: var(--gold);
          border-color: var(--gold);
        }
        .map-placeholder {
          width: 100%;
          height: 220px;
          background: var(--bg-elevated);
          border: 1px solid var(--border);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-muted);
          font-family: var(--font-heading);
          font-size: 12px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }
        @media (max-width: 900px) {
          .contact-layout {
            grid-template-columns: 1fr;
            gap: 48px;
          }
        }
      `}</style>

      <div className="page-hero">
        <div className="container">
          <p className="eyebrow" style={{ marginBottom: 12 }}>Get In Touch</p>
          <h1>Contact Us</h1>
          <p>Questions about training, kits, or scheduling? We're here to help.</p>
        </div>
      </div>

      <section className="section" ref={sectionRef as React.RefObject<HTMLElement>}>
        <div className="container">
          <div className="contact-layout">
            {/* Form */}
            <div className="animate-in">
              <h2 className="section-heading" style={{ marginBottom: 32 }}>Send a Message</h2>
              {submitted ? (
                <div className="success-message">
                  <h3>Message Received!</h3>
                  <p>
                    Thank you for reaching out. We'll be in touch within 1-2 business days.
                    For urgent inquiries, call us at <a href="tel:6013362054" style={{ color: 'var(--gold)' }}>601-336-2054</a>.
                  </p>
                  <button
                    className="btn-ghost"
                    style={{ marginTop: 24 }}
                    onClick={() => { setSubmitted(false); setForm(initialForm) }}
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form className="contact-form" onSubmit={handleSubmit} noValidate>
                  <div className="form-group">
                    <label className="form-label" htmlFor="name">Full Name *</label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      className="form-input"
                      placeholder="John Smith"
                      value={form.name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="email">Email Address *</label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      className="form-input"
                      placeholder="john@example.com"
                      value={form.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="phone">Phone Number</label>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      className="form-input"
                      placeholder="601-000-0000"
                      value={form.phone}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="interest">I'm Interested In</label>
                    <select
                      id="interest"
                      name="interest"
                      className="form-select"
                      value={form.interest}
                      onChange={handleChange}
                    >
                      <option value="Courses">Courses</option>
                      <option value="Medical Kits">Medical Kits</option>
                      <option value="Both">Both</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="message">Message *</label>
                    <textarea
                      id="message"
                      name="message"
                      className="form-textarea"
                      placeholder="Tell us how we can help you..."
                      value={form.message}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <button type="submit" className="btn-gold" style={{ alignSelf: 'flex-start', padding: '16px 40px' }}>
                    Send Message
                  </button>
                </form>
              )}
            </div>

            {/* Info Panel */}
            <div className="contact-info animate-in" style={{ transitionDelay: '150ms' }}>
              {/* Hours */}
              <div>
                <p className="info-section-heading">Hours of Operation</p>
                <table className="hours-table">
                  <tbody>
                    <tr>
                      <td>Tuesday – Friday</td>
                      <td>9:00 AM – 6:00 PM</td>
                    </tr>
                    <tr>
                      <td>Saturday</td>
                      <td>7:00 AM – 7:00 PM</td>
                    </tr>
                    <tr className="closed">
                      <td>Sunday – Monday</td>
                      <td>CLOSED</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Contact Details */}
              <div>
                <p className="info-section-heading">Contact Details</p>
                <div className="contact-detail">
                  <div className="contact-detail-item">
                    <span className="contact-detail-label">Phone</span>
                    <a href="tel:6013362054">601-336-2054</a>
                  </div>
                  <div className="contact-detail-item">
                    <span className="contact-detail-label">Email</span>
                    <a href="mailto:integricorpllc@gmail.com">integricorpllc@gmail.com</a>
                  </div>
                  <div className="contact-detail-item">
                    <span className="contact-detail-label">State</span>
                    <span>Mississippi, USA</span>
                  </div>
                </div>
              </div>

              {/* Social */}
              <div>
                <p className="info-section-heading">Follow Us</p>
                <div className="social-links">
                  <a href="https://facebook.com/integricorp" target="_blank" rel="noopener noreferrer" className="social-link">Facebook</a>
                  <a href="https://instagram.com/integricorp" target="_blank" rel="noopener noreferrer" className="social-link">Instagram</a>
                  <a href="https://tiktok.com/@marlonhuddlestons" target="_blank" rel="noopener noreferrer" className="social-link">TikTok</a>
                </div>
              </div>

              {/* Map Placeholder */}
              <div>
                <p className="info-section-heading">Location</p>
                <div className="map-placeholder">Google Maps — Mississippi</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
