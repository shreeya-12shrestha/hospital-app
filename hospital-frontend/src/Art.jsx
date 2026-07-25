// Flat SVG illustrations. Every fill is a themed CSS class (.iw, .ibb, .iwb …)
// defined in index.css, so they re-tint automatically in dark mode.

const CARDS = [
  (
    <svg viewBox="0 0 320 200" aria-hidden="true">
    <rect width="320" height="200" className="ibb"/>
    <circle cx="264" cy="44" r="26" className="iw" opacity=".55"/>
    <rect x="34" y="96" width="62" height="104" rx="6" className="iw"/>
    <rect x="102" y="52" width="118" height="148" rx="8" className="iw"/>
    <rect x="226" y="112" width="60" height="88" rx="6" className="iw"/>
    <rect x="150" y="66" width="9" height="30" rx="2" className="ird"/>
    <rect x="139" y="77" width="31" height="9" rx="2" className="ird"/>
    <g className="iwb">
    <rect x="116" y="104" width="20" height="16" rx="3"/><rect x="150" y="104" width="20" height="16" rx="3"/><rect x="184" y="104" width="20" height="16" rx="3"/>
    <rect x="116" y="132" width="20" height="16" rx="3"/><rect x="150" y="132" width="20" height="16" rx="3"/><rect x="184" y="132" width="20" height="16" rx="3"/>
    <rect x="48" y="118" width="16" height="14" rx="3"/><rect x="70" y="118" width="16" height="14" rx="3"/>
    <rect x="240" y="130" width="16" height="14" rx="3"/><rect x="262" y="130" width="16" height="14" rx="3"/>
    </g>
    <rect x="146" y="166" width="30" height="34" rx="4" className="ibl"/>
    <rect x="0" y="192" width="320" height="8" className="ig"/>
    </svg>
  ),
  (
    <svg viewBox="0 0 320 200" aria-hidden="true">
    <rect width="320" height="200" className="ibr"/>
    <circle cx="58" cy="40" r="22" className="iw" opacity=".6"/>
    <rect x="40" y="70" width="104" height="130" rx="8" className="iw"/>
    <rect x="152" y="104" width="128" height="96" rx="8" className="iw"/>
    <rect x="87" y="84" width="9" height="28" rx="2" className="ird"/>
    <rect x="77" y="94" width="29" height="9" rx="2" className="ird"/>
    <g className="iwr">
    <rect x="54" y="122" width="18" height="15" rx="3"/><rect x="82" y="122" width="18" height="15" rx="3"/><rect x="110" y="122" width="18" height="15" rx="3"/>
    <rect x="54" y="150" width="18" height="15" rx="3"/><rect x="110" y="150" width="18" height="15" rx="3"/>
    <rect x="168" y="126" width="22" height="16" rx="3"/><rect x="200" y="126" width="22" height="16" rx="3"/><rect x="232" y="126" width="22" height="16" rx="3"/>
    </g>
    <rect x="82" y="168" width="26" height="32" rx="4" className="ird"/>
    <rect x="0" y="192" width="320" height="8" className="igr"/>
    </svg>
  ),
  (
    <svg viewBox="0 0 320 200" aria-hidden="true">
    <rect width="320" height="200" className="ibb"/>
    <path d="M0 96 58 44l44 34 46-38 60 48 44-26 68 42v96H0z" className="ihill"/>
    <rect x="76" y="66" width="86" height="134" rx="8" className="iw"/>
    <rect x="170" y="98" width="94" height="102" rx="8" className="iw"/>
    <rect x="115" y="80" width="9" height="28" rx="2" className="ird"/>
    <rect x="105" y="90" width="29" height="9" rx="2" className="ird"/>
    <g className="iwb">
    <rect x="88" y="118" width="19" height="15" rx="3"/><rect x="116" y="118" width="19" height="15" rx="3"/>
    <rect x="88" y="146" width="19" height="15" rx="3"/><rect x="116" y="146" width="19" height="15" rx="3"/>
    <rect x="184" y="120" width="20" height="15" rx="3"/><rect x="214" y="120" width="20" height="15" rx="3"/><rect x="244" y="120" width="10" height="15" rx="3"/>
    <rect x="184" y="150" width="20" height="15" rx="3"/><rect x="214" y="150" width="20" height="15" rx="3"/>
    </g>
    <rect x="0" y="192" width="320" height="8" className="ig"/>
    </svg>
  ),
  (
    <svg viewBox="0 0 320 200" aria-hidden="true">
    <rect width="320" height="200" className="ibb2"/>
    <rect x="46" y="58" width="228" height="142" rx="10" className="iw"/>
    <rect x="46" y="58" width="228" height="18" rx="9" className="ibl"/>
    <rect x="155" y="86" width="10" height="30" rx="2" className="ird"/>
    <rect x="144" y="96" width="32" height="10" rx="2" className="ird"/>
    <g className="iwb">
    <rect x="66" y="126" width="24" height="17" rx="3"/><rect x="100" y="126" width="24" height="17" rx="3"/><rect x="196" y="126" width="24" height="17" rx="3"/><rect x="230" y="126" width="24" height="17" rx="3"/>
    <rect x="66" y="156" width="24" height="17" rx="3"/><rect x="100" y="156" width="24" height="17" rx="3"/><rect x="196" y="156" width="24" height="17" rx="3"/><rect x="230" y="156" width="24" height="17" rx="3"/>
    </g>
    <rect x="142" y="150" width="36" height="50" rx="5" className="ibl"/>
    <rect x="0" y="192" width="320" height="8" className="ig"/>
    </svg>
  ),
  (
    <svg viewBox="0 0 320 200" aria-hidden="true">
    <rect width="320" height="200" className="ibr"/>
    <circle cx="252" cy="48" r="30" className="iw" opacity=".5"/>
    <rect x="58" y="88" width="86" height="112" rx="8" className="iw"/>
    <rect x="152" y="54" width="72" height="146" rx="8" className="iw"/>
    <rect x="232" y="120" width="48" height="80" rx="6" className="iw"/>
    <rect x="183" y="70" width="9" height="28" rx="2" className="ird"/>
    <rect x="173" y="80" width="29" height="9" rx="2" className="ird"/>
    <g className="iwr">
    <rect x="72" y="112" width="20" height="16" rx="3"/><rect x="102" y="112" width="20" height="16" rx="3"/>
    <rect x="72" y="142" width="20" height="16" rx="3"/><rect x="102" y="142" width="20" height="16" rx="3"/>
    <rect x="166" y="112" width="18" height="16" rx="3"/><rect x="192" y="112" width="18" height="16" rx="3"/>
    <rect x="166" y="142" width="18" height="16" rx="3"/><rect x="192" y="142" width="18" height="16" rx="3"/>
    <rect x="244" y="140" width="24" height="16" rx="3"/>
    </g>
    <rect x="0" y="192" width="320" height="8" className="igr"/>
    </svg>
  ),
]

