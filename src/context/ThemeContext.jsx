import { createContext, useContext, useState } from 'react'

const ThemeCtx = createContext({ isDark: false, toggle: () => {} })

export function ThemeProvider({ children }) {
  // Lazy initialiser — reads localStorage synchronously before the first render
  // so the correct class is on <html> before React paints anything, eliminating
  // the light-mode flash on hard reload for users who prefer dark.
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('prym-theme')
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    const initial = saved ? saved === 'dark' : prefersDark
    document.documentElement.classList.toggle('dark', initial)
    return initial
  })

  const toggle = () => {
    setIsDark(prev => {
      const next = !prev
      document.documentElement.classList.toggle('dark', next)
      localStorage.setItem('prym-theme', next ? 'dark' : 'light')
      return next
    })
  }

  return (
    <ThemeCtx.Provider value={{ isDark, toggle }}>
      {children}
    </ThemeCtx.Provider>
  )
}

export const useTheme = () => useContext(ThemeCtx)
