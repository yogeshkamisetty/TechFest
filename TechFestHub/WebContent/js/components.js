// TechFest Shared Component Renderers matching Design System

export const glyphs = {
  Coding: '</>',
  Quiz: '?',
  Robotics: '⌁',
  Hackathon: '✦',
  Gaming: '◆',
  Design: '◒',
  'AI-ML': '∿',
  Default: '✧',
};

export const titles = {
  Coding: 'Code Chakra: Algorithm Sprint',
  Quiz: 'Quiz-e-Hind Grand Finale',
  Robotics: 'Robo Raas Obstacle Arena',
  Hackathon: 'Hackotsav 24-Hour Build',
  Gaming: 'Game Gully Squad Clash',
  Design: 'Pixel Pandal UX Challenge',
  'AI-ML': 'Neural Navratri Model Cup',
  Default: 'Tech Talk: Future of Campus',
};

export function PinIcon() {
  return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 21s7-5.5 7-12a7 7 0 0 0-14 0c0 6.5 7 12 7 12Z" /><circle cx="12" cy="9" r="2.5" /></svg>`;
}

export function CalIcon() {
  return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="5" width="18" height="16" rx="3" /><path d="M8 3v4M16 3v4M3 10h18" /></svg>`;
}

export function CheckIcon() {
  return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9" /><path d="m8 12 3 3 5-6" /></svg>`;
}

export function AlertIcon() {
  return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9" /><path d="M12 7v6M12 17h.01" /></svg>`;
}

export function ArrowIcon() {
  return `<svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M14 7l5 5-5 5" /></svg>`;
}

export function DateBlock({ size = 'S', month = 'NOV', day = '14' } = {}) {
  return `<div class="ds-date-block date-${size.toLowerCase()}"><span>${month}</span><b>${day}</b></div>`;
}

export function CategoryChip(category, active = false, label = null) {
  const catKey = category.toLowerCase().replace(/[^a-z0-9]/g, '');
  return `<span class="event-category cat-${catKey} ${active ? 'is-active' : ''}"><i></i>${label || category}</span>`;
}

export function StatusBadge(status) {
  return `<span class="badge badge-${status.toLowerCase()}"><i></i>${status}</span>`;
}

export function renderEventCard(e, isRegistered = false) {
  const open = e.status === 'Open';
  const catKey = e.category.toLowerCase().replace(/[^a-z0-9]/g, '');
  const glyph = glyphs[e.category] || glyphs['Default'];
  const feeLabel = e.fee === 'Free' ? 'Free' : e.fee;

  let registerActionHtml = '';
  if (!open) {
    registerActionHtml = `<button type="button" class="btn btn-primary btn-size-m is-disabled" disabled><span>Closed</span></button>`;
  } else if (isRegistered) {
    registerActionHtml = `<button type="button" class="btn btn-primary btn-size-m is-disabled" disabled><span>Registered</span></button>`;
  } else {
    registerActionHtml = `<a href="register.html?slug=${e.slug}" class="btn btn-primary btn-size-m is-default" data-layer="btn btn-primary"><span>Register</span></a>`;
  }

  return `
    <article class="ds-event-card cat-${catKey} status-${e.status.toLowerCase()}" data-layer="event-card" style="--art-angle: ${e.angle || '135deg'}">
      <div class="event-art">
        <div class="clay-emblem"><span>${glyph}</span></div>
      </div>
      <div class="event-body">
        ${CategoryChip(e.category)}
        <div class="event-title" role="heading">${e.title}</div>
        <div class="event-date-row">
          ${DateBlock({ size: 'S', day: e.day || '14' })}
          <span class="event-date">${e.cardDate}</span>
        </div>
        <div class="event-venue">${PinIcon()}${e.venue}</div>
      </div>
      <div class="event-perforation"></div>
      <div class="event-stub-ds">
        <div class="stub-meta">
          <span class="fee-badge fee-${e.fee === 'Free' ? 'free' : 'paid'}">${feeLabel}</span>
          ${StatusBadge(e.status)}
        </div>
        <div class="stub-actions">
          <a href="event-details.html?slug=${e.slug}" class="btn btn-secondary btn-size-m is-default" data-layer="btn btn-secondary"><span>View Details</span></a>
          ${registerActionHtml}
        </div>
      </div>
    </article>
  `;
}

