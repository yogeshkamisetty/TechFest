import { renderNavbar, renderFooter } from './nav.js';
import { State } from './state.js';
import { importantDates } from './data.js';
import { CategoryChip, StatusBadge, renderTicketBooth, PinIcon, CalIcon, CheckIcon, AlertIcon } from './components.js';

renderNavbar('Events');
renderFooter('footer-mount');

const urlParams = new URLSearchParams(window.location.search);
const slug = urlParams.get('slug');
const event = State.getEvent(slug);
const mainMount = document.getElementById('detail-main-mount');

if (!mainMount) throw new Error('detail-main-mount not found');

if (!event) {
  mainMount.innerHTML = `
    <section class="events-empty not-found" style="margin: 64px auto;">
      <div role="heading" aria-level="1">Event not found</div>
      <p>This event may have moved or the link is incorrect.</p>
      <a href="events.html" class="btn btn-secondary btn-size-l is-default"><span>Back to all events</span></a>
    </section>
  `;
} else {
  const user = State.getUser();
  const registered = State.isRegistered(event.slug);
  const completed = event.status === 'Completed';

  let boothState = 'Open';
  if (completed) boothState = 'Completed';
  else if (event.status === 'Closed') boothState = 'Closed';
  else if (!user) boothState = 'LoggedOut';
  else if (registered) boothState = 'Registered';

  const onRegisterHref = `register.html?slug=${event.slug}`;
  const onLoginHref = `login.html?next=${encodeURIComponent(`event-details.html?slug=${event.slug}`)}`;

  const dates = importantDates(event);
  const datesHtml = dates
    .map(
      (d, i) => `
    <li class="date-node is-${d.phase}">
      <span class="date-index">T${String(i).padStart(2, '0')}</span>
      <span class="date-dot" aria-hidden="true"></span>
      <div>
        <b>${d.label}</b>
        <time>${d.date}</time>
        <p>${d.note}</p>
      </div>
      ${d.phase === 'live' ? '<em>NOW</em>' : ''}
    </li>
  `
    )
    .join('');

  const detailsList = [
    { label: 'DATE & TIME', value: event.longDate, tint: 'tint-yellow', icon: CalIcon() },
    { label: 'VENUE', value: event.venue, tint: 'tint-mint', icon: PinIcon() },
    { label: 'REGISTRATION FEE', value: event.fee, tint: 'tint-pink', icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M4 7a2 2 0 0 0 2-2h12a2 2 0 0 0 2 2v2a3 3 0 0 0 0 6v2a2 2 0 0 0-2 2H6a2 2 0 0 0-2-2v-2a3 3 0 0 0 0-6V7Z"/></svg>` },
    { label: 'CAPACITY', value: `${event.capacity} participants`, tint: 'tint-blue', icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></svg>` },
    { label: 'REGISTRATION DEADLINE', value: event.deadline, tint: 'tint-peach', icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>` },
    { label: 'CATEGORY', value: event.category, tint: 'tint-green', icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M8 4h8v5a4 4 0 0 1-8 0V4ZM12 13v4M8 20h8"/><path d="M8 6H4v2a4 4 0 0 0 4 4M16 6h4v2a4 4 0 0 1-4 4"/></svg>` },
  ];

  const infoGridHtml = detailsList
    .map(
      (d) => `
    <div class="info-ds">
      <span class="${d.tint}">${d.icon}</span>
      <div>
        <small>${d.label}</small>
        <b>${d.value}</b>
      </div>
    </div>
  `
    )
    .join('');

  mainMount.innerHTML = `
    <div class="alert-slot" data-layer="alert-slot"></div>
    <!-- Hero Banner -->
    <section class="event-hero ${completed || event.status === 'Closed' ? 'is-completed' : ''}" data-layer="event-hero">
      <div class="hero-panel" data-layer="hero-panel">
        <span class="breadcrumb">
          <a href="events.html">EVENTS</a> / <a href="events.html?category=${event.category}">${event.category.toUpperCase()}</a>
        </span>
        ${CategoryChip(event.category)}
        <div class="detail-title" role="heading" aria-level="1">${event.title}</div>
        ${StatusBadge(event.status)}
      </div>
      <div class="event-banner-3d" data-layer="3d-event-banner">
        <i class="cube cube-a"></i><i class="cube cube-b"></i><i class="cube cube-c"></i>
        <b class="banner-gem g1"></b><b class="banner-gem g2"></b><b class="banner-gem g3"></b>
        <span class="streak s1"></span><span class="streak s2"></span>
      </div>
    </section>

    <!-- Main Content & Aside Booth -->
    <section class="event-body" data-layer="event-body">
      <div class="event-main">
        <section>
          <div class="detail-h2" role="heading" aria-level="2">About this event</div>
          <div class="about-copy">
            ${event.about.map((p) => `<p>${p}</p>`).join('')}
          </div>
        </section>

        <section class="important-dates" aria-labelledby="dates-title">
          <div class="dates-head">
            <div>
              <span class="hud-label">// SCHEDULE.LOG</span>
              <div id="dates-title" class="detail-h2" role="heading" aria-level="2">Important dates</div>
            </div>
            <span class="hud-chip">${event.status === 'Open' ? 'REGISTRATIONS LIVE' : event.status.toUpperCase()}</span>
          </div>
          <ol class="dates-track">
            ${datesHtml}
          </ol>
        </section>

        <section>
          <div class="detail-h2" role="heading" aria-level="2">Event details</div>
          <div class="info-grid" data-layer="info-grid">
            ${infoGridHtml}
          </div>
        </section>

        <div>
          <a href="events.html" class="btn btn-secondary btn-size-m is-default"><span>← Back to all events</span></a>
        </div>
      </div>

      <aside class="detail-booth" data-layer="booth">
        ${renderTicketBooth(event, boothState, onRegisterHref, onLoginHref)}
      </aside>
    </section>
  `;
}
