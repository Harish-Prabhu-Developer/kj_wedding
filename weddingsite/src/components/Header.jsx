import { useState, useEffect } from 'react'

export default function Header({ monogram }) {
  const [menuOpen, setMenuOpen] = useState(false)

  // Close menu on Escape key
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape') setMenuOpen(false)
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  function handleNavClick() {
    setMenuOpen(false)
  }

  return (
    <header className="bar">
      <div className="in">
        <a
          className="mono"
          href="#top"
          aria-label="Prakash and Agnes, back to top"
          onClick={handleNavClick}
        >
          {monogram}
        </a>

        {/* Desktop Navigation */}
        <nav className="desktop-nav" aria-label="Sections">
          <a href="#couple">Couple</a>
          <a href="#schedule">Schedule</a>
          <a href="#live">Live</a>
          <a href="#venue">Venue</a>
          <a className="cta" href="#memories">
            Memories
          </a>
        </nav>

        {/* Mobile Navigation Toggle Button */}
        <button
          type="button"
          className="nav-menu-btn"
          aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={menuOpen}
          aria-controls="mobile-nav-menu"
          onClick={() => setMenuOpen((prev) => !prev)}
        >
          {menuOpen ? (
            <svg
              className="menu-icon"
              viewBox="0 0 24 24"
              width="22"
              height="22"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          ) : (
            <svg
              className="menu-icon"
              viewBox="0 0 24 24"
              width="22"
              height="22"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <line x1="4" y1="6" x2="20" y2="6" />
              <line x1="4" y1="12" x2="20" y2="12" />
              <line x1="4" y1="18" x2="20" y2="18" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile Dropdown Navigation Menu */}
      <div
        id="mobile-nav-menu"
        className={`nav-dropdown ${menuOpen ? 'open' : ''}`}
        aria-hidden={!menuOpen}
      >
        <nav className="mobile-nav-links" aria-label="Mobile Navigation">
          <a href="#couple" onClick={handleNavClick}>
            <span>Bride &amp; Groom</span>
            <span className="arrow" aria-hidden="true">
              &rarr;
            </span>
          </a>
          <a href="#schedule" onClick={handleNavClick}>
            <span>The Celebrations</span>
            <span className="arrow" aria-hidden="true">
              &rarr;
            </span>
          </a>
          <a href="#live" onClick={handleNavClick}>
            <span>Live Stream</span>
            <span className="arrow" aria-hidden="true">
              &rarr;
            </span>
          </a>
          <a href="#venue" onClick={handleNavClick}>
            <span>The Venues</span>
            <span className="arrow" aria-hidden="true">
              &rarr;
            </span>
          </a>
          <a href="#memories" onClick={handleNavClick}>
            <span>Memories</span>
            <span className="arrow" aria-hidden="true">
              &rarr;
            </span>
          </a>
        </nav>
      </div>
    </header>
  )
}
