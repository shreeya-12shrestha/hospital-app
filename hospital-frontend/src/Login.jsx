import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useApp } from './AppContext'
import { Hexbrow } from './Lib'

export default function Login() {
  const { t, signIn } = useApp()
  const navigate = useNavigate()
  const [form, setForm] = useState({ phone: '', password: '' })
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))

  const submit = async (e) => {
    e.preventDefault()                       // stop the browser reloading the page
    setBusy(true)
    setError('')
    try {
      const r = await fetch('/api/login/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await r.json()
      if (!r.ok) throw new Error(data.error || t('auth.failed'))
      signIn(data.token, data.user)
      navigate('/my-appointments')
    } catch (err) {
      setError(err.message || t('auth.failed'))
    } finally {
      setBusy(false)
    }
  }

  return (
    <main className="page">
      <div className="wrap wrap--narrow">
        <div className="page__head">
          <p className="eyebrow"><Hexbrow />{t('auth.eyebrow')}</p>
          <h1 className="page__title">{t('auth.loginTitle')}</h1>
          <p className="page__sub">{t('auth.loginSub')}</p>
        </div>

        <form className="appt-form" onSubmit={submit}>
          <label className="field">
            <span className="field__label">{t('auth.phone')}</span>
            <input type="tel" autoComplete="username" placeholder="98XXXXXXXX"
              value={form.phone} onChange={set('phone')} required />
          </label>
          <label className="field">
            <span className="field__label">{t('auth.password')}</span>
            <input type="password" autoComplete="current-password"
              value={form.password} onChange={set('password')} required />
          </label>

          {error && <p className="appt-error">{error}</p>}

          <button className="btn btn--red appt-submit" type="submit" disabled={busy}>
            {t('auth.loginBtn')}
          </button>
          <p className="auth-switch">
            {t('auth.noAccount')} <Link to="/register">{t('auth.toRegister')}</Link>
          </p>
        </form>
      </div>
    </main>
  )
}