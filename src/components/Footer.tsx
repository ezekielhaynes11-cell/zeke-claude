import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="footer">
      <style>{`
        .footer {
          background: var(--bg-secondary);
          border-top: 2px solid var(--gold);
          padding: 64px 0 32px;
          margin-top: auto;
        }
        .footer__grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 48px;
          margin-bottom: 48px;
        }
        .footer__logo {
          font-family: var(--font-display);
          font-size: 32px;
          color: var(--gold);
          display: block;
          margin-bottom: 12px;
        }
        .footer__tagline {
          font-family: var(--font-heading);
          font-size: 12px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: var(--text-secondary);
        }
        .footer__col-heading {
          font-family: var(--font-heading);
          font-size: 13px;
          font-weight: 600;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: var(--gold);
          margin-bottom: 20px;
        }
        .footer__links {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .footer__links a {
          font-size: 14px;
          color: var(--text-secondary);
          transition: color var(--transition);
        }
        .footer__links a:hover {
          color: var(--text-primary);
        }
        .footer__hours-row {
          display: flex;
          justify-content: space-between;
          gap: 8px;
          font-size: 13px;
          color: var(--text-secondary);
          margin-bottom: 6px;
        }
        .footer__hours-row span:first-child {
          color: var(--text-primary);
        }
        .footer__hours-row.closed span:last-child {
          color: var(--text-muted);
        }
        .footer__contact-item {
          font-size: 14px;
          color: var(--text-secondary);
          margin-bottom: 8px;
        }
        .footer__contact-item a {
          color: var(--text-secondary);
          transition: color var(--transition);
        }
        .footer__contact-item a:hover {
          color: var(--gold);
        }
        .footer__social {
          display: flex;
          gap: 16px;
          margin-top: 16px;
        }
        .footer__social a {
          font-family: var(--font-heading);
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--text-secondary);
          border: 1px solid var(--border);
          padding: 6px 12px;
          transition: color var(--transition), border-color var(--transition);
        }
        .footer__social a:hover {
          color: var(--gold);
          border-color: var(--gold);
        }
        .footer__bottom {
          border-top: 1px solid var(--border);
          padding-top: 24px;
          font-size: 12px;
          color: var(--text-muted);
          text-align: center;
        }
        @media (max-width: 1024px) {
          .footer__grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 36px;
          }
        }
        @media (max-width: 640px) {
          .footer__grid {
            grid-template-columns: 1fr;
            gap: 32px;
          }
          .footer__social {
            flex-wrap: wrap;
          }
        }
      `}</style>
      <div className="container">
        <div className="footer__grid">
          {/* Col 1: Logo + Tagline */}
          <div>
            <Link to="/" className="footer__logo">IntegriCorp</Link>
            <p className="footer__tagline">Educate. Train. Empower.</p>
            <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 12 }}>
              Mississippi's premier firearms education and tactical training center.
            </p>
          </div>

          {/* Col 2: Navigation */}
          <div>
            <p className="footer__col-heading">Navigation</p>
            <nav className="footer__links">
              <Link to="/">Home</Link>
              <Link to="/courses">Courses</Link>
              <Link to="/medical-kits">Medical Kits</Link>
              <Link to="/about">About</Link>
              <Link to="/events">Events</Link>
              <Link to="/media">Media Gallery</Link>
              <Link to="/faqs">FAQs</Link>
              <Link to="/contact">Contact</Link>
            </nav>
          </div>

          {/* Col 3: Hours */}
          <div>
            <p className="footer__col-heading">Hours of Operation</p>
            <div className="footer__hours-row">
              <span>Tuesday – Friday</span>
              <span>9AM – 6PM</span>
            </div>
            <div className="footer__hours-row">
              <span>Saturday</span>
              <span>7AM – 7PM</span>
            </div>
            <div className="footer__hours-row closed">
              <span>Sunday – Monday</span>
              <span>CLOSED</span>
            </div>
          </div>

          {/* Col 4: Contact + Social */}
          <div>
            <p className="footer__col-heading">Contact</p>
            <div className="footer__contact-item">
              <a href="tel:6013362054">601-336-2054</a>
            </div>
            <div className="footer__contact-item">
              <a href="mailto:integricorpllc@gmail.com">integricorpllc@gmail.com</a>
            </div>
            <div className="footer__social">
              <a href="https://facebook.com/integricorp" target="_blank" rel="noopener noreferrer">FB</a>
              <a href="https://instagram.com/integricorp" target="_blank" rel="noopener noreferrer">IG</a>
              <a href="https://tiktok.com/@marlonhuddlestons" target="_blank" rel="noopener noreferrer">TT</a>
            </div>
          </div>
        </div>

        <div className="footer__bottom">
          © 2024 IntegriCorp LLC. All Rights Reserved. | IntegriCorp LLC — Educate. Train. Empower.
        </div>
      </div>
    </footer>
  )
}
