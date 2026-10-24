import { useState, type FormEvent, type ReactNode } from 'react'
import { Link, Navigate, useNavigate, useSearchParams } from 'react-router'
import { useAuth } from './auth'
import { safeNext } from './LoginPage'

type Values = { name: string; email: string; password: string; confirm: string; department: string }
const empty: Values = { name: '', email: '', password: '', confirm: '', department: '' }
const departments = ['Computer Science', 'Electronics', 'Mechanical', 'Design']

const I = ({ children, className }: { children: ReactNode; className?: string }) => <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{children}</svg>
const icons = {
  user: <I><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></I>,
  mail: <I><rect x="3" y="5" width="18" height="14" rx="3" /><path d="m4 7 8 6 8-6" /></I>,
  lock: <I><rect x="5" y="10" width="14" height="11" rx="3" /><path d="M8 10V7a4 4 0 0 1 8 0v3" /></I>,
  building: <I><path d="M4 21V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v16M16 9h2a2 2 0 0 1 2 2v10M2 21h20M8 7h4M8 11h4M8 15h4" /></I>,
}
const Eye = ({ off }: { off: boolean }) => off ? <I><path d="M3 3l18 18M10.6 5.1A11 11 0 0 1 12 5c6.5 0 10 7 10 7a17 17 0 0 1-3 3.9M6.6 6.6C3.7 8.4 2 12 2 12s3.5 7 10 7a10 10 0 0 0 5.4-1.6" /></I> : <I><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" /><circle cx="12" cy="12" r="3" /></I>
const Check = () => <I className="status-good"><circle cx="12" cy="12" r="9" /><path d="m8 12 3 3 5-6" /></I>
const Alert = () => <I className="helper-alert"><circle cx="12" cy="12" r="9" /><path d="M12 7v6M12 17h.01" /></I>

export function strength(p: string) {
  if (!p) return 'Empty'
  const score = Number(p.length >= 8) + Number(/\d/.test(p)) + Number(/[^A-Za-z0-9]|[A-Z]/.test(p))
  return score >= 3 ? 'Strong' : score === 2 ? 'Medium' : 'Weak'
}
function validate(v: Values) {
  return {
    name: v.name.trim() ? '' : 'Enter your full name.',
    email: /^\S+@\S+\.\S+$/.test(v.email.trim()) ? '' : 'Enter a valid college email.',
    password: v.password.length >= 8 && /\d/.test(v.password) ? '' : 'Use 8+ characters with a number',
    confirm: v.confirm && v.confirm === v.password ? '' : 'Passwords do not match',
    department: v.department.trim() ? '' : 'Enter your department.',
  }
}

export function StrengthMeter({ level }: { level: string }) {
  const count = { Empty: 0, Weak: 1, Medium: 2, Strong: 4 }[level] ?? 0
  return <div className={`strength-set signup-strength strength-${level.toLowerCase()}`} data-layer="strength-meter"><div>{Array.from({ length: 4 }).map((_, i) => <i key={i} className={i < count ? 'filled' : ''} />)}</div><p>Use 8+ characters with a number</p></div>
}

function Field({ id, label, icon, value, onChange, placeholder, error, type = 'text', reveal, children, onFocus, onBlur, autoComplete, disabled }: { id: string; label: string; icon: ReactNode; value: string; onChange: (v: string) => void; placeholder: string; error?: string; type?: string; reveal?: boolean; children?: ReactNode; onFocus?: () => void; onBlur?: () => void; autoComplete?: string; disabled?: boolean }) {
  const [show, setShow] = useState(false)
  return <div className={`form-group signup-field ${error ? 'input-error' : ''} ${disabled ? 'input-disabled' : ''}`}>
    <label htmlFor={id}>{label}</label>
    <div className="form-input"><span className="input-left-icon">{icon}</span><input id={id} type={reveal && show ? 'text' : type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} onFocus={onFocus} onBlur={onBlur} autoComplete={autoComplete} disabled={disabled} aria-invalid={Boolean(error) || undefined} aria-describedby={error ? `${id}-error` : undefined} />{reveal && <button type="button" className="input-eye" onClick={() => setShow(!show)} aria-label={show ? `Hide ${label.toLowerCase()}` : `Show ${label.toLowerCase()}`}><Eye off={show} /></button>}</div>
    {children}{error && !children && <div className="input-helper" id={`${id}-error`}><Alert />{error}</div>}
  </div>
}

function SignupScene() {
  const glyphs = ['</>', '?', '⌁', '✦', '◆', '◒', '∿']
  return <div className="signup-scene-3d" data-layer="3d-signup-scene" aria-hidden="true"><div className="turmeric-sphere" />{glyphs.map((g, i) => <span key={g} className={`glass-tile t${i}`}><b>{g}</b></span>)}<div className="clay-ticket"><span>TFH</span></div></div>
}

