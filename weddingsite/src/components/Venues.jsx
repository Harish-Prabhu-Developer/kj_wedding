import { useEffect, useRef, useState } from 'react'
import { shortDate } from '../lib/format'

export default function Venues({ venues = [], events = [] }) {
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

  return (
    <section
      ref={sectionRef}
      className={`sec venue ${inView ? 'in-view' : ''}`}
      id="venue"
      aria-labelledby="ve-h"
    >
      <div className="in">
        <div className="sec-head rv">
          <p className="eyebrow">Where to find us</p>
          <h2 id="ve-h">The venues</h2>
          <div className="rule">
            <i></i>
          </div>
        </div>
        <div className="venue-grid">
          <figure className={`photo ${inView ? 'in-view' : ''}`}>
            <img
              src="/assets/venue-flowers.jpg"
              alt="Peonies, roses and gold scrollwork at the venue entrance"
              loading="lazy"
            />
          </figure>
          <div className="vd" id="venues">
            {venues.map((v, idx) => {
              const q = encodeURIComponent(v.q)
              const evs = events.filter((e) => e.venueId === v.id)
              return (
                <div
                  key={v.id}
                  className={`vn ${inView ? 'in-view' : ''}`}
                  style={{ '--d': `${idx * 0.14}s` }}
                >
                  <h3>{v.name}</h3>
                  <p className="ta">{v.ta}</p>
                  <ul>
                    {evs.map((e) => (
                      <li key={e.key}>
                        <small>{shortDate(e.date)}</small>
                        {e.name}, {e.time}
                        {e.end ? ' to ' + e.end : ''}
                      </li>
                    ))}
                  </ul>
                  <div className="row">
                    <a
                      className="btn"
                      href={`https://www.google.com/maps/search/?api=1&query=${q}`}
                      target="_blank"
                      rel="noopener"
                    >
                      Open in Maps
                    </a>
                    <a
                      className="btn ghost"
                      href={`https://www.google.com/maps/dir/?api=1&destination=${q}`}
                      target="_blank"
                      rel="noopener"
                    >
                      Get directions
                    </a>
                  </div>
                  {/* Golden polish shine effect */}
                  <span className="shine" aria-hidden="true">
                    <i />
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
