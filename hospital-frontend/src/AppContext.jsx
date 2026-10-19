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
function initialToken() {
  return localStorage.getItem('st-token')
}

export function AppProvider({ children }) {
  const [theme, setTheme] = useState(initialTheme)
  const [lang, setLang] = useState(initialLang)
  const [token, setToken] = useState(initialToken)
  const [user, setUser] = useState(null)

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    localStorage.setItem('st-theme', theme)
  }, [theme])

  useEffect(() => {
    document.documentElement.lang = lang
    document.title = STR[lang]['meta.title']
    localStorage.setItem('st-lang', lang)
  }, [lang])
    // after a page refresh we only have the saved token, so ask the backend whose it is
  useEffect(() => {
    if (!token || user) return
    let alive = true
    fetch('/api/me/', { headers: { Authorization: `Token ${token}` } })
      .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
      .then((me) => { if (alive) setUser(me) })
      .catch((status) => {
        if (alive && status === 401) {      // token no longer valid → treat as logged out
          localStorage.removeItem('st-token')
          setToken(null)
        }
      })
    return () => { alive = false }
  }, [token, user])

  const authHeaders = () => (token ? { Authorization: `Token ${token}` } : {})

  const signIn = (newToken, newUser) => {
    localStorage.setItem('st-token', newToken)
    setToken(newToken)
    setUser(newUser)
  }

  const signOut = () => {
    if (token) fetch('/api/logout/', { method: 'POST', headers: authHeaders() }).catch(() => {})
    localStorage.removeItem('st-token')
    setToken(null)
    setUser(null)
  }
  const t = (key) => STR[lang][key] ?? key

  const value = {
    lang,
    setLang,
    theme,
    setTheme,
    t,
    toggleTheme: () => setTheme((v) => (v === 'dark' ? 'light' : 'dark')),
    token,
    user,
    signIn,
    signOut,
    authHeaders,
  }

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useApp() {
  const v = useContext(Ctx)
  if (!v) throw new Error('useApp must be used inside <AppProvider>')
  return v
}