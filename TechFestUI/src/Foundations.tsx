import type { ReactNode } from 'react'

type Swatch = [string, string, string]
const groups: [string, Swatch[]][] = [
  ['Surfaces', [['Ivory Aangan', '#FFF9F0', 'surface/page'], ['Haldi Band', '#FDEFD9', 'surface/band'], ['Frosted Card', '#FFFFFF', 'surface/card'], ['Sunlit Hover', '#FFF3D6', 'surface/hover']]],
  ['Brand', [['Kesari Saffron', '#FF9933', 'brand/primary'], ['Kesari Glow', '#FFA64D', 'brand/primary-hover'], ['Mor Teal', '#19B5A5', 'brand/accent'], ['Kamal Pink', '#F472A6', 'brand/lotus'], ['Haldi Turmeric', '#FFC83D', 'brand/turmeric'], ['Neel Periwinkle', '#7C9BFF', 'brand/periwinkle']]],
  ['Text', [['Kattha Brown', '#5B3A29', 'text/primary'], ['Chandan Brown', '#8A5A3C', 'text/secondary']]],
  ['State', [['Success Green', '#34B26B', 'state/success'], ['Error Rose', '#E0475B', 'state/error'], ['Completed Ash', '#C9BBAA', 'state/completed']]],
  ['Pastel tints', [['Kesari Tint', '#FFE9D1', 'tint/saffron'], ['Haldi Tint', '#FFF1C9', 'tint/turmeric'], ['Kamal Tint', '#FFE4EE', 'tint/pink'], ['Mor Tint', '#DDF5F1', 'tint/teal'], ['Neel Tint', '#E6ECFF', 'tint/periwinkle'], ['Success Tint', '#E1F7EA', 'tint/success'], ['Error Tint', '#FFE4E8', 'tint/error'], ['Ash Tint', '#F1EBE2', 'tint/completed']]],
]
const supporting: Swatch[] = [['Zari Gold', '#E8C468', 'border/zari'], ['Chandan Border', '#F0DCC0', 'border/default'], ['Teal Ink', '#0B7A70', 'text/link']]

const icons: Record<string, ReactNode> = {
  search: <><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></>,
  calendar: <><rect x="3" y="5" width="18" height="16" rx="3" /><path d="M8 3v4M16 3v4M3 10h18" /></>,
  'map-pin': <><path d="M12 21s7-5.5 7-12a7 7 0 0 0-14 0c0 6.5 7 12 7 12Z" /><circle cx="12" cy="9" r="2.5" /></>,
  ticket: <><path d="M4 7a2 2 0 0 0 2-2h12a2 2 0 0 0 2 2v2a3 3 0 0 0 0 6v2a2 2 0 0 0-2 2H6a2 2 0 0 0-2-2v-2a3 3 0 0 0 0-6V7Z" /><path d="M10 7v10" strokeDasharray="2 2" /></>,
  user: <><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></>,
  lock: <><rect x="5" y="10" width="14" height="11" rx="3" /><path d="M8 10V7a4 4 0 0 1 8 0v3" /></>,
  mail: <><rect x="3" y="5" width="18" height="14" rx="3" /><path d="m4 7 8 6 8-6" /></>,
  eye: <><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" /><circle cx="12" cy="12" r="3" /></>,
  'eye-off': <><path d="M3 3l18 18M10.6 5.1A11 11 0 0 1 12 5c6.5 0 10 7 10 7a17 17 0 0 1-3 3.9M6.6 6.6C3.7 8.4 2 12 2 12s3.5 7 10 7a10 10 0 0 0 5.4-1.6" /><path d="M9.9 9.9a3 3 0 0 0 4.2 4.2" /></>,
  check: <path d="m5 12 4 4L19 6" />,
  x: <path d="M6 6l12 12M18 6 6 18" />,
  alert: <><path d="M10.3 4.3 2.6 18a2 2 0 0 0 1.7 3h15.4a2 2 0 0 0 1.7-3L13.7 4.3a2 2 0 0 0-3.4 0Z" /><path d="M12 9v4M12 17h.01" /></>,
  'arrow-right': <path d="M5 12h14M14 7l5 5-5 5" />,
  menu: <path d="M4 7h16M4 12h16M4 17h16" />,
  clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
  trophy: <><path d="M8 4h8v5a4 4 0 0 1-8 0V4ZM12 13v4M8 20h8" /><path d="M8 6H4v2a4 4 0 0 0 4 4M16 6h4v2a4 4 0 0 1-4 4" /></>,
  cpu: <><rect x="7" y="7" width="10" height="10" rx="2" /><path d="M9 1v3M15 1v3M9 20v3M15 20v3M1 9h3M1 15h3M20 9h3M20 15h3" /></>,
  code: <path d="m8 9-4 3 4 3M16 9l4 3-4 3M14 5l-4 14" />,
  brain: <><path d="M9 4a3 3 0 0 0-3 3 3 3 0 0 0-2 5 3 3 0 0 0 2 5 3 3 0 0 0 6 1V5a3 3 0 0 0-3-1ZM15 4a3 3 0 0 1 3 3 3 3 0 0 1 2 5 3 3 0 0 1-2 5 3 3 0 0 1-6 1" /></>,
  bot: <><rect x="5" y="7" width="14" height="12" rx="3" /><path d="M9 12h.01M15 12h.01M9 16h6M12 7V4M9 4h6" /></>,
  gamepad: <><path d="M8 8h8a5 5 0 0 1 4.6 7l-1 2.4a2 2 0 0 1-3.3.6L14 16h-4l-2.3 2a2 2 0 0 1-3.3-.6L3.4 15A5 5 0 0 1 8 8Z" /><path d="M7 12h4M9 10v4M16 12h.01M18 14h.01" /></>,
  palette: <><path d="M12 3a9 9 0 0 0 0 18h1.5a2 2 0 0 0 1.4-3.4 2 2 0 0 1 1.4-3.4H18a3 3 0 0 0 3-3C21 6.6 17 3 12 3Z" /><path d="M7.5 11h.01M9.5 7h.01M14 7h.01M17 11h.01" /></>,
}

