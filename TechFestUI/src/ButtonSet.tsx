type BType = 'Primary' | 'Secondary' | 'Ghost'
type BState = 'Default' | 'Hover' | 'Focus' | 'Disabled' | 'Loading'
type BSize = 'M' | 'L'
type BIcon = 'None' | 'Left' | 'Right'

const types: BType[] = ['Primary', 'Secondary', 'Ghost']
const states: BState[] = ['Default', 'Hover', 'Focus', 'Disabled', 'Loading']
const sizes: BSize[] = ['M', 'L']
const iconsPos: BIcon[] = ['None', 'Left', 'Right']

function Arrow() {
  return <svg className="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M14 7l5 5-5 5" /></svg>
}

export function DSButton({ type = 'Primary', state = 'Default', size = 'M', icon = 'None', label = 'Register now', onClick }: { type?: BType; state?: BState; size?: BSize; icon?: BIcon; label?: string; onClick?: () => void }) {
  const loading = state === 'Loading'
  return <button
    className={`btn btn-${type.toLowerCase()} btn-size-${size.toLowerCase()} is-${state.toLowerCase()}`}
    data-layer={`btn btn-${type.toLowerCase()}`}
    disabled={state === 'Disabled'}
    onClick={onClick}
    aria-busy={loading || undefined}
    aria-label={loading ? `${label}, loading` : undefined}
  >
    {loading ? <span className="btn-spinner" aria-hidden="true" /> : <>{icon === 'Left' && <Arrow />}<span>{label}</span>{icon === 'Right' && <Arrow />}</>}
  </button>
}

export default function ButtonSet() {
  return <main className="foundations-scroll"><div className="foundations-board button-board">
    <header className="fd-hero"><div><div className="eyebrow">COMPONENT SET · 90 VARIANTS</div><div className="heading heading-xl" role="heading">[Button] <em>matrix.</em></div></div><p>Type × State × Size × Icon. Labels are replaced by a spinner while loading.</p></header>
    <div className="btn-matrix">
      <div className="btn-matrix-head"><span>TYPE / SIZE / ICON</span>{states.map(s => <span key={s}>{s.toUpperCase()}</span>)}</div>
      {types.map(type => <section className="btn-type-group" key={type}>
        <div className="btn-type-title">{type}<span>btn-{type.toLowerCase()}</span></div>
        {sizes.flatMap(size => iconsPos.map(icon => <div className="btn-matrix-row" key={`${size}-${icon}`}>
          <div className="btn-props"><b>{size} · {size === 'M' ? 48 : 56}</b><span>Icon={icon}</span></div>
          {states.map(state => <div className="btn-cell" key={state}><DSButton type={type} state={state} size={size} icon={icon} /></div>)}
        </div>))}
      </section>)}
    </div>
  </div></main>
}
