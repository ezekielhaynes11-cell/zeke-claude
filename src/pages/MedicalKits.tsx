import { useEffect, useRef, useState } from 'react'
import KitCard from '../components/KitCard'
import KitRecommender from '../components/KitRecommender'

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

const allKits = [
  { name: 'Combat Application Tourniquet (CAT)', description: 'Gen 7 windlass system with circumferential pressure. The field-standard tourniquet trusted by military and first responders worldwide.', forWho: 'First Responders | Military | Civilians', category: 'Tourniquets' },
  { name: 'Fox Eye Shield with Garter', description: 'Military and civilian pre-hospital eye injury treatment for penetrating and blunt trauma. Rigid shield protects injured eye from further damage.', forWho: 'Military | Law Enforcement | Civilians', category: 'Eye / Trauma' },
  { name: 'Vacuum Sealed Bleeding Control Kit', description: 'Tourniquets, hemostatic gauze, and pressure dressing — vacuum sealed for maximum shelf life and compact carry in any bag or vehicle.', forWho: 'Civilians | First Responders | Outdoors', category: 'Bleeding Control' },
  { name: 'Bleeding Control Kit in Nylon Pack', description: 'Portable, intuitive, and packed with life-saving tools. Designed for everyday carry and rapid deployment by bystanders with minimal training.', forWho: 'Civilians | Workplaces | Schools', category: 'Bleeding Control' },
  { name: 'Trauma and First Aid Kit (TFAK) / Class A', description: 'Zippered nylon case covering workplace injuries from minor cuts to major trauma. Meets OSHA recommendations and is intuitive for all skill levels.', forWho: 'Workplaces | Schools | Institutions', category: 'Bleeding Control' },
  { name: '5-Pack Bleeding Control Station', description: 'Bulk facility configuration. Five wall-mountable bleeding control stations for schools, offices, stadiums, and public spaces.', forWho: 'Institutions | Government | Public Venues', category: 'Bleeding Control' },
  { name: 'Tactical Operator Response Kit (TORK)', description: 'Point-of-wounding self and buddy aid. Compact, field-ready system including tourniquet, hemostatic gauze, chest seal, and pressure bandage.', forWho: 'Law Enforcement | Military | Security', category: 'Multi-Kit' },
]

type Category = 'All' | 'Tourniquets' | 'Bleeding Control' | 'Eye / Trauma' | 'Multi-Kit'
const categories: Category[] = ['All', 'Tourniquets', 'Bleeding Control', 'Eye / Trauma', 'Multi-Kit']

export default function MedicalKits() {
  const [activeCategory, setActiveCategory] = useState<Category>('All')
  const sectionRef = useAnimateIn()
  const recommenderRef = useAnimateIn()

  const filtered = activeCategory === 'All'
    ? allKits
    : allKits.filter(k => k.category === activeCategory)

  return (
    <div>
      <style>{`
        .filter-bar {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
          margin-bottom: 40px;
        }
        .filter-btn {
          font-family: var(--font-heading);
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          padding: 10px 20px;
          border: 1px solid var(--border);
          background: transparent;
          color: var(--text-secondary);
          cursor: pointer;
          transition: all var(--transition);
        }
        .filter-btn:hover,
        .filter-btn.active {
          border-color: var(--gold);
          color: var(--gold);
          background: rgba(201,168,76,0.06);
        }
        .kits-page-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 24px;
          margin-bottom: 24px;
        }
        .customize-cta {
          text-align: center;
          padding: 64px 24px;
          background: var(--bg-elevated);
          border: 1px solid var(--border);
          border-left: 4px solid var(--gold);
          margin-top: 48px;
        }
        .customize-cta h3 {
          font-family: var(--font-heading);
          font-size: 24px;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 12px;
        }
        .customize-cta p {
          color: var(--text-secondary);
          margin-bottom: 24px;
          max-width: 480px;
          margin-left: auto;
          margin-right: auto;
        }
        @media (max-width: 1024px) {
          .kits-page-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        @media (max-width: 640px) {
          .kits-page-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <div className="page-hero">
        <div className="container">
          <p className="eyebrow" style={{ marginBottom: 12 }}>7 Kit Varieties</p>
          <h1>Medical Kits</h1>
          <p>Professional-grade tactical medical equipment for civilians, first responders, and law enforcement. Every kit ships ready to deploy.</p>
        </div>
      </div>

      <section className="section" ref={sectionRef as React.RefObject<HTMLElement>}>
        <div className="container">
          <div className="filter-bar">
            {categories.map(cat => (
              <button
                key={cat}
                className={`filter-btn${activeCategory === cat ? ' active' : ''}`}
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
          <div className="kits-page-grid">
            {filtered.map((k, i) => (
              <KitCard key={k.name} {...k} index={i} />
            ))}
          </div>
          <div className="customize-cta animate-in">
            <h3>Customize Your Kit Today!</h3>
            <p>Not sure what you need? Use our kit recommender or contact us for personalized recommendations for your team or institution.</p>
            <a href="/contact" className="btn-gold">Contact Us</a>
          </div>
        </div>
      </section>

      <section className="section" ref={recommenderRef as React.RefObject<HTMLElement>} style={{ background: 'var(--bg-secondary)', borderTop: '1px solid var(--border)' }}>
        <div className="container">
          <h2 className="section-heading animate-in" style={{ textAlign: 'center', alignItems: 'center' }}>Find Your Kit</h2>
          <KitRecommender />
        </div>
      </section>
    </div>
  )
}
