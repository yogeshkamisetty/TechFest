import { useEventCatalog } from './eventCatalog'
import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router'
import { DSButton } from './ButtonSet'
import { DSEventCard } from './CardSet'
import { CategoryChip } from './FormSet'
import { Footer } from './PatternSet'
import { HomeNavbar } from './HomePage'
import { useAuth } from './auth'
import { type EventStatus } from './data/events'
import { useRegisterFlow } from './useRegisterFlow'

const chips = ['All', 'Coding', 'Quiz', 'Robotics', 'Hackathon', 'Gaming', 'Design']
const feeValue = (fee: string) => fee === 'Free' ? 0 : Number(fee.replace('₹', ''))
const statusOrder: Record<EventStatus, number> = { Open: 0, Closed: 1, Completed: 2 }

export default function EventsPage() {
  const events = useEventCatalog()
  const navigate = useNavigate()
  const startRegister = useRegisterFlow()
  const { isRegistered } = useAuth()
  const [params, setParams] = useSearchParams()
  const category = chips.includes(params.get('category') ?? '') ? params.get('category')! : 'All'
  const query = params.get('q') ?? ''
  const [sort, setSort] = useState(params.get('sort') ?? 'date')
  const [openOnly, setOpenOnly] = useState(params.get('open') === '1')

  // Keep filters in the URL so filtered views can be shared and survive refresh.
  const update = (key: string, value: string) => { const next = new URLSearchParams(params); if (value) next.set(key, value); else next.delete(key); setParams(next, { replace: true }) }
  useEffect(() => { update('sort', sort === 'date' ? '' : sort) }, [sort]) // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { update('open', openOnly ? '1' : '') }, [openOnly]) // eslint-disable-line react-hooks/exhaustive-deps

  const visible = useMemo(() => events
    .filter(e => e.title.toLowerCase().includes(query.trim().toLowerCase()) && (category === 'All' || e.category === category) && (!openOnly || e.status === 'Open'))
    .sort((a, b) => sort === 'fee' ? feeValue(a.fee) - feeValue(b.fee) : sort === 'name' ? a.title.localeCompare(b.title) : statusOrder[a.status] - statusOrder[b.status]), [events, query, category, openOnly, sort])
  const clear = () => { setSort('date'); setOpenOnly(false); setParams({}, { replace: true }) }

  return <div className="home-frame events-frame" data-layer="02-events">
    <div className="page-wash" aria-hidden="true" />
    <HomeNavbar active="Events" />
    <main>
      <section className="events-header" data-layer="page-header"><div className="home-jaali" /><div className="home-container"><div className="breadcrumb">HOME / EVENTS</div><div className="events-title" role="heading" aria-level={1}>Find your next <em>challenge</em></div><p>Browse technical events across campus, filter by category and register in a few clicks.</p></div><div className="header-magnifier" data-layer="3d-header-shape"><i /><b /><span /></div></section>

      <div className="events-filter home-container" data-layer="filter-bar">
        <div className="filter-row"><label className="search-ds"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></svg><input type="search" value={query} onChange={e => update('q', e.target.value)} placeholder="Search events by name…" aria-label="Search events by name" /></label>
          <label className="events-select"><span>Sort by:</span><select value={sort} onChange={e => setSort(e.target.value)}><option value="date">Date (soonest)</option><option value="fee">Fee: low to high</option><option value="name">Name A–Z</option></select></label>
          <button className={`toggle-ds ${openOnly ? 'on' : ''}`} role="switch" aria-checked={openOnly} onClick={() => setOpenOnly(!openOnly)}><i />Open only</button>
          <span className="filter-count" aria-live="polite">{visible.length} {visible.length === 1 ? 'EVENT' : 'EVENTS'}</span></div>
        <div className="chip-row">{chips.map(c => <button key={c} className="chip-button" aria-pressed={category === c} onClick={() => update('category', c === 'All' ? '' : c)}><CategoryChip category={c === 'All' ? 'Default' : c} label={c} active={category === c} /></button>)}</div>
      </div>

      <section className="events-grid home-container" data-layer="event-grid">
        {visible.length ? visible.map(e => <DSEventCard key={e.slug} title={e.title} category={e.category} date={e.cardDate} day={e.day} venue={e.venue} fee={e.fee === 'Free' ? 'Free' : 'Paid'} price={e.fee} status={e.status} angle={e.angle} registered={isRegistered(e.slug)} onDetails={() => navigate(`/events/${e.slug}`)} onRegister={() => startRegister(e.slug)} />)
          : <div className="events-empty"><div className="empty-magnifier"><i /><b /></div><div role="heading" aria-level={2}>No events match your search</div><p>Try a different keyword or clear your filters.</p><DSButton type="Secondary" size="L" label="Clear filters" onClick={clear} /></div>}
      </section>
    </main>
    <div className="home-footer"><Footer /></div>
  </div>
}
