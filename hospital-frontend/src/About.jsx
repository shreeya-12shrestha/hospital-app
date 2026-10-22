import { useApp } from './AppContext'
import { Hexbrow } from './Lib'

const REPO = 'https://github.com/shreeya-12shrestha/hospital-app'

export default function About() {
  const { t } = useApp()
  const what = ['about.what1', 'about.what2', 'about.what3', 'about.what4']

  return (
    <main className="page">
      <div className="wrap wrap--narrow">
        <div className="page__head">
          <p className="eyebrow"><Hexbrow />{t('about.eyebrow')}</p>
          <h1 className="page__title">{t('about.title')}</h1>
          <p className="page__sub">{t('about.sub')}</p>
        </div>

        <section className="about">
          <h2>{t('about.whatTitle')}</h2>
          <ul>
            {what.map((k) => <li key={k}>{t(k)}</li>)}
          </ul>

          <h2>{t('about.techTitle')}</h2>
          <p>{t('about.tech')}</p>

          <h2>{t('about.teamTitle')}</h2>
          <p>{t('about.team')}</p>

          <a className="btn btn--red" href={REPO} target="_blank" rel="noreferrer">
            {t('about.code')}
          </a>
          <p className="about__note">{t('sym.disclaimer')}</p>
        </section>
      </div>
    </main>
  )
}