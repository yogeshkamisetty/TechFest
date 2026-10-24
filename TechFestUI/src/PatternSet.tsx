import { useState, type ReactNode } from 'react'
import { DSButton } from './ButtonSet'
import { CategoryChip } from './FormSet'
import { Link } from 'react-router'

type Active = 'Home' | 'Events' | 'MyReg'
const I = ({ children }: { children: ReactNode }) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{children}</svg>
const Check = () => <I><circle cx="12" cy="12" r="9" /><path d="m8 12 3 3 5-6" /></I>
const AlertIcon = () => <I><circle cx="12" cy="12" r="9" /><path d="M12 7v6M12 17h.01" /></I>
const Search = () => <I><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></I>
const Menu = () => <I><path d="M4 7h16M4 12h16M4 17h16" /></I>
const Close = () => <I><path d="M6 6l12 12M18 6 6 18" /></I>
const Chevron = () => <I><path d="m6 9 6 6 6-6" /></I>
const Cal = () => <I><rect x="3" y="5" width="18" height="16" rx="3" /><path d="M8 3v4M16 3v4M3 10h18" /></I>
const Pin = () => <I><path d="M12 21s7-5.5 7-12a7 7 0 0 0-14 0c0 6.5 7 12 7 12Z" /><circle cx="12" cy="9" r="2.5" /></I>
const Ticket = () => <I><path d="M4 7a2 2 0 0 0 2-2h12a2 2 0 0 0 2 2v2a3 3 0 0 0 0 6v2a2 2 0 0 0-2 2H6a2 2 0 0 0-2-2v-2a3 3 0 0 0 0-6V7Z" /></I>

function Brand() { return <span className="brand-ds"><span className="logo-mark"><i /><i /><i /><i /></span>TECH FEST HUB</span> }

export function Toran({ width = 1200 }: { width?: number }) {
  return <div className="toran-ds" style={{ width }} aria-hidden="true" />
}

export function Navbar({ auth = 'LoggedOut', device = 'Desktop', active = 'Home', open = false }: { auth?: 'LoggedOut' | 'LoggedIn'; device?: 'Desktop' | 'Mobile'; active?: Active; open?: boolean }) {
  const links = auth === 'LoggedIn' ? [['Home', 'Home'], ['Events', 'Events'], ['MyReg', 'My Registrations']] : [['Home', 'Home'], ['Events', 'Events'], ['How', 'How it works']]
  if (device === 'Mobile') return <div className="mobile-nav-wrap"><div className="navbar-ds navbar-mobile" data-layer="navbar"><Brand /><button className="hamburger" aria-label={open ? 'Close menu' : 'Open menu'}>{open ? <Close /> : <Menu />}</button></div>{open && <div className="mobile-overlay"><Toran width={390} /><div>{links.map(([k, l]) => <span key={k} className={active === k ? 'active' : ''}>{l}</span>)}</div>{auth === 'LoggedOut' ? <DSButton size="L" label="Sign Up" /> : <span className="overlay-user">Hi, Aarav · Logout</span>}</div>}</div>
  return <div className="navbar-ds" data-layer="navbar"><Brand /><nav>{links.map(([k, l]) => <span key={k} className={active === k ? 'active' : ''}>{l}</span>)}</nav>{auth === 'LoggedOut' ? <div className="nav-auth"><span className="nav-login">Login</span><DSButton label="Sign Up" /></div> : <div className="user-pill"><span>A</span>Hi, Aarav<DSButton type="Ghost" label="Logout" /></div>}</div>
}

export function Footer({ device = 'Desktop' }: { device?: 'Desktop' | 'Mobile' }) {
  const cols = [['Explore', [['Events', '/events'], ['Login', '/login'], ['Sign Up', '/signup']]], ['Account', [['My Registrations', '/registrations']]], ['Contact', [['hello@techfesthub.example', 'mailto:hello@techfesthub.example']]]] as const
  const item = ([label, to]: readonly [string, string]) => to.startsWith('mailto:') ? <a key={label} href={to}>{label}</a> : <Link key={label} to={to}>{label}</Link>
  return <footer className={`footer-ds footer-${device.toLowerCase()}`} data-layer="footer"><Toran width={device === 'Mobile' ? 390 : 1200} /><div className="footer-cols"><div><Brand /><p>Discover, compete and innovate at India’s brightest campus tech festival.</p></div>{cols.map(([title, items]) => device === 'Mobile' ? <details key={title}><summary>{title}<Chevron /></summary>{items.map(item)}</details> : <div key={title}><b>{title}</b>{items.map(item)}</div>)}</div><div className="copyright">© 2026 TECH FEST HUB<Link className="handoff-footer-link" to="/handoff">DESIGN SYSTEM &amp; HANDOFF →</Link></div></footer>
}

