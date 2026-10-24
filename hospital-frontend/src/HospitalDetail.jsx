import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useApp } from './AppContext'
import { Icon } from './Icons'
import { HospitalArt } from './Art'
import { normalizeHospital, Hexbrow } from './Lib'

export default function HospitalDetail() {
  const { t } = useApp()
  const { id } = useParams()
  const [raw, setRaw] = useState(null)
  const [loading, setLoading] = useState(true)
  const [failed, setFailed] = useState(false)    // true = server problem, false = really not found

  useEffect(() => {
    let alive = true
    fetch(`/api/hospitals/${id}/`)
      .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
      .then((json) => {
        if (alive) { setRaw(json); setLoading(false) }
      })
      .catch((status) => {
        if (alive) { setRaw(null); setFailed(status !== 404); setLoading(false) }
      })
  }, [id])

  const hospital = raw ? normalizeHospital(raw) : null

  if (loading) {
    return <main className="page"><div className="wrap"><p className="results-count">{t('hosp.loading')}</p></div></main>
  }

  if (!hospital) {
    return (
      <main className="page">
        <div className="wrap">
          <Link className="det__back" to="/hospitals"><Icon n="left" /> {t('det.back')}</Link>
          <div className="empty"><p>{t(failed ? 'det.failed' : 'det.notfound')}</p></div>        </div>
      </main>
    )
  }

  const h = hospital
  const bedsAvail = h.beds ?? 0
  const bedsTotal = raw.total_beds || 1
  const bedsPct = Math.min(100, Math.round((bedsAvail / bedsTotal) * 100))

  return (
    <main className="page">
      <div className="wrap">
        <Link className="det__back" to="/hospitals"><Icon n="left" /> {t('det.back')}</Link>

        <div className="det__hero">
          <div className="det__media"><HospitalArt i={Number(id) % 5} /></div>
          <div className="det__intro">
            <span className={`tag${h.gov ? ' tag--gov' : ''}`}>{h.specialty ?? t('tag.multi')}</span>
            <h1 className="page__title">{h.name}</h1>
            <p className="hosp__loc det__loc"><Icon n="pin" /><span>{h.location}</span></p>
            {h.rating > 0 && (
              <p className="det__rate">
                <Icon n="star" /><b>{h.rating}</b>
                {h.reviews ? <span>{h.reviews} {t('det.reviews')}</span> : null}
              </p>
            )}
            <Link className="btn btn--red" to={`/appointments?hospital=${h.id}`}>
              <Icon n="cal" /> {t('det.book')}
            </Link>
          </div>
        </div>

        <div className="det__grid">
          <div className="det__main">
            <section className="det__block">
              <p className="eyebrow"><Hexbrow />{t('det.about')}</p>
              <p className="det__body">{h.description || t('det.aboutBody')}</p>
            </section>

                   {raw.services.length > 0 && (
              <section className="det__block">
                <p className="eyebrow"><Hexbrow />{t('det.services')}</p>
                <div className="det__chips">
                  {raw.services.map((s) => (
                    <span className="det__chip" key={s.id}>
                      <Icon n="steth" /> {s.name}
                    </span>
                  ))}
                </div>
              </section>
            )}

                        {raw.doctors.length > 0 && (
              <section className="det__block">
                <p className="eyebrow"><Hexbrow />{t('det.doctors')}</p>
                <div className="doc-grid">
                  {raw.doctors.map((d) => (
                    <article className="doc-card" key={d.id}>
                      <h3 className="doc-card__name">Dr. {d.name}</h3>
                      {d.specialty && <span className="tag">{d.specialty}</span>}
                      {d.available_days && (
                        <p className="doc-card__meta">
                          <Icon n="cal" />
                          <span>{d.available_days}</span>
                        </p>
                      )}
                      <Link className="btn btn--red doc-card__book" to={`/appointments?doctor=${d.id}`}>
                        <Icon n="cal" /> {t('doc.book')}
                      </Link>
                    </article>
                  ))}
                </div>
              </section>
            )}

            <section className="det__block">
              <p className="eyebrow"><Hexbrow />{t('det.beds')}</p>
              <div className="beds">
                <div className="beds__bar"><span style={{ width: `${bedsPct}%` }} /></div>
                <p className="beds__label"><b>{bedsAvail}</b> / {bedsTotal} {t('det.bedsAvail')}</p>
              </div>
            </section>
          </div>

          <aside className="det__side">
            <div className="det__card">
              <p className="eyebrow"><Hexbrow blue />{t('det.contact')}</p>
              <p className="det__contact"><Icon n="pin" /><span>{h.location}</span></p>
              {h.phone && <p className="det__contact"><Icon n="steth" /><span>{h.phone}</span></p>}
              <p className="det__contact"><Icon n="clock" /><span>{t('det.hours')}</span></p>
              <div className="det__map" role="img" aria-label={t('det.map')}>
                <Icon n="pin" />
                <span>{t('det.map')}</span>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  )
}