import React from 'react'

export default function Footer({ couple, dateLabel }) {
  return (
    <footer className="foot" role="contentinfo">
      <div className="in">
        <span className="mono" aria-label="Couple Monogram">
          {couple.monogram}
        </span>
        <p className="foot-date">
          <span>{dateLabel}</span>
        </p>
        <p className="foot-hashtag">{couple.hashtag}</p>
      </div>
    </footer>
  )
}


