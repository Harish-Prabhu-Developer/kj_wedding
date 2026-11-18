import { useEffect, useRef, useState } from 'react'
import { longDate } from '../lib/format'

function renderIcon(icon) {
  switch (icon) {
    case 'rings':
      return (
        <>
          <circle cx="8.5" cy="14.5" r="5" />
          <circle cx="15.5" cy="14.5" r="5" />
          <path d="M12 2.5l2 2.2-2 2.2-2-2.2z" />
        </>
      )
    case 'dawn':
      return <path d="M3 18h18M6 18a6 6 0 0 1 12 0M12 5v3M4.5 9l2 2M19.5 9l-2 2" />
    case 'meal':
      return (
        <path d="M7 3v8M5 3v5a2 2 0 0 0 4 0V3M7 11v10M17 21V3c-2 1-3.5 4-3.5 8H17" />
      )
    case 'glass':
      return <path d="M5 4h14l-7 8zM12 12v8M8 20h8" />
    default:
      return null
  }
}

export default function Schedule({ events = [], venues = [] }) {
  const [inView, setInView] = useState(false)
  const sectionRef = useRef(null)

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          // Continuously trigger visibility animation whenever scrolling into or out of view
          setInView(entry.isIntersecting)
        })
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -40px 0px'
      }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const venuesMap = {}
  venues.forEach((v) => {
    venuesMap[v.id] = v
  })

  return (
    <section
      ref={sectionRef}
      className={`sec schedule-sec ${inView ? 'in-view' : ''}`}
      id="schedule"
      aria-labelledby="sc-h"
    >
      <div className="in">
        <div className="sec-head rv">
          <p className="eyebrow">12 to 15 December</p>
          <h2 id="sc-h">The celebrations</h2>
          <div className="rule">
            <i></i>
          </div>
        </div>
        <ol className="timeline" id="tl">
          {events.map((e, idx) => {
            const v = venuesMap[e.venueId] || {}
            return (
              <li
                key={e.key}
                className={`ev ${inView ? 'in-view' : ''}`}
                style={{ '--d': `${idx * 0.12}s` }}
              >
                <time>
                  {e.time}
                  {e.end ? (
                    <>
                      <br />
                      <span style={{ opacity: 0.65, fontSize: '.9em' }}>
                        to {e.end}
                      </span>
                    </>
                  ) : null}
                </time>
                <span className="ico">
                  <svg viewBox="0 0 24 24">{renderIcon(e.icon)}</svg>
                </span>
                <div>
                  <h3>
                    {e.name}
                    {e.live ? (
                      <>
                        {' '}
                        <span className="tag">Streamed live</span>
                      </>
                    ) : null}
                  </h3>
                  <p className="ta" style={{ fontSize: '1rem' }}>
                    {e.ta}
                  </p>
                  <p>
                    {longDate(e.date)}
                    <br />
                    {v.name || ''}
                  </p>
                  {/* Golden polish shine effect */}
                  <span className="shine" aria-hidden="true">
                    <i />
                  </span>
                </div>
              </li>
            )
          })}
        </ol>
      </div>
    </section>
  )
}
