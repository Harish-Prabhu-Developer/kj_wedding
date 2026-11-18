import React, { useEffect, useRef } from 'react'

export default function Lightbox({ photo, onClose }) {
  const lbRef = useRef(null)
  const closeBtnRef = useRef(null)

  useEffect(() => {
    if (photo) {
      if (closeBtnRef.current) {
        closeBtnRef.current.focus()
      }
    }
  }, [photo])

  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape' && photo) {
        onClose()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [photo, onClose])

  function handleBackdropClick(e) {
    if (e.target === lbRef.current) {
      onClose()
    }
  }

  return (
    <div
      className={`lb ${photo ? 'on' : ''}`}
      id="lb"
      role="dialog"
      aria-label="Photo viewer"
      ref={lbRef}
      onClick={handleBackdropClick}
    >
      <button
        type="button"
        id="lbX"
        ref={closeBtnRef}
        onClick={onClose}
      >
        Close
      </button>
      <img
        id="lbImg"
        src={photo ? photo.src : undefined}
        alt={photo ? photo.caption : ''}
      />
      <p id="lbCap">{photo ? photo.caption : ''}</p>
    </div>
  )
}

