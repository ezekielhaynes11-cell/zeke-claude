import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'

const navLinks = [
  { label: 'Home', to: '/' },
  { label: 'Courses', to: '/courses' },
  { label: 'Medical Kits', to: '/medical-kits' },
  { label: 'About', to: '/about' },
  { label: 'Events', to: '/events' },
  { label: 'FAQs', to: '/faqs' },
  { label: 'Contact', to: '/contact' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 80)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  useEffect(() => {
    setMenuOpen(false)
  }, [location.pathname])

  return (
    <nav className={`navbar${scrolled ? ' navbar--scrolled' : ''}`}>
      <style>{`
        .navbar {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 1000;
          background: var(--bg-primary);
          border-bottom: 1px solid var(--border);
          transition: box-shadow 0.3s ease, backdrop-filter 0.3s ease;
        }
        .navbar--scrolled {
          backdrop-filter: blur(10px);
          box-shadow: 0 1px 20px rgba(201, 168, 76, 0.15);
        }
        .navbar__inner {
          max-width: var(--container-max);
          margin: 0 auto;
          padding: 0 var(--container-pad);
          height: 72px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 24px;
        }
        .navbar__logo {
          font-family: var(--font-display);
          font-size: 28px;
          color: var(--gold);
          letter-spacing: 0.05em;
          white-space: nowrap;
          flex-shrink: 0;
        }
        .navbar__links {
          display: flex;
          align-items: center;
          gap: 32px;
        }
        .navbar__link {
          font-family: var(--font-heading);
          font-size: 13px;
          font-weight: 500;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--text-primary);
          transition: color var(--transition);
          white-space: nowrap;
        }
        .navbar__link:hover,
        .navbar__link.active {
          color: var(--gold);
        }
        .navbar__cta {
          flex-shrink: 0;
        }
        .navbar__hamburger {
          display: none;
          flex-direction: column;
          gap: 5px;
          background: none;
          border: none;
          cursor: pointer;
          padding: 4px;
        }
        .navbar__hamburger span {
          display: block;
          width: 24px;
          height: 2px;
          background: var(--text-primary);
          transition: transform 0.25s ease, opacity 0.25s ease;
        }
        .navbar__hamburger.open span:nth-child(1) {
          transform: translateY(7px) rotate(45deg);
        }
        .navbar__hamburger.open span:nth-child(2) {
          opacity: 0;
        }
        .navbar__hamburger.open span:nth-child(3) {
          transform: translateY(-7px) rotate(-45deg);
        }
        .navbar__drawer {
          background: var(--bg-primary);
          border-top: 1px solid var(--border);
          padding: 24px var(--container-pad);
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        .navbar__drawer .navbar__link {
          font-size: 16px;
        }
        .navbar__drawer .btn-gold {
          width: 100%;
          text-align: center;
        }
        @media (max-width: 900px) {
          .navbar__links,
          .navbar__cta {
            display: none;
          }
          .navbar__hamburger {
            display: flex;
          }
        }
      `}</style>
      <div className="navbar__inner">
        <Link to="/" className="navbar__logo">IntegriCorp</Link>
        <div className="navbar__links">
          {navLinks.map(link => (
            <Link
              key={link.to}
              to={link.to}
              className={`navbar__link${location.pathname === link.to ? ' active' : ''}`}
            >
              {link.label}
            </Link>
          ))}
        </div>
        <div className="navbar__cta">
          <Link to="/courses" className="btn-gold">Book a Course</Link>
        </div>
        <button
          className={`navbar__hamburger${menuOpen ? ' open' : ''}`}
          onClick={() => setMenuOpen(o => !o)}
          aria-label="Toggle menu"
        >
          <span />
          <span />
          <span />
        </button>
      </div>
      {menuOpen && (
        <div className="navbar__drawer">
          {navLinks.map(link => (
            <Link
              key={link.to}
              to={link.to}
              className={`navbar__link${location.pathname === link.to ? ' active' : ''}`}
            >
              {link.label}
            </Link>
          ))}
          <Link to="/courses" className="btn-gold">Book a Course</Link>
        </div>
      )}
    </nav>
  )
}
