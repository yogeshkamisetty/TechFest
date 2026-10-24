import { renderNavbar, renderFooter } from './nav.js';
import { State } from './state.js';
import { teamSize, tracksFor, needsProject } from './data.js';
import { CategoryChip } from './components.js';

renderNavbar('Events');
renderFooter('footer-mount');

const user = State.getUser();
const urlParams = new URLSearchParams(window.location.search);
const slug = urlParams.get('slug');
const event = State.getEvent(slug);
const mount = document.getElementById('register-mount');

if (!user) {
  window.location.href = `login.html?next=${encodeURIComponent(`register.html?slug=${slug || ''}`)}`;
} else if (user.role === 'admin') {
  window.location.href = 'admin.html';
} else if (!event || event.status !== 'Open') {
  window.location.href = event ? `event-details.html?slug=${event.slug}` : 'events.html';
} else if (State.isRegistered(event.slug)) {
  window.location.href = 'my-registrations.html';
} else {
  initRegisterWizard();
}

function initRegisterWizard() {
  const [minTeam, maxTeam] = teamSize(event);
  const solo = maxTeam === 1;
  const storageKey = `tfh.draft.${user.email}.${slug}`;

  let draft = {
    team: '',
    track: '',
    phone: '',
    year: '3rd',
    members: Array.from({ length: Math.max(0, minTeam - 1) }, () => ({ name: '', email: '' })),
    project: '',
    summary: '',
    agree: false,
  };

  try {
    const saved = localStorage.getItem(storageKey);
    if (saved) draft = { ...draft, ...JSON.parse(saved) };
  } catch {}

  const steps = [
    { id: 'team', label: solo ? 'Entry' : 'Team', hint: 'Name & track' },
    { id: 'lead', label: solo ? 'You' : 'Team lead', hint: 'Primary contact' },
    ...(!solo ? [{ id: 'members', label: 'Members', hint: `${minTeam}–${maxTeam} builders` }] : []),
    ...(needsProject(event) ? [{ id: 'project', label: 'Idea', hint: 'Short pitch' }] : []),
    { id: 'review', label: 'Review', hint: 'Confirm & submit' },
  ];

  let stepIndex = 0;
  let touched = false;
  let savedAt = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
  let submitting = false;

  const headings = {
    team: [
      solo ? 'Claim your entry' : 'Name your team',
      solo ? 'Pick how you’ll appear on the leaderboard, then choose a track.' : 'Pick a name that will look great on the leaderboard.'
    ],
    lead: [
      solo ? 'Your contact details' : 'Who’s leading?',
      'We’ll use these for check-in updates and schedule changes.'
    ],
    members: [
      'Assemble your crew',
      `Add ${minTeam === maxTeam ? minTeam - 1 : `${minTeam - 1}–${maxTeam - 1}`} teammate${maxTeam - 1 === 1 ? '' : 's'} besides you.`
    ],
    project: [
      'Pitch your idea',
      'A short, honest description is perfect. You can refine it later.'
    ],
    review: [
      'One last look',
      'Check everything before your pass is issued.'
    ],
  };

  const stepIcons = {
    team: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m12 3 1.5 5.5L19 10l-5.5 1.5L12 17l-1.5-5.5L5 10l5.5-1.5L12 3Z" /></svg>`,
    lead: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></svg>`,
    members: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="9" cy="8" r="3.5" /><path d="M2.5 20a6.5 6.5 0 0 1 13 0M16 4.5a3.5 3.5 0 0 1 0 7M18 14a6 6 0 0 1 3.5 6" /></svg>`,
    project: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 19c2-6 6-11 14-14-3 8-8 12-14 14ZM9 15l-3-3" /></svg>`,
    review: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6l-8-3Z" /><path d="m9 12 2 2 4-4" /></svg>`,
  };

  const checkIcon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m5 12 4 4L19 6" /></svg>`;
  const alertIcon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9" /><path d="M12 7v6M12 17h.01" /></svg>`;
  const isEmail = (v) => /^\S+@\S+\.\S+$/.test(v.trim());

  function save() {
    localStorage.setItem(storageKey, JSON.stringify(draft));
    savedAt = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
  }

  function validate() {
    const errors = {};
    const step = steps[stepIndex];

    if (step.id === 'team') {
      if (draft.team.trim().length < 3) errors.team = solo ? 'Enter a display name of at least 3 characters.' : 'Enter a team name of at least 3 characters.';
      if (!draft.track) errors.track = 'Choose a track to continue.';
    }
    if (step.id === 'lead') {
      if (!/^[6-9]\d{9}$/.test(draft.phone.replace(/\s/g, ''))) errors.phone = 'Enter a valid 10-digit mobile number.';
      if (!draft.year) errors.year = 'Select your year of study.';
    }
    if (step.id === 'members') {
      draft.members.forEach((m, i) => {
        if (!m.name.trim()) errors[`m${i}name`] = 'Enter this member’s name.';
        if (!isEmail(m.email)) errors[`m${i}email`] = 'Enter a valid email.';
        else if (m.email.trim().toLowerCase() === user.email.toLowerCase()) errors[`m${i}email`] = 'You are already the team lead.';
      });
    }
    if (step.id === 'project') {
      if (draft.project.trim().length < 4) errors.project = 'Give your idea a short title.';
      if (draft.summary.trim().length < 30) errors.summary = 'Describe your idea in at least 30 characters.';
    }
    if (step.id === 'review' && !draft.agree) {
      errors.agree = 'Please accept the participation guidelines.';
    }
    return errors;
  }

  function getPreviewJsonHtml() {
    const preview = {
      event: event.slug,
      [solo ? 'entry' : 'team']: draft.team || null,
      track: draft.track || null,
      lead: user.name ?? null,
      lead_email: user.email ?? null,
      phone: draft.phone ? draft.phone.replace(/\d(?=\d{4})/g, '•') : null,
      ...(solo ? {} : { members: draft.members.length + 1 }),
      ...(needsProject(event) ? { idea: draft.project || null } : {}),
      fee: event.fee,
      step: `${stepIndex + 1}/${steps.length}`,
    };

    const entries = Object.entries(preview);
    const lines = entries.map(([k, v], i) => {
      const isLast = i === entries.length - 1;
      const comma = isLast ? '' : ',';
      let valSpan = `<span class="pn">null</span>`;
      if (typeof v === 'number') {
        valSpan = `<span class="pnum">${v}</span>`;
      } else if (v !== null) {
        valSpan = `<span class="ps">"${v}"</span>`;
      }
      return `  <span class="pk">"${k}"</span>: ${valSpan}${comma}`;
    });

    return `{\n${lines.join('\n')}\n}`;
  }

  function render() {
    const step = steps[stepIndex];
    const errors = validate();
    const shown = touched ? errors : {};
    const pct = ((stepIndex + 1) / steps.length) * 100;

    const railHtml = steps
      .map((s, i) => {
        const isDone = i < stepIndex;
        const isCurrent = i === stepIndex;
        const stateClass = isCurrent ? 'current' : isDone ? 'done' : '';
        const icon = isDone ? checkIcon : stepIcons[s.id];
        return `
          <li class="${stateClass}">
            <button type="button" ${i > stepIndex ? 'disabled' : ''} data-step-nav="${i}" aria-current="${isCurrent ? 'step' : 'false'}">
              <span class="rail-icon">${icon}</span>
              <span>
                <b>${s.label}</b>
                <small>${s.hint}</small>
              </span>
            </button>
          </li>
        `;
      })
      .join('');

    let stepBodyHtml = '';

    if (step.id === 'team') {
      const tracks = tracksFor(event);
      stepBodyHtml = `
        <div class="form-group ${shown.team ? 'input-error' : ''}">
          <label for="reg-team">${solo ? 'DISPLAY NAME' : 'TEAM NAME'}</label>
          <div class="form-input">
            <input id="reg-team" value="${draft.team}" maxlength="32" placeholder="${solo ? 'e.g. Aarav S.' : 'e.g. Circuit Sutra'}" />
          </div>
          ${shown.team ? `<div class="input-helper"><span class="helper-alert">${alertIcon}</span>${shown.team}</div>` : draft.team.trim().length >= 3 ? `<div class="field-ok">${checkIcon}Looks good</div>` : ''}
        </div>

        <fieldset class="track-field">
          <legend>TRACK <span aria-hidden="true">*</span></legend>
          <div class="track-grid">
            ${tracks
              .map(
                (t, i) => `
              <label class="track-option ${draft.track === t ? 'selected' : ''}">
                <input type="radio" name="track" value="${t}" ${draft.track === t ? 'checked' : ''} />
                <span class="track-glyph tg-${i % 6}">${String(i + 1).padStart(2, '0')}</span>
                <b>${t}</b>
              </label>
            `
              )
              .join('')}
          </div>
          ${shown.track ? `<div class="input-helper"><span class="helper-alert">${alertIcon}</span>${shown.track}</div>` : ''}
          <p class="field-note">Each registration competes in one track. Not sure? Choose the open category.</p>
        </fieldset>
      `;
    } else if (step.id === 'lead') {
      const years = ['1st', '2nd', '3rd', '4th', 'PG'];
      stepBodyHtml = `
        <div class="reg-fields">
          <div class="readonly-card">
            <span class="rail-icon">${stepIcons.lead}</span>
            <div>
              <b>${user.name}</b>
              <small>${user.email} · ${user.department}</small>
            </div>
            <span class="hud-chip">FROM PROFILE</span>
          </div>

          <div class="form-group ${shown.phone ? 'input-error' : ''}">
            <label for="reg-phone">MOBILE NUMBER</label>
            <div class="form-input">
              <span class="input-prefix">+91</span>
              <input id="reg-phone" inputmode="numeric" autocomplete="tel-national" value="${draft.phone}" maxlength="11" placeholder="98765 43210" />
            </div>
            ${shown.phone ? `<div class="input-helper"><span class="helper-alert">${alertIcon}</span>${shown.phone}</div>` : ''}
          </div>

          <div class="form-group ${shown.year ? 'input-error' : ''}">
            <label for="reg-year">YEAR OF STUDY</label>
            <div class="year-pills" id="reg-year" role="radiogroup" aria-label="Year of study">
              ${years
                .map(
                  (y) => `
                <button type="button" role="radio" aria-checked="${draft.year === y}" class="${draft.year === y ? 'selected' : ''}" data-year="${y}">${y}</button>
              `
                )
                .join('')}
            </div>
            ${shown.year ? `<div class="input-helper"><span class="helper-alert">${alertIcon}</span>${shown.year}</div>` : ''}
          </div>
        </div>
      `;
    } else if (step.id === 'members') {
      stepBodyHtml = `
        <div class="reg-fields">
          <div class="member-row lead-row">
            <span class="member-index">01</span>
            <div>
              <b>${user.name}</b>
              <small>${user.email}</small>
            </div>
            <span class="hud-chip">LEAD</span>
          </div>

          ${draft.members
            .map(
              (m, i) => `
            <div class="member-row">
              <span class="member-index">${String(i + 2).padStart(2, '0')}</span>
              <div class="form-group ${shown[`m${i}name`] ? 'input-error' : ''}">
                <label for="m${i}n">NAME</label>
                <div class="form-input">
                  <input id="m${i}n" class="member-name-input" data-idx="${i}" value="${m.name}" placeholder="Teammate name" />
                </div>
                ${shown[`m${i}name`] ? `<div class="input-helper"><span class="helper-alert">${alertIcon}</span>${shown[`m${i}name`]}</div>` : ''}
              </div>
              <div class="form-group ${shown[`m${i}email`] ? 'input-error' : ''}">
                <label for="m${i}e">EMAIL</label>
                <div class="form-input">
                  <input id="m${i}e" type="email" class="member-email-input" data-idx="${i}" value="${m.email}" placeholder="name@college.edu" />
                </div>
                ${shown[`m${i}email`] ? `<div class="input-helper"><span class="helper-alert">${alertIcon}</span>${shown[`m${i}email`]}</div>` : ''}
              </div>
              ${
                draft.members.length + 1 > minTeam
                  ? `<button type="button" class="member-remove remove-member-btn" data-idx="${i}" aria-label="Remove member ${i + 2}">Remove</button>`
                  : ''
              }
            </div>
          `
            )
            .join('')}

          ${
            draft.members.length + 1 < maxTeam
              ? `<button type="button" class="add-member" id="add-member-btn">+ Add teammate <span>${draft.members.length + 1}/${maxTeam}</span></button>`
              : ''
          }
        </div>
      `;
    } else if (step.id === 'project') {
      stepBodyHtml = `
        <div class="reg-fields">
          <div class="form-group ${shown.project ? 'input-error' : ''}">
            <label for="reg-project">IDEA TITLE</label>
            <div class="form-input">
              <input id="reg-project" value="${draft.project}" maxlength="60" placeholder="e.g. QueueLess Canteen" />
            </div>
            ${shown.project ? `<div class="input-helper"><span class="helper-alert">${alertIcon}</span>${shown.project}</div>` : ''}
          </div>

          <div class="form-group ${shown.summary ? 'input-error' : ''}">
            <label for="reg-summary">WHAT ARE YOU BUILDING?</label>
            <textarea id="reg-summary" class="reg-textarea" rows="5" maxlength="400" placeholder="The problem, who it helps and your first idea for solving it.">${draft.summary}</textarea>
            <div class="char-count" id="summary-char-count">${draft.summary.length}/400</div>
            ${shown.summary ? `<div class="input-helper"><span class="helper-alert">${alertIcon}</span>${shown.summary}</div>` : ''}
          </div>
        </div>
      `;
    } else if (step.id === 'review') {
      const memberNames = [user.name, ...draft.members.map((m) => m.name).filter(Boolean)].join(', ');
      stepBodyHtml = `
        <div class="reg-fields">
          <dl class="review-list">
            <div>
              <dt>${solo ? 'Entry' : 'Team'}</dt>
              <dd>${draft.team}</dd>
              <button type="button" data-edit-step="0">Edit</button>
            </div>
            <div>
              <dt>Track</dt>
              <dd>${CategoryChip(event.category, false, draft.track)}</dd>
              <button type="button" data-edit-step="0">Edit</button>
            </div>
            <div>
              <dt>Contact</dt>
              <dd>${user.name} · +91 ${draft.phone} · ${draft.year} year</dd>
              <button type="button" data-edit-step="1">Edit</button>
            </div>
            ${
              !solo
                ? `
              <div>
                <dt>Members</dt>
                <dd>${memberNames}</dd>
                <button type="button" data-edit-step="${steps.findIndex((s) => s.id === 'members')}">Edit</button>
              </div>
            `
                : ''
            }
            ${
              needsProject(event)
                ? `
              <div>
                <dt>Idea</dt>
                <dd>${draft.project}</dd>
                <button type="button" data-edit-step="${steps.findIndex((s) => s.id === 'project')}">Edit</button>
              </div>
            `
                : ''
            }
            <div>
              <dt>Entry fee</dt>
              <dd>${event.fee === 'Free' ? 'Free' : `${event.fee} · pay at the venue desk`}</dd>
            </div>
          </dl>

          <label class="agree-row ${shown.agree ? 'has-error' : ''}">
            <input type="checkbox" id="reg-agree" ${draft.agree ? 'checked' : ''} />
            <span>I confirm these details are correct and agree to the festival participation guidelines.</span>
          </label>
          ${shown.agree ? `<div class="input-helper"><span class="helper-alert">${alertIcon}</span>${shown.agree}</div>` : ''}
        </div>
      `;
    }

    mount.innerHTML = `
      <header class="register-head">
        <div>
          <span class="hud-label">// REGISTRATION · ${event.category.toUpperCase()}</span>
          <div class="register-title" role="heading" aria-level="1">${event.title}</div>
          <div class="register-meta">
            <span>${event.longDate}</span>
            <i></i>
            <span>${event.venue}</span>
            <i></i>
            <span>${solo ? 'SOLO ENTRY' : `TEAM OF ${minTeam}–${maxTeam}`}</span>
          </div>
        </div>
        <a href="event-details.html?slug=${event.slug}" class="register-exit">Save & exit</a>
      </header>

      <div class="register-grid">
        <aside class="register-side">
          <div class="register-rail">
            <div class="rail-head">
              <b>${solo ? 'Solo registration' : 'Team registration'}</b>
              <span class="${event.fee === 'Free' ? 'fee-free' : 'fee-paid'}">${event.fee === 'Free' ? 'FREE' : event.fee}</span>
            </div>
            <ol>
              ${railHtml}
            </ol>
          </div>

          <div class="live-preview" aria-label="Live registration preview">
            <div class="preview-bar">
              <span></span><span></span><span></span>
              <code>registration.json · live</code>
            </div>
            <pre>${getPreviewJsonHtml()}</pre>
          </div>
        </aside>

        <section class="register-card" aria-labelledby="step-title">
          <div class="register-card-top">
            <div class="step-progress" aria-hidden="true">
              <i style="width: ${pct}%"></i>
            </div>
            <span class="autosave">Draft autosaved · ${savedAt}</span>
          </div>
          <span class="hud-label">STEP ${String(stepIndex + 1).padStart(2, '0')} / ${String(steps.length).padStart(2, '0')}</span>
          <div id="step-title" class="step-title" role="heading" aria-level="2">${headings[step.id][0]}</div>
          <p class="step-sub">${headings[step.id][1]}</p>

          ${stepBodyHtml}

          <div class="register-actions">
            <button type="button" class="btn btn-secondary btn-size-l" id="reg-back-btn" ${submitting ? 'disabled' : ''}>
              ← ${stepIndex === 0 ? 'Event details' : 'Back'}
            </button>
            <button type="button" class="btn btn-primary btn-size-l ${submitting ? 'is-loading' : ''}" id="reg-next-btn" ${submitting ? 'disabled' : ''}>
              ${submitting ? '<span class="btn-spinner" aria-label="Submitting registration"></span>' : step.id === 'review' ? 'Confirm registration' : 'Continue →'}
            </button>
          </div>
        </section>
      </div>
    `;

    bindEvents();
  }

  function bindEvents() {
    // Rail clicks
    mount.querySelectorAll('[data-step-nav]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const targetIdx = Number(btn.getAttribute('data-step-nav'));
        if (targetIdx <= stepIndex) {
          touched = false;
          stepIndex = targetIdx;
          render();
        }
      });
    });

    // Step 0: Team & Track
    const teamInput = document.getElementById('reg-team');
    if (teamInput) {
      teamInput.addEventListener('input', (e) => {
        draft.team = e.target.value;
        save();
        updatePreview();
      });
    }
    mount.querySelectorAll('input[name="track"]').forEach((radio) => {
      radio.addEventListener('change', (e) => {
        draft.track = e.target.value;
        save();
        render();
      });
    });

    // Step 1: Lead
    const phoneInput = document.getElementById('reg-phone');
    if (phoneInput) {
      phoneInput.addEventListener('input', (e) => {
        draft.phone = e.target.value.replace(/[^\d ]/g, '');
        save();
        updatePreview();
      });
    }
    mount.querySelectorAll('.year-pills button').forEach((btn) => {
      btn.addEventListener('click', () => {
        draft.year = btn.getAttribute('data-year');
        save();
        render();
      });
    });

    // Step 2: Members
    mount.querySelectorAll('.member-name-input').forEach((input) => {
      input.addEventListener('input', (e) => {
        const idx = Number(input.getAttribute('data-idx'));
        draft.members[idx].name = e.target.value;
        save();
      });
    });
    mount.querySelectorAll('.member-email-input').forEach((input) => {
      input.addEventListener('input', (e) => {
        const idx = Number(input.getAttribute('data-idx'));
        draft.members[idx].email = e.target.value;
        save();
      });
    });
    mount.querySelectorAll('.remove-member-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        const idx = Number(btn.getAttribute('data-idx'));
        draft.members.splice(idx, 1);
        save();
        render();
      });
    });
    const addMemberBtn = document.getElementById('add-member-btn');
    if (addMemberBtn) {
      addMemberBtn.addEventListener('click', () => {
        draft.members.push({ name: '', email: '' });
        save();
        render();
      });
    }

    // Step 3: Project
    const projectInput = document.getElementById('reg-project');
    if (projectInput) {
      projectInput.addEventListener('input', (e) => {
        draft.project = e.target.value;
        save();
        updatePreview();
      });
    }
    const summaryInput = document.getElementById('reg-summary');
    if (summaryInput) {
      summaryInput.addEventListener('input', (e) => {
        draft.summary = e.target.value;
        const charCount = document.getElementById('summary-char-count');
        if (charCount) charCount.textContent = `${draft.summary.length}/400`;
        save();
      });
    }

    // Step 4: Review
    mount.querySelectorAll('[data-edit-step]').forEach((btn) => {
      btn.addEventListener('click', () => {
        stepIndex = Number(btn.getAttribute('data-edit-step'));
        touched = false;
        render();
      });
    });
    const agreeCheck = document.getElementById('reg-agree');
    if (agreeCheck) {
      agreeCheck.addEventListener('change', (e) => {
        draft.agree = e.target.checked;
        save();
      });
    }

    // Actions
    const backBtn = document.getElementById('reg-back-btn');
    if (backBtn) {
      backBtn.addEventListener('click', () => {
        touched = false;
        if (stepIndex === 0) {
          window.location.href = `event-details.html?slug=${event.slug}`;
        } else {
          stepIndex -= 1;
          render();
        }
      });
    }

    const nextBtn = document.getElementById('reg-next-btn');
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        touched = true;
        const errors = validate();
        if (Object.keys(errors).length > 0) {
          render();
          return;
        }

        touched = false;
        const step = steps[stepIndex];
        if (step.id !== 'review') {
          stepIndex += 1;
          render();
        } else {
          // Final submission
          submitting = true;
          render();
          setTimeout(() => {
            State.addRegistration(event.slug);
            localStorage.removeItem(storageKey);
            window.location.href = `my-registrations.html?registered=${event.slug}`;
          }, 700);
        }
      });
    }
  }

  function updatePreview() {
    const pre = mount.querySelector('.live-preview pre');
    if (pre) {
      pre.innerHTML = getPreviewJsonHtml();
    }
  }

  render();
}
