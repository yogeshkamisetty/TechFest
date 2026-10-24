import { useState, type FormEvent, type ReactNode } from 'react'
import { Link, Navigate, useNavigate, useSearchParams } from 'react-router'
import { ADMIN_CREDENTIALS, DEMO_CREDENTIALS, useAuth } from './auth'

const I = ({ children, className }: { children: ReactNode; className?: string }) => <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{children}</svg>
const Mail = () => <I><rect x="3" y="5" width="18" height="14" rx="3" /><path d="m4 7 8 6 8-6" /></I>
const Lock = () => <I><rect x="5" y="10" width="14" height="11" rx="3" /><path d="M8 10V7a4 4 0 0 1 8 0v3" /></I>
const Eye = () => <I><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" /><circle cx="12" cy="12" r="3" /></I>
const EyeOff = () => <I><path d="M3 3l18 18M10.6 5.1A11 11 0 0 1 12 5c6.5 0 10 7 10 7a17 17 0 0 1-3 3.9M6.6 6.6C3.7 8.4 2 12 2 12s3.5 7 10 7a10 10 0 0 0 5.4-1.6" /><path d="M9.9 9.9a3 3 0 0 0 4.2 4.2" /></I>
const AlertIcon = ({ className }: { className?: string }) => <I className={className}><circle cx="12" cy="12" r="9" /><path d="M12 7v6M12 17h.01" /></I>
const Key = () => <I><circle cx="8" cy="15" r="4" /><path d="m10.8 12.2 8.2-8.2M16 7l2 2M14 9l2 2" /></I>

// Only allow in-app redirects after login.
export const safeNext = (next: string | null) => next && next.startsWith('/') && !next.startsWith('//') ? next : '/registrations'

export default function LoginPage() {
  const { user, login } = useAuth()
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const next = safeNext(params.get('next'))
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [visible, setVisible] = useState(false)
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(false)

  if (user && !loading) return <Navigate to={next} replace />

  const submit = (e: FormEvent) => {
    e.preventDefault()
    setError(false); setLoading(true)
    // Short delay mirrors a network request so the loading state is visible.
    window.setTimeout(() => {
      if (login(email, password)) navigate(!params.get('next') && email.trim().toLowerCase() === ADMIN_CREDENTIALS.email ? '/admin' : next, { replace: true })
      else { setError(true); setLoading(false) }
    }, 600)
  }
  const useDemo = () => { setEmail(DEMO_CREDENTIALS.email); setPassword(DEMO_CREDENTIALS.password); setError(false) }

  return <div className="login-frame" data-layer="04-login">
    <div className="auth-split" data-layer="auth-split">
      <section className="auth-scene" data-layer="auth-scene"><div className="toran-ds auth-toran" /><Link className="auth-logo" to="/" aria-label="Tech Fest Hub home"><span className="lotus-ticket"><i /><i /><i /></span>TECH FEST HUB</Link>
        <div className="login-scene-3d" data-layer="3d-login-scene"><div className="login-mandala"><div className="mandala-petals outer">{Array.from({ length: 12 }).map((_, i) => <i key={i} />)}</div><div className="mandala-petals inner">{Array.from({ length: 12 }).map((_, i) => <i key={i} />)}</div><div className="sun-orb" /></div><span className="login-gem one" /><span className="login-gem two" /><span className="login-gem three" /><div className="login-orbit" /></div>
        <div className="auth-kolam" data-layer="kolam-floor" />
        <div className="auth-quote-block"><div className="auth-quote">Your next challenge is one login away.</div><div className="auth-chips"><span>9 EVENTS</span><span>7 CATEGORIES</span><span>1 CAMPUS</span></div></div>
      </section>
      <section className="auth-form-side">
        <div className="form-container login-card" data-layer="form-container">
          <span className="login-eyebrow">WELCOME BACK</span>
          <div className="login-title" role="heading" aria-level={1}>Log in to Tech Fest Hub</div>
          <p className="login-sub">Enter your college email to pick up where you left off.</p>
          <div className="demo-credentials"><Key /><div><b>Demo account</b><span>{DEMO_CREDENTIALS.email} · {DEMO_CREDENTIALS.password}</span></div><button type="button" onClick={useDemo}>Use demo</button></div>
          <div className="demo-credentials"><div><b>Festival admin demo</b><span>{ADMIN_CREDENTIALS.email} · {ADMIN_CREDENTIALS.password}</span></div><button type="button" onClick={() => { setEmail(ADMIN_CREDENTIALS.email); setPassword(ADMIN_CREDENTIALS.password); setError(false) }}>Use admin</button></div>
          <div className="login-alert-slot" data-layer="alert-slot">{error && <div className="alert-ds alert-error" role="alert"><AlertIcon />Invalid email or password.</div>}</div>
          <form onSubmit={submit} noValidate>
            <div className={`form-group ${error ? 'input-error' : ''} ${loading ? 'input-disabled' : ''}`}>
              <label htmlFor="login-email">EMAIL</label>
              <div className="form-input"><span className="input-left-icon"><Mail /></span><input id="login-email" type="email" autoComplete="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@college.edu" disabled={loading} aria-invalid={error || undefined} required /></div>
            </div>
            <div className={`form-group ${error ? 'input-error' : ''} ${loading ? 'input-disabled' : ''}`}>
              <label htmlFor="login-password">PASSWORD</label>
              <div className="form-input"><span className="input-left-icon"><Lock /></span><input id="login-password" type={visible ? 'text' : 'password'} autoComplete="current-password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Enter your password" disabled={loading} aria-invalid={error || undefined} aria-describedby={error ? 'login-password-help' : undefined} required /><button type="button" className="input-eye" disabled={loading} onClick={() => setVisible(!visible)} aria-label={visible ? 'Hide password' : 'Show password'}>{visible ? <EyeOff /> : <Eye />}</button></div>
              {error && <div className="input-helper" id="login-password-help"><AlertIcon className="helper-alert" />Check your email and password and try again.</div>}
            </div>
            <div className="login-submit"><button type="submit" className="submit-shell" disabled={loading}><span className={`btn btn-primary btn-size-l ${loading ? 'is-loading' : ''}`}>{loading ? <span className="btn-spinner" aria-label="Logging in" /> : 'Log In'}</span></button></div>
          </form>
          <div className="login-or"><span>or</span></div>
          <p className="login-create">New here? <Link to={`/signup${params.get('next') ? `?next=${encodeURIComponent(next)}` : ''}`}>Create an account</Link></p>
          <Link className="login-back" to="/">← Back to home</Link>
        </div>
      </section>
    </div>
  </div>
}
