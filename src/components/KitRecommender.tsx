import { useState } from 'react'

type Answers = Record<number, string>

interface Step {
  question: string
  options: string[]
}

const steps: Step[] = [
  {
    question: 'What are you preparing for?',
    options: ['Home Defense', 'Workplace Safety', 'Outdoor / Field', 'Law Enforcement / Security'],
  },
  {
    question: 'Who will be using it?',
    options: ['Individual', 'Family', 'Team / Group', 'Institution'],
  },
  {
    question: 'Experience level?',
    options: ['Beginner', 'Intermediate', 'Advanced'],
  },
]

function getRecommendation(answers: Answers): { name: string; description: string } {
  const use = answers[1] ?? ''
  const who = answers[2] ?? ''

  if (use === 'Law Enforcement / Security') {
    return {
      name: 'Tactical Operator Response Kit (TORK)',
      description: 'Designed for point-of-wounding self and buddy aid. Includes tourniquet, hemostatic gauze, chest seal, and emergency bandage — optimized for operational environments.',
    }
  }
  if (use === 'Outdoor / Field') {
    return {
      name: 'Vacuum Sealed Bleeding Control Kit',
      description: 'Rugged, compact, and ready for field conditions. Includes tourniquets, pressure gauze, and hemostatic dressing. Ideal for hunting, hiking, and remote activities.',
    }
  }
  if (who === 'Institution' || who === 'Team / Group') {
    return {
      name: '5-Pack Bleeding Control Station',
      description: 'Bulk facility configuration designed for schools, offices, and team environments. Wall-mountable stations with clear access for rapid deployment in emergencies.',
    }
  }
  if (use === 'Workplace Safety') {
    return {
      name: 'Trauma and First Aid Kit (TFAK) / Class A',
      description: 'Zippered nylon case covering workplace injuries from minor cuts to major trauma. Meets OSHA standards and is intuitive for all skill levels.',
    }
  }
  return {
    name: 'Bleeding Control Kit in Nylon Pack',
    description: 'The ideal everyday carry kit for civilians. Portable, intuitive, and packed with life-saving tools including tourniquet, gauze, and nitrile gloves.',
  }
}

export default function KitRecommender() {
  const [step, setStep] = useState(1)
  const [answers, setAnswers] = useState<Answers>({})
  const [result, setResult] = useState<{ name: string; description: string } | null>(null)

  function select(option: string) {
    const next = { ...answers, [step]: option }
    setAnswers(next)
    if (step < 3) {
      setStep(s => s + 1)
    } else {
      setResult(getRecommendation(next))
    }
  }

  function reset() {
    setStep(1)
    setAnswers({})
    setResult(null)
  }

  const current = steps[step - 1]
  const progressPct = result ? 100 : ((step - 1) / 3) * 100

  return (
    <div className="kit-recommender">
      <style>{`
        .kit-recommender {
          background: var(--bg-elevated);
          border: 1px solid var(--border);
          padding: 48px;
          max-width: 680px;
          margin: 0 auto;
        }
        .kit-recommender__progress-track {
          width: 100%;
          height: 3px;
          background: var(--border);
          margin-bottom: 40px;
          position: relative;
          overflow: hidden;
        }
        .kit-recommender__progress-fill {
          position: absolute;
          top: 0;
          left: 0;
          height: 100%;
          background: var(--gold);
          transition: width 0.4s ease;
        }
        .kit-recommender__step-label {
          font-family: var(--font-heading);
          font-size: 11px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: var(--text-muted);
          margin-bottom: 12px;
        }
        .kit-recommender__question {
          font-family: var(--font-heading);
          font-size: 22px;
          font-weight: 600;
          color: var(--text-primary);
          margin-bottom: 28px;
          line-height: 1.3;
        }
        .kit-recommender__options {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
          margin-bottom: 32px;
        }
        .kit-recommender__option {
          background: var(--bg-secondary);
          border: 1px solid var(--border);
          padding: 16px 20px;
          font-family: var(--font-heading);
          font-size: 14px;
          font-weight: 500;
          color: var(--text-secondary);
          cursor: pointer;
          text-align: left;
          transition: border-color var(--transition), color var(--transition), background var(--transition);
        }
        .kit-recommender__option:hover {
          border-color: var(--gold);
          color: var(--text-primary);
          background: var(--bg-elevated);
        }
        .kit-recommender__back {
          background: none;
          border: none;
          color: var(--text-muted);
          font-family: var(--font-heading);
          font-size: 13px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          cursor: pointer;
          transition: color var(--transition);
        }
        .kit-recommender__back:hover {
          color: var(--text-primary);
        }
        .kit-recommender__result {
          animation: fadeSlideIn 0.5s ease both;
        }
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .kit-recommender__result-label {
          font-family: var(--font-heading);
          font-size: 11px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: var(--gold);
          margin-bottom: 12px;
        }
        .kit-recommender__result-name {
          font-family: var(--font-heading);
          font-size: 24px;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 16px;
        }
        .kit-recommender__result-desc {
          font-size: 15px;
          color: var(--text-secondary);
          line-height: 1.7;
          margin-bottom: 28px;
        }
        .kit-recommender__result-actions {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
        }
        @media (max-width: 600px) {
          .kit-recommender {
            padding: 28px 20px;
          }
          .kit-recommender__options {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <div className="kit-recommender__progress-track">
        <div className="kit-recommender__progress-fill" style={{ width: `${progressPct}%` }} />
      </div>

      {!result ? (
        <>
          <p className="kit-recommender__step-label">Step {step} of 3</p>
          <p className="kit-recommender__question">{current.question}</p>
          <div className="kit-recommender__options">
            {current.options.map(opt => (
              <button key={opt} className="kit-recommender__option" onClick={() => select(opt)}>
                {opt}
              </button>
            ))}
          </div>
          {step > 1 && (
            <button className="kit-recommender__back" onClick={() => setStep(s => s - 1)}>
              ← Back
            </button>
          )}
        </>
      ) : (
        <div className="kit-recommender__result">
          <p className="kit-recommender__result-label">Your Recommended Kit</p>
          <p className="kit-recommender__result-name">{result.name}</p>
          <p className="kit-recommender__result-desc">{result.description}</p>
          <div className="kit-recommender__result-actions">
            <button className="btn-gold">Build My Kit</button>
            <button className="btn-ghost" onClick={reset}>Start Over</button>
          </div>
        </div>
      )}
    </div>
  )
}