export function HospitalArt({ i }) {
  return CARDS[i % CARDS.length]
}

export function DoctorArt() {
  return (
    <svg className="stage__art" viewBox="0 0 440 470" aria-hidden="true">
    <path d="M148 462V318c0-56 30-101 72-113 42 12 72 57 72 113v144z" className="iw iline" strokeWidth="3" strokeLinejoin="round"/>
    <path d="M194 200h52l-26 64z" className="ibl"/>
    <path d="M194 200l26 64M246 200l-26 64" className="iline" fill="none" strokeWidth="3" strokeLinecap="round"/>
    <rect x="204" y="152" width="32" height="46" rx="15" className="isk2"/>
    <circle cx="220" cy="118" r="47" className="isk"/>
    <path d="M220 60c-31 0-53 23-53 53 0 8 2 15 5 20 3-19 10-30 21-34 13-5 27-1 42-1 16 0 25 7 31 21 2 5 4 1 5-5 3-31-20-54-51-54z" className="ihair"/>
    <circle cx="272" cy="96" r="15" className="ihair"/>
    <path d="M198 199c-6 52 8 87 27 87 15 0 24-13 24-28v-16" fill="none" stroke="var(--red-solid)" strokeWidth="6.5" strokeLinecap="round"/>
    <circle cx="249" cy="238" r="11" className="iw" stroke="var(--red-solid)" strokeWidth="6.5"/>
    <g fill="none" strokeLinecap="round">
    <path d="M180 250C160 280 152 316 150 348" stroke="var(--ill-line)" strokeWidth="38"/>
    <path d="M262 250C282 280 290 316 292 348" stroke="var(--ill-line)" strokeWidth="38"/>
    <path d="M180 250C160 280 152 316 150 348" stroke="var(--ill-wall-2)" strokeWidth="33"/>
    <path d="M262 250C282 280 290 316 292 348" stroke="var(--ill-wall-2)" strokeWidth="33"/>
    </g>
    <g transform="rotate(-5 220 352)">
    <rect x="140" y="298" width="160" height="112" rx="14" className="idk"/>
    <rect x="148" y="306" width="144" height="96" rx="9" fill="#003893"/>
    <rect x="160" y="318" width="120" height="30" rx="8" fill="#fff" opacity=".95"/>
    <circle cx="176" cy="333" r="7" fill="#DC143C"/>
    <rect x="190" y="326" width="54" height="6" rx="3" fill="#0C1A35" opacity=".75"/>
    <rect x="190" y="338" width="36" height="5" rx="2.5" fill="#5B6A88" opacity=".6"/>
    <rect x="160" y="358" width="92" height="6" rx="3" fill="#fff" opacity=".42"/>
    <rect x="160" y="372" width="66" height="6" rx="3" fill="#fff" opacity=".42"/>
    <rect x="160" y="386" width="54" height="11" rx="5.5" fill="#DC143C"/>
    </g>
    <circle cx="150" cy="352" r="16" className="isk"/>
    <circle cx="292" cy="352" r="16" className="isk"/>
    </svg>
  )
}

