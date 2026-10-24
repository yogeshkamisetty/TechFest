import { useEffect, useState, type ReactNode } from 'react'
import { Link, Navigate, useNavigate, useParams } from 'react-router'
import { useAuth } from './auth'
import { findEvent } from './data/events'
import { needsProject, teamSize, tracksFor } from './data/eventMeta'
import { useEventCatalog } from './eventCatalog'
import { HomeNavbar } from './HomePage'
import { CategoryChip } from './FormSet'

type Member = { name: string; email: string }
type Draft = { team: string; track: string; phone: string; year: string; members: Member[]; project: string; summary: string; agree: boolean }
type StepId = 'team' | 'lead' | 'members' | 'project' | 'review'

const I = ({ children }: { children: ReactNode }) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{children}</svg>
const stepIcons: Record<StepId, ReactNode> = {
  team: <I><path d="m12 3 1.5 5.5L19 10l-5.5 1.5L12 17l-1.5-5.5L5 10l5.5-1.5L12 3Z" /></I>,
  lead: <I><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></I>,
  members: <I><circle cx="9" cy="8" r="3.5" /><path d="M2.5 20a6.5 6.5 0 0 1 13 0M16 4.5a3.5 3.5 0 0 1 0 7M18 14a6 6 0 0 1 3.5 6" /></I>,
  project: <I><path d="M5 19c2-6 6-11 14-14-3 8-8 12-14 14ZM9 15l-3-3" /></I>,
  review: <I><path d="M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6l-8-3Z" /><path d="m9 12 2 2 4-4" /></I>,
}
const Check = () => <I><path d="m5 12 4 4L19 6" /></I>
const Alert = () => <I><circle cx="12" cy="12" r="9" /><path d="M12 7v6M12 17h.01" /></I>
const isEmail = (v: string) => /^\S+@\S+\.\S+$/.test(v.trim())

