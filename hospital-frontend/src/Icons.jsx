// One SVG sprite mounted once at the app root; <Icon n="bell" /> points at it.
// Keeping icons as <use> refs means the whole set costs one DOM subtree, not one per usage.
export function IconSprite() {
  return (
    <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true">
      <symbol id="i-bell" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8a6 6 0 1 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.7 21a2 2 0 0 1-3.4 0"/></symbol>
      <symbol id="i-down" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></symbol>
      <symbol id="i-left" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></symbol>
      <symbol id="i-right" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></symbol>
      <symbol id="i-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h13M12 6l6 6-6 6"/></symbol>
      <symbol id="i-star" viewBox="0 0 24 24"><path fill="currentColor" d="m12 2.6 2.9 5.9 6.5.9-4.7 4.6 1.1 6.4-5.8-3-5.8 3 1.1-6.4L2.6 9.4l6.5-.9z"/></symbol>
      <symbol id="i-pin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 21s7-5.6 7-11a7 7 0 1 0-14 0c0 5.4 7 11 7 11z"/><circle cx="12" cy="10" r="2.4"/></symbol>
      <symbol id="i-shield" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 21.6s7.4-3.7 7.4-9.6V5.4L12 2.4 4.6 5.4V12c0 5.9 7.4 9.6 7.4 9.6z"/><path d="m9 12 2.1 2.1L15.2 10"/></symbol>
      <symbol id="i-spark" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3.2c.7 4.3 2.3 5.9 6.6 6.6-4.3.7-5.9 2.3-6.6 6.6-.7-4.3-2.3-5.9-6.6-6.6 4.3-.7 5.9-2.3 6.6-6.6z"/><path d="M18.4 16.2c.3 1.9 1 2.6 2.9 2.9-1.9.3-2.6 1-2.9 2.9-.3-1.9-1-2.6-2.9-2.9 1.9-.3 2.6-1 2.9-2.9z"/></symbol>
      <symbol id="i-bolt" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M13.2 2.4 4.6 13.6h6.6l-.4 8 8.6-11.2h-6.6z"/></symbol>
      <symbol id="i-lock" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3.6" y="10.4" width="16.8" height="10.6" rx="3"/><path d="M7.6 10.4V7.2a4.4 4.4 0 0 1 8.8 0v3.2"/><path d="M12 15v2"/></symbol>
      <symbol id="i-steth" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M5.5 2.8v5a4 4 0 0 0 8 0v-5"/><path d="M3.6 2.8h2M13.4 2.8h2"/><path d="M9.5 11.8v2.6a5.4 5.4 0 0 0 10.8 0v-1.2"/><circle cx="20.3" cy="10.4" r="2.2"/></symbol>
      <symbol id="i-hospital" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3.6 21V8.6L12 3.2l8.4 5.4V21"/><path d="M12 8v5M9.5 10.5h5"/><path d="M9 21v-4.6h6V21"/><path d="M2 21h20"/></symbol>
      <symbol id="i-cal" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3.4" y="5" width="17.2" height="16" rx="3"/><path d="M8 2.8v4M16 2.8v4M3.4 10.4h17.2"/><path d="m9.6 15.4 1.7 1.7 3.3-3.3"/></symbol>
      <symbol id="i-file" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2.6h8l4.4 4.4V21.4H6z"/><path d="M14 2.6V7h4.4"/><path d="M12 11.4v5M9.5 13.9h5"/></symbol>
      <symbol id="i-users" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="9.4" cy="8" r="3.4"/><path d="M3.2 20a6.2 6.2 0 0 1 12.4 0"/><path d="M16.4 5a3.4 3.4 0 0 1 0 6"/><path d="M17.8 14.6A6.2 6.2 0 0 1 21.4 20"/></symbol>
      <symbol id="i-heart" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M20.6 6a4.8 4.8 0 0 0-7 0L12 7.7 10.4 6a4.8 4.8 0 1 0-7 6.6L12 21l8.6-8.4a4.8 4.8 0 0 0 0-6.6z"/></symbol>
      <symbol id="i-clock" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 6.8V12l3.4 2.2"/></symbol>
      <symbol id="i-chat" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.6a8.4 8.4 0 0 1-9.1 8.4L4 21.4l1.2-4.5A8.4 8.4 0 1 1 21 11.6z"/><path d="M8.6 11.6h.01M12 11.6h.01M15.4 11.6h.01"/></symbol>
      <symbol id="i-x" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M18 6 6 18M6 6l12 12"/></symbol>
      <symbol id="i-send" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d="M21.4 2.6 10.6 13.4"/><path d="M21.4 2.6 14.6 21.4l-4-8.2-8.2-4z"/></symbol>
      <symbol id="i-menu" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M4 7h16M4 12h16M4 17h16"/></symbol>
      <symbol id="i-check" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m5 12.8 4.4 4.4L19 7.6"/></symbol>
      <symbol id="i-moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M20.5 14.4A8.6 8.6 0 0 1 9.6 3.5a8.6 8.6 0 1 0 10.9 10.9z"/></symbol>
      <symbol id="i-mic" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="2.4" width="6" height="11.4" rx="3"/><path d="M5.4 11.4a6.6 6.6 0 0 0 13.2 0"/><path d="M12 18v3.6M8.8 21.6h6.4"/></symbol>
      <symbol id="i-sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4.2"/><path d="M12 2.4v2.4M12 19.2v2.4M4.2 4.2l1.7 1.7M18.1 18.1l1.7 1.7M2.4 12h2.4M19.2 12h2.4M4.2 19.8l1.7-1.7M18.1 5.9l1.7-1.7"/></symbol>
    </svg>
  )
}

export function Icon({ n, className }) {
  return (
    <svg className={className} aria-hidden="true">
      <use href={`#i-${n}`} />
    </svg>
  )
}