export function HospitalCtaArt() {
  return (
    <svg className="final__art" viewBox="0 0 340 250" aria-hidden="true">
    <circle cx="170" cy="120" r="104" className="iw" opacity=".55"/>
    <rect x="60" y="58" width="164" height="150" rx="12" className="iw iline" strokeWidth="2.5"/>
    <rect x="60" y="58" width="164" height="20" rx="10" className="ibl"/>
    <rect x="136" y="92" width="12" height="36" rx="3" className="ird"/>
    <rect x="124" y="104" width="36" height="12" rx="3" className="ird"/>
    <g className="ihill">
    <rect x="78" y="140" width="26" height="20" rx="4"/><rect x="114" y="140" width="26" height="20" rx="4"/>
    <rect x="150" y="140" width="26" height="20" rx="4"/><rect x="186" y="140" width="26" height="20" rx="4"/>
    </g>
    <rect x="128" y="174" width="30" height="34" rx="4" className="ibl"/>
    <rect x="222" y="150" width="82" height="42" rx="8" className="iw iline" strokeWidth="2.5"/>
    <path d="M264 150h22l18 20v22h-40z" className="ibb2"/>
    <rect x="238" y="162" width="7" height="20" rx="2" className="ird"/>
    <rect x="231" y="169" width="21" height="7" rx="2" className="ird"/>
    <circle cx="248" cy="196" r="11" className="idk"/><circle cx="248" cy="196" r="4" className="iw"/>
    <circle cx="290" cy="196" r="11" className="idk"/><circle cx="290" cy="196" r="4" className="iw"/>
    <rect x="255" y="141" width="14" height="8" rx="4" className="ird"/>
    <rect x="30" y="204" width="286" height="6" rx="3" className="ihill"/>
    </svg>
  )
}