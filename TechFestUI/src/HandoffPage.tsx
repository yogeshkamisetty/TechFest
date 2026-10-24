import { useGo } from './router'

const classes = [
  ['navbar', '.navbar', 'Navbar', 'HomePage.tsx · PatternSet.tsx', 'Implemented as .home-navbar / .navbar-ds'],
  ['hero', '.hero', 'Home hero', 'HomePage.tsx', 'Implemented as .home-hero'],
  ['section-title', '.section-title', 'Section heading', 'HomePage.tsx', 'Accent word in <em>'],
  ['event-grid', '.event-grid', 'Event grid', 'HomePage.tsx · EventsPage.tsx', '.home-event-grid / .events-grid'],
  ['event-card', '.event-card', 'EventCard', 'CardSet.tsx', 'Implemented as .ds-event-card'],
  ['event-category', '.event-category', 'CategoryChip', 'FormSet.tsx', 'Modifiers .cat-coding … .cat-aiml, .is-active'],
  ['event-title', '.event-title', 'EventCard title', 'CardSet.tsx', '2-line clamp'],
  ['event-date', '.event-date', 'EventCard date', 'CardSet.tsx', 'Paired with .ds-date-block'],
  ['event-venue', '.event-venue', 'EventCard venue', 'CardSet.tsx', 'Pin icon + text'],
  ['btn', '.btn', 'Button', 'ButtonSet.tsx', 'Sizes .btn-size-m / .btn-size-l'],
  ['btn-primary', '.btn-primary', 'Button · Primary', 'ButtonSet.tsx', 'Saffron fill, brown text'],
  ['btn-secondary', '.btn-secondary', 'Button · Secondary', 'ButtonSet.tsx', 'Teal-ink outline'],
  ['form-container', '.form-container', 'Auth form card', 'LoginPage.tsx · SignupPage.tsx', 'Variants .login-card / .signup-card'],
  ['form-group', '.form-group', 'Input wrapper', 'FormSet.tsx', 'State modifiers .input-error, .input-focus …'],
  ['form-input', '.form-input', 'Input field', 'FormSet.tsx', 'Wraps native <input>'],
  ['error-message', '.error-message', 'Field / alert error', 'FormSet.tsx · PatternSet.tsx', 'Currently .input-helper + .alert-error'],
  ['success-message', '.success-message', 'Alert · Success', 'PatternSet.tsx', 'Currently .alert-ds (default) / .match-line'],
  ['dashboard-card', '.dashboard-card', 'StatTile', 'RegistrationsPage.tsx', 'With .stat-ds, dot modifiers'],
  ['data-table', '.data-table', 'DataTable', 'PatternSet.tsx', 'Currently .table-ds'],
  ['pass', '.pass', 'PassCard (custom)', 'CardSet.tsx', 'Currently .pass-ds, .pass-mobile'],
  ['booth', '.booth', 'TicketBooth (custom)', 'CardSet.tsx', 'Currently .booth-ds, .booth-{state}'],
  ['filter-bar', '.filter-bar', 'FilterBar (custom)', 'EventsPage.tsx · PatternSet.tsx', '.events-filter / .filterbar-ds'],
  ['info-tile', '.info-tile', 'InfoTile (custom)', 'EventDetailPage.tsx', 'Currently .info-ds'],
  ['auth-split', '.auth-split', 'Auth layout (custom)', 'LoginPage.tsx · SignupPage.tsx', 'Mirror via .signup-split'],
  ['toran', '.toran', 'Toran (custom)', 'PatternSet.tsx', 'Currently .toran-ds'],
  ['jaali', '.jaali', 'Jaali lattice (custom)', 'HomePage.tsx', 'Currently .home-jaali'],
]
const spacing = [[4, 'space-1', 'Icon-to-label nudges, strength segments'], [8, 'space-2', 'Label → input, chip gaps, icon gap'], [16, 'space-4', 'Input padding, card internals'], [24, 'space-6', 'Gutter, card padding, grid gaps'], [32, 'space-8', 'Form padding, stat gaps'], [48, 'space-12', 'Filter → grid, section internals'], [64, 'space-16', 'CTA padding, large blocks'], [120, 'space-30', 'Section top padding, page margins']]
const exports = [
  ['Logo mark', 'tfh-logo-mark.svg · tfh-logo-mark@2x.png', 'SVG + PNG 2x', '40×40'],
  ['Logo lockup', 'tfh-logo-lockup.svg · tfh-logo-lockup@2x.png', 'SVG + PNG 2x', '220×40'],
  ['Category emblems (8)', 'emblem-coding.png · emblem-quiz.png · emblem-robotics.png · emblem-hackathon.png · emblem-gaming.png · emblem-design.png · emblem-ai-ml.png · emblem-default.png', 'PNG 2x, transparent', '96×96'],
  ['Hero mandala', 'hero-mandala.webp · hero-mandala.glb (optional)', 'WebP fallback + live Three.js', '600×600'],
  ['Event banner', 'event-banner-hackathon.webp', 'WebP, transparent', '600×360'],
  ['Auth scenes', 'auth-login-scene.webp · auth-signup-scene.webp', 'WebP, transparent', '600×600'],
  ['Step icons (3)', 'step-account.png · step-event.png · step-pass.png', 'PNG 2x, transparent', '72×72'],
  ['CTA ring', 'cta-ring.webp', 'WebP, transparent', '420×420'],
  ['Toran garland', 'toran-tile.svg', 'SVG, horizontally tileable', '24px high'],
  ['Kolam floor', 'kolam-floor.svg', 'SVG pattern', 'Tile 32×32'],
  ['Gulal wash', 'gulal-wash.webp', 'WebP, blurred radials', '1440×900'],
  ['Favicon', 'favicon.svg · favicon-32.png · apple-touch-icon.png', 'SVG + PNG', '32 / 180'],
]

