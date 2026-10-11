import { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useApp } from './AppContext'
import { Icon } from './Icons'
import { Hexbrow } from './Lib'

// Fixed time slots the user picks from — stored as text in the model.
const SLOTS = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '12:00', '14:00', '14:30', '15:00', '15:30', '16:00',
]

export default function Appointments() {
  const { t, lang } = useApp()
  const [params] = useSearchParams()
  const doctorId = params.get('doctor')
  const hospitalParam = params.get('hospital')

  // context we display + the hospital id we must send
  const [ctx, setCtx] = useState({ doctorName: '', hospitalName: '', hospitalId: hospitalParam || '' })

  const [form, setForm] = useState({ patient_name: '', phone: '', date: '', time_slot: '', note: '' })
  const [status, setStatus] = useState('idle')   // idle | sending | done | error
  const [errorMsg, setErrorMsg] = useState('')

  // Resolve the hospital id + display names from whatever was passed in the URL.
  useEffect(() => {
    let alive = true
    async function resolve() {
      try {
        if (doctorId) {
          const r = await fetch('/api/doctors/')
          const docs = await r.json()
          const d = (Array.isArray(docs) ? docs : []).find((x) => String(x.id) === String(doctorId))
          if (d && alive) {
            setCtx({ doctorName: d.name, hospitalName: d.hospital_name || '', hospitalId: d.hospital })
            return
          }
        }
        if (hospitalParam) {
          const r = await fetch('/api/hospitals/')
          const hs = await r.json()
          const h = (Array.isArray(hs) ? hs : []).find((x) => String(x.id) === String(hospitalParam))
          if (h && alive) setCtx({ doctorName: '', hospitalName: h.name, hospitalId: h.id })
        }
      } catch {
        /* leave ctx as-is; the guard below handles a missing hospital id */
      }
    }
    resolve()
    return () => { alive = false }
  }, [doctorId, hospitalParam])

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const today = useMemo(() => new Date().toISOString().slice(0, 10), [])

  async function submit() {
    setErrorMsg('')
    // client-side check for the required fields
    if (!form.patient_name.trim() || !form.phone.trim() || !form.date || !form.time_slot) {
      setErrorMsg(t('appt.required'))
      return
    }
    if (!ctx.hospitalId) {
      setErrorMsg(t('appt.noHospital'))
      return
    }
    setStatus('sending')
    try {
      const body = {
        hospital: ctx.hospitalId,
        patient_name: form.patient_name.trim(),
        phone: form.phone.trim(),
        date: form.date,
        time_slot: form.time_slot,
        note: form.note.trim(),
      }
      if (doctorId) body.doctor = doctorId

      const r = await fetch('/api/appointments/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      if (!r.ok) {
        const data = await r.json().catch(() => ({}))
        // surface the first field error DRF returns, if any
        const first = Object.values(data)[0]
        throw new Error(Array.isArray(first) ? first[0] : t('appt.failed'))
      }
      setStatus('done')
    } catch (err) {
      setStatus('error')
      setErrorMsg(err.message || t('appt.failed'))
    }
  }

  // success screen
  if (status === 'done') {
    return (
      <main className="page">
        <div className="wrap wrap--narrow">
          <div className="appt-done">
            <span className="appt-done__tick"><Icon n="check" /></span>
            <h1 className="page__title">{t('appt.doneTitle')}</h1>
            <p className="page__sub">{t('appt.doneBody')}</p>
            <div className="appt-done__actions">
              <Link className="btn btn--red" to="/hospitals"><Icon n="hospital" /> {t('appt.backHosp')}</Link>
              <Link className="btn btn--ghost" to="/">{t('appt.home')}</Link>
            </div>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="page">
      <div className="wrap wrap--narrow">
        <div className="page__head">
          <p className="eyebrow"><Hexbrow />{t('appt.title')}</p>
          <h1 className="page__title">{t('appt.title')}</h1>
          {(ctx.doctorName || ctx.hospitalName) && (
            <p className="page__sub">
              {ctx.doctorName && <>Dr. {ctx.doctorName}{ctx.hospitalName ? ` · ${ctx.hospitalName}` : ''}</>}
              {!ctx.doctorName && ctx.hospitalName}
            </p>
          )}
        </div>

        <div className="appt-form">
          <label className="field">
            <span className="field__label">{t('appt.name')}</span>
            <input type="text" value={form.patient_name} onChange={set('patient_name')} placeholder={t('appt.namePh')} />
          </label>

          <label className="field">
            <span className="field__label">{t('appt.phone')}</span>
            <input type="tel" value={form.phone} onChange={set('phone')} placeholder={t('appt.phonePh')} />
          </label>

          <div className="field-row">
            <label className="field">
              <span className="field__label">{t('appt.date')}</span>
              <input type="date" value={form.date} min={today} onChange={set('date')} />
            </label>

            <label className="field">
              <span className="field__label">{t('appt.time')}</span>
              <select value={form.time_slot} onChange={set('time_slot')}>
                <option value="">{t('appt.timePick')}</option>
                {SLOTS.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </label>
          </div>

          <label className="field">
            <span className="field__label">{t('appt.note')} <em>{t('appt.optional')}</em></span>
            <textarea rows={3} value={form.note} onChange={set('note')} placeholder={t('appt.notePh')} />
          </label>

          {errorMsg && <p className="appt-error">{errorMsg}</p>}

          <button className="btn btn--red appt-submit" disabled={status === 'sending'} onClick={submit}>
            <Icon n="cal" /> {status === 'sending' ? t('appt.sending') : t('appt.submit')}
          </button>
        </div>
      </div>
    </main>
  )
}