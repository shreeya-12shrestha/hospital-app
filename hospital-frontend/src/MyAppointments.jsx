import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useApp } from './AppContext'
import { Icon } from './Icons'
import { Hexbrow } from './Lib'

export default function MyAppointments() {
  const { t, token, user, authHeaders } = useApp()
  const [appts, setAppts] = useState(null)        // null = still loading

  useEffect(() => {
    if (!token) return
    let alive = true
    fetch('/api/my-appointments/', { headers: authHeaders() })
      .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
      .then((data) => { if (alive) setAppts(data) })
      .catch(() => { if (alive) setAppts([]) })
    return () => { alive = false }
    // authHeaders is rebuilt every render; the token is what actually matters
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token])

  if (!token) {
    return (
      <main className="page">
        <div className="wrap wrap--narrow">
          <div className="empty">
            <p>{t('my.loginFirst')}</p>
            <Link className="btn btn--red" to="/login">{t('auth.loginBtn')}</Link>
          </div>
        </div>
      </main>
    )
  }

  const today = new Date().toISOString().slice(0, 10)

  return (
    <main className="page">
      <div className="wrap wrap--narrow">
        <div className="page__head">
          <p className="eyebrow"><Hexbrow />{t('menu.appts')}</p>
          <h1 className="page__title">{user ? `${t('my.hello')}, ${user.name}` : t('menu.appts')}</h1>
          {user && <p className="page__sub">{user.phone}</p>}
        </div>

        {appts === null && <p className="page__sub">{t('my.loading')}</p>}

        {appts && appts.length === 0 && (
          <div className="empty">
            <p>{t('my.none')}</p>
            <Link className="btn btn--red" to="/hospitals">{t('my.findHospital')}</Link>
          </div>
        )}

        {appts && appts.length > 0 && (
          <ul className="my-appts">
            {appts.map((a) => (
              <li className="my-appt" key={a.id}>
                <div className="my-appt__when">
                  <Icon n="cal" />
                  <b>{a.date}</b> · {a.time_slot}
                  {a.date < today && <span className="tag">{t('my.past')}</span>}
                </div>
                <p className="my-appt__who">
                  {a.doctor_name ? `Dr. ${a.doctor_name} · ` : ''}{a.hospital_name}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  )
}