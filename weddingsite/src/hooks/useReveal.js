import { useEffect } from 'react'

export function useReveal(enabled) {
  useEffect(() => {
    if (!enabled) return

    const reduce =
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (reduce || !('IntersectionObserver' in window)) return

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.remove('pre')
            io.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.12 }
    )

    const rvs = document.querySelectorAll('.rv')
    rvs.forEach((el) => {
      if (el.getBoundingClientRect().top > window.innerHeight * 0.9) {
        el.classList.add('pre')
        io.observe(el)
      }
    })

    return () => {
      io.disconnect()
    }
  }, [enabled])
}

