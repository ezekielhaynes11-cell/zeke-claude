import { useEffect, useRef, useState } from 'react'

interface Stat {
  value: string
  numericValue?: number
  suffix?: string
  label: string
}

const stats: Stat[] = [
  { value: '500+', numericValue: 500, suffix: '+', label: 'Students Trained' },
  { value: 'NRA', label: 'Certified Instruction' },
  { value: 'MS', label: 'State Recognized' },
  { value: '7', numericValue: 7, suffix: '', label: 'Kit Varieties Available' },
]

function useCountUp(target: number, duration: number, active: boolean) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    if (!active) return
    let start = 0
    const step = target / (duration / 16)
    const frame = () => {
      start += step
      if (start >= target) {
        setCount(target)
        return
      }
      setCount(Math.floor(start))
      requestAnimationFrame(frame)
    }
    requestAnimationFrame(frame)
  }, [active, target, duration])
  return count
}

function StatItem({ stat, active }: { stat: Stat; active: boolean }) {
  const count = useCountUp(stat.numericValue ?? 0, 1500, active)
  const displayValue = stat.numericValue !== undefined
    ? `${count}${stat.suffix ?? ''}`
    : stat.value

  return (
    <div className="stats-bar__item">
      <span className="stats-bar__number">{displayValue}</span>
      <span className="stats-bar__label">{stat.label}</span>
    </div>
  )
}

export default function StatsBar() {
  const ref = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setActive(true)
          observer.disconnect()
        }
      },
      { threshold: 0.4 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div className="stats-bar" ref={ref}>
      <style>{`
        .stats-bar {
          background: var(--bg-secondary);
          border-top: 1px solid var(--border);
          border-bottom: 1px solid var(--border);
          padding: 56px 0;
        }
        .stats-bar .container {
          display: flex;
          align-items: center;
          justify-content: space-around;
          gap: 24px;
          flex-wrap: wrap;
        }
        .stats-bar__item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          text-align: center;
          padding: 8px 24px;
        }
        .stats-bar__number {
          font-family: var(--font-display);
          font-size: clamp(48px, 7vw, 64px);
          color: var(--gold);
          line-height: 1;
        }
        .stats-bar__label {
          font-family: var(--font-body);
          font-size: 13px;
          font-weight: 500;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--text-primary);
        }
        @media (max-width: 768px) {
          .stats-bar .container {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 32px;
          }
        }
      `}</style>
      <div className="container">
        {stats.map((stat) => (
          <StatItem key={stat.label} stat={stat} active={active} />
        ))}
      </div>
    </div>
  )
}
