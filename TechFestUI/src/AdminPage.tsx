import { useState, type FormEvent } from 'react'
import { Link, NavLink, Navigate, Outlet, useLocation, useNavigate } from 'react-router'
import { useAuth } from './auth'
import { useEventCatalog, updateEvent } from './eventCatalog'
import { DSButton } from './ButtonSet'
import { StatusBadge } from './FormSet'
import { type FestEvent } from './data/events'

export function AdminLayout() {
  const { user, logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  if (!user) return <Navigate to={`/login?next=${encodeURIComponent(location.pathname)}`} replace />
  if (user.role !== 'admin') return <div className="admin-denied"><div className="heading heading-medium">Admin access only</div><p>Your student account cannot access festival management.</p><Link to="/">Return to the festival</Link></div>
  return <div className="admin-shell"><aside className="admin-sidebar"><Link to="/" className="home-logo"><span className="lotus-ticket"><i /><i /><i /></span>TECH FEST HUB</Link><span className="eyebrow">FESTIVAL OFFICE</span><nav>{[['/admin', 'Overview'], ['/admin/events', 'Events'], ['/admin/registrations', 'Registrations'], ['/admin/students', 'Students']].map(([to, label]) => <NavLink key={to} to={to} end={to === '/admin'}>{label}</NavLink>)}</nav><div className="admin-sidebar-bottom"><p>Local demo workspace<br /><small>Changes stay in this browser.</small></p><DSButton type="Secondary" label="Logout" onClick={() => { logout(); navigate('/login') }} /></div></aside><div className="admin-content"><header className="admin-top"><span className="eyebrow">UTSAV ARENA / ADMIN</span><Link to="/events">View festival →</Link><span className="admin-avatar">FA</span></header><Outlet /></div></div>
}

export default function AdminPage({ section = 'overview' }: { section?: 'overview' | 'events' | 'registrations' | 'students' }) {
  const { students, adminRegistrations } = useAuth()
  const events = useEventCatalog()
  const [search, setSearch] = useState('')
  const [editing, setEditing] = useState<FestEvent | null>(null)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const titles = { overview: ['Festival at a glance', 'A little organisation. A lot of possibility.'], events: ['Your festival programme', 'Manage event information and registration availability.'], registrations: ['Every pass, in one place', 'A live view of the registrations stored in this browser.'], students: ['The minds behind the magic', 'Student accounts in your local festival workspace.'] }
  const filteredEvents = events.filter(e => `${e.title} ${e.category}`.toLowerCase().includes(search.toLowerCase()))
  const filteredRegs = adminRegistrations.filter(r => `${r.name} ${r.email} ${r.regId} ${events.find(e => e.slug === r.slug)?.title}`.toLowerCase().includes(search.toLowerCase()))
  const filteredStudents = students.filter(s => `${s.name} ${s.email} ${s.department}`.toLowerCase().includes(search.toLowerCase()))
  const save = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!editing) return
    const data = new FormData(event.currentTarget)
    const title = String(data.get('title')).trim(), venue = String(data.get('venue')).trim()
    const fee = Number(data.get('fee'))
    if (!title || !venue || !Number.isFinite(fee) || fee < 0) return setError('Enter a title, venue and a valid non-negative fee.')
    try { updateEvent(editing.slug, { title, venue, fee: fee === 0 ? 'Free' : `₹${fee}`, status: String(data.get('status')) as FestEvent['status'] }); setMessage('Event updated. Changes are reflected on the student pages.'); setEditing(null); setError('') } catch { setError('Unable to save. Please allow browser storage and try again.') }
  }
  return <main className="admin-main"><div className="admin-page-heading"><div><div className="eyebrow">{section === 'overview' ? 'WELCOME BACK, FESTIVAL TEAM' : 'MANAGE / ' + section.toUpperCase()}</div><div className="heading heading-large">{titles[section][0]}</div><p>{titles[section][1]}</p></div><span className="admin-season">TECH FEST<br /><b>2026</b></span></div>
    {message && <div className="alert-ds" role="status">{message}</div>}
    {section === 'overview' && <><div className="admin-stats">{[['Events', events.length, 'peach'], ['Open for registration', events.filter(e => e.status === 'Open').length, 'mint'], ['Student accounts', students.length, 'pink'], ['Confirmed passes', adminRegistrations.filter(r => r.status === 'Confirmed').length, 'blue']].map(([label, count, color]) => <div key={label} className={`admin-stat ${color}`}><span className="eyebrow">{label}</span><strong>{count}</strong></div>)}</div><div className="admin-section-head"><div className="heading heading-medium">The programme</div><Link to="/admin/events">Manage events →</Link></div></>}
    {section !== 'overview' && <label className="search-ds admin-search"><input aria-label={`Search ${section}`} value={search} onChange={e => setSearch(e.target.value)} placeholder={`Search ${section}…`} /></label>}
    <div className="admin-table-wrap"><table className="table-ds"><thead><tr>{(section === 'students' ? ['STUDENT', 'EMAIL', 'DEPARTMENT'] : section === 'registrations' ? ['PASS ID', 'STUDENT', 'EVENT', 'REGISTERED', 'STATUS'] : ['EVENT', 'CATEGORY', 'VENUE', 'FEE', 'STATUS', '']).map((label, i) => <th key={i}>{label}</th>)}</tr></thead><tbody>
      {(section === 'overview' || section === 'events') && filteredEvents.map(e => <tr key={e.slug}><td><Link to={`/events/${e.slug}`}>{e.title}</Link></td><td>{e.category}</td><td>{e.venue}</td><td>{e.fee}</td><td><StatusBadge status={e.status} /></td><td><DSButton type="Ghost" label="Edit" onClick={() => { setEditing({ ...e }); setError('') }} /></td></tr>)}
      {section === 'registrations' && filteredRegs.map(r => <tr key={r.email + r.regId}><td>{r.regId}</td><td>{r.name}<small className="admin-subtext">{r.email}</small></td><td>{events.find(e => e.slug === r.slug)?.title ?? r.slug}</td><td>{r.registeredOn}</td><td><StatusBadge status={r.status} /></td></tr>)}
      {section === 'students' && filteredStudents.map(s => <tr key={s.email}><td>{s.name}</td><td>{s.email}</td><td>{s.department}</td></tr>)}
    </tbody></table>{((section === 'students' && !filteredStudents.length) || (section === 'registrations' && !filteredRegs.length) || ((section === 'events' || section === 'overview') && !filteredEvents.length)) && <p className="admin-empty">No matching records.</p>}</div>
    <p className="admin-local-note">Demo environment · Data is stored locally, not shared across browsers. This is not a secure production admin service.</p>
    {editing && <div className="admin-modal-backdrop"><section className="admin-editor" role="dialog" aria-modal="true" aria-labelledby="admin-editor-title"><div id="admin-editor-title" className="heading heading-medium">Edit event</div><p>Update the details students see on the festival pages.</p><form key={editing.slug} onSubmit={save}>{[['title', 'EVENT TITLE', editing.title], ['venue', 'VENUE', editing.venue], ['fee', 'FEE IN ₹ · 0 FOR FREE', editing.fee === 'Free' ? '0' : editing.fee.replace('₹', '')]].map(([name, label, value]) => <label className="input-wrap" key={name}><span>{label}</span><input autoFocus={name === 'title'} name={name} defaultValue={value} type={name === 'fee' ? 'number' : 'text'} min={name === 'fee' ? '0' : undefined} required /></label>)}<label className="input-wrap"><span>STATUS</span><select name="status" defaultValue={editing.status}>{['Open', 'Closed', 'Completed'].map(s => <option key={s}>{s}</option>)}</select></label>{error && <div className="alert-ds alert-error" role="alert">{error}</div>}<div className="admin-editor-actions"><DSButton type="Secondary" label="Discard changes" onClick={() => setEditing(null)} /><button className="btn btn-primary" type="submit">Save event</button></div></form></section></div>}
  </main>
}
