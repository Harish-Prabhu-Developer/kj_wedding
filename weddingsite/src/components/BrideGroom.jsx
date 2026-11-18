import { useEffect, useRef, useState } from 'react'

export default function BrideGroom({ couple = {} }) {
  const [inView, setInView] = useState(false)
  const sectionRef = useRef(null)

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return

    const observer = new IntersectionObserver(
      (entries) => {
        // Continuously trigger visibility animation whenever scrolling into or out of view
        entries.forEach((entry) => {
          setInView(entry.isIntersecting)
        })
      },
      {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px'
      }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const groomName = couple.groom?.name || couple.first || 'Prakash Vel'
  const brideName = couple.bride?.name || couple.second || 'Agnes'

  const groomDesc =
    couple.groom?.desc ||
    'Ready to begin this beautiful new chapter of life with love, devotion, and cherished blessings.'
  const brideDesc =
    couple.bride?.desc ||
    'Stepping gracefully into a new journey of love, happiness, and lifelong companionship.'

  return (
    <section
      ref={sectionRef}
      className={`sec couple-sec ${inView ? 'section-in-view' : ''}`}
      id="couple"
      aria-labelledby="couple-h"
    >
      <div className="in">
        <div className="sec-head rv">
          <p className="eyebrow">The Happy Couple</p>
          <h2 id="couple-h">Bride and Groom</h2>
          <div className="rule">
            <i></i>
          </div>
        </div>

        <div className="couple-cards">
          {/* Groom Card */}
          <article
            className={`couple-card groom-card ${inView ? 'in-view' : ''}`}
            aria-labelledby="groom-name"
          >
            <div className="couple-avatar" aria-hidden="true">
              <span>{(groomName || 'P')[0]}</span>
            </div>
            <span className="couple-role">{couple.groom?.role || 'The Groom'}</span>
            <h3 id="groom-name" className="couple-card-name">
              {groomName}
            </h3>
            <div className="rule">
              <i></i>
            </div>
            <p className="couple-card-desc">{groomDesc}</p>

            {/* Continuous golden polish shine sweep */}
            <span className="shine" aria-hidden="true">
              <i />
            </span>
          </article>

          {/* Bride Card */}
          <article
            className={`couple-card bride-card ${inView ? 'in-view' : ''}`}
            aria-labelledby="bride-name"
          >
            <div className="couple-avatar" aria-hidden="true">
              <span>{(brideName || 'A')[0]}</span>
            </div>
            <span className="couple-role">{couple.bride?.role || 'The Bride'}</span>
            <h3 id="bride-name" className="couple-card-name">
              {brideName}
            </h3>
            <div className="rule">
              <i></i>
            </div>
            <p className="couple-card-desc">{brideDesc}</p>

            {/* Continuous golden polish shine sweep */}
            <span className="shine" aria-hidden="true">
              <i />
            </span>
          </article>
        </div>
      </div>
    </section>
  )
}