export default function SignupPage() {
  const { user, signup } = useAuth()
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const next = safeNext(params.get('next'))
  const [v, setV] = useState(empty)
  const [submitted, setSubmitted] = useState(false)
  const [exists, setExists] = useState(false)
  const [deptOpen, setDeptOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  if (user && !loading) return <Navigate to={next} replace />

  const errors = validate(v)
  const shown = submitted ? errors : { name: '', email: '', password: '', confirm: '', department: '' }
  const level = strength(v.password)
  const set = (key: keyof Values) => (value: string) => { setV(current => ({ ...current, [key]: value })); if (key === 'email') setExists(false) }
  const suggestions = departments.filter(d => d.toLowerCase().includes(v.department.toLowerCase()))
  const submit = (e: FormEvent) => {
    e.preventDefault(); setSubmitted(true)
    if (Object.values(errors).some(Boolean)) return
    setLoading(true)
    window.setTimeout(() => {
      if (signup({ name: v.name, email: v.email, password: v.password, department: v.department }) === 'exists') { setExists(true); setLoading(false) }
      else navigate(next, { replace: true })
    }, 600)
  }

  return <div className="login-frame signup-frame" data-layer="05-signup">
    <div className="auth-split signup-split" data-layer="auth-split">
      <section className="auth-form-side signup-form-side"><Link className="auth-logo" to="/" aria-label="Tech Fest Hub home"><span className="lotus-ticket"><i /><i /><i /></span>TECH FEST HUB</Link>
        <div className="form-container signup-card" data-layer="form-container">
          <span className="login-eyebrow">JOIN THE ARENA</span><div className="login-title" role="heading" aria-level={1}>Create your student account</div><p className="login-sub">Takes less than a minute.</p>
          <div className="signup-alert-slot" data-layer="alert-slot">{exists && <div className="alert-ds alert-error" role="alert"><Alert />An account with this email already exists. <Link className="inline-link" to="/login">Log in instead</Link></div>}</div>
          <form onSubmit={submit} noValidate>
            <Field id="signup-name" label="FULL NAME" icon={icons.user} value={v.name} onChange={set('name')} placeholder="Aarav Sharma" error={shown.name} autoComplete="name" disabled={loading} />
            <Field id="signup-email" label="EMAIL" icon={icons.mail} value={v.email} onChange={set('email')} placeholder="you@college.edu" error={shown.email} type="email" autoComplete="email" disabled={loading} />
            <Field id="signup-password" label="PASSWORD" icon={icons.lock} value={v.password} onChange={set('password')} placeholder="Create a password" type="password" reveal error={shown.password} autoComplete="new-password" disabled={loading}><StrengthMeter level={level} /></Field>
            <Field id="signup-confirm" label="CONFIRM PASSWORD" icon={icons.lock} value={v.confirm} onChange={set('confirm')} placeholder="Re-enter your password" type="password" reveal error={shown.confirm} autoComplete="new-password" disabled={loading}>{v.confirm ? <div className="match-line" id="signup-confirm-error">{v.confirm === v.password ? <><Check />Passwords match</> : <><Alert />Passwords do not match</>}</div> : shown.confirm ? <div className="match-line" id="signup-confirm-error"><Alert />{shown.confirm}</div> : null}</Field>
            <div className="department-wrap">
              <Field id="signup-department" label="DEPARTMENT" icon={icons.building} value={v.department} onChange={value => { set('department')(value); setDeptOpen(true) }} placeholder="e.g. Computer Science" error={shown.department} onFocus={() => setDeptOpen(true)} onBlur={() => window.setTimeout(() => setDeptOpen(false), 120)} autoComplete="off" disabled={loading} />
              {deptOpen && suggestions.length > 0 && <div className="dept-menu" role="listbox" aria-label="Department suggestions">{suggestions.map(d => <button type="button" role="option" aria-selected={v.department === d} key={d} onMouseDown={e => e.preventDefault()} onClick={() => { set('department')(d); setDeptOpen(false) }}>{d}</button>)}</div>}
            </div>
            <button type="submit" className="submit-shell signup-submit" disabled={loading}><span className={`btn btn-primary btn-size-l ${loading ? 'is-loading' : ''}`}>{loading ? <span className="btn-spinner" aria-label="Creating account" /> : 'Create Account'}</span></button>
          </form>
          <p className="login-create signup-login">Already have an account? <Link to={`/login${params.get('next') ? `?next=${encodeURIComponent(next)}` : ''}`}>Log in</Link></p>
        </div>
      </section>
      <section className="auth-scene signup-scene" data-layer="auth-scene"><div className="toran-ds auth-toran" /><SignupScene /><div className="auth-quote-block"><div className="auth-quote">Join 500+ students competing this season.</div></div></section>
    </div>
  </div>
}
