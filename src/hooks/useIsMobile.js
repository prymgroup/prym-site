import { useState, useEffect } from 'react'

/**
 * Returns true when the viewport width is below `breakpoint` (default 768px).
 * Use breakpoint=900 for components that switch layout at a wider threshold.
 * Single shared implementation — avoids duplicating the resize listener
 * across every page component.
 */
export function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < breakpoint)
  useEffect(() => {
    const fn = () => setIsMobile(window.innerWidth < breakpoint)
    window.addEventListener('resize', fn)
    return () => window.removeEventListener('resize', fn)
  }, [breakpoint])
  return isMobile
}
