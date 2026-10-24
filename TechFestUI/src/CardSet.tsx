import type { CSSProperties } from 'react'
import { DSButton } from './ButtonSet'
import { CategoryChip, StatusBadge } from './FormSet'

type Status = 'Open' | 'Closed' | 'Completed'
type Fee = 'Free' | 'Paid'
const categories = ['Coding', 'Quiz', 'Robotics', 'Hackathon', 'Gaming', 'Design', 'AI-ML', 'Default']
const titles: Record<string, string> = { Coding: 'Code Chakra: Algorithm Sprint', Quiz: 'Quiz-e-Hind Grand Finale', Robotics: 'Robo Raas Obstacle Arena', Hackathon: 'Hackotsav 24-Hour Build', Gaming: 'Game Gully Squad Clash', Design: 'Pixel Pandal UX Challenge', 'AI-ML': 'Neural Navratri Model Cup', Default: 'Tech Talk: Future of Campus' }
const glyphs: Record<string, string> = { Coding: '</>', Quiz: '?', Robotics: '⌁', Hackathon: '✦', Gaming: '◆', Design: '◒', 'AI-ML': '∿', Default: '✧' }

export function DateBlock({ size = 'S', month = 'NOV', day = '14' }: { size?: 'S' | 'M'; month?: string; day?: string }) {
  return <div className={`ds-date-block date-${size.toLowerCase()}`}><span>{month}</span><b>{day}</b></div>
}

function Pin() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 21s7-5.5 7-12a7 7 0 0 0-14 0c0 6.5 7 12 7 12Z" /><circle cx="12" cy="9" r="2.5" /></svg>
}
function Cal() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="3" y="5" width="18" height="16" rx="3" /><path d="M8 3v4M16 3v4M3 10h18" /></svg>
}
function CheckIcon() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9" /><path d="m8 12 3 3 5-6" /></svg>
}

type PassStatus = 'Confirmed' | 'Cancelled'
export function PassCard({ status = 'Confirmed', state = 'Default', category = 'Hackathon', title = 'Hackotsav 24-Hour Build', date = '14 Nov 2026 · 10:00 AM', venue = 'Main Auditorium, Block A', regId = 'REG-000124', regDate = '12 Oct 2026', mobile = false, onView }: { status?: PassStatus; state?: 'Default' | 'Hover'; category?: string; title?: string; date?: string; venue?: string; regId?: string; regDate?: string; mobile?: boolean; onView?: () => void }) {
  return <article className={`pass-ds pass-${status.toLowerCase()} ${state === 'Hover' ? 'is-hover' : ''} ${mobile ? 'pass-mobile' : ''}`} data-layer="pass-card">
    {status === 'Confirmed' && <><div className="pass-ds-shimmer" /><svg className="pass-ds-paisley" viewBox="0 0 40 40" aria-hidden="true"><path d="M30 6C17 2 6 11 9 23c2 9 13 14 21 9 7-4 6-14-1-16-5-1-9 3-8 7" /><circle cx="22" cy="23" r="2" /></svg></>}
    <div className="pass-ds-body"><CategoryChip category={category} /><div className="pass-ds-title" role="heading">{title}</div><div className="pass-ds-row mono"><Cal />{date}</div><div className="pass-ds-row muted"><Pin />{venue}</div><div className="pass-ds-action"><DSButton type="Secondary" label="View Event" onClick={onView} /></div></div>
    <div className="pass-ds-perf" />
    <div className="pass-ds-stub"><div className="barcode-ds" aria-hidden="true" /><div className="pass-stub-meta"><StatusBadge status={status} /><b>{regId}</b><span>Registered on {regDate}</span></div></div>
  </article>
}

