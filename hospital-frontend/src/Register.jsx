import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useApp } from './AppContext'
import { Hexbrow } from './Lib'

export default function Register() {
  const { t, signIn } = useApp()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', phone: '', password: '' })
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))

  const submit = async (e) => {
    e.preventDefault()
    setBusy(true)
    setError('')
    try {
      const r = await fetch('/api/register/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await r.json()
      // DRF sends field errors like { phone: ["..."], password: ["...", "..."] }
      if (!r.ok) throw new Error(Object.values(data).flat().join(' ') || t('auth.failed'))
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
          <h1 className="page__title">{t('auth.registerTitle')}</h1>
          <p className="page__sub">{t('auth.registerSub')}</p>
        </div>

        <form className="appt-form" onSubmit={submit}>
          <label className="field">
            <span className="field__label">{t('auth.name')}</span>
            <input type="text" autoComplete="name"
              value={form.name} onChange={set('name')} required />
          </label>
          <label className="field">
            <span className="field__label">{t('auth.phone')}</span>
            <input type="tel" autoComplete="username" placeholder="98XXXXXXXX"
              value={form.phone} onChange={set('phone')} required />
          </label>
          <label className="field">
            <span className="field__label">{t('auth.password')} <em>{t('auth.passwordHint')}</em></span>
            <input type="password" autoComplete="new-password" minLength={8}
              value={form.password} onChange={set('password')} required />
          </label>

          {error && <p className="appt-error">{error}</p>}

          <button className="btn btn--red appt-submit" type="submit" disabled={busy}>
            {t('auth.registerBtn')}
          </button>
          <p className="auth-switch">
            {t('auth.haveAccount')} <Link to="/login">{t('auth.toLogin')}</Link>
          </p>
        </form>
      </div>
    </main>
  )
}