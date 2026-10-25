import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useApp } from './AppContext'
import { Icon } from './Icons'
import { Hexbrow } from './Lib'

function initials(name) {
  return name.replace(/^Dr\.?\s*/, '').split(' ').map((w) => w[0]).slice(0, 2).join('')
}

export default function Doctors() {
  const { t } = useApp()
  const [q, setQ] = useState('')
  const [spec, setSpec] = useState('')
  const [raw, setRaw] = useState(null)     // API rows, or null while loading
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let alive = true
    fetch('/api/doctors/')
      .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
      .then((json) => {
        const list = Array.isArray(json) ? json : json.results ?? []
        if (alive) { setRaw(list); setLoading(false) }
      })
      .catch(() => alive && (setRaw([]), setLoading(false)))
    return () => { alive = false }
  }, [])

  const doctors = useMemo(() => (raw ?? []).map((d) => ({
    id: d.id,
    name: d.name,
    specialty: d.specialty ?? '',
    hospital: d.hospital_name ?? '',
    days: d.available_days ?? '',
  })), [raw])
  const specs = useMemo(
    () => [...new Set(doctors.map((d) => d.specialty).filter(Boolean))].sort(),
    [doctors],
  )

  const shown = useMemo(() => doctors.filter((d) => {
    const hay = `${d.name} ${d.specialty}`.toLowerCase()
    if (q && !hay.includes(q.toLowerCase())) return false
    if (spec && d.specialty !== spec) return false
    return true
  }), [doctors, q, spec])

  return (
    <main className="page">
      <div className="wrap">
        <div className="page__head">
          <p className="eyebrow"><Hexbrow />{t('doc.title')}</p>
          <h1 className="page__title">{t('doc.title')}</h1>
          <p className="page__sub">{t('doc.sub')}</p>
        </div>

        <div className="toolbar">
          <div className="toolbar__search">
            <Icon n="users" />
            <input type="text" value={q} placeholder={t('doc.search')} onChange={(e) => setQ(e.target.value)} />
          </div>
          <select value={spec} onChange={(e) => setSpec(e.target.value)} aria-label={t('doc.spec')}>
            <option value="">{t('doc.spec')}</option>
            {specs.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        {loading ? (
          <p className="results-count">{t('doc.loading')}</p>
        ) : shown.length === 0 ? (
          <div className="empty"><p>{t('doc.none')}</p></div>
        ) : (
          <div className="doc-grid">
            {shown.map((d) => (
              <article className="doc-card" key={d.id}>
                <div className="doc-card__top">
                  <span className="doc-card__ava">{initials(d.name)}</span>
                </div>
                <h3 className="doc-card__name">Dr. {d.name}</h3>
                {d.specialty && <span className="tag">{d.specialty}</span>}
                {d.hospital && (
                  <p className="doc-card__meta">
                    <Icon n="hospital" />
                    <span>{d.hospital}</span>
                  </p>
                )}
                {d.days && (
                  <p className="doc-card__meta">
                    <Icon n="cal" />
                    <span>{d.days}</span>
                  </p>
                )}
                <Link className="btn btn--red doc-card__book" to={`/appointments?doctor=${d.id}`}>
                  <Icon n="cal" /> {t('doc.book')}
                </Link>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}