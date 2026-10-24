import { State } from './state.js';
import { StatusBadge } from './components.js';

const user = State.getUser();
const shellMount = document.getElementById('admin-shell-mount');
const modalSlot = document.getElementById('admin-modal-slot');

if (!user) {
  window.location.href = `login.html?next=admin.html`;
} else if (user.role !== 'admin') {
  if (shellMount) {
    shellMount.innerHTML = `
      <div class="admin-denied" style="max-width: 520px; margin: 80px auto; padding: 32px; text-align: center; border: 1px solid #F0DCC0; border-radius: 16px; background: #FFFFFF;">
        <div class="heading heading-medium" style="font-size: 24px; font-weight: 700; margin-bottom: 8px;">Admin access only</div>
        <p style="color: #8A5A3C; margin-bottom: 24px;">Your student account cannot access festival management.</p>
        <a href="index.html" class="btn btn-secondary btn-size-m is-default"><span>Return to the festival</span></a>
      </div>
    `;
  }
} else {
  let section = 'overview'; // 'overview' | 'events' | 'registrations' | 'students'
  let search = '';
  let editing = null;
  let message = '';
  let error = '';

  const titles = {
    overview: ['Festival at a glance', 'A little organisation. A lot of possibility.'],
    events: ['Your festival programme', 'Manage event information and registration availability.'],
    registrations: ['Every pass, in one place', 'A live view of the registrations stored in this browser.'],
    students: ['The minds behind the magic', 'Student accounts in your local festival workspace.'],
  };

  function render() {
    const events = State.getEvents();
    const students = State.getAllStudents();
    const registrations = State.getAllRegistrations();

    const q = search.trim().toLowerCase();
    const filteredEvents = events.filter((e) => `${e.title} ${e.category} ${e.venue}`.toLowerCase().includes(q));
    const filteredRegs = registrations.filter((r) => {
      const ev = events.find((e) => e.slug === r.slug);
      return `${r.name} ${r.email} ${r.regId} ${ev ? ev.title : r.slug}`.toLowerCase().includes(q);
    });
    const filteredStudents = students.filter((s) => `${s.name} ${s.email} ${s.department}`.toLowerCase().includes(q));

    const confirmedCount = registrations.filter((r) => r.status === 'Confirmed').length;
    const openCount = events.filter((e) => e.status === 'Open').length;

    let mainContentHtml = `
      <div class="admin-page-heading">
        <div>
          <div class="eyebrow">${section === 'overview' ? 'WELCOME BACK, FESTIVAL TEAM' : 'MANAGE / ' + section.toUpperCase()}</div>
          <div class="heading heading-large">${titles[section][0]}</div>
          <p>${titles[section][1]}</p>
        </div>
        <span class="admin-season">TECH FEST<br /><b>2026</b></span>
      </div>

      ${message ? `<div class="alert-ds" role="status" style="margin-bottom: 24px;">${message}</div>` : ''}
    `;

    if (section === 'overview') {
      mainContentHtml += `
        <div class="admin-stats">
          <div class="admin-stat peach">
            <span class="eyebrow">Events</span>
            <strong>${events.length}</strong>
          </div>
          <div class="admin-stat mint">
            <span class="eyebrow">Open for registration</span>
            <strong>${openCount}</strong>
          </div>
          <div class="admin-stat pink">
            <span class="eyebrow">Student accounts</span>
            <strong>${students.length}</strong>
          </div>
          <div class="admin-stat blue">
            <span class="eyebrow">Confirmed passes</span>
            <strong>${confirmedCount}</strong>
          </div>
        </div>

        <div class="admin-section-head">
          <div class="heading heading-medium">The programme</div>
          <button type="button" class="btn btn-ghost" id="manage-events-btn" style="color: #0B7A70; font-weight: 600;">Manage events →</button>
        </div>
      `;
    }

    if (section !== 'overview') {
      mainContentHtml += `
        <label class="search-ds admin-search" style="margin-bottom: 20px;">
          <input aria-label="Search ${section}" id="admin-search-input" value="${search}" placeholder="Search ${section}…" />
        </label>
      `;
    }

    // Table Content
    let tableHeadings = [];
    let tableRowsHtml = '';
    let isEmpty = false;

    if (section === 'students') {
      tableHeadings = ['STUDENT', 'EMAIL', 'DEPARTMENT'];
      if (!filteredStudents.length) isEmpty = true;
      tableRowsHtml = filteredStudents
        .map(
          (s) => `
        <tr>
          <td>${s.name}</td>
          <td>${s.email}</td>
          <td>${s.department}</td>
        </tr>
      `
        )
        .join('');
    } else if (section === 'registrations') {
      tableHeadings = ['PASS ID', 'STUDENT', 'EVENT', 'REGISTERED', 'STATUS'];
      if (!filteredRegs.length) isEmpty = true;
      tableRowsHtml = filteredRegs
        .map((r) => {
          const ev = events.find((e) => e.slug === r.slug);
          return `
          <tr>
            <td><b>${r.regId}</b></td>
            <td>${r.name}<small class="admin-subtext" style="display:block;color:#8A5A3C;">${r.email}</small></td>
            <td>${ev ? ev.title : r.slug}</td>
            <td>${r.registeredOn}</td>
            <td>${StatusBadge(r.status)}</td>
          </tr>
        `;
        })
        .join('');
    } else {
      // overview or events
      tableHeadings = ['EVENT', 'CATEGORY', 'VENUE', 'FEE', 'STATUS', ''];
      if (!filteredEvents.length) isEmpty = true;
      tableRowsHtml = filteredEvents
        .map(
          (e) => `
        <tr>
          <td><a href="event-details.html?slug=${e.slug}" target="_blank" style="color:#5B3A29;font-weight:600;">${e.title}</a></td>
          <td>${e.category}</td>
          <td>${e.venue}</td>
          <td>${e.fee}</td>
          <td>${StatusBadge(e.status)}</td>
          <td>
            <button type="button" class="btn btn-ghost edit-event-btn" data-slug="${e.slug}">Edit</button>
          </td>
        </tr>
      `
        )
        .join('');
    }

    mainContentHtml += `
      <div class="admin-table-wrap">
        <table class="table-ds">
          <thead>
            <tr>
              ${tableHeadings.map((h) => `<th>${h}</th>`).join('')}
            </tr>
          </thead>
          <tbody>
            ${tableRowsHtml}
          </tbody>
        </table>
        ${isEmpty ? '<p class="admin-empty">No matching records.</p>' : ''}
      </div>

      <p class="admin-local-note">
        Demo environment · Data is stored locally, not shared across browsers. This is not a secure production admin service.
      </p>
    `;

    // Modal HTML
    let modalHtml = '';
    if (editing) {
      modalHtml = `
        <div class="admin-modal-backdrop">
          <section class="admin-editor" role="dialog" aria-modal="true" aria-labelledby="admin-editor-title">
            <div id="admin-editor-title" class="heading heading-medium">Edit event</div>
            <p>Update the details students see on the festival pages.</p>
            <form id="admin-edit-form">
              <label class="input-wrap">
                <span>EVENT TITLE</span>
                <input name="title" id="edit-title" value="${editing.title}" required />
              </label>
              <label class="input-wrap">
                <span>VENUE</span>
                <input name="venue" id="edit-venue" value="${editing.venue}" required />
              </label>
              <label class="input-wrap">
                <span>FEE IN ₹ · 0 FOR FREE</span>
                <input name="fee" id="edit-fee" type="number" min="0" value="${editing.fee === 'Free' ? '0' : editing.fee.replace('₹', '')}" required />
              </label>
              <label class="input-wrap">
                <span>STATUS</span>
                <select name="status" id="edit-status">
                  <option value="Open" ${editing.status === 'Open' ? 'selected' : ''}>Open</option>
                  <option value="Closed" ${editing.status === 'Closed' ? 'selected' : ''}>Closed</option>
                  <option value="Completed" ${editing.status === 'Completed' ? 'selected' : ''}>Completed</option>
                </select>
              </label>

              ${error ? `<div class="alert-ds alert-error" role="alert" style="margin-top: 16px;">${error}</div>` : ''}

              <div class="admin-editor-actions">
                <button type="button" class="btn btn-secondary btn-size-m" id="discard-edit-btn">Discard changes</button>
                <button type="submit" class="btn btn-primary btn-size-m">Save event</button>
              </div>
            </form>
          </section>
        </div>
      `;
    }

    shellMount.innerHTML = `
      <aside class="admin-sidebar">
        <a href="index.html" class="home-logo">
          <span class="lotus-ticket"><i></i><i></i><i></i></span>TECH FEST HUB
        </a>
        <span class="eyebrow">FESTIVAL OFFICE</span>
        <nav>
          <button type="button" class="admin-nav-item ${section === 'overview' ? 'active' : ''}" data-tab="overview">Overview</button>
          <button type="button" class="admin-nav-item ${section === 'events' ? 'active' : ''}" data-tab="events">Events</button>
          <button type="button" class="admin-nav-item ${section === 'registrations' ? 'active' : ''}" data-tab="registrations">Registrations</button>
          <button type="button" class="admin-nav-item ${section === 'students' ? 'active' : ''}" data-tab="students">Students</button>
        </nav>
        <div class="admin-sidebar-bottom">
          <p>Local demo workspace<br /><small>Changes stay in this browser.</small></p>
          <button type="button" class="btn btn-secondary btn-size-m" id="admin-logout-btn">Logout</button>
        </div>
      </aside>

      <div class="admin-content">
        <header class="admin-top">
          <span class="eyebrow">UTSAV ARENA / ADMIN</span>
          <a href="events.html" target="_blank">View festival →</a>
          <span class="admin-avatar">FA</span>
        </header>
        <main class="admin-main">
          ${mainContentHtml}
        </main>
      </div>
    `;

    if (modalSlot) {
      modalSlot.innerHTML = modalHtml;
    }

    bindEvents();
  }

  function bindEvents() {
    // Nav buttons
    shellMount.querySelectorAll('.admin-nav-item').forEach((btn) => {
      btn.addEventListener('click', () => {
        section = btn.getAttribute('data-tab');
        search = '';
        message = '';
        error = '';
        render();
      });
    });

    const manageEventsBtn = document.getElementById('manage-events-btn');
    if (manageEventsBtn) {
      manageEventsBtn.addEventListener('click', () => {
        section = 'events';
        search = '';
        render();
      });
    }

    // Logout
    const logoutBtn = document.getElementById('admin-logout-btn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', () => {
        State.logout();
        window.location.href = 'login.html';
      });
    }

    // Search input
    const searchInput = document.getElementById('admin-search-input');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        search = e.target.value;
        render();
        const nextInput = document.getElementById('admin-search-input');
        if (nextInput) {
          nextInput.focus();
          nextInput.selectionStart = nextInput.selectionEnd = search.length;
        }
      });
    }

    // Edit button clicks
    shellMount.querySelectorAll('.edit-event-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        const slugToEdit = btn.getAttribute('data-slug');
        const ev = State.getEvent(slugToEdit);
        if (ev) {
          editing = { ...ev };
          error = '';
          message = '';
          render();
        }
      });
    });

    // Modal form submit
    const editForm = document.getElementById('admin-edit-form');
    if (editForm && editing) {
      editForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const title = document.getElementById('edit-title').value.trim();
        const venue = document.getElementById('edit-venue').value.trim();
        const feeNum = Number(document.getElementById('edit-fee').value);
        const status = document.getElementById('edit-status').value;

        if (!title || !venue || !Number.isFinite(feeNum) || feeNum < 0) {
          error = 'Enter a title, venue and a valid non-negative fee.';
          render();
          return;
        }

        try {
          State.updateEvent(editing.slug, {
            title,
            venue,
            fee: feeNum === 0 ? 'Free' : `₹${feeNum}`,
            status,
          });
          message = 'Event updated. Changes are reflected on the student pages.';
          editing = null;
          error = '';
          render();
        } catch {
          error = 'Unable to save. Please allow browser storage and try again.';
          render();
        }
      });

      const discardBtn = document.getElementById('discard-edit-btn');
      if (discardBtn) {
        discardBtn.addEventListener('click', () => {
          editing = null;
          error = '';
          render();
        });
      }
    }
  }

  render();
}
