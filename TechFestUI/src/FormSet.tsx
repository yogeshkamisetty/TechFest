import { useState, type ReactNode } from 'react'

type IState = 'Default' | 'Focus' | 'Filled' | 'Error' | 'Success' | 'Disabled'
type IType = 'Text' | 'Password'
const inputStates: IState[] = ['Default', 'Focus', 'Filled', 'Error', 'Success', 'Disabled']

function Svg({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{children}</svg>
}
const Mail = () => <Svg><rect x="3" y="5" width="18" height="14" rx="3" /><path d="m4 7 8 6 8-6" /></Svg>
const Lock = () => <Svg><rect x="5" y="10" width="14" height="11" rx="3" /><path d="M8 10V7a4 4 0 0 1 8 0v3" /></Svg>
const Eye = () => <Svg><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" /><circle cx="12" cy="12" r="3" /></Svg>
const EyeOff = () => <Svg><path d="M3 3l18 18M10.6 5.1A11 11 0 0 1 12 5c6.5 0 10 7 10 7a17 17 0 0 1-3 3.9M6.6 6.6C3.7 8.4 2 12 2 12s3.5 7 10 7a10 10 0 0 0 5.4-1.6" /><path d="M9.9 9.9a3 3 0 0 0 4.2 4.2" /></Svg>
const Check = () => <Svg className="input-success-icon"><path d="m5 12 4 4L19 6" /></Svg>
const Alert = () => <Svg className="helper-alert"><circle cx="12" cy="12" r="9" /><path d="M12 7v6M12 17h.01" /></Svg>

export function DSInput({ state = 'Default', icon = false, type = 'Text' }: { state?: IState; icon?: boolean; type?: IType }) {
  const [visible, setVisible] = useState(false)
  const password = type === 'Password'
  const valued = ['Filled', 'Error', 'Success'].includes(state)
  const id = `input-${state}-${icon}-${type}`
  return <div className={`form-group input-${state.toLowerCase()}`}>
    <label htmlFor={id}>{password ? 'Password' : 'Email address'}</label>
    <div className="form-input">
      {icon && <span className="input-left-icon">{password ? <Lock /> : <Mail />}</span>}
      <input id={id} type={password && !visible ? 'password' : 'text'} defaultValue={valued ? (password ? 'Utsav2026' : 'aarav@college.edu') : ''} placeholder={password ? 'Enter your password' : 'you@college.edu'} disabled={state === 'Disabled'} aria-invalid={state === 'Error' || undefined} aria-describedby={state === 'Error' ? `${id}-help` : undefined} />
      {state === 'Success' && <Check />}
      {password && <button type="button" className="input-eye" disabled={state === 'Disabled'} onClick={() => setVisible(!visible)} aria-label={visible ? 'Hide password' : 'Show password'}>{visible ? <EyeOff /> : <Eye />}</button>}
    </div>
    {state === 'Error' && <div className="input-helper" id={`${id}-help`}><Alert />{password ? 'Password must include a number.' : 'Enter a valid college email.'}</div>}
  </div>
}

function StrengthMeter({ level }: { level: 'Empty' | 'Weak' | 'Medium' | 'Strong' }) {
  const count = { Empty: 0, Weak: 1, Medium: 2, Strong: 4 }[level]
  return <div className={`strength-set strength-${level.toLowerCase()}`}><div>{Array.from({ length: 4 }).map((_, i) => <i key={i} className={i < count ? 'filled' : ''} />)}</div><p>Use 8+ characters with a number</p></div>
}

const cats = ['Coding', 'Quiz', 'Robotics', 'Hackathon', 'Gaming', 'Design', 'AI-ML', 'Default']
export function CategoryChip({ category, active = false, label }: { category: string; active?: boolean; label?: string }) {
  return <span className={`event-category cat-${category.toLowerCase().replace('-', '')} ${active ? 'is-active' : ''}`}><i />{label ?? category}</span>
}
export function StatusBadge({ status }: { status: string }) {
  return <span className={`badge badge-${status.toLowerCase()}`}><i />{status}</span>
}

export default function FormSet() {
  return <main className="foundations-scroll"><div className="foundations-board form-board">
    <header className="fd-hero"><div><div className="eyebrow">FORM & TAG COMPONENT SETS</div><div className="heading heading-xl" role="heading">Inputs & <em>tags.</em></div></div><p>Field states, password strength, categories and statuses.</p></header>

    <section className="fd-section"><div className="fd-section-label"><span>01</span><b>[INPUT] · STATE × ICON × TYPE</b></div>
      <div className="input-matrix"><div className="input-matrix-head"><span>TYPE / ICON</span>{inputStates.map(s => <span key={s}>{s.toUpperCase()}</span>)}</div>
        {(['Text', 'Password'] as IType[]).flatMap(type => [false, true].map(icon => <div className="input-matrix-row" key={type + icon}><div className="btn-props"><b>{type}</b><span>Icon={icon ? 'Left' : 'None'}</span></div>{inputStates.map(state => <DSInput key={state} state={state} icon={icon} type={type} />)}</div>))}
      </div>
    </section>

    <section className="fd-section"><div className="fd-section-label"><span>02</span><b>[STRENGTHMETER] · LEVEL</b></div><div className="strength-row">{(['Empty', 'Weak', 'Medium', 'Strong'] as const).map(l => <div key={l}><span className="mono-label">LEVEL={l.toUpperCase()}</span><StrengthMeter level={l} /></div>)}</div></section>

    <section className="fd-section"><div className="fd-section-label"><span>03</span><b>[CATEGORYCHIP] · CATEGORY × STATE</b></div><div className="chip-matrix">{['Default', 'Active'].map(state => <div key={state}><span className="mono-label">STATE={state.toUpperCase()}</span>{cats.map(c => <CategoryChip key={c} category={c} active={state === 'Active'} />)}</div>)}</div></section>

    <section className="fd-section"><div className="fd-section-label"><span>04</span><b>[STATUSBADGE] · STATUS</b></div><div className="badge-row">{['Open', 'Closed', 'Completed', 'Confirmed', 'Cancelled'].map(s => <StatusBadge key={s} status={s} />)}</div></section>
  </div></main>
}
