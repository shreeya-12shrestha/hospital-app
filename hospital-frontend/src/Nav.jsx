import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useApp } from './AppContext'
import { Icon } from './Icons'

export default function Nav() {
  const { t, lang, setLang, theme, toggleTheme } = useApp()
  const [menuOpen, setMenuOpen] = useState(false)   // profile dropdown
  const [navOpen, setNavOpen] = useState(false)     // mobile burger
  const profileRef = useRef(null)

  // close the profile dropdown on any outside click or Escape
  useEffect(() => {
    const away = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) setMenuOpen(false)
    }
    const esc = (e) => e.key === 'Escape' && setMenuOpen(false)
    document.addEventListener('click', away)
    document.addEventListener('keydown', esc)
    return () => {
      document.removeEventListener('click', away)
      document.removeEventListener('keydown', esc)
    }
  }, [])

  const links = [
    { to: '/', label: t('nav.home'), active: true },
    { to: '/hospitals', label: t('nav.hospitals') },
    { to: '/symptom-check', label: t('nav.symptoms') },
    { to: '/doctors', label: t('nav.doctors') },
    { to: '/about', label: t('nav.about') },
    { to: '/contact', label: t('nav.contact') },
  ]

  return (
    <header className={`nav${navOpen ? ' is-open' : ''}`}>
      <div className="wrap nav__in">
        <Link className="logo" to="/" aria-label="स्वास्थ्य Track">
<svg className="logo__mark" viewBox="0 0 44 44" aria-hidden="true">
            <path d="M34 22 28 11.6H16L10 22l6 10.4h12z" fill="var(--blue-tint)" />
            <path d="M22 5.55H12.5L3 22l9.5 16.45h19L41 22" fill="none" stroke="var(--blue)" strokeWidth="5" strokeLinejoin="round" strokeLinecap="round" />
            <path d="M22 5.55h9.5L41 22" fill="none" stroke="var(--red)" strokeWidth="5" strokeLinejoin="round" strokeLinecap="round" />
            <rect x="19.4" y="10.5" width="5.2" height="13.5" rx="1.2" fill="var(--red)" />
            <rect x="15.6" y="14.65" width="12.8" height="5.2" rx="1.2" fill="var(--red)" />
            <path d="M8.5 27h7.5l1.7-5.5 2.5 9.5 2.1-6.2 1.5 2.2H35.5" fill="none" stroke="var(--red)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          {/* brand lockup — fixed in both languages, never translated */}
          <span className="logo__word">
            <span className="logo__ne">स्वास्थ्य</span>
            <span className="logo__en">TRACK</span>
          </span>
        </Link>

        <nav className="nav__links" aria-label="Main">
          {links.map((l, i) => (
            <Link
              key={i}
              to={l.to}
              className={l.active ? 'is-active' : undefined}
              onClick={() => setNavOpen(false)}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="nav__side">
          <div className="lang" role="group" aria-label="Language / भाषा">
            <button type="button" lang="en" aria-pressed={lang === 'en'} onClick={() => setLang('en')}>EN</button>
            <button type="button" lang="ne" aria-pressed={lang === 'ne'} onClick={() => setLang('ne')}>ने</button>
          </div>

          <button
            className="icon-btn"
            id="themeBtn"
            aria-pressed={theme === 'dark'}
            aria-label={t(theme === 'dark' ? 'a11y.theme.off' : 'a11y.theme.on')}
            onClick={toggleTheme}
          >
            <Icon n="moon" className="moon" />
            <Icon n="sun" className="sun" />
          </button>

          <button
            className="icon-btn burger"
            aria-expanded={navOpen}
            aria-label={t('a11y.menu')}
            onClick={(e) => { e.stopPropagation(); setNavOpen((v) => !v) }}
          >
            <Icon n="menu" />
          </button>

          <button className="icon-btn" id="bellBtn" aria-label={t('a11y.bell')}>
            <Icon n="bell" />
            <span className="dot" />
          </button>

          <div className={`profile${menuOpen ? ' is-open' : ''}`} ref={profileRef}>
            <button
              className="profile__btn"
              aria-expanded={menuOpen}
              aria-haspopup="true"
              onClick={(e) => { e.stopPropagation(); setMenuOpen((v) => !v) }}
            >
              <span className="avatar">SS</span>
              <Icon n="down" />
            </button>
            <div className="menu" role="menu">
              <div className="menu__head">
                <strong>Shreeya Shrestha</strong>
                <span>{t('menu.role')}</span>
              </div>
              <a href="#" role="menuitem">{t('menu.profile')}</a>
              <a href="#" role="menuitem">{t('menu.appts')}</a>
              <a href="#" role="menuitem">{t('menu.records')}</a>
              <a href="#" role="menuitem" className="is-danger">{t('menu.signout')}</a>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}