export default function RegisterPage() {
  useEventCatalog()
  const { slug } = useParams()
  const event = findEvent(slug)
  const { user, register, isRegistered } = useAuth()
  const navigate = useNavigate()
  const storageKey = `tfh.draft.${user?.email}.${slug}`
  const [min, max] = event ? teamSize(event) : [1, 1]
  const solo = max === 1
  const [draft, setDraft] = useState<Draft>(() => {
    try { const saved = localStorage.getItem(storageKey); if (saved) return JSON.parse(saved) as Draft } catch { /* fall back to a fresh draft */ }
    return { team: '', track: '', phone: '', year: '', members: Array.from({ length: Math.max(0, min - 1) }, () => ({ name: '', email: '' })), project: '', summary: '', agree: false }
  })
  const [stepIndex, setStepIndex] = useState(0)
  const [touched, setTouched] = useState(false)
  const [savedAt, setSavedAt] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (!event) return
    localStorage.setItem(storageKey, JSON.stringify(draft))
    setSavedAt(new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }))
  }, [draft, storageKey, event])

  if (!event) return <Navigate to="/events" replace />
  if (user?.role === 'admin') return <Navigate to="/admin" replace />
  if (event.status !== 'Open') return <Navigate to={`/events/${event.slug}`} replace />
  if (isRegistered(event.slug) && !submitting) return <Navigate to="/registrations" replace />

  const steps: { id: StepId; label: string; hint: string }[] = [
    { id: 'team', label: solo ? 'Entry' : 'Team', hint: solo ? 'Name & track' : 'Name & track' },
    { id: 'lead', label: solo ? 'You' : 'Team lead', hint: 'Primary contact' },
    ...(!solo ? [{ id: 'members' as StepId, label: 'Members', hint: `${min}–${max} builders` }] : []),
    ...(needsProject(event) ? [{ id: 'project' as StepId, label: 'Idea', hint: 'Short pitch' }] : []),
    { id: 'review', label: 'Review', hint: 'Confirm & submit' },
  ]
  const step = steps[stepIndex]
  const set = <K extends keyof Draft>(key: K, value: Draft[K]) => setDraft(d => ({ ...d, [key]: value }))
  const setMember = (i: number, key: keyof Member, value: string) => setDraft(d => ({ ...d, members: d.members.map((m, idx) => idx === i ? { ...m, [key]: value } : m) }))

  const errors: Partial<Record<string, string>> = {}
  if (step.id === 'team') {
    if (draft.team.trim().length < 3) errors.team = solo ? 'Enter a display name of at least 3 characters.' : 'Enter a team name of at least 3 characters.'
    if (!draft.track) errors.track = 'Choose a track to continue.'
  }
  if (step.id === 'lead') {
    if (!/^[6-9]\d{9}$/.test(draft.phone.replace(/\s/g, ''))) errors.phone = 'Enter a valid 10-digit mobile number.'
    if (!draft.year) errors.year = 'Select your year of study.'
  }
  if (step.id === 'members') draft.members.forEach((m, i) => {
    if (!m.name.trim()) errors[`m${i}name`] = 'Enter this member’s name.'
    if (!isEmail(m.email)) errors[`m${i}email`] = 'Enter a valid email.'
    else if (m.email.trim().toLowerCase() === user?.email) errors[`m${i}email`] = 'You are already the team lead.'
  })
  if (step.id === 'project') {
    if (draft.project.trim().length < 4) errors.project = 'Give your idea a short title.'
    if (draft.summary.trim().length < 30) errors.summary = 'Describe your idea in at least 30 characters.'
  }
  if (step.id === 'review' && !draft.agree) errors.agree = 'Please accept the participation guidelines.'
  const shown = touched ? errors : {}
  const valid = Object.keys(errors).length === 0

  const next = () => {
    setTouched(true)
    if (!valid) return
    setTouched(false)
    if (step.id !== 'review') return setStepIndex(i => i + 1)
    setSubmitting(true)
    window.setTimeout(() => {
      const result = register(event.slug)
      localStorage.removeItem(storageKey)
      navigate('/registrations', { state: { registered: event.slug, result } })
    }, 700)
  }
  const back = () => { setTouched(false); if (stepIndex === 0) navigate(`/events/${event.slug}`); else setStepIndex(i => i - 1) }
  const headings: Record<StepId, [string, string]> = {
    team: [solo ? 'Claim your entry' : 'Name your team', solo ? 'Pick how you’ll appear on the leaderboard, then choose a track.' : 'Pick a name that will look great on the leaderboard.'],
    lead: [solo ? 'Your contact details' : 'Who’s leading?', 'We’ll use these for check-in updates and schedule changes.'],
    members: ['Assemble your crew', `Add ${min === max ? min - 1 : `${min - 1}–${max - 1}`} teammate${max - 1 === 1 ? '' : 's'} besides you.`],
    project: ['Pitch your idea', 'A short, honest description is perfect. You can refine it later.'],
    review: ['One last look', 'Check everything before your pass is issued.'],
  }

  const preview = {
    event: event.slug, [solo ? 'entry' : 'team']: draft.team || null, track: draft.track || null,
    lead: user?.name ?? null, lead_email: user?.email ?? null, phone: draft.phone ? draft.phone.replace(/\d(?=\d{4})/g, '•') : null,
    ...(solo ? {} : { members: draft.members.length + 1 }),
    ...(needsProject(event) ? { idea: draft.project || null } : {}),
    fee: event.fee, step: `${stepIndex + 1}/${steps.length}`,
  }

  return <div className="home-frame register-frame">
    <div className="page-wash" aria-hidden="true" />
    <HomeNavbar active="Events" />
    <main className="home-container register-main">
      <header className="register-head">
        <div><span className="hud-label">// REGISTRATION · {event.category.toUpperCase()}</span><div className="register-title" role="heading" aria-level={1}>{event.title}</div><div className="register-meta"><span>{event.longDate}</span><i /><span>{event.venue}</span><i /><span>{solo ? 'SOLO ENTRY' : `TEAM OF ${min}–${max}`}</span></div></div>
        <Link to={`/events/${event.slug}`} className="register-exit">Save & exit</Link>
      </header>
      <div className="register-grid">
        <aside className="register-side">
          <div className="register-rail"><div className="rail-head"><b>{solo ? 'Solo registration' : 'Team registration'}</b><span className={event.fee === 'Free' ? 'fee-free' : 'fee-paid'}>{event.fee === 'Free' ? 'FREE' : event.fee}</span></div>
            <ol>{steps.map((s, i) => <li key={s.id} className={i === stepIndex ? 'current' : i < stepIndex ? 'done' : ''}><button type="button" disabled={i > stepIndex} onClick={() => { setTouched(false); setStepIndex(i) }} aria-current={i === stepIndex ? 'step' : undefined}><span className="rail-icon">{i < stepIndex ? <Check /> : stepIcons[s.id]}</span><span><b>{s.label}</b><small>{s.hint}</small></span></button></li>)}</ol>
          </div>
          <div className="live-preview" aria-label="Live registration preview"><div className="preview-bar"><span /><span /><span /><code>registration.json · live</code></div><pre>{'{\n'}{Object.entries(preview).map(([k, v], i, arr) => <span key={k}>  <span className="pk">"{k}"</span>: <span className={v === null ? 'pn' : typeof v === 'number' ? 'pnum' : 'ps'}>{v === null ? 'null' : typeof v === 'number' ? v : `"${v}"`}</span>{i < arr.length - 1 ? ',' : ''}{'\n'}</span>)}{'}'}</pre></div>
        </aside>

        <section className="register-card" aria-labelledby="step-title">
          <div className="register-card-top"><div className="step-progress" aria-hidden="true"><i style={{ width: `${((stepIndex + 1) / steps.length) * 100}%` }} /></div><span className="autosave">{savedAt ? `Draft autosaved · ${savedAt}` : 'Draft ready'}</span></div>
          <span className="hud-label">STEP {String(stepIndex + 1).padStart(2, '0')} / {String(steps.length).padStart(2, '0')}</span>
          <div id="step-title" className="step-title" role="heading" aria-level={2}>{headings[step.id][0]}</div>
          <p className="step-sub">{headings[step.id][1]}</p>

          {step.id === 'team' && <>
            <div className={`form-group ${shown.team ? 'input-error' : ''}`}><label htmlFor="reg-team">{solo ? 'DISPLAY NAME' : 'TEAM NAME'}</label><div className="form-input"><input id="reg-team" value={draft.team} maxLength={32} onChange={e => set('team', e.target.value)} placeholder={solo ? 'e.g. Aarav S.' : 'e.g. Circuit Sutra'} aria-invalid={Boolean(shown.team) || undefined} /></div>{shown.team ? <div className="input-helper"><span className="helper-alert"><Alert /></span>{shown.team}</div> : draft.team.trim().length >= 3 && <div className="field-ok"><Check />Looks good</div>}</div>
            <fieldset className="track-field"><legend>TRACK <span aria-hidden="true">*</span></legend><div className="track-grid">{tracksFor(event).map((t, i) => <label key={t} className={`track-option ${draft.track === t ? 'selected' : ''}`}><input type="radio" name="track" value={t} checked={draft.track === t} onChange={() => set('track', t)} /><span className={`track-glyph tg-${i % 6}`}>{String(i + 1).padStart(2, '0')}</span><b>{t}</b></label>)}</div>{shown.track && <div className="input-helper"><span className="helper-alert"><Alert /></span>{shown.track}</div>}<p className="field-note">Each registration competes in one track. Not sure? Choose the open category.</p></fieldset>
          </>}

          {step.id === 'lead' && <div className="reg-fields">
            <div className="readonly-card"><span className="rail-icon">{stepIcons.lead}</span><div><b>{user?.name}</b><small>{user?.email} · {user?.department}</small></div><span className="hud-chip">FROM PROFILE</span></div>
            <div className={`form-group ${shown.phone ? 'input-error' : ''}`}><label htmlFor="reg-phone">MOBILE NUMBER</label><div className="form-input"><span className="input-prefix">+91</span><input id="reg-phone" inputMode="numeric" autoComplete="tel-national" value={draft.phone} maxLength={11} onChange={e => set('phone', e.target.value.replace(/[^\d ]/g, ''))} placeholder="98765 43210" aria-invalid={Boolean(shown.phone) || undefined} /></div>{shown.phone && <div className="input-helper"><span className="helper-alert"><Alert /></span>{shown.phone}</div>}</div>
            <div className={`form-group ${shown.year ? 'input-error' : ''}`}><label htmlFor="reg-year">YEAR OF STUDY</label><div className="year-pills" id="reg-year" role="radiogroup" aria-label="Year of study">{['1st', '2nd', '3rd', '4th', 'PG'].map(y => <button type="button" role="radio" aria-checked={draft.year === y} key={y} className={draft.year === y ? 'selected' : ''} onClick={() => set('year', y)}>{y}</button>)}</div>{shown.year && <div className="input-helper"><span className="helper-alert"><Alert /></span>{shown.year}</div>}</div>
          </div>}

          {step.id === 'members' && <div className="reg-fields">
            <div className="member-row lead-row"><span className="member-index">01</span><div><b>{user?.name}</b><small>{user?.email}</small></div><span className="hud-chip">LEAD</span></div>
            {draft.members.map((m, i) => <div className="member-row" key={i}><span className="member-index">{String(i + 2).padStart(2, '0')}</span>
              <div className={`form-group ${shown[`m${i}name`] ? 'input-error' : ''}`}><label htmlFor={`m${i}n`}>NAME</label><div className="form-input"><input id={`m${i}n`} value={m.name} onChange={e => setMember(i, 'name', e.target.value)} placeholder="Teammate name" /></div>{shown[`m${i}name`] && <div className="input-helper"><span className="helper-alert"><Alert /></span>{shown[`m${i}name`]}</div>}</div>
              <div className={`form-group ${shown[`m${i}email`] ? 'input-error' : ''}`}><label htmlFor={`m${i}e`}>EMAIL</label><div className="form-input"><input id={`m${i}e`} type="email" value={m.email} onChange={e => setMember(i, 'email', e.target.value)} placeholder="name@college.edu" /></div>{shown[`m${i}email`] && <div className="input-helper"><span className="helper-alert"><Alert /></span>{shown[`m${i}email`]}</div>}</div>
              {draft.members.length + 1 > min && <button type="button" className="member-remove" onClick={() => set('members', draft.members.filter((_, idx) => idx !== i))} aria-label={`Remove member ${i + 2}`}>Remove</button>}
            </div>)}
            {draft.members.length + 1 < max && <button type="button" className="add-member" onClick={() => set('members', [...draft.members, { name: '', email: '' }])}>+ Add teammate <span>{draft.members.length + 1}/{max}</span></button>}
          </div>}

          {step.id === 'project' && <div className="reg-fields">
            <div className={`form-group ${shown.project ? 'input-error' : ''}`}><label htmlFor="reg-project">IDEA TITLE</label><div className="form-input"><input id="reg-project" value={draft.project} maxLength={60} onChange={e => set('project', e.target.value)} placeholder="e.g. QueueLess Canteen" /></div>{shown.project && <div className="input-helper"><span className="helper-alert"><Alert /></span>{shown.project}</div>}</div>
            <div className={`form-group ${shown.summary ? 'input-error' : ''}`}><label htmlFor="reg-summary">WHAT ARE YOU BUILDING?</label><textarea id="reg-summary" className="reg-textarea" rows={5} maxLength={400} value={draft.summary} onChange={e => set('summary', e.target.value)} placeholder="The problem, who it helps and your first idea for solving it." /><div className="char-count">{draft.summary.length}/400</div>{shown.summary && <div className="input-helper"><span className="helper-alert"><Alert /></span>{shown.summary}</div>}</div>
          </div>}

          {step.id === 'review' && <div className="reg-fields">
            <dl className="review-list">
              <div><dt>{solo ? 'Entry' : 'Team'}</dt><dd>{draft.team}</dd><button type="button" onClick={() => setStepIndex(0)}>Edit</button></div>
              <div><dt>Track</dt><dd><CategoryChip category={event.category} label={draft.track} /></dd><button type="button" onClick={() => setStepIndex(0)}>Edit</button></div>
              <div><dt>Contact</dt><dd>{user?.name} · +91 {draft.phone} · {draft.year} year</dd><button type="button" onClick={() => setStepIndex(1)}>Edit</button></div>
              {!solo && <div><dt>Members</dt><dd>{[user?.name, ...draft.members.map(m => m.name)].join(', ')}</dd><button type="button" onClick={() => setStepIndex(steps.findIndex(s => s.id === 'members'))}>Edit</button></div>}
              {needsProject(event) && <div><dt>Idea</dt><dd>{draft.project}</dd><button type="button" onClick={() => setStepIndex(steps.findIndex(s => s.id === 'project'))}>Edit</button></div>}
              <div><dt>Entry fee</dt><dd>{event.fee === 'Free' ? 'Free' : `${event.fee} · pay at the venue desk`}</dd></div>
            </dl>
            <label className={`agree-row ${shown.agree ? 'has-error' : ''}`}><input type="checkbox" checked={draft.agree} onChange={e => set('agree', e.target.checked)} /><span>I confirm these details are correct and agree to the festival participation guidelines.</span></label>
            {shown.agree && <div className="input-helper"><span className="helper-alert"><Alert /></span>{shown.agree}</div>}
          </div>}

          <div className="register-actions"><button type="button" className="btn btn-secondary btn-size-l" onClick={back} disabled={submitting}>← {stepIndex === 0 ? 'Event details' : 'Back'}</button><button type="button" className={`btn btn-primary btn-size-l ${submitting ? 'is-loading' : ''}`} onClick={next} disabled={submitting}>{submitting ? <span className="btn-spinner" aria-label="Submitting registration" /> : step.id === 'review' ? 'Confirm registration' : 'Continue →'}</button></div>
        </section>
      </div>
    </main>
  </div>
}
