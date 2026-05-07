import { createContext, useContext, useState, useEffect } from 'react'

const LanguageContext = createContext({ lang: 'FR', setLang: () => {} })

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => {
    try { return localStorage.getItem('prym_lang') || 'FR' } catch (_) { return 'FR' }
  })

  useEffect(() => {
    try { localStorage.setItem('prym_lang', lang) } catch (_) { /* localStorage unavailable (SSR/private mode) */ }
    document.documentElement.dir  = lang === 'AR' ? 'rtl' : 'ltr'
    document.documentElement.lang = { FR: 'fr', EN: 'en', AR: 'ar' }[lang] ?? 'fr'
  }, [lang])

  return (
    <LanguageContext.Provider value={{ lang, setLang }}>
      {children}
    </LanguageContext.Provider>
  )
}

export const useLanguage = () => useContext(LanguageContext)
