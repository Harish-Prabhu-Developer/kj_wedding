import React, { useRef, useEffect } from 'react'

export default function EnvelopeGate({ onReveal, monogram = 'P&A' }) {
  const gateRef = useRef(null)
  const sealRef = useRef(null)
  const openedRef = useRef(false)
  const timersRef = useRef([])

  useEffect(() => {
    return () => {
      timersRef.current.forEach((t) => clearTimeout(t))
    }
  }, [])

  function addTimer(fn, ms) {
    const id = setTimeout(fn, ms)
    timersRef.current.push(id)
    return id
  }

  function crumbs() {
    const gate = gateRef.current
    if (!gate || !gate.animate) return
    const box = gate.querySelector('.envbox')
    if (!box) return
    const W = box.getBoundingClientRect().width
    const n = 11
    for (let i = 0; i < n; i++) {
      const c = document.createElement('i')
      c.className = 'crumb'
      const s = W * (0.012 + Math.random() * 0.02)
      c.style.width = s + 'px'
      c.style.height = s * (0.7 + Math.random() * 0.5) + 'px'
      c.style.marginLeft = -s / 2 + 'px'
      c.style.marginTop = -s / 2 + 'px'
      box.appendChild(c)
      const ang = Math.random() * Math.PI * 2
      const dx = Math.cos(ang) * W * (0.06 + Math.random() * 0.14)
      const up = -Math.abs(Math.sin(ang)) * W * (0.04 + Math.random() * 0.08)
      const fall = W * (0.7 + Math.random() * 0.5)
      const anim = c.animate(
        [
          { transform: 'translate(0,0) rotate(0deg)', opacity: 1 },
          {
            transform: `translate(${dx * 0.6}px,${up}px) rotate(${Math.random() * 200 - 100}deg)`,
            opacity: 1,
            offset: 0.28
          },
          {
            transform: `translate(${dx}px,${fall}px) rotate(${Math.random() * 500 - 250}deg)`,
            opacity: 0
          }
        ],
        {
          duration: 1100 + Math.random() * 500,
          easing: 'cubic-bezier(.4,0,.9,.6)',
          fill: 'forwards'
        }
      )
      anim.onfinish = () => {
        c.remove()
      }
    }
  }

  function finish() {
    if (gateRef.current) {
      gateRef.current.classList.add('gone')
    }
  }

  function handleOpen() {
    if (openedRef.current) return
    openedRef.current = true

    window.scrollTo(0, 0)

    const reduce =
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (reduce) {
      finish()
      onReveal()
      return
    }

    const gate = gateRef.current
    const seal = sealRef.current
    if (!gate || !seal) return

    const canMask = Boolean(
      window.CSS &&
      CSS.supports &&
      CSS.supports('mask-image', 'radial-gradient(circle,#000,#000)') &&
      CSS.registerProperty
    )

    const r = seal.getBoundingClientRect()
    gate.style.setProperty('--cx', r.left + r.width / 2 + 'px')
    gate.style.setProperty('--cy', r.top + r.height / 2 + 'px')

    gate.classList.add('press')

    addTimer(() => {
      if (gateRef.current) {
        gateRef.current.classList.add('split')
      }
    }, 480)

    addTimer(() => {
      if (gateRef.current) {
        gateRef.current.classList.add('fall')
        crumbs()
      }
    }, 800)

    addTimer(() => {
      onReveal()
      if (gateRef.current) {
        if (canMask) {
          gateRef.current.classList.add('bloom')
          addTimer(finish, 2000)
        } else {
          gateRef.current.classList.add('fade')
          addTimer(finish, 1150)
        }
      }
    }, 1250)
  }

  return (
    <div
      className="gate"
      id="gate"
      role="dialog"
      aria-label="Wedding invitation envelope"
      ref={gateRef}
    >
      <div className="envbox">
        <img
          src="/assets/envelope.jpg"
          alt="Cream embossed envelope with floral vines"
          draggable="false"
        />
        <div className="gate-cap">A wedding invitation</div>
        <div className="glow"></div>
        <div className="sealwrap">
          <button
            className="seal"
            id="seal"
            type="button"
            aria-label="Break the wax seal to open the invitation"
            ref={sealRef}
            onClick={handleOpen}
          >
            <span className="half l">
              <img src="/assets/seal.png" alt="" />
              <span className="mono2">{monogram}</span>
            </span>
            <span className="half r">
              <img src="/assets/seal.png" alt="" />
              <span className="mono2">{monogram}</span>
            </span>
          </button>
        </div>
        <div className="hint">Tap the seal to open</div>
      </div>
    </div>
  )
}