export function renderPassCard(reg, event, isMobile = false) {
  const isConfirmed = reg.status === 'Confirmed';
  return `
    <article class="pass-ds pass-${reg.status.toLowerCase()} ${isMobile ? 'pass-mobile' : ''}" data-layer="pass-card">
      ${isConfirmed ? `
        <div class="pass-ds-shimmer"></div>
        <svg class="pass-ds-paisley" viewBox="0 0 40 40" aria-hidden="true">
          <path d="M30 6C17 2 6 11 9 23c2 9 13 14 21 9 7-4 6-14-1-16-5-1-9 3-8 7" />
          <circle cx="22" cy="23" r="2" />
        </svg>
      ` : ''}
      <div class="pass-ds-body">
        ${CategoryChip(event.category)}
        <div class="pass-ds-title" role="heading">${event.title}</div>
        <div class="pass-ds-row mono">${CalIcon()}${event.passDate}</div>
        <div class="pass-ds-row muted">${PinIcon()}${event.venue}</div>
        <div class="pass-ds-action">
          <a href="event-details.html?slug=${event.slug}" class="btn btn-secondary btn-size-m is-default"><span>View Event</span></a>
        </div>
      </div>
      <div class="pass-ds-perf"></div>
      <div class="pass-ds-stub">
        <div class="barcode-ds" aria-hidden="true"></div>
        <div class="pass-stub-meta">
          ${StatusBadge(reg.status)}
          <b>${reg.regId}</b>
          <span>Registered on ${reg.registeredOn}</span>
        </div>
      </div>
    </article>
  `;
}

export function renderTicketBooth(e, boothState, onRegisterHref, onLoginHref) {
  const isCountdown = boothState !== 'Closed' && boothState !== 'Completed';

  let topHtml = '';
  if (isCountdown) {
    topHtml = `
      <span class="booth-label">REGISTRATION CLOSES IN</span>
      <div class="countdown-ds">
        <div><b>04</b><span>DAYS</span></div>
        <div><b>12</b><span>HRS</span></div>
        <div><b>36</b><span>MIN</span></div>
        <div><b>09</b><span>SEC</span></div>
      </div>
    `;
  } else if (boothState === 'Closed') {
    topHtml = `
      <span class="booth-label">REGISTRATION STATUS</span>
      <span class="closed-badge">CLOSED</span>
    `;
  } else {
    topHtml = `
      <span class="booth-label">EVENT STATUS</span>
      <span class="booth-ended-mini">Concluded</span>
    `;
  }

  let stubActionHtml = '';
  if (boothState === 'Open') {
    stubActionHtml = `<a href="${onRegisterHref}" class="btn btn-primary btn-size-l is-default" style="width: 100%; text-align: center;"><span>Register Now</span></a>`;
  } else if (boothState === 'LoggedOut') {
    stubActionHtml = `
      <a href="${onLoginHref}" class="btn btn-secondary btn-size-l is-default" style="width: 100%; text-align: center;"><span>Login to Register</span></a>
      <p style="margin-top: 8px; font-size: 13px; color: var(--muted); text-align: center;">You need an account to register</p>
    `;
  } else if (boothState === 'Registered') {
    stubActionHtml = `
      <div class="booth-panel booth-success" style="display: flex; align-items: center; justify-content: center; gap: 8px;">
        ${CheckIcon()} You're registered ✓
      </div>
      <a href="my-registrations.html" class="btn btn-ghost btn-size-m is-default" style="margin-top: 8px; text-align: center;"><span>View my registrations</span></a>
    `;
  } else if (boothState === 'Closed') {
    stubActionHtml = `<button type="button" class="btn btn-primary btn-size-l is-disabled" disabled style="width: 100%;"><span>Registration Closed</span></button>`;
  } else {
    stubActionHtml = `<div class="booth-panel booth-ended">This event has ended</div>`;
  }

  return `
    <aside class="booth-ds booth-${boothState.toLowerCase()}" data-layer="ticket-booth">
      <div class="booth-zari"></div>
      <div class="booth-top-ds">
        ${topHtml}
      </div>
      <div class="booth-perf"></div>
      <div class="booth-info">
        <div class="booth-fee">${e.fee}</div>
        <div class="capacity-ds">
          <div><span>Capacity: ${e.capacity} participants</span></div>
        </div>
        <div class="booth-divider"></div>
        <div class="booth-row mono">${CalIcon()}${e.longDate}</div>
        <div class="booth-row">${PinIcon()}${e.venue}</div>
      </div>
      <div class="booth-stub">
        ${stubActionHtml}
      </div>
    </aside>
  `;
}
