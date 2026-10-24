import { useEventCatalog } from './eventCatalog'
import { lazy, Suspense, useEffect, useState, type ReactNode } from 'react'
import { Link, useLocation, useNavigate } from 'react-router'
import { DSButton } from './ButtonSet'
import { DSEventCard } from './CardSet'
import { Footer } from './PatternSet'
import { useAuth } from './auth'
import { featuredSlugs } from './data/events'
import { useGo, useScrolled } from './router'

const LotusMandala3D = lazy(() => import('./LotusMandala3D'))

const cats = [['Coding', '</>'], ['Quiz', '?'], ['Robotics', '⌁'], ['Hackathon', '✦'], ['Gaming', '◆'], ['Design', '◒']]
const Arrow = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M14 7l5 5-5 5" /></svg>

function NavLink({ children, active, to }: { children: ReactNode; active?: boolean; to: string }) {
  return <Link to={to} className={active ? 'active' : ''} aria-current={active ? 'page' : undefined}>{children}</Link>
}

export function HomeNavbar({ active, showToran = true }: { active?: 'Home' | 'Events' | 'MyReg'; showToran?: boolean }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const scrolled = useScrolled()
  const firstName = user?.name.split(' ')[0]
  const { pathname, hash } = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)
  useEffect(() => { setMenuOpen(false) }, [pathname, hash])
  useEffect(() => {
    if (!menuOpen) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setMenuOpen(false) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [menuOpen])
  const signOut = () => { setMenuOpen(false); logout(); navigate('/') }
  return <header className={`home-navbar ${scrolled ? 'is-scrolled' : ''} ${menuOpen ? 'menu-open' : ''}`} data-layer="navbar">
    <div className="home-nav-inner">
      <Link to="/" className="home-logo"><span className="lotus-ticket"><i /><i /><i /></span>TECH FEST HUB</Link>
      <nav aria-label="Primary"><NavLink to="/" active={active === 'Home'}>Home</NavLink><NavLink to="/events" active={active === 'Events'}>Events</NavLink>{user?.role === 'admin' ? <NavLink to="/admin">Admin</NavLink> : user ? <NavLink to="/registrations" active={active === 'MyReg'}>My Registrations</NavLink> : <NavLink to="/#how-it-works">How it works</NavLink>}</nav>
      {user ? <div className="user-pill home-user"><span>{firstName?.[0]}</span>Hi, {firstName}<DSButton type="Ghost" label="Logout" onClick={signOut} /></div> : <div className="home-auth"><Link to="/login">Login</Link><DSButton label="Sign Up" onClick={() => navigate('/signup')} /></div>}
      <button type="button" className="home-menu-btn" aria-label={menuOpen ? 'Close menu' : 'Open menu'} aria-expanded={menuOpen} aria-controls="mobile-menu" onClick={() => setMenuOpen(o => !o)}><i /><i /><i /></button>
    </div>
    {menuOpen && <div className="mobile-menu" id="mobile-menu">
      <nav aria-label="Mobile">
        <Link to="/" className={active === 'Home' ? 'active' : ''}>Home</Link>
        <Link to="/events" className={active === 'Events' ? 'active' : ''}>Events</Link>
        {user?.role === 'admin' ? <Link to="/admin">Admin</Link> : user ? <Link to="/registrations" className={active === 'MyReg' ? 'active' : ''}>My Registrations</Link> : <Link to="/#how-it-works">How it works</Link>}
      </nav>
      {user ? <div className="mobile-menu-user"><span className="mobile-avatar">{firstName?.[0]}</span><div><b>{user.name}</b><small>{user.email}</small></div><button type="button" onClick={signOut}>Logout</button></div>
        : <div className="mobile-menu-auth"><Link to="/login" className="btn btn-secondary btn-size-m">Login</Link><Link to="/signup" className="btn btn-primary btn-size-m">Sign Up</Link></div>}
    </div>}
    {showToran && <div className="toran-ds home-toran" aria-hidden="true" />}
  </header>
}

function CssMandala() {
  return <>
    <div className="mandala-glow" /><div className="contact-shadow" />
    <div className="bead-ring ring-a" /><div className="bead-ring ring-b" />
    <div className="mandala-petals outer">{Array.from({ length: 12 }).map((_, i) => <i key={i} />)}</div>
    <div className="mandala-petals inner">{Array.from({ length: 12 }).map((_, i) => <i key={i} />)}</div>
    <div className="sun-orb" />
  </>
}

function HeroArt() {
  return <div className="hero-mandala" data-layer="3d-hero-mandala" aria-label="Glossy festival mandala with technical event categories" role="img">
    <div className="mandala-glow" />
    <Suspense fallback={<CssMandala />}><LotusMandala3D /></Suspense>
    {cats.map(([name], i) => <span key={name} className={`gem-chip gem-${i}`}>{name}</span>)}
    {Array.from({ length: 12 }).map((_, i) => <b key={i} className={`gulal p${i}`} />)}
  </div>
}

