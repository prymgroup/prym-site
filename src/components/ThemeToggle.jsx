import { useTheme } from '../context/ThemeContext'

/**
 * Quiet Luxury theme toggle.
 * Half-filled geometric circle — universal, brand-aligned, zero background box.
 * Light mode  → left half filled (dark side visible) = click to enter dark
 * Dark mode   → right half filled (light side visible) = click to enter light
 */
export default function ThemeToggle() {
  const { isDark, toggle } = useTheme()

  return (
    <button
      onClick={toggle}
      aria-label={isDark ? 'Mode clair' : 'Mode sombre'}
      style={{
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        padding: '2px 0',
        display: 'flex',
        alignItems: 'center',
        color: 'inherit',
        opacity: 0.45,
        transition: 'opacity 0.25s ease',
        WebkitTapHighlightColor: 'transparent',
        lineHeight: 0,
        flexShrink: 0,
      }}
      onMouseEnter={e => { e.currentTarget.style.opacity = '1' }}
      onMouseLeave={e => { e.currentTarget.style.opacity = '0.45' }}
    >
      <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden>
        {/* Outer circle — always visible */}
        <circle cx="6.5" cy="6.5" r="4.5" stroke="currentColor" strokeWidth="0.7" />
        {/* Half-fill — switches orientation to indicate the other mode */}
        <path
          d={
            isDark
              /* dark mode: right half filled → shows light side is reachable */
              ? 'M6.5 2 A4.5 4.5 0 0 1 6.5 11 Z'
              /* light mode: left half filled → shows dark side is reachable */
              : 'M6.5 2 A4.5 4.5 0 0 0 6.5 11 Z'
          }
          fill="currentColor"
        />
      </svg>
    </button>
  )
}
