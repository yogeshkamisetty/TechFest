import { useEventCatalog } from './eventCatalog'
import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router'
import { DSButton } from './ButtonSet'
import { PassCard } from './CardSet'
import { Footer } from './PatternSet'
import { HomeNavbar } from './HomePage'
import { useAuth } from './auth'
import { findEvent } from './data/events'
import { useIsMobile } from './router'

const Check = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9" /><path d="m8 12 3 3 5-6" /></svg>
const AlertIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9" /><path d="M12 7v6M12 17h.01" /></svg>

export default function RegistrationsPage() {
  useEventCatalog()
  const { user, registrations } = useAuth()
  const navigate = useNavigate()
  const mobile = useIsMobile()
  const location = useLocation()
  // Keep the success message for this visit only, then clear router state so a refresh doesn't replay it.
  const [flash] = useState(() => (location.state ?? {}) as { registered?: string; result?: 'ok' | 'exists' })
  useEffect(() => { if (location.state) navigate('.', { replace: true, state: null }) }, []) // eslint-disable-line react-hooks/exhaustive-deps
  const passes = registrations.map(r => ({ reg: r, event: findEvent(r.slug) })).filter(p => p.event)
  const confirmed = registrations.filter(r => r.status === 'Confirmed').length
  const stats = [['TOTAL', registrations.length, 'ash'], ['CONFIRMED', confirmed, 'green'], ['CANCELLED', registrations.length - confirmed, 'red']] as const
  const firstName = user?.name.split(' ')[0]

  return <div className="home-frame registrations-frame" data-layer="06-my-registrations">
    <div className="page-wash" aria-hidden="true" />
    <HomeNavbar active="MyReg" />
    <main className="home-container registrations-main">
      <header className="registrations-header" data-layer="page-header"><span className="login-eyebrow">YOUR PASSES</span><div className="registrations-title" role="heading" aria-level={1}>Hi <em>{firstName}</em>, here are your events</div>
        <div className="stat-row" data-layer="stat-row">{stats.map(([label, value, dot]) => <div className={`stat-ds dashboard-card dot-${dot}`} key={label}><strong>{value}</strong><span><i />{label}</span></div>)}</div></header>
      {flash.registered && <div className="registrations-alert" data-layer="alert-slot">{flash.result === 'exists' ? <div className="alert-ds alert-error" role="alert"><AlertIcon />You are already registered for this event.</div> : <div className="alert-ds" role="status"><Check />You have registered successfully.</div>}</div>}
      {passes.length === 0 ? <section className="registrations-empty"><div className="empty-ticket-art" aria-hidden="true"><span>TFH</span></div><div role="heading" aria-level={2}>No registrations yet</div><p>Pick an event and claim your first pass.</p><DSButton size="L" label="Explore Events" onClick={() => navigate('/events')} /></section>
        : <div className={mobile ? 'mobile-pass-list' : 'my-pass-grid'} data-layer="pass-grid">{passes.map(({ reg, event }) => <PassCard key={reg.regId} category={event!.category} title={event!.title} date={event!.passDate} venue={event!.venue} status={reg.status} regId={reg.regId} regDate={reg.registeredOn} mobile={mobile} onView={() => navigate(`/events/${event!.slug}`)} />)}</div>}
    </main>
    <div className="home-footer"><Footer /></div>
  </div>
}
