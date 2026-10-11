import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useApp } from './AppContext'
import { Icon } from './Icons'
import { Hexbrow } from './Lib'

const SR = typeof window !== 'undefined'
  ? window.SpeechRecognition || window.webkitSpeechRecognition
  : null

export default function SymptomChecker() {
  const { t, lang } = useApp()
  const [text, setText] = useState('')
  const [busy, setBusy] = useState(false)
  const [result, setResult] = useState(null)   // { summary, note } | null
  const [error, setError] = useState('')
  const [listening, setListening] = useState(false)

  const recRef = useRef(null)
  const langRef = useRef(lang)
  langRef.current = lang

  useEffect(() => {
    if (!SR) return
    const rec = new SR()
    rec.interimResults = true
    rec.continuous = false
    rec.onresult = (e) => {
      let s = ''
      for (let i = e.resultIndex; i < e.results.length; i++) s += e.results[i][0].transcript
      setText(s)
    }
    rec.onend = () => setListening(false)
    rec.onerror = () => setListening(false)
    recRef.current = rec
    return () => { try { rec.abort() } catch { /* noop */ } }
  }, [])

  const toggleMic = () => {
    const rec = recRef.current
    if (!rec) return
    if (listening) { rec.stop(); return }
    rec.lang = langRef.current === 'ne' ? 'ne-NP' : 'en-US'
    try { rec.start(); setListening(true) } catch { /* already running */ }
  }

  const check = async () => {
    const body = text.trim()
    if (!body) { setError(t('sym.empty')); return }
    setError('')
    setBusy(true)
    setResult(null)
    try {
      // Reuse the same endpoint the chat widget uses — it already reads `lang`.
      const r = await fetch('/api/symptom-check/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ symptoms: body, message: body, lang }),
      })
      const data = await r.json()
      setResult({
        summary: data.result ?? data.reply ?? data.response ?? data.prediction ?? t('chat.demo'),
        note: t('sym.resultNote'),
      })
    } catch {
      setResult({ summary: t('chat.demo'), note: t('sym.resultNote') })
    } finally {
      setBusy(false)
    }
  }

  const examples = ['sym.eg1', 'sym.eg2', 'sym.eg3']

  return (
    <main className="page">
      <div className="wrap wrap--narrow">
        <div className="page__head page__head--center">
          <p className="eyebrow"><Hexbrow />{t('sym.title')}</p>
          <h1 className="page__title">{t('sym.title')}</h1>
          <p className="page__sub">{t('sym.sub')}</p>
        </div>

        <div className="sym__box">
          <textarea
            className="sym__input"
            rows={4}
            value={text}
            placeholder={t('sym.ph')}
            onChange={(e) => { setText(e.target.value); if (error) setError('') }}
          />
          {listening && (
            <div className="voice voice--inline">
              <span className="wave" aria-hidden="true"><i /><i /><i /><i /><i /></span>
              <span>{t('voice.listening')}</span>
              <span className="voice__lang">{lang === 'ne' ? 'नेपाली' : 'English'}</span>
            </div>
          )}
          <div className="sym__actions">
            <button
              type="button"
              className={`btn btn--ghost${listening ? ' is-on' : ''}`}
              disabled={!SR}
              title={!SR ? t('voice.unsupported') : undefined}
              onClick={toggleMic}
            >
              <Icon n="mic" /> {t('sym.mic')}
            </button>
            <button type="button" className="btn btn--red" disabled={busy} onClick={check}>
              <Icon n="steth" /> {busy ? t('sym.checking') : t('sym.submit')}
            </button>
          </div>
          {error && <p className="sym__error">{error}</p>}
        </div>

        {!result && !busy && (
          <div className="sym__egs">
            <p className="sym__egs-label">{t('sym.eg')}</p>
            <div className="sym__eg-list">
              {examples.map((k) => (
                <button type="button" key={k} className="sym__eg" onClick={() => setText(t(k))}>
                  {t(k)}
                </button>
              ))}
            </div>
          </div>
        )}

        {result && (
          <div className="sym__result">
            <p className="eyebrow"><Hexbrow blue />{t('sym.result')}</p>
            <div className="sym__result-body">{result.summary}</div>
            <p className="sym__result-note">{result.note}</p>
            <div className="sym__result-actions">
              <Link className="btn btn--red" to="/hospitals"><Icon n="hospital" /> {t('sym.findHosp')}</Link>
              <button className="btn btn--ghost" onClick={() => { setResult(null); setText('') }}>
                {t('sym.again')}
              </button>
            </div>
          </div>
        )}

        <p className="sym__disclaimer"><Icon n="shield" /> {t('sym.disclaimer')}</p>
      </div>
    </main>
  )
}