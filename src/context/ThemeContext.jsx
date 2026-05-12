import { createContext, useContext, useState, useEffect } from 'react'

const ThemeCtx = createContext({ isDark: false, toggle: () => {} })

export function ThemeProvider({ children }) {
  const [isDark, setIsDark] = useState(false)

  // Initialise from localStorage / system preference on mount
  useEffect(() => {
    const saved = localStorage.getItem('prym-theme')
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    const initial = saved ? saved === 'dark' : prefersDark
    setIsDark(initial)
    document.documentElement.classList.toggle('dark', initial)
  }, [])

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