export default function HomePage() {
  const events = useEventCatalog()
  const go = useGo()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [step, setStep] = useState(2)
  const featured = featuredSlugs.map(slug => events.find(e => e.slug === slug)!)
  const countFor = (category: string) => String(events.filter(e => e.category === category).length).padStart(2, '0')

  return <div className="home-frame" data-layer="01-home">
    <div className="page-wash" aria-hidden="true" />
    <HomeNavbar active="Home" showToran={false} />
    <main>
      <section className="home-hero" data-layer="hero">
        <div className="home-jaali" /><div className="home-kolam" />
        <div className="hero-hud hud-left" aria-hidden="true"><span><i />EDITION 01</span><span>TFH · CAMPUS ARENA · 2026</span><span>EXPLORE → COMPETE → WIN</span></div>
        <div className="hero-hud hud-ruler" aria-hidden="true">{Array.from({ length: 7 }).map((_, i) => <span key={i} className={i === 0 ? 'on' : ''}><i />DAY {String(i + 1).padStart(2, '0')}</span>)}</div>
        <div className="home-container hero-grid">
          <div className="hero-left">
            <div className="hindi-ribbon">तकनीकी उत्सव</div>
            <div className="hero-pill"><i />TECH FEST 2026 • REGISTRATIONS OPEN</div>
            <div className="hero-terminal" aria-hidden="true"><span>$</span> tfh register --event=any --level=campus<b /></div>
            <div className="hero-title" role="heading" aria-level={1}><span>Discover.</span><span>Compete.</span><em>Innovate.</em></div>
            <p className="hero-sub-home">One hub to explore technical events, compete with your campus and register in seconds.</p>
            <div className="home-hero-actions"><DSButton size="L" icon="Right" label="Explore Events" onClick={() => go('events')} /><DSButton type="Secondary" size="L" label={user ? 'My Registrations' : 'Create Account'} onClick={() => go(user ? 'passes' : 'signup')} /></div>
            <div className="hero-stats">{[[String(events.length), 'EVENTS'], ['7', 'CATEGORIES'], ['1', 'CAMPUS']].map(([n, l]) => <div key={l}><strong>{n}</strong><span>{l}</span></div>)}</div>
          </div>
          <HeroArt />
        </div>
      </section>

      <section className="home-categories home-container" data-layer="categories">
        <div className="section-title centered" role="heading" aria-level={2}>Pick your <em>arena</em></div>
        <div className="arena-tiles">{cats.map(([name, glyph]) => <button key={name} className={`arena-tile cat-${name.toLowerCase()}`} onClick={() => navigate(`/events?category=${name}`)}><span className="arena-emblem">{glyph}</span><b>{name}</b><small>{countFor(name)} {countFor(name) === '01' ? 'EVENT' : 'EVENTS'}</small></button>)}</div>
      </section>

      <section className="home-featured home-container" data-layer="featured">
        <div className="featured-head"><div className="section-title" role="heading" aria-level={2}>Featured events</div><button onClick={() => go('events')}>View all <Arrow /></button></div>
        <div className="home-event-grid" data-layer="event-grid">
          {featured.map(e => <DSEventCard key={e.slug} category={e.category} fee={e.fee === 'Free' ? 'Free' : 'Paid'} price={e.fee} title={e.title} date={e.cardDate} venue={e.venue} angle={e.angle} day={e.day} status={e.status} onDetails={() => navigate(`/events/${e.slug}`)} />)}
        </div>
      </section>

      <section className="home-how" id="how-it-works" data-layer="how-it-works">
        <div className="home-container"><div className="section-title centered" role="heading" aria-level={2}>Three steps to the <em>arena</em></div>
          <div className={`how-steps active-${step}`}><div className="step-connector"><i /><i /><i /></div>{[['Create your account', 'Sign up with your college email and department.', '◉'], ['Pick an event', 'Browse by category and open the one that excites you.', '✦'], ['Get your pass', 'Register in one click and keep it under My Registrations.', '▰']].map(([t, d, g], i) => <article key={t} onMouseEnter={() => setStep(i + 1)} className={step === i + 1 ? 'active' : ''}><span className="step-num">0{i + 1}</span><span className="step-clay">{g}</span><div role="heading" aria-level={3}>{t}</div><p>{d}</p></article>)}</div>
        </div>
      </section>

      <section className="home-cta home-container" data-layer="cta-band"><div className="toran-ds" /><div><div className="cta-head">Your seat in the arena is waiting.</div><div className="home-hero-actions"><DSButton size="L" label={user ? 'My Registrations' : 'Sign Up Free'} onClick={() => go(user ? 'passes' : 'signup')} /><DSButton type="Secondary" size="L" label="Browse Events" onClick={() => go('events')} /></div></div><div className="cta-ring" data-layer="3d-cta-ring">{Array.from({ length: 18 }).map((_, i) => <i key={i} />)}</div></section>
    </main>
    <div className="home-footer"><Footer /></div>
  </div>
}
