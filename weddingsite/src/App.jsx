import React, { useState, useEffect } from 'react'
import { useSite } from './hooks/useSite'
import { cleanupOldKeys } from './lib/api'
import { useReveal } from './hooks/useReveal'
import useInvitationEffects from './hooks/useInvitationEffects'

import EnvelopeGate from './components/EnvelopeGate'
import Header from './components/Header'
import Hero from './components/Hero'
import Countdown from './components/Countdown'
import BrideGroom from './components/BrideGroom'
import Schedule from './components/Schedule'
import LiveStream from './components/LiveStream'
import Venues from './components/Venues'
import MemoryWall from './components/MemoryWall'
import Lightbox from './components/Lightbox'
import Footer from './components/Footer'

export default function App() {
  const site = useSite()
  const [revealed, setRevealed] = useState(false)
  const [activePhoto, setActivePhoto] = useState(null)

  useInvitationEffects()

  useEffect(() => {
    cleanupOldKeys()
    document.documentElement.classList.add('locked')
    return () => {
      document.documentElement.classList.remove('locked')
      document.body.classList.remove('live')
    }
  }, [])

  function handleReveal() {
    document.documentElement.classList.remove('locked')
    document.body.classList.add('live')
    setRevealed(true)
  }

  useReveal(revealed)

  function handleOpenPhoto(src, caption) {
    setActivePhoto({ src, caption })
  }

  function handleClosePhoto() {
    setActivePhoto(null)
  }

  const couple = site.couple || {
    first: 'Prakash Vel',
    second: 'Agnes',
    firstTa: 'பிரகாஷ் வேல்',
    secondTa: 'அக்னிஸ்',
    monogram: 'P&A',
    hashtag: '#PrakashAndAgnes'
  }

  return (
    <>
      <EnvelopeGate onReveal={handleReveal} monogram={couple.monogram} />
      <Header monogram={couple.monogram} />
      <main id="top">
        <Hero
          couple={couple}
          dateLabel={site.dateLabel}
          hero={site.hero}
        />
        <Countdown
          countdownTarget={site.countdownTarget}
          countdownNote={site.countdownNote}
        />
        <BrideGroom couple={couple} />
        <Schedule events={site.events || []} venues={site.venues || []} />
        <LiveStream stream={site.stream || {}} venues={site.venues || []} />
        <Venues venues={site.venues || []} events={site.events || []} />
        <MemoryWall
          memory={site.memory || {}}
          onOpenPhoto={handleOpenPhoto}
        />
      </main>
      <Lightbox photo={activePhoto} onClose={handleClosePhoto} />
      <Footer couple={couple} dateLabel={site.dateLabel} />
    </>
  )
}
