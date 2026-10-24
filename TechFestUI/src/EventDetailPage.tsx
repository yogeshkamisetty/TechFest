import { useEventCatalog } from './eventCatalog'
import { useState, type ReactNode } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router'
import { DSButton } from './ButtonSet'
import { TicketBooth } from './CardSet'
import { CategoryChip, StatusBadge } from './FormSet'
import { Footer } from './PatternSet'
import { HomeNavbar } from './HomePage'
import { useAuth } from './auth'
import { findEvent } from './data/events'
import { importantDates } from './data/eventMeta'

const I = ({ children }: { children: ReactNode }) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{children}</svg>
const icons = {
  calendar: <I><rect x="3" y="5" width="18" height="16" rx="3" /><path d="M8 3v4M16 3v4M3 10h18" /></I>,
  pin: <I><path d="M12 21s7-5.5 7-12a7 7 0 0 0-14 0c0 6.5 7 12 7 12Z" /><circle cx="12" cy="9" r="2.5" /></I>,
  ticket: <I><path d="M4 7a2 2 0 0 0 2-2h12a2 2 0 0 0 2 2v2a3 3 0 0 0 0 6v2a2 2 0 0 0-2 2H6a2 2 0 0 0-2-2v-2a3 3 0 0 0 0-6V7Z" /></I>,
  user: <I><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></I>,
  clock: <I><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></I>,
  trophy: <I><path d="M8 4h8v5a4 4 0 0 1-8 0V4ZM12 13v4M8 20h8" /><path d="M8 6H4v2a4 4 0 0 0 4 4M16 6h4v2a4 4 0 0 1-4 4" /></I>,
  check: <I><circle cx="12" cy="12" r="9" /><path d="m8 12 3 3 5-6" /></I>,
  alert: <I><circle cx="12" cy="12" r="9" /><path d="M12 7v6M12 17h.01" /></I>,
}

export default function EventDetailPage() {
  useEventCatalog()
  const { slug } = useParams()
  const event = findEvent(slug)
  const navigate = useNavigate()
  const location = useLocation()
  const { user, register, isRegistered } = useAuth()
  const [alert, setAlert] = useState<'success' | 'exists' | null>(null)

  if (!event) return <div className="home-frame details-frame"><div className="page-wash" aria-hidden="true" /><HomeNavbar active="Events" /><main className="home-container"><section className="events-empty not-found"><div role="heading" aria-level={1}>Event not found</div><p>This event may have moved or the link is incorrect.</p><DSButton type="Secondary" size="L" label="Back to all events" onClick={() => navigate('/events')} /></section></main><div className="home-footer"><Footer /></div></div>

  const registered = isRegistered(event.slug)
  const completed = event.status === 'Completed'
  const boothState = completed ? 'Completed' : event.status === 'Closed' ? 'Closed' : !user ? 'LoggedOut' : registered ? 'Registered' : 'Open'
  const handleRegister = () => navigate(`/events/${event.slug}/register`)
  const details = [['DATE & TIME', event.longDate, 'calendar', 'tint-yellow'], ['VENUE', event.venue, 'pin', 'tint-mint'], ['REGISTRATION FEE', event.fee, 'ticket', 'tint-pink'], ['CAPACITY', `${event.capacity} participants`, 'user', 'tint-blue'], ['REGISTRATION DEADLINE', event.deadline, 'clock', 'tint-peach'], ['CATEGORY', event.category, 'trophy', 'tint-green']] as const

  return <div className="home-frame details-frame" data-layer="03-event-details">
    <div className="page-wash" aria-hidden="true" />
    <HomeNavbar active="Events" />
    <main className="home-container">
      <div className="alert-slot" data-layer="alert-slot">{alert === 'success' && <div className="alert-ds" role="status">{icons.check}Registration confirmed! Your pass is in <Link to="/registrations" className="inline-link">My Registrations</Link>.</div>}{alert === 'exists' && <div className="alert-ds alert-error" role="alert">{icons.alert}You are already registered for this event.</div>}</div>
      <section className={`event-hero ${completed || event.status === 'Closed' ? 'is-completed' : ''}`} data-layer="event-hero">
        <div className="hero-panel" data-layer="hero-panel"><span className="breadcrumb"><Link to="/events">EVENTS</Link> / <Link to={`/events?category=${event.category}`}>{event.category.toUpperCase()}</Link></span><CategoryChip category={event.category} /><div className="detail-title" role="heading" aria-level={1}>{event.title}</div><StatusBadge status={event.status} /></div>
        <div className="event-banner-3d" data-layer="3d-event-banner"><i className="cube cube-a" /><i className="cube cube-b" /><i className="cube cube-c" /><b className="banner-gem g1" /><b className="banner-gem g2" /><b className="banner-gem g3" /><span className="streak s1" /><span className="streak s2" /></div>
      </section>
      <section className="event-body" data-layer="event-body">
        <div className="event-main">
          <section><div className="detail-h2" role="heading" aria-level={2}>About this event</div><div className="about-copy">{event.about.map(p => <p key={p}>{p}</p>)}</div></section>
          <section className="important-dates" aria-labelledby="dates-title"><div className="dates-head"><div><span className="hud-label">// SCHEDULE.LOG</span><div id="dates-title" className="detail-h2" role="heading" aria-level={2}>Important dates</div></div><span className="hud-chip">{event.status === 'Open' ? 'REGISTRATIONS LIVE' : event.status.toUpperCase()}</span></div><ol className="dates-track">{importantDates(event).map((d, i) => <li key={d.label} className={`date-node is-${d.phase}`}><span className="date-index">T{String(i).padStart(2, '0')}</span><span className="date-dot" aria-hidden="true" /><div><b>{d.label}</b><time>{d.date}</time><p>{d.note}</p></div>{d.phase === 'live' && <em>NOW</em>}</li>)}</ol></section>
          <section><div className="detail-h2" role="heading" aria-level={2}>Event details</div><div className="info-grid" data-layer="info-grid">{details.map(([label, value, icon, tint]) => <div className="info-ds" key={label}><span className={tint}>{icons[icon]}</span><div><small>{label}</small><b>{value}</b></div></div>)}</div></section>
          <DSButton type="Secondary" label="← Back to all events" onClick={() => navigate('/events')} />
        </div>
        <aside className="detail-booth" data-layer="booth"><TicketBooth state={boothState} fee={event.fee} date={event.longDate} venue={event.venue} onRegister={handleRegister} onLogin={() => navigate(`/login?next=${encodeURIComponent(`/events/${event.slug}/register`)}`)} onViewRegistrations={() => navigate('/registrations')} /></aside>
      </section>
    </main>
    <div className="home-footer"><Footer /></div>
  </div>
}
