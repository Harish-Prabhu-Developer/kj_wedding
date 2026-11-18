import React from 'react'
import { useNow } from '../hooks/useNow'

function pad(n) {
  return n < 10 ? '0' + n : '' + n
}

export default function Countdown({ countdownTarget, countdownNote }) {
  const now = useNow(1000)
  const target = new Date(countdownTarget).getTime()
  const diff = Math.max(0, target - now)

  const d = Math.floor(diff / 864e5)
  const h = Math.floor((diff % 864e5) / 36e5)
  const m = Math.floor((diff % 36e5) / 6e4)
  const s = Math.floor((diff % 6e4) / 1e3)

  const days = d < 100 ? pad(d) : '' + d
  const hours = pad(h)
  const minutes = pad(m)
  const seconds = pad(s)

  return (
    <section className="sec count" aria-labelledby="cd-h">
      <div className="in">
        <p className="eyebrow">Until we say I do</p>
        <h2 id="cd-h" className="rv" style={{ marginTop: '.6rem' }}>
          The countdown
        </h2>
        <div
          className="clock rv"
          role="timer"
          aria-label="Time remaining until the ceremony"
        >
          <div className="unit">
            <b id="cd-d">{days}</b>
            <small>Days</small>
          </div>
          <div className="unit">
            <b id="cd-h2">{hours}</b>
            <small>Hours</small>
          </div>
          <div className="unit">
            <b id="cd-m">{minutes}</b>
            <small>Minutes</small>
          </div>
          <div className="unit">
            <b id="cd-s">{seconds}</b>
            <small>Seconds</small>
          </div>
        </div>
        <p className="note" id="cd-note">
          {diff === 0 ? 'Today is the day. See you there.' : countdownNote}
        </p>
      </div>
    </section>
  )
}

