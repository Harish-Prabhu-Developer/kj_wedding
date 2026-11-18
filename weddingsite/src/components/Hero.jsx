import { useEffect, useRef, useState } from 'react'

export default function Hero({ couple, dateLabel, hero }) {
  const [namesInView, setNamesInView] = useState(true)
  const namesRef = useRef(null)

  useEffect(() => {
    const el = namesRef.current
    if (!el) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          // Continuously trigger visibility animation whenever scrolling into or out of view
          setNamesInView(entry.isIntersecting)
        })
      },
      {
        threshold: 0.2,
        rootMargin: '0px 0px -30px 0px'
      }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const inviteLine =
    hero?.inviteLine ||
    'request the pleasure of your company at their wedding celebrations'
  const welcome =
    hero?.welcome ||
    'With the blessings of our elders and the love of our families, we invite you to our engagement, wedding and reception. Your presence and your blessings will make these days complete.'
  const welcomeTa =
    hero?.welcomeTa || 'உங்கள் வருகையையும் ஆசிகளையும் அன்புடன் வேண்டுகிறோம்.'

  return (
    <section className="hero" aria-labelledby="names">
      <div className="hero-card">
        <img
          className="top"
          src="/assets/hero-top.jpg"
          alt="Crystal chandelier and a frame of peonies and gold scrollwork"
          draggable="false"
        />
        <div className="hero-mid stagger">
          <p className="eyebrow" style={{ '--i': 0 }}>
            Together with their families
          </p>

          {/* Continuous scroll-triggered animated name pairings (English and Tamil) */}
          <div
            ref={namesRef}
            className={`names-pair-wrap ${namesInView ? 'in-view' : ''}`}
          >
            <h1 className="names" id="names" style={{ '--i': 1 }}>
              <span>{couple.first}</span>
              <span className="amp" aria-hidden="true">
                &amp;
              </span>
              <span>{couple.second}</span>
            </h1>
            <p className="ta names-ta" style={{ '--i': 1 }}>
              {couple.firstTa} &amp; {couple.secondTa}
            </p>
          </div>

          <p className="invite-line" style={{ '--i': 2 }}>
            {inviteLine}
          </p>
          <div className="rule" style={{ '--i': 3 }}>
            <i></i>
          </div>
          <p className="when" style={{ '--i': 3 }}>
            <span>{dateLabel}</span>
          </p>
          <p className="welcome" style={{ '--i': 4 }}>
            {welcome}
          </p>
          <p
            className="ta"
            style={{
              '--i': 4,
              color: 'var(--ink-soft)',
              fontSize: '1.05rem'
            }}
          >
            {welcomeTa}
          </p>
          <a className="btn" href="#schedule" style={{ '--i': 5 }}>
            View the schedule
          </a>
        </div>
        <img
          className="bot"
          src="/assets/hero-bottom.jpg"
          alt="The couple standing before blush and ivory florals"
          draggable="false"
        />
      </div>
    </section>
  )
}
