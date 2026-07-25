import { createContext, useContext, useEffect, useState } from 'react'
import { STR } from './i18n'

const Ctx = createContext(null)

// Read once at startup: saved choice wins, otherwise follow the OS.
function initialTheme() {
  const saved = localStorage.getItem('st-theme')
  if (saved === 'light' || saved === 'dark') return saved
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}
function initialLang() {
  const saved = localStorage.getItem('st-lang')
  return saved === 'ne' ? 'ne' : 'en'
}

export function AppProvider({ children }) {
  const [theme, setTheme] = useState(initialTheme)
  const [lang, setLang] = useState(initialLang)

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    localStorage.setItem('st-theme', theme)
  }, [theme])

  useEffect(() => {
    document.documentElement.lang = lang
    document.title = STR[lang]['meta.title']
    localStorage.setItem('st-lang', lang)
  }, [lang])

  const t = (key) => STR[lang][key] ?? key

  const value = {
    lang,
    setLang,
    theme,
    setTheme,
    t,
    toggleTheme: () => setTheme((v) => (v === 'dark' ? 'light' : 'dark')),
  }

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useApp() {
  const v = useContext(Ctx)
  if (!v) throw new Error('useApp must be used inside <AppProvider>')
  return v
}