type BoothState = 'LoggedOut' | 'Open' | 'Registered' | 'Closed' | 'Completed'
export function TicketBooth({ state = 'Open', fee = '₹250', date = 'Sat, 14 Nov 2026 · 10:00 AM', venue = 'Main Auditorium', capacity = false, onRegister, onLogin, onViewRegistrations }: { state?: BoothState; fee?: string; date?: string; venue?: string; capacity?: boolean; onRegister?: () => void; onLogin?: () => void; onViewRegistrations?: () => void }) {
  const countdown = state !== 'Closed' && state !== 'Completed'
  return <aside className={`booth-ds booth-${state.toLowerCase()}`} data-layer="ticket-booth">
    <div className="booth-zari" />
    <div className="booth-top-ds">
      {countdown ? <><span className="booth-label">REGISTRATION CLOSES IN</span><div className="countdown-ds">{[['04', 'DAYS'], ['12', 'HRS'], ['36', 'MIN'], ['09', 'SEC']].map(([n, l]) => <div key={l}><b>{n}</b><span>{l}</span></div>)}</div></> : state === 'Closed' ? <><span className="booth-label">REGISTRATION STATUS</span><span className="closed-badge">CLOSED</span></> : <><span className="booth-label">EVENT STATUS</span><span className="booth-ended-mini">Concluded</span></>}
    </div>
    <div className="booth-perf" />
    <div className="booth-info"><div className="booth-fee">{fee}</div>{capacity && <div className="capacity-ds"><div><span>86 / 120 registered</span><small>only if backend provides registeredCount</small></div><i><b /></i></div>}<div className="booth-divider" /><div className="booth-row mono"><Cal />{date}</div><div className="booth-row"><Pin />{venue}</div></div>
    <div className="booth-stub">
      {state === 'Open' && <DSButton size="L" label="Register Now" onClick={onRegister} />}
      {state === 'LoggedOut' && <><DSButton type="Secondary" size="L" label="Login to Register" onClick={onLogin} /><p>You need an account to register</p></>}
      {state === 'Registered' && <><div className="booth-panel booth-success"><CheckIcon />You're registered ✓</div><DSButton type="Ghost" label="View my registrations" onClick={onViewRegistrations} /></>}
      {state === 'Closed' && <DSButton size="L" state="Disabled" label="Registration Closed" />}
      {state === 'Completed' && <div className="booth-panel booth-ended">This event has ended</div>}
    </div>
  </aside>
}

export function DSEventCard({ category = 'Coding', status = 'Open', fee = 'Free', state = 'Default', title, date = 'Sat, 14 Nov · 10:00 AM', venue = 'Main Auditorium, Block A', price = '₹250', angle, day = '14', onDetails, onRegister, registered = false }: { category?: string; status?: Status; fee?: Fee; state?: 'Default' | 'Hover'; title?: string; date?: string; venue?: string; price?: string; angle?: string; day?: string; onDetails?: () => void; onRegister?: () => void; registered?: boolean }) {
  const open = status === 'Open'
  const key = category.toLowerCase().replace('-', '')
  return <article className={`ds-event-card cat-${key} status-${status.toLowerCase()} ${state === 'Hover' ? 'is-hover' : ''}`} data-layer="event-card" style={angle ? { '--art-angle': angle } as CSSProperties : undefined}>
    <div className="event-art"><div className="clay-emblem"><span>{glyphs[category]}</span></div></div>
    <div className="event-body">
      <CategoryChip category={category} />
      <div className="event-title" role="heading">{title ?? titles[category]}</div>
      <div className="event-date-row"><DateBlock day={day} /><span className="event-date">{date}</span></div>
      <div className="event-venue"><Pin />{venue}</div>
    </div>
    <div className="event-perforation" />
    <div className="event-stub-ds">
      <div className="stub-meta"><span className={`fee-badge fee-${fee.toLowerCase()}`}>{fee === 'Free' ? 'Free' : price}</span><StatusBadge status={status} /></div>
      <div className="stub-actions"><DSButton type="Secondary" label="View Details" onClick={onDetails} /><DSButton label={!open ? 'Closed' : registered ? 'Registered' : 'Register'} state={open && !registered ? 'Default' : 'Disabled'} onClick={onRegister ?? onDetails} /></div>
    </div>
  </article>
}

export default function CardSet() {
  return <main className="foundations-scroll"><div className="foundations-board card-board">
    <header className="fd-hero"><div><div className="eyebrow">TICKET COMPONENTS</div><div className="heading heading-xl" role="heading">Event <em>cards.</em></div></div><p>Calendar blocks and ticket-inspired event cards with category, status, fee and hover variants.</p></header>
    <section className="fd-section"><div className="fd-section-label"><span>01</span><b>[DATEBLOCK] · SIZE</b></div><div className="date-specimens"><div><DateBlock size="S" /><span>Size=S · 56×56</span></div><div><DateBlock size="M" /><span>Size=M · 72×72</span></div></div></section>
    <section className="fd-section"><div className="fd-section-label"><span>02</span><b>[EVENTCARD] · STATE × STATUS × FEE</b></div><div className="card-grid">
      {(['Default', 'Hover'] as const).flatMap(state => (['Open', 'Closed', 'Completed'] as Status[]).flatMap(status => (['Free', 'Paid'] as Fee[]).map(fee => <div className="card-variant" key={state + status + fee}><span>State={state} · Status={status} · Fee={fee}</span><DSEventCard state={state} status={status} fee={fee} /></div>)))}
    </div></section>
    <section className="fd-section"><div className="fd-section-label"><span>03</span><b>[EVENTCARD] · CATEGORY</b></div><div className="card-grid">{categories.map((category, i) => <div className="card-variant" key={category}><span>Category={category}</span><DSEventCard category={category} fee={i % 2 ? 'Paid' : 'Free'} /></div>)}</div></section>
    <section className="fd-section"><div className="fd-section-label"><span>04</span><b>[PASSCARD] · STATUS × STATE</b></div><div className="pass-grid">{(['Confirmed', 'Cancelled'] as PassStatus[]).flatMap(status => (['Default', 'Hover'] as const).map(state => <div className="card-variant" key={status + state}><span>Status={status} · State={state}</span><PassCard status={status} state={state} /></div>))}</div></section>
    <section className="fd-section"><div className="fd-section-label"><span>05</span><b>[TICKETBOOTH] · STATE</b></div><div className="booth-grid">{(['LoggedOut', 'Open', 'Registered', 'Closed', 'Completed'] as BoothState[]).map(state => <div className="card-variant" key={state}><span>State={state}</span><TicketBooth state={state} /></div>)}<div className="card-variant"><span>State=Open · Fee=Free</span><TicketBooth fee="Free" /></div></div></section>
  </div></main>
}
