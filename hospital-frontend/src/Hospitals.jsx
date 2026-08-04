import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useApp } from './AppContext'
import { Icon } from './Icons'
import { HospitalArt } from './Art'
import { useHospitals, normalizeHospital, Hexbrow } from './lib'

// When the API has no rows yet, fall back to the five designed demo hospitals
// so the page never looks broken while the backend is still being filled.
function demoHospitals(t) {
  return [1, 2, 3, 4, 5].map((n) => ({
    id: `demo-${n}`,
    name: t(`h${n}.name`),
    location: t(`h${n}.loc`),
    city: t(`h${n}.loc`).split(',').pop().trim(),
    rating: [4.8, 4.6, 4.7, 4.5, 4.4][n - 1],
    reviews: ['312', '198', '864', '1,204', '503'][n - 1],
    specialty: t(n === 4 ? 'tag.gov' : n === 5 ? 'tag.cardio' : 'tag.multi'),
    gov: n === 4,
    demo: true,
  }))
}

export default function Hospitals() {
  const { t } = useApp()
  const { data, loading } = useHospitals()

  const [q, setQ] = useState('')
  const [city, setCity] = useState('')
  const [spec, setSpec] = useState('')
  const [sort, setSort] = useState('rating')

  const list = useMemo(() => {
    const source = data && data.length ? data.map(normalizeHospital) : demoHospitals(t)
    return source
  }, [data, t])

  // Build filter dropdowns from whatever the data actually contains.
  const cities = useMemo(
    () => [...new Set(list.map((h) => h.city).filter(Boolean))].sort(),
    [list],
  )
  const specs = useMemo(
    () => [...new Set(list.map((h) => h.specialty).filter(Boolean))].sort(),
    [list],
  )

  const shown = useMemo(() => {
    let r = list.filter((h) => {
      if (q && !h.name.toLowerCase().includes(q.toLowerCase())) return false
      if (city && h.city !== city) return false
      if (spec && h.specialty !== spec) return false
      return true
    })
    r = [...r].sort((a, b) => {
      if (sort === 'name') return a.name.localeCompare(b.name)
      if (sort === 'reviews') return (parseInt(b.reviews) || 0) - (parseInt(a.reviews) || 0)
      return (b.rating ?? 0) - (a.rating ?? 0) // rating
    })
    return r
  }, [list, q, city, spec, sort])

  const hasFilters = q || city || spec
  const clear = () => { setQ(''); setCity(''); setSpec('') }

  return (
    <main className="page">
      <div className="wrap">
        <div className="page__head">
          <p className="eyebrow"><Hexbrow />{t('hosp.title')}</p>
          <h1 className="page__title">{t('hosp.title')}</h1>
          <p className="page__sub">{t('hosp.sub')}</p>
        </div>

        <div className="toolbar">
          <div className="toolbar__search">
            <Icon n="hospital" />
            <input
              type="text"
              value={q}
              placeholder={t('hosp.search')}
              onChange={(e) => setQ(e.target.value)}
            />
          </div>
          <select value={city} onChange={(e) => setCity(e.target.value)} aria-label={t('hosp.city')}>
            <option value="">{t('hosp.city')}</option>
            {cities.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <select value={spec} onChange={(e) => setSpec(e.target.value)} aria-label={t('hosp.spec')}>
            <option value="">{t('hosp.spec')}</option>
            {specs.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          <select value={sort} onChange={(e) => setSort(e.target.value)} aria-label={t('hosp.sort')}>
            <option value="rating">{t('hosp.sortRating')}</option>
            <option value="reviews">{t('hosp.sortReviews')}</option>
            <option value="name">{t('hosp.sortName')}</option>
          </select>
        </div>

        <p className="results-count">
          {loading
            ? t('hosp.loading')
            : `${shown.length} ${shown.length === 1 ? t('hosp.count1') : t('hosp.count')}`}
        </p>

        {shown.length === 0 && !loading ? (
          <div className="empty">
            <p>{t('hosp.none')}</p>
            {hasFilters && (
              <button className="btn btn--ghost" onClick={clear}>{t('hosp.clear')}</button>
            )}
          </div>
        ) : (
          <div className="hosp-grid">
            {shown.map((h, i) => (
              <article className="hosp" key={h.id}>
                <div className="hosp__media"><HospitalArt i={i} /></div>
                <span className="hosp__badge">{t('promo.badge')}</span>
                <div className="hosp__body">
                  <h3 className="hosp__name">{h.name}</h3>
                  <p className="hosp__loc"><Icon n="pin" /><span>{h.location}</span></p>
                  <div className="hosp__foot">
                    <span className="rate">
                      <Icon n="star" /><b>{h.rating ?? '—'}</b>
                      {h.reviews ? <span>({h.reviews})</span> : null}
                    </span>
                    <span className={`tag${h.gov ? ' tag--gov' : ''}`}>
                      {h.specialty ?? t('tag.multi')}
                    </span>
                  </div>
                  {!h.demo && (
                    <Link className="hosp__link" to={`/hospitals/${h.id}`}>
                      {t('hosp.view')} <Icon n="arrow" />
                    </Link>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}