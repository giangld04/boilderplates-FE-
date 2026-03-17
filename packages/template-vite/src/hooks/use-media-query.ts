import { useEffect, useState } from 'react'

/** Returns true when the given CSS media query matches */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() => {
    if (typeof window === 'undefined') return false
    return window.matchMedia(query).matches
  })

  useEffect(() => {
    const mq = window.matchMedia(query)
    const handler = (e: MediaQueryListEvent) => setMatches(e.matches)

    mq.addEventListener('change', handler)
    setMatches(mq.matches)

    return () => mq.removeEventListener('change', handler)
  }, [query])

  return matches
}

/** Common breakpoint helpers */
export const useIsMobile = () => useMediaQuery('(max-width: 768px)')
export const useIsTablet = () => useMediaQuery('(min-width: 769px) and (max-width: 1024px)')
export const useIsDesktop = () => useMediaQuery('(min-width: 1025px)')
