import { useState } from 'react'
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import { useApp } from './AppContext'
import { Icon } from './Icons'
import { Hexbrow } from './Lib'

// used when the browser can't (or won't) share the location — central Pokhara
const SAMPLE = { lat: 28.2096, lng: 83.9856 }

export default function Ambulance() {
  const { t } = useApp()
  const [pos, setPos] = useState(null)            // the patient's location
  const [list, setList] = useState([])
  const [status, setStatus] = useState('idle')    // idle | locating | loading | done | denied | error

  const search = async (where) => {
    setPos(where)
    setStatus('loading')
    try {
      const r = await fetch(`/api/ambulances/nearby/?lat=${where.lat}&lng=${where.lng}`)
      if (!r.ok) throw new Error(r.status)
      setList(await r.json())
      setStatus('done')
    } catch {
      setStatus('error')
    }
  }

  const locate = () => {
    if (!navigator.geolocation) { setStatus('denied'); return }
    setStatus('locating')
    navigator.geolocation.getCurrentPosition(
      (p) => search({ lat: p.coords.latitude, lng: p.coords.longitude }),
      () => setStatus('denied'),
      { enableHighAccuracy: true, timeout: 10000 },
    )
  }

  return (
    <main className="page">
      <div className="wrap wrap--narrow">
        <div className="page__head">
          <p className="eyebrow"><Hexbrow />{t('amb.eyebrow')}</p>
          <h1 className="page__title">{t('amb.title')}</h1>
          <p className="page__sub">{t('amb.sub')}</p>
        </div>

        <a className="sos" href="tel:102">
          <Icon n="bolt" />
          <span><b>{t('amb.sosTitle')}</b> {t('amb.sosBody')}</span>
        </a>

        <div className="amb-actions">
          <button className="btn btn--red" onClick={locate} disabled={status === 'locating' || status === 'loading'}>
            <Icon n="pin" /> {t('amb.find')}
          </button>
          <button className="btn btn--ghost" onClick={() => search(SAMPLE)}>
            {t('amb.sample')}
          </button>
        </div>

        {status === 'locating' && <p className="page__sub">{t('amb.locating')}</p>}
        {status === 'denied' && <p className="appt-error">{t('amb.denied')}</p>}
        {status === 'error' && <p className="appt-error">{t('amb.error')}</p>}

        {pos && (
          <div className="amb-map">
            <MapContainer key={`${pos.lat},${pos.lng}`} center={[pos.lat, pos.lng]} zoom={13} scrollWheelZoom={false}>
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <CircleMarker center={[pos.lat, pos.lng]} radius={9} pathOptions={{ color: '#003893', fillOpacity: 0.9 }}>
                <Popup>{t('amb.you')}</Popup>
              </CircleMarker>
              {list.map((a) => (
                <CircleMarker key={a.id} center={[a.latitude, a.longitude]} radius={9}
                  pathOptions={{ color: '#DC143C', fillOpacity: 0.9 }}>
                  <Popup>{a.name}<br />{a.distance_km} km</Popup>
                </CircleMarker>
              ))}
            </MapContainer>
          </div>
        )}

        {status === 'done' && list.length === 0 && (
          <div className="empty"><p>{t('amb.none')}</p></div>
        )}

        {list.length > 0 && (
          <ul className="my-appts">
            {list.map((a) => (
              <li className="my-appt amb" key={a.id}>
                <div>
                  <div className="my-appt__when"><b>{a.name}</b></div>
                  <p className="my-appt__who">
                    {a.hospital ? `${a.hospital} · ` : ''}{a.distance_km} km {t('amb.away')}
                  </p>
                </div>
                <a className="btn btn--red amb__call" href={`tel:${a.phone}`}>{t('amb.call')}</a>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  )
}