import { useEffect, useRef, useState } from 'react'
import { useApp } from './AppContext'
import { Icon } from './Icons'

const SR = typeof window !== 'undefined'
  ? window.SpeechRecognition || window.webkitSpeechRecognition
  : null

export default function ChatWidget() {
  const { t, lang } = useApp()
  const [open, setOpen] = useState(true)
  const [msgs, setMsgs] = useState([])          // [{ me: bool, text: string }]
  const [draft, setDraft] = useState('')
  const [listening, setListening] = useState(false)
  const [busy, setBusy] = useState(false)

  const bodyRef = useRef(null)
  const inputRef = useRef(null)
  const recRef = useRef(null)
  const langRef = useRef(lang)
  langRef.current = lang                         // recognition reads this at start time

  // keep the transcript pinned to the newest message
  useEffect(() => {
    const b = bodyRef.current
    if (b) b.scrollTop = b.scrollHeight
  }, [msgs, busy])

  // ---- speech recognition: one instance, locale set per start ----
  useEffect(() => {
    if (!SR) return
    const rec = new SR()
    rec.interimResults = true
    rec.continuous = false
    rec.onresult = (e) => {
      let text = ''
      for (let i = e.resultIndex; i < e.results.length; i++) text += e.results[i][0].transcript
      setDraft(text)
    }
    rec.onend = () => setListening(false)
    rec.onerror = () => setListening(false)
    recRef.current = rec
    return () => { try { rec.abort() } catch { /* already stopped */ } }
  }, [])

  const toggleMic = () => {
    const rec = recRef.current
    if (!rec) return
    if (listening) { rec.stop(); return }
    // ne-NP and en-US are the two recognition locales
    rec.lang = langRef.current === 'ne' ? 'ne-NP' : 'en-US'
    try { rec.start(); setListening(true) } catch { /* start() while already running */ }
  }

  const send = async (textArg) => {
    const text = (textArg ?? draft).trim()
    if (!text || busy) return
    setMsgs((m) => [...m, { me: true, text }])
    setDraft('')
    setBusy(true)
    try {
      const r = await fetch('/api/chat/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // lang travels with the message so Gemini answers in the language spoken
        body: JSON.stringify({ message: text, lang, history: msgs.slice(-10) }),
      })
      const data = await r.json()
      setMsgs((m) => [...m, { me: false, text: data.reply ?? data.response ?? data.message ?? t('chat.demo') }])
    } catch {
      setMsgs((m) => [...m, { me: false, text: t('chat.demo') }])
    } finally {
      setBusy(false)
    }
  }

  const quick = ['chat.q1', 'chat.q2', 'chat.q3', 'chat.q4']

  return (
    <>
      <aside className={`chat${open ? '' : ' is-hidden'}`} aria-label={t('chat.title')}>
        <div className="chat__head">
          <span className="chat__ava"><Icon n="spark" /></span>
          <div>
            <strong>{t('chat.title')}</strong>
            <span>{t('chat.status')}</span>
          </div>
          <button className="chat__close" aria-label={t('a11y.close')} onClick={() => setOpen(false)}>
            <Icon n="x" />
          </button>
        </div>

        <div className="chat__body" ref={bodyRef}>
          <div className="bubble">{t('chat.greeting')}</div>

          {msgs.map((m, i) => (
            <div className={`bubble${m.me ? ' bubble--me' : ''}`} key={i}>{m.text}</div>
          ))}
          {busy && <div className="bubble bubble--typing"><i /><i /><i /></div>}

          {msgs.length === 0 && (
            <>
              <p className="chat__label">{t('chat.quick')}</p>
              <div className="quick">
                {quick.map((k) => (
                  <button type="button" key={k} onClick={() => send(t(k))}>{t(k)}</button>
                ))}
              </div>
              <p className="voice-hint">
                <Icon n="mic" />
                <span>{t('chat.voicehint')}</span>
              </p>
            </>
          )}
        </div>

        <div className="chat__foot">
          {listening && (
            <div className="voice">
              <span className="wave" aria-hidden="true"><i /><i /><i /><i /><i /></span>
              <span>{t('voice.listening')}</span>
              <span className="voice__lang">{lang === 'ne' ? 'नेपाली' : 'English'}</span>
            </div>
          )}

          <div className="chat__input">
            <label htmlFor="chatInput" className="sr">{t('chat.label')}</label>
            <input
              id="chatInput"
              ref={inputRef}
              type="text"
              value={draft}
              placeholder={t('chat.ph')}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && send()}
            />
            <button
              className={`mic${listening ? ' is-on' : ''}`}
              disabled={!SR}
              title={!SR ? t('voice.unsupported') : undefined}
              aria-pressed={listening}
              aria-label={t(listening ? 'a11y.micStop' : 'a11y.mic')}
              onClick={toggleMic}
            >
              <Icon n="mic" />
            </button>
            <button className="chat__send" aria-label={t('a11y.send')} onClick={() => send()}>
              <Icon n="send" />
            </button>
          </div>

          <p className="chat__note">{t('chat.note')}</p>
        </div>
      </aside>

      <button className="launcher" aria-label={t('a11y.open')} onClick={() => setOpen((v) => !v)}>
        <Icon n="chat" />
        <span className="dot" />
      </button>
    </>
  )
}