export default function HandoffPage() {
  const go = useGo()
  return <main className="foundations-scroll"><div className="foundations-board handoff-board">
    <header className="fd-hero"><div><div className="eyebrow">DEVELOPER HANDOFF · UTSAV ARENA</div><div className="heading heading-xl" role="heading">Ready to <em>build.</em></div></div><p>Class names, spacing and assets for implementing Tech Fest Hub.</p></header>
    <nav className="handoff-links">{([['foundations', 'Foundations'], ['buttons', 'Buttons'], ['forms', 'Inputs & tags'], ['cards', 'Cards'], ['patterns', 'Patterns'], ['home', 'Back to app']] as const).map(([p, l]) => <button key={p} onClick={() => go(p)}>{l} →</button>)}</nav>

    <section className="fd-section"><div className="fd-section-label"><span>01</span><b>LAYER → CSS CLASS</b></div><p className="handoff-note">Target class is the agreed production name. Where the prototype uses a different class today, it is listed under “Current implementation”.</p>
      <table className="table-ds handoff-table"><thead><tr><th>LAYER</th><th>TARGET CLASS</th><th>COMPONENT</th><th>SOURCE</th><th>CURRENT IMPLEMENTATION</th></tr></thead><tbody>{classes.map(([layer, cls, comp, src, note], i) => <tr key={layer} className={i === 19 ? 'custom-start' : ''}><td>{layer}</td><td><code>{cls}</code></td><td>{comp}</td><td>{src}</td><td>{note}</td></tr>)}</tbody></table>
    </section>

    <section className="fd-section"><div className="fd-section-label"><span>02</span><b>SPACING CHEAT SHEET</b></div>
      <div className="handoff-spacing"><div className="fd-ruler">{spacing.map(([px, token, use]) => <div key={token}><i style={{ width: px as number }} /><span>{px}px</span><small>--{token} · {use}</small></div>)}</div>
        <div className="handoff-layout"><div><strong>1200</strong><span>CONTAINER · x120–1320 at 1440</span></div><div><strong>24</strong><span>GUTTER · 12 columns, 78px each</span></div><div><strong>8</strong><span>BASE GRID · all spacing multiples of 8 (4 for fine detail)</span></div><div className="column-preview">{Array.from({ length: 12 }).map((_, i) => <i key={i} />)}</div></div></div>
    </section>

    <section className="fd-section"><div className="fd-section-label"><span>03</span><b>EXPORT LIST</b></div>
      <table className="table-ds handoff-table"><thead><tr><th>ASSET</th><th>FILE NAMES</th><th>FORMAT</th><th>SIZE</th></tr></thead><tbody>{exports.map(([asset, files, format, size]) => <tr key={asset}><td>{asset}</td><td><code>{files}</code></td><td>{format}</td><td>{size}</td></tr>)}</tbody></table>
      <p className="handoff-note">Export to <code>/public/assets/</code>. Use @2x PNG/WebP for raster art, keep transparent backgrounds, and never flatten onto black.</p>
    </section>
  </div></main>
}
