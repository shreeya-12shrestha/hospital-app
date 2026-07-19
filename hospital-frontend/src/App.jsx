import { useState, useEffect } from 'react'

function capacityInfo(h) {
  const total = h.total_beds || 0
  const avail = h.available_beds || 0
  const ratio = total > 0 ? avail / total : 0
  if (ratio >= 0.4) return { cls: 'ok', label: 'Beds open', pct: ratio * 100 }
  if (ratio > 0)    return { cls: 'warn', label: 'Filling fast', pct: ratio * 100 }
  return { cls: 'crit', label: 'Full', pct: 100 }
}

function App() {
  const [hospitals, setHospitals] = useState([])
  const [status, setStatus] = useState('loading')

  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/hospitals/')
      .then(res => res.json())
      .then(data => { setHospitals(data); setStatus('ready') })
      .catch(() => setStatus('error'))
  }, [])

  return (
    <>
      <nav className="nav">
        <div className="wrap nav-inner">
          <div className="logo">Aarogya<span>+</span></div>
          <div className="nav-links">
            <a href="#">Hospitals</a>
            <a href="#">Symptom Check</a>
            <a href="#">Chat</a>
          </div>
        </div>
      </nav>

      <header className="wrap hero">
        <div className="eyebrow">Live network</div>
        <h1>Find care, right now.</h1>
        <p className="sub">Real-time bed availability and AI-guided symptom checks, in one place.</p>
      </header>

      <main className="wrap">
        {status === 'loading' && <p className="status">Checking live availability…</p>}

        {status === 'error' && (
          <div className="notice">
            Can't reach the server. Make sure the backend is running on port 8000.
          </div>
        )}

        {status === 'ready' && hospitals.length === 0 && (
          <div className="notice">No hospitals yet — add one from the Django admin to see it here.</div>
        )}

        {status === 'ready' && (
          <section className="grid">
            {hospitals.map((h, i) => {
              const cap = capacityInfo(h)
              return (
                <article className="card" key={h.id} style={{ animationDelay: `${i * 60}ms` }}>
                  <h2>{h.name}</h2>
                  <p className="meta">{h.address}</p>
                  <p className="meta">{h.phone}</p>
                  <div className="capacity">
                    <div className="cap-row">
                      <span>Available beds</span>
                      <span className="cap-num">{h.available_beds} / {h.total_beds}</span>
                    </div>
                    <div className="bar"><i className={cap.cls} style={{ width: `${cap.pct}%` }} /></div>
                    <span className={`chip ${cap.cls}`}>{cap.label}</span>
                  </div>
                </article>
              )
            })}
          </section>
        )}
      </main>
    </>
  )
}

export default App