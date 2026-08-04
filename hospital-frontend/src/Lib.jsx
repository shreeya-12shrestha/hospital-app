import { useEffect, useState } from 'react'

// One shared fetch for the hospitals list, reused by Hospitals, Doctors and Detail.
// Returns { data, loading, error }. On failure data stays null so callers can
// decide whether to show demo content or an empty state.
export function useHospitals() {
  const [state, setState] = useState({ data: null, loading: true, error: false })

  useEffect(() => {
    let alive = true
    fetch('/api/hospitals/')
      .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
      .then((json) => {
        const list = Array.isArray(json) ? json : json.results ?? []
        if (alive) setState({ data: list, loading: false, error: false })
      })
      .catch(() => alive && setState({ data: null, loading: false, error: true }))
    return () => { alive = false }
  }, [])

  return state
}

// Normalize a hospital record so the UI never has to guess field names.
export function normalizeHospital(h, i = 0) {
  return {
    id: h.id ?? i,
    name: h.name ?? '—',
    location: h.location ?? h.address ?? h.city ?? '',
    city: h.city ?? (h.location ?? h.address ?? '').split(',').pop()?.trim() ?? '',
    rating: h.rating != null ? Number(h.rating) : null,
    reviews: h.reviews ?? h.review_count ?? null,
    specialty: h.specialty ?? h.type ?? null,
    beds: h.beds ?? h.available_beds ?? null,
    gov: /gov/i.test(h.specialty ?? h.type ?? ''),
    phone: h.phone ?? h.contact ?? null,
    description: h.description ?? null,
    raw: h,
  }
}

// Section eyebrow marker — a small hexagon echoing the logo.
export const Hexbrow = ({ blue }) => (
  <svg
    className={`pennant${blue ? ' pennant--blue' : ''}`}
    viewBox="0 0 16 18"
    aria-hidden="true"
    style={{ width: 15, height: 17 }}
  >
    <path d="M8 1 14.9 5v8L8 17 1.1 13V5z" fill="currentColor" />
  </svg>
)