export function Alert({ type = 'Success' }: { type?: 'Success' | 'Error' }) {
  return <div className={`alert-ds alert-${type.toLowerCase()}`} role={type === 'Error' ? 'alert' : 'status'}>{type === 'Success' ? <Check /> : <AlertIcon />}{type === 'Success' ? 'Your registration is confirmed. See you at the arena.' : 'We couldn’t complete your registration. Please try again.'}</div>
}
function InfoTile({ icon, label, value, tint }: { icon: ReactNode; label: string; value: string; tint: string }) { return <div className="info-ds"><span className={tint}>{icon}</span><div><small>{label}</small><b>{value}</b></div></div> }
function StatTile({ variant }: { variant: 'Landing' | 'Registrations' }) { return <div className={`stat-ds stat-${variant.toLowerCase()}`}><strong>{variant === 'Landing' ? '42' : '03'}</strong><span><i />{variant === 'Landing' ? 'LIVE EVENTS' : 'CONFIRMED PASSES'}</span></div> }
function DataTable({ rows }: { rows: 3 | 5 }) {
  const data = [['Hackotsav', 'Hackathon', '14 NOV', 'Confirmed'], ['Code Chakra', 'Coding', '15 NOV', 'Confirmed'], ['Robo Raas', 'Robotics', '16 NOV', 'Confirmed'], ['Pixel Pandal', 'Design', '17 NOV', 'Completed'], ['Quiz-e-Hind', 'Quiz', '18 NOV', 'Completed']].slice(0, rows)
  return <table className="table-ds"><thead><tr><th>EVENT</th><th>CATEGORY</th><th>DATE</th><th>STATUS</th></tr></thead><tbody>{data.map(r => <tr key={r[0]}>{r.map(c => <td key={c}>{c}</td>)}</tr>)}</tbody></table>
}
export function Toggle({ on = false, label = 'Open only' }: { on?: boolean; label?: string }) {
  const [checked, setChecked] = useState(on)
  return <button className={`toggle-ds ${checked ? 'on' : ''}`} role="switch" aria-checked={checked} onClick={() => setChecked(!checked)}><i />{label}</button>
}
export function Select({ open = false, width = 200 }: { open?: boolean; width?: number }) {
  return <div className="select-ds" style={{ width }}><button aria-expanded={open}><span>SORT</span>Date: soonest<Chevron /></button>{open && <div className="select-menu"><span className="selected">Date: soonest</span><span>Name: A–Z</span><span>Fee: low to high</span></div>}</div>
}
export function FilterBar({ device = 'Desktop' }: { device?: 'Desktop' | 'Mobile' }) {
  return <div className={`filterbar-ds filter-${device.toLowerCase()}`} data-layer="filter-bar"><div className="filter-row"><label className="search-ds"><Search /><input placeholder="Search events by name…" /></label><Select width={device === 'Mobile' ? 160 : 200} /><Toggle on /><span className="filter-count">24 EVENTS</span></div><div className="chip-row">{['All', 'Coding', 'Quiz', 'Robotics', 'Hackathon', 'Gaming', 'Design'].map((c, i) => <CategoryChip key={c} category={c === 'All' ? 'Default' : c} label={c} active={i === 0} />)}</div></div>
}

const Label = ({ children }: { children: ReactNode }) => <span className="variant-label">{children}</span>
export default function PatternSet() {
  return <main className="foundations-scroll"><div className="foundations-board pattern-board">
    <header className="fd-hero"><div><div className="eyebrow">LAYOUT & FEEDBACK PATTERNS</div><div className="heading heading-xl" role="heading">Patterns & <em>shell.</em></div></div><p>Navigation, footer, data and filter components for every student screen.</p></header>
    <section className="fd-section"><div className="fd-section-label"><span>01</span><b>[NAVBAR] · AUTH × DEVICE × ACTIVE</b></div><div className="pattern-stack">{(['LoggedOut', 'LoggedIn'] as const).flatMap(auth => (['Home', 'Events', 'MyReg'] as Active[]).filter(a => auth === 'LoggedIn' || a !== 'MyReg').map(active => <div key={auth + active}><Label>Auth={auth} · Device=Desktop · Active={active}</Label><Navbar auth={auth} active={active} /></div>))}<div className="mobile-row">{(['LoggedOut', 'LoggedIn'] as const).map(a => <div key={a}><Label>Mobile · {a}</Label><Navbar auth={a} device="Mobile" /></div>)}<div><Label>Mobile · Open</Label><Navbar device="Mobile" open active="Events" /></div></div></div></section>
    <section className="fd-section"><div className="fd-section-label"><span>02</span><b>[FOOTER] · DEVICE</b></div><Label>Desktop</Label><Footer /><div className="footer-mobile-wrap"><Label>Mobile · accordion</Label><Footer device="Mobile" /></div></section>
    <section className="fd-section"><div className="fd-section-label"><span>03</span><b>[TORAN] · WIDTH</b></div><div className="pattern-stack">{[720, 1200, 390].map(w => <div key={w}><Label>{w}px</Label><Toran width={w} /></div>)}</div></section>
    <section className="fd-section"><div className="fd-section-label"><span>04</span><b>[ALERT] · [INFOTILE] · [STATTILE]</b></div><div className="pattern-stack"><Alert /><Alert type="Error" /><div className="tile-row"><InfoTile icon={<Cal />} label="DATE" value="Sat, 14 Nov" tint="tint-yellow" /><InfoTile icon={<Pin />} label="VENUE" value="Main Auditorium" tint="tint-mint" /><InfoTile icon={<Ticket />} label="ENTRY" value="₹250" tint="tint-pink" /><StatTile variant="Landing" /><StatTile variant="Registrations" /></div></div></section>
    <section className="fd-section"><div className="fd-section-label"><span>05</span><b>[DATATABLE] · ROWS</b></div><div className="table-row"><div><Label>Rows=3</Label><DataTable rows={3} /></div><div><Label>Rows=5</Label><DataTable rows={5} /></div></div></section>
    <section className="fd-section"><div className="fd-section-label"><span>06</span><b>[FILTERBAR] · [TOGGLE] · [SELECT]</b></div><div className="pattern-stack"><Label>Desktop</Label><FilterBar /><Label>Mobile</Label><FilterBar device="Mobile" /><div className="control-row"><Toggle on label="On" /><Toggle label="Off" /><Select /><Select open /></div></div></section>
  </div></main>
}