function Section({ n, title, children }: { n: string; title: string; children: ReactNode }) {
  return <section className="fd-section"><div className="fd-section-label"><span>{n}</span><b>{title}</b></div>{children}</section>
}

function SwatchItem({ s }: { s: Swatch }) {
  return <div className="fd-swatch"><i style={{ background: s[1] }} /><b>{s[0]}</b><span>{s[1]} · {s[2]}</span></div>
}

export default function Foundations() {
  return <main className="foundations-scroll"><div className="foundations-board">
    <header className="fd-hero"><div><div className="eyebrow">TECH FEST HUB · UTSAV ARENA · V1.0</div><div className="heading heading-xl" role="heading">Design <em>foundations.</em></div></div><p>The sunlit tokens, type and motifs behind every festival screen.</p></header>

    <Section n="01" title="COLOUR">
      <div className="fd-colour-groups">{groups.map(([name, swatches]) => <div key={name} className="fd-group"><div className="fd-group-title">{name} <span>{swatches.length}</span></div><div className="fd-swatches">{swatches.map(s => <SwatchItem key={s[2]} s={s} />)}</div></div>)}</div>
      <div className="fd-support"><span>Supporting tokens</span>{supporting.map(s => <div key={s[2]}><i style={{ background: s[1] }} />{s[0]} {s[1]} · {s[2]}</div>)}</div>
      <div className="fd-gradients">{[['sandhya', 'gradient/sandhya'], ['mor', 'gradient/mor'], ['zari', 'gradient/zari'], ['text-accent', 'gradient/text-accent'], ['page-wash', 'gradient/page-wash']].map(([g, v]) => <div key={g}><i className={`fd-grad-${g}`} /><b>{g}</b><span>{v}</span></div>)}</div>
    </Section>

    <Section n="02" title="CONTRAST">
      <div className="fd-contrast">
        {[['#5B3A29', '#FFF9F0', '9.9:1', 'AAA · body text'], ['#8A5A3C', '#FFF9F0', '5.4:1', 'AA · secondary'], ['#5B3A29', '#FF9933', '4.7:1', 'AA · primary button'], ['#0B7A70', '#FFF9F0', '5.0:1', 'AA · links & focus']].map(([fg, bg, r, use]) => <div className="fd-pair" key={fg + bg} style={{ background: bg }}><b style={{ color: fg }}>Aa</b><p style={{ color: fg }}>Discover. Compete.</p><span className="fd-pass">✓ {r}</span><small>{fg} on {bg} · {use}</small></div>)}
        {[['#FF9933', 'Saffron'], ['#19B5A5', 'Teal']].map(([fg, name]) => <div className="fd-pair fd-never" key={fg}><b style={{ color: fg }}>Aa</b><p style={{ color: fg }}>{name} text</p><span className="fd-fail">✕ Never as text</span><small>{fg} on #FFF9F0 · fills & art only</small></div>)}
      </div>
    </Section>

    <Section n="03" title="TYPE">
      <div className="fd-type">
        {[
          ['Display XL', 'Bricolage Grotesque', '72 / 76', '800', <div className="fd-dxl">Discover. Compete. <em>Innovate.</em></div>],
          ['Display L', 'Bricolage Grotesque', '48 / 52', '800', <div className="fd-dl">Find your arena.</div>],
          ['H2', 'Bricolage Grotesque', '36 / 42', '700', <div className="fd-h2">Pick your challenge</div>],
          ['H3', 'Bricolage Grotesque', '20 / 28', '700', <div className="fd-h3">Robo Raas Championship</div>],
          ['Body L', 'Plus Jakarta Sans', '18 / 28', '400', <p className="fd-bl">A sunlit arena of bold ideas and joyful rivalries.</p>],
          ['Body M', 'Plus Jakarta Sans', '16 / 24', '400', <p className="fd-bm">Register in a few clear steps and receive your digital ticket.</p>],
          ['Body S', 'Plus Jakarta Sans', '14 / 20', '500', <p className="fd-bs">Arrive 20 minutes before your event begins.</p>],
          ['Label', 'Geist Mono · uppercase +6%', '12 / 16', '500', <div className="fd-label">CODING · OPEN ENTRY</div>],
          ['Data', 'Geist Mono', '14 / 20', '500', <div className="fd-data">TFH-26-1204 · 18 FEB · ₹149</div>],
          ['Countdown', 'Geist Mono', '40 / 44', '500', <div className="fd-count">04 : 12 : 36 : 09</div>],
        ].map(([name, font, size, weight, sample]) => <div className="fd-type-row" key={name as string}><div><b>{name}</b><span>{font}</span><span>{size} · {weight}</span></div>{sample}</div>)}
      </div>
    </Section>

    <Section n="04" title="EFFECTS">
      <div className="fd-effects">{[['shadow/card', '0 8 24 · brown 10%'], ['shadow/lift', '0 16 50 · brown 10%'], ['glow/saffron', 'saffron 32% bloom'], ['halo/focus', '3px mint + teal ink'], ['glass/frost', 'white 64% · blur 16'], ['border/zari', '1px zari gold']].map(([e, d]) => <div className={`fd-effect-wrap ${e === 'glass/frost' ? 'fd-wash' : ''}`} key={e}><div className={`fd-effect fd-${e.replace('/', '-')}`}><b>{e}</b><span>{d}</span></div></div>)}</div>
    </Section>

    <Section n="05" title="SPACING & RADIUS">
      <div className="fd-space-radius"><div className="fd-ruler">{[4, 8, 16, 24, 32, 48, 64, 120].map(s => <div key={s}><i style={{ width: s }} /><span>{s}</span><small>space/{s}</small></div>)}</div><div className="fd-radii">{[12, 16, 24, 32, 999].map(r => <div key={r}><i style={{ borderRadius: r }} /><span>{r === 999 ? 'pill · 999' : r}</span></div>)}</div></div>
    </Section>

    <Section n="06" title="ICONS">
      <div className="fd-icons">{Object.entries(icons).map(([name, path]) => <div key={name}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{path}</svg><span>{name}</span></div>)}</div>
    </Section>

    <Section n="07" title="MOTIFS">
      <div className="fd-motifs">
        <div><div className="fd-kolam" /><b>Kolam dot floor</b></div>
        <div><div className="fd-jaali" /><b>Jaali lattice</b></div>
        <div><div className="fd-toran">{Array.from({ length: 10 }).map((_, i) => <i key={i} />)}</div><b>Toran garland</b></div>
        <div><div className="fd-paisley"><svg viewBox="0 0 40 40" aria-hidden="true"><path d="M30 6C17 2 6 11 9 23c2 9 13 14 21 9 7-4 6-14-1-16-5-1-9 3-8 7" /><circle cx="22" cy="23" r="2" /></svg></div><b>Paisley corner · 40px</b></div>
        <div><div className="fd-barcode" /><b>Barcode strip</b></div>
      </div>
    </Section>
  </div></main>
}
