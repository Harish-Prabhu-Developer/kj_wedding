import React, { useState } from 'react'
import { useNow } from '../hooks/useNow'

export default function LiveStream({ stream = {}, venues = [] }) {
  const now = useNow(1000)
  const [copyNote, setCopyNote] = useState('')

  const wv = venues.find((v) => v.id === stream.venueId) || {}
  const venueName = wv.name || ''

  const sStart = stream.start ? new Date(stream.start).getTime() : 0
  const sEnd = stream.end ? new Date(stream.end).getTime() : 0

  const has = Boolean(stream.url)
  const diff = sStart - now
  const isDuring = now >= sStart && now < sEnd
  const isAfter = now >= sEnd

  const badgeOn = has && isDuring

  let badgeText = ''
  let bigText = ''

  if (now < sStart) {
    const d = Math.floor(diff / 864e5)
    const h = Math.floor((diff % 864e5) / 36e5)
    const m = Math.floor((diff % 36e5) / 6e4)
    badgeText = 'Opens in ' + (d ? d + 'd ' : '') + h + 'h ' + m + 'm'
    bigText = 'Live from ' + venueName
  } else if (!isAfter) {
    badgeText = has ? 'Live now' : 'Stream link not added yet'
    bigText = has ? 'The wedding is streaming now' : 'Stream link coming soon'
  } else {
    badgeText = 'Stream ended'
    bigText = has ? 'Watch the recording' : 'Thank you for celebrating with us'
  }

  const btnText = has
    ? isDuring
      ? 'Watch live on ' + (stream.platform || 'YouTube')
      : 'Open on ' + (stream.platform || 'YouTube')
    : 'Live link will be shared here on the wedding day'

  const whenText = stream.start
    ? new Date(stream.start)
        .toLocaleString('en-IN', {
          weekday: 'long',
          day: 'numeric',
          month: 'long',
          year: 'numeric',
          hour: 'numeric',
          minute: '2-digit',
          timeZone: 'Asia/Kolkata'
        })
        .replace(' at ', ' · ') + ' IST'
    : ''

  function handleCopy() {
    if (!stream.url) {
      setCopyNote('The stream link has not been added yet.')
      return
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard
        .writeText(stream.url)
        .then(() => {
          setCopyNote('Stream link copied.')
        })
        .catch(() => {
          setCopyNote(stream.url)
        })
    } else {
      setCopyNote(stream.url)
    }
  }

  return (
    <section className="sec" id="live" aria-labelledby="lv-h">
      <div className="in">
        <div className="sec-head rv">
          <p className="eyebrow">Live stream</p>
          <h2 id="lv-h">Watch from anywhere</h2>
          <p className="lead">
            Cannot travel? Watch the wedding ceremony live from home. The stream
            opens fifteen minutes before the muhurtham.
          </p>
          <div className="rule">
            <i></i>
          </div>
        </div>
        <div className="stage rv">
          <div className="poster">
            {stream.embedUrl ? (
              <iframe
                src={stream.embedUrl}
                title="Wedding Live Stream"
                allow="autoplay; encrypted-media; picture-in-picture"
                allowFullScreen
                loading="lazy"
                style={{
                  position: 'absolute',
                  inset: 0,
                  width: '100%',
                  height: '100%',
                  border: 0,
                  zIndex: 2
                }}
              />
            ) : (
              <>
                <img
                  src="/assets/hero-bottom.jpg"
                  alt="The couple standing before blush florals"
                  loading="lazy"
                />
                <div className="over">
                  <span
                    className={`badge ${badgeOn ? 'on' : ''}`}
                    id="lv-badge"
                  >
                    <i></i>
                    <span id="lv-badge-t">{badgeText}</span>
                  </span>
                  <p className="big" id="lv-big">
                    {bigText}
                  </p>
                  {has ? (
                    <a
                      className="btn"
                      id="lv-btn"
                      href={stream.url}
                      target="_blank"
                      rel="noopener"
                    >
                      {btnText}
                    </a>
                  ) : (
                    <a
                      className="btn"
                      id="lv-btn"
                      href="#"
                      target="_blank"
                      rel="noopener"
                      aria-disabled="true"
                    >
                      Live link will be shared here on the wedding day
                    </a>
                  )}
                </div>
              </>
            )}
          </div>
          <div className="stage-foot">
            <span id="lv-when">{whenText}</span>
            <div className="row">
              {stream.embedUrl && has && (
                <a
                  className="btn"
                  href={stream.url}
                  target="_blank"
                  rel="noopener"
                  style={{ textDecoration: 'none' }}
                >
                  Watch on {stream.platform || 'YouTube'}
                </a>
              )}
              <button
                className="btn ghost"
                id="lv-copy"
                type="button"
                onClick={handleCopy}
              >
                Copy stream link
              </button>
            </div>
          </div>
        </div>
        <p
          className="note-s"
          id="lv-note"
          role="status"
          style={{ textAlign: 'center', marginTop: '.6rem' }}
        >
          {copyNote}
        </p>
      </div>
    </section>
  )
}
