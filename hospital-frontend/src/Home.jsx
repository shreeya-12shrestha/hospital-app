import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useApp } from './AppContext'
import { Icon } from './Icons'
import { HospitalArt, DoctorArt, HospitalCtaArt } from './Art'

const Pennant = ({ blue }) => (
  <svg className={`pennant${blue ? ' pennant--blue' : ''}`} viewBox="0 0 13 17" aria-hidden="true">
    <path d="M0 0h13L4.5 7H13L0 17z" />
  </svg>
)

export default function Home() {
  const { t } = useApp()
  const [hospitals, setHospitals] = useState(null)   // null = still loading
  const railRef = useRef(null)

  useEffect(() => {
    let alive = true
    fetch('/api/hospitals/?promoted=true')
      .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
      .then((data) => {
        const list = Array.isArray(data) ? data : data.results ?? []
        if (alive) setHospitals(list)
      })
      .catch(() => alive && setHospitals([]))   // API down → the promoted section stays hidden
    return () => { alive = false }
  }, [])

  const cards = hospitals ?? []

  const scrollRail = (dir) => {
    const rail = railRef.current
    const card = rail?.querySelector('.hosp')
    rail?.scrollBy({ left: dir * ((card?.offsetWidth ?? 292) + 22), behavior: 'smooth' })
  }

  return (
    <main id="top">
      {/* ============================ PROMOTED HOSPITALS ============================ */}
      {cards.length > 0 && (
        <section className="promo" id="hospitals">
          <div className="wrap">
            <div className="promo__head">
              <div>
                <p className="eyebrow"><Pennant />{t('promo.eyebrow')}</p>
                <h2 className="h2">{t('promo.title')}</h2>
                <p className="lede">{t('promo.sub')}</p>
              </div>
              <Link className="promo__viewall" to="/hospitals">
                {t('promo.viewall')} <Icon n="arrow" />
              </Link>
            </div>

            <div className="rail-shell">
              <div className="rail-nav">
                <button className="rail-btn" aria-label={t('a11y.prev')} onClick={() => scrollRail(-1)}>
                  <Icon n="left" />
                </button>
                <button className="rail-btn" aria-label={t('a11y.next')} onClick={() => scrollRail(1)}>
                  <Icon n="right" />
                </button>
              </div>

              <div className="rail" ref={railRef} tabIndex={0} aria-label={t('promo.title')}>
                {cards.map((h, i) => (
                  <article className="hosp" key={h.id ?? i}>
                    <div className="hosp__media"><HospitalArt i={i} /></div>
                    <span className="hosp__badge">{t('promo.badge')}</span>
                    <div className="hosp__body">
                      <h3 className="hosp__name">{h.name}</h3>
                      <p className="hosp__loc">
                        <Icon n="pin" />
                        <span>{h.location ?? h.address ?? ''}</span>
                      </p>
                      <div className="hosp__foot">
                        <span className="rate">
                          <Icon n="star" />
                          <b>{h.rating ?? '—'}</b>
                          {h.reviews ? <span>({h.reviews})</span> : null}
                        </span>
                        <span className={`tag${h.gov ? ' tag--gov' : ''}`}>
                          {h.tag ?? h.specialty ?? (h.beds ? `${h.beds} beds` : t('tag.multi'))}
                        </span>
                      </div>
                      <Link className="hosp__link" to={`/hospitals/${h.id}`}>
                        {t('promo.viewall')} <Icon n="arrow" />
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ==================================== HERO ==================================== */}
      <section className="hero">
        <div className="wrap hero__in">
          <div>
            <p className="eyebrow"><Pennant blue />{t('hero.eyebrow')}</p>
            <h1 dangerouslySetInnerHTML={{ __html: t('hero.title') }} />
            <p>{t('hero.body')}</p>
            <div className="hero__cta">
              <Link className="btn btn--red" to="/symptom-check">
                <Icon n="steth" /> {t('hero.cta1')}
              </Link>
              <Link className="btn btn--ghost" to="/hospitals">
                <Icon n="hospital" /> {t('hero.cta2')}
              </Link>
            </div>
            <p className="hero__note"><Icon n="check" /> {t('hero.note')}</p>
          </div>

          <div className="stage">
            <span className="blob blob--a" />
            <span className="blob blob--b" />
            <span className="blob blob--c" />
            <DoctorArt />

            <div className="float float--1">
              <i><Icon n="spark" /></i>
              <span>{t('float.1a')}<small>{t('float.1b')}</small></span>
            </div>
            <div className="float float--2">
              <i><Icon n="shield" /></i>
              <span>{t('float.2a')}<small>{t('float.2b')}</small></span>
            </div>
            <div className="float float--3">
              <i><Icon n="cal" /></i>
              <span>{t('float.3a')}<small>{t('float.3b')}</small></span>
            </div>
          </div>
        </div>
      </section>

      {/* ================================ TRUST STRIP ================================ */}
      <section className="trust section--tight" id="about">
        <div className="wrap trust__grid">
          {[
            ['shield', 'trust.1a', 'trust.1b'],
            ['spark', 'trust.2a', 'trust.2b'],
            ['bolt', 'trust.3a', 'trust.3b'],
            ['lock', 'trust.4a', 'trust.4b'],
          ].map(([icon, a, b]) => (
            <div className="trust-card" key={a}>
              <i><Icon n={icon} /></i>
              <h3>{t(a)}</h3>
              <p>{t(b)}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ================================== SERVICES ================================== */}
      <section className="section" id="services">
        <div className="wrap">
          <div className="svc__head">
            <div>
              <p className="eyebrow"><Pennant />{t('svc.eyebrow')}</p>
              <h2 className="h2">{t('svc.title')}</h2>
              <p className="lede">{t('svc.sub')}</p>
            </div>
            <a className="btn btn--ghost" href="#services">
              {t('svc.explore')} <Icon n="arrow" />
            </a>
          </div>

          <div className="svc__grid">
            {[
              ['steth', 'svc.1a', 'svc.1b', '/symptom-check'],
              ['hospital', 'svc.2a', 'svc.2b', '/hospitals'],
              ['cal', 'svc.3a', 'svc.3b', '/appointments'],
              ['file', 'svc.4a', 'svc.4b', '/my-appointments'],            ].map(([icon, a, b, to]) => (
              <Link className="svc-card" to={to} key={a}>
                <i><Icon n={icon} /></i>
                <div>
                  <h3>{t(a)}</h3>
                  <p>{t(b)}</p>
                </div>
                <span className="svc-card__go"><Icon n="arrow" /></span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* =================================== STATS =================================== */}
      <section className="stats section--tight" id="doctors">
        <div className="wrap stats__grid">
          {[
            ['hospital', 'stat.1n', 'stat.1a'],
            ['users', 'stat.2n', 'stat.2a'],
            ['heart', 'stat.3n', 'stat.3a'],
            ['clock', 'stat.4n', 'stat.4a'],
          ].map(([icon, n, label]) => (
            <div className="stat" key={n}>
              <i><Icon n={icon} /></i>
              <b>{t(n)}</b>
              <span>{t(label)}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ================================= FINAL CTA ================================= */}
      <section className="final" id="contact">
        <div className="wrap">
          <div className="final__card">
            <HospitalCtaArt />
            <div>
              <p className="eyebrow"><Pennant blue />{t('final.eyebrow')}</p>
              <h2>{t('final.title')}</h2>
              <p>{t('final.body')}</p>
              <Link className="btn btn--red" to="/symptom-check">
                {t('final.cta')} <Icon n="arrow" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <footer className="foot">
        <div className="wrap foot__in">
          <span>{t('foot.copy')}</span>
          <nav aria-label="Footer">
            <Link to="/about">{t('foot.about')}</Link>
            <a href="https://github.com/shreeya-12shrestha/hospital-app" target="_blank" rel="noreferrer">GitHub</a>
          </nav>
        </div>
      </footer>
    </main>
  )
}