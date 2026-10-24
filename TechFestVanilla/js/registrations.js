import { renderNavbar, renderFooter } from './nav.js';
import { State } from './state.js';
import { renderPassCard, CheckIcon, AlertIcon } from './components.js';

renderNavbar('MyReg');
renderFooter('footer-mount');

const user = State.getUser();
const mount = document.getElementById('registrations-mount');

if (!user) {
  window.location.href = `login.html?next=my-registrations.html`;
} else if (mount) {
  const urlParams = new URLSearchParams(window.location.search);
  const registeredSlug = urlParams.get('registered');
  const flashResult = urlParams.get('result') || 'ok';
  if (registeredSlug) {
    window.history.replaceState({}, '', window.location.pathname);
  }

  const registrations = State.getRegistrations();
  const confirmedCount = registrations.filter((r) => r.status === 'Confirmed').length;
  const cancelledCount = registrations.length - confirmedCount;
  const firstName = user.name.split(' ')[0];

  const passesWithEvents = registrations
    .map((reg) => ({ reg, event: State.getEvent(reg.slug) }))
    .filter((p) => p.event);

  let alertHtml = '';
  if (registeredSlug) {
    alertHtml = `
      <div class="registrations-alert" data-layer="alert-slot">
        ${
          flashResult === 'exists'
            ? `<div class="alert-ds alert-error" role="alert">${AlertIcon()}You are already registered for this event.</div>`
            : `<div class="alert-ds" role="status">${CheckIcon()}You have registered successfully.</div>`
        }
      </div>
    `;
  }

  let bodyHtml = '';
  if (passesWithEvents.length === 0) {
    bodyHtml = `
      <section class="registrations-empty">
        <div class="empty-ticket-art" aria-hidden="true"><span>TFH</span></div>
        <div role="heading" aria-level="2">No registrations yet</div>
        <p>Pick an event and claim your first pass.</p>
        <a href="events.html" class="btn btn-primary btn-size-l is-default" data-layer="btn btn-primary"><span>Explore Events</span></a>
      </section>
    `;
  } else {
    const isMobile = window.innerWidth <= 720;
    const cardsHtml = passesWithEvents
      .map(({ reg, event }) => renderPassCard(reg, event, isMobile))
      .join('');
    bodyHtml = `<div class="${isMobile ? 'mobile-pass-list' : 'my-pass-grid'}" data-layer="pass-grid">${cardsHtml}</div>`;
  }

  mount.innerHTML = `
    <header class="registrations-header" data-layer="page-header">
      <span class="login-eyebrow">YOUR PASSES</span>
      <div class="registrations-title" role="heading" aria-level="1">
        Hi <em>${firstName}</em>, here are your events
      </div>
      <div class="stat-row" data-layer="stat-row">
        <div class="stat-ds dashboard-card dot-ash">
          <strong>${registrations.length}</strong>
          <span><i></i>TOTAL</span>
        </div>
        <div class="stat-ds dashboard-card dot-green">
          <strong>${confirmedCount}</strong>
          <span><i></i>CONFIRMED</span>
        </div>
        <div class="stat-ds dashboard-card dot-red">
          <strong>${cancelledCount}</strong>
          <span><i></i>CANCELLED</span>
        </div>
      </div>
    </header>

    ${alertHtml}
    ${bodyHtml}
  `;
}
