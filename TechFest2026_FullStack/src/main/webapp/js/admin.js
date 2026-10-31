import { State } from './state.js';
import { StatusBadge } from './components.js';

const user = State.getUser();
const shellMount = document.getElementById('admin-shell-mount');
const modalSlot = document.getElementById('admin-modal-slot');

if (!user) {
  window.location.href = `login.html?next=admin.html`;
} else if (user.role !== 'admin' && user.role !== 'ADMIN') {
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
  let showCreateEvent = false;
  let showAddStudent = false;
  let message = '';
  let error = '';

  let liveEvents = [];
  let liveStudents = [];
  let liveRegistrations = [];

  const titles = {
    overview: ['Festival at a glance', 'A little organisation. A lot of possibility.'],
    events: ['Your festival programme', 'Manage event information, create new events, and toggle availability.'],
    registrations: ['Every pass, in one place', 'Live student registrations stored in Oracle SQL database.'],
    students: ['The minds behind the magic', 'Active student accounts in your Oracle SQL festival database.'],
  };

  async function loadData() {
    try {
      // 1. Events from DB
      const evRes = await fetch('api/events');
      if (evRes.ok) {
        const data = await evRes.json();
        if (Array.isArray(data)) {
          liveEvents = data.map((e) => ({
            slug: e.slug,
            title: e.eventName || e.title,
            category: e.category || 'General',
            venue: e.venue || 'Campus',
            fee: e.registrationFee === 0 || e.registrationFee === '0' || !e.registrationFee ? 'Free' : `₹${e.registrationFee}`,
            status: e.status ? (e.status.charAt(0).toUpperCase() + e.status.slice(1).toLowerCase()) : 'Open',
            capacity: e.maxParticipants || 100,
            cardDate: e.cardDate || '14 Nov',
            description: e.description || ''
          }));
        }
      }
    } catch (e) {
      console.warn('Fallback to local events:', e);
      liveEvents = State.getEvents();
    }

    try {
      // 2. Students from DB
      const stRes = await fetch('admin/students', { headers: { 'Accept': 'application/json' } });
      if (stRes.ok) {
        const data = await stRes.json();
        if (Array.isArray(data)) {
          liveStudents = data.map((s) => ({
            id: s.userId || s.id,
            name: s.fullName || s.name,
            email: s.email,
            department: s.department || 'General',
            createdAt: s.createdAt ? new Date(s.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Registered'
          }));
        }
      }
    } catch (e) {
      console.warn('Fallback to local students:', e);
      liveStudents = State.getAllStudents();
    }

    try {
      // 3. Registrations from DB
      const regRes = await fetch('admin/registrations', { headers: { 'Accept': 'application/json' } });
      if (regRes.ok) {
        const data = await regRes.json();
        if (Array.isArray(data)) {
          liveRegistrations = data.map((r) => ({
            regId: r.regNumber || `REG-${r.registrationId}`,
            name: r.userName || 'Student',
            email: r.userEmail || '',
            eventName: r.eventName || r.eventSlug,
            slug: r.eventSlug,
            registeredOn: r.registeredAt ? new Date(r.registeredAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Confirmed',
            status: r.status ? (r.status.charAt(0).toUpperCase() + r.status.slice(1).toLowerCase()) : 'Confirmed'
          }));
        }
      }
    } catch (e) {
      console.warn('Fallback to local registrations:', e);
      liveRegistrations = State.getAllRegistrations();
    }

    render();
  }

  function render() {
    const events = liveEvents.length ? liveEvents : State.getEvents();
    const students = liveStudents.length ? liveStudents : State.getAllStudents();
    const registrations = liveRegistrations.length ? liveRegistrations : State.getAllRegistrations();

    const q = search.trim().toLowerCase();
    const filteredEvents = events.filter((e) => `${e.title} ${e.category} ${e.venue}`.toLowerCase().includes(q));
    const filteredRegs = registrations.filter((r) => {
      return `${r.name || ''} ${r.email || ''} ${r.regId || ''} ${r.eventName || r.slug || ''}`.toLowerCase().includes(q);
    });
    const filteredStudents = students.filter((s) => `${s.name || ''} ${s.email || ''} ${s.department || ''}`.toLowerCase().includes(q));

    const confirmedCount = registrations.filter((r) => r.status === 'Confirmed' || r.status === 'CONFIRMED').length;
    const openCount = events.filter((e) => e.status === 'Open' || e.status === 'OPEN').length;

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

    // Action Header Bar for Events / Students
    if (section === 'events') {
      mainContentHtml += `
        <div style="display: flex; gap: 16px; align-items: center; justify-content: space-between; margin-bottom: 20px; flex-wrap: wrap;">
          <label class="search-ds admin-search" style="margin-bottom: 0; flex: 1; max-width: 440px;">
            <input aria-label="Search events" id="admin-search-input" value="${search}" placeholder="Search events by title, category, venue…" />
          </label>
          <button type="button" class="btn btn-primary btn-size-m" id="create-event-btn" style="white-space: nowrap;">
            <span>+ Create New Event</span>
          </button>
        </div>
      `;
    } else if (section === 'students') {
      mainContentHtml += `
        <div style="display: flex; gap: 16px; align-items: center; justify-content: space-between; margin-bottom: 20px; flex-wrap: wrap;">
          <label class="search-ds admin-search" style="margin-bottom: 0; flex: 1; max-width: 440px;">
            <input aria-label="Search students" id="admin-search-input" value="${search}" placeholder="Search students by name, email, department…" />
          </label>
          <button type="button" class="btn btn-primary btn-size-m" id="add-student-btn" style="white-space: nowrap;">
            <span>+ Add Student</span>
          </button>
        </div>
      `;
    } else if (section === 'registrations') {
      mainContentHtml += `
        <label class="search-ds admin-search" style="margin-bottom: 20px; max-width: 440px;">
          <input aria-label="Search registrations" id="admin-search-input" value="${search}" placeholder="Search passes, students, emails, events…" />
        </label>
      `;
    }

    // Table Content
    let tableHeadings = [];
    let tableRowsHtml = '';
    let isEmpty = false;

    if (section === 'students') {
      tableHeadings = ['STUDENT NAME', 'EMAIL', 'DEPARTMENT', 'REGISTERED ON', 'ACTIONS'];
      if (!filteredStudents.length) isEmpty = true;
      tableRowsHtml = filteredStudents
        .map(
          (s) => `
        <tr>
          <td><b>${s.name}</b></td>
          <td>${s.email}</td>
          <td><span style="display:inline-block;padding:2px 8px;border-radius:6px;background:#FFF1C9;color:#8A5A3C;font-size:12px;">${s.department}</span></td>
          <td>${s.createdAt || 'Registered'}</td>
          <td>
            <button type="button" class="btn btn-ghost remove-student-btn" data-id="${s.id}" data-name="${s.name}" style="color: #E0475B; font-weight: 600; padding: 4px 10px;">Remove</button>
          </td>
        </tr>
      `
        )
        .join('');
    } else if (section === 'registrations') {
      tableHeadings = ['PASS NUMBER', 'STUDENT NAME', 'STUDENT EMAIL', 'EVENT', 'REGISTERED ON', 'STATUS'];
      if (!filteredRegs.length) isEmpty = true;
      tableRowsHtml = filteredRegs
        .map((r) => `
          <tr>
            <td><b>${r.regId}</b></td>
            <td><b>${r.name}</b></td>
            <td>${r.email}</td>
            <td>${r.eventName || r.slug}</td>
            <td>${r.registeredOn}</td>
            <td>${StatusBadge(r.status)}</td>
          </tr>
        `)
        .join('');
    } else {
      // overview or events
      tableHeadings = ['EVENT', 'CATEGORY', 'VENUE', 'FEE', 'STATUS', 'ACTIONS'];
      if (!filteredEvents.length) isEmpty = true;
      tableRowsHtml = filteredEvents
        .map(
          (e) => `
        <tr>
          <td><a href="event-details.html?slug=${e.slug}" target="_blank" style="color:#5B3A29;font-weight:600;">${e.title}</a></td>
          <td><span style="display:inline-block;padding:2px 8px;border-radius:6px;background:#DDF5F1;color:#0B7A70;font-size:12px;font-weight:600;">${e.category}</span></td>
          <td>${e.venue}</td>
          <td>${e.fee}</td>
          <td>${StatusBadge(e.status)}</td>
          <td>
            <button type="button" class="btn btn-ghost edit-event-btn" data-slug="${e.slug}" style="color:#0B7A70;font-weight:600;padding:4px 10px;">Edit</button>
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
        ${isEmpty ? '<p class="admin-empty" style="padding: 32px; text-align: center; color: #8A5A3C;">No matching records found.</p>' : ''}
      </div>

      <p class="admin-local-note" style="margin-top: 24px; color: #8A5A3C; font-size: 13px;">
        Connected to Oracle SQL Database (<code>localhost:1521:xe</code>) · Changes are synced live across student pages.
      </p>
    `;

    // Modal HTML: Edit Event, Create Event, or Add Student
    let modalHtml = '';
    if (editing) {
      modalHtml = `
        <div class="admin-modal-backdrop">
          <section class="admin-editor" role="dialog" aria-modal="true" aria-labelledby="admin-editor-title">
            <div id="admin-editor-title" class="heading heading-medium">Edit Event: ${editing.title}</div>
            <p>Update the event details students see across the festival pages.</p>
            <form id="admin-edit-form">
              <label class="input-wrap">
                <span>EVENT TITLE</span>
                <input name="title" id="edit-title" value="${editing.title}" required />
              </label>
              <label class="input-wrap">
                <span>CATEGORY</span>
                <select name="category" id="edit-category">
                  <option value="Coding" ${editing.category === 'Coding' ? 'selected' : ''}>Coding</option>
                  <option value="Hackathon" ${editing.category === 'Hackathon' ? 'selected' : ''}>Hackathon</option>
                  <option value="Quiz" ${editing.category === 'Quiz' ? 'selected' : ''}>Quiz</option>
                  <option value="Robotics" ${editing.category === 'Robotics' ? 'selected' : ''}>Robotics</option>
                  <option value="Gaming" ${editing.category === 'Gaming' ? 'selected' : ''}>Gaming</option>
                  <option value="Design" ${editing.category === 'Design' ? 'selected' : ''}>Design</option>
                  <option value="General" ${editing.category === 'General' ? 'selected' : ''}>General</option>
                </select>
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
                <span>CAPACITY</span>
                <input name="capacity" id="edit-capacity" type="number" min="1" value="${editing.capacity || 100}" required />
              </label>
              <label class="input-wrap">
                <span>STATUS</span>
                <select name="status" id="edit-status">
                  <option value="Open" ${editing.status === 'Open' || editing.status === 'OPEN' ? 'selected' : ''}>Open</option>
                  <option value="Closed" ${editing.status === 'Closed' || editing.status === 'CLOSED' ? 'selected' : ''}>Closed</option>
                  <option value="Completed" ${editing.status === 'Completed' || editing.status === 'COMPLETED' ? 'selected' : ''}>Completed</option>
                </select>
              </label>

              ${error ? `<div class="alert-ds alert-error" role="alert" style="margin-top: 16px;">${error}</div>` : ''}

              <div class="admin-editor-actions">
                <button type="button" class="btn btn-secondary btn-size-m" id="discard-modal-btn">Discard changes</button>
                <button type="submit" class="btn btn-primary btn-size-m">Save Event</button>
              </div>
            </form>
          </section>
        </div>
      `;
    } else if (showCreateEvent) {
      modalHtml = `
        <div class="admin-modal-backdrop">
          <section class="admin-editor" role="dialog" aria-modal="true" aria-labelledby="admin-editor-title">
            <div id="admin-editor-title" class="heading heading-medium">Create New Event</div>
            <p>Publish a new competition or workshop to the festival database.</p>
            <form id="admin-create-event-form">
              <label class="input-wrap">
                <span>EVENT NAME</span>
                <input name="title" id="create-title" placeholder="e.g. AI Innovation Challenge" required />
              </label>
              <label class="input-wrap">
                <span>CATEGORY</span>
                <select name="category" id="create-category">
                  <option value="Coding">Coding</option>
                  <option value="Hackathon">Hackathon</option>
                  <option value="Quiz">Quiz</option>
                  <option value="Robotics">Robotics</option>
                  <option value="Gaming">Gaming</option>
                  <option value="Design">Design</option>
                  <option value="General">General</option>
                </select>
              </label>
              <label class="input-wrap">
                <span>VENUE</span>
                <input name="venue" id="create-venue" placeholder="e.g. Seminar Hall 2" required />
              </label>
              <label class="input-wrap">
                <span>REGISTRATION FEE (₹) · 0 FOR FREE</span>
                <input name="fee" id="create-fee" type="number" min="0" value="0" required />
              </label>
              <label class="input-wrap">
                <span>MAX CAPACITY</span>
                <input name="capacity" id="create-capacity" type="number" min="1" value="100" required />
              </label>
              <label class="input-wrap">
                <span>DESCRIPTION</span>
                <textarea name="description" id="create-description" rows="3" placeholder="Brief event description..." style="width:100%;border:1px solid #F0DCC0;border-radius:12px;padding:10px;font-family:inherit;"></textarea>
              </label>
              <label class="input-wrap">
                <span>STATUS</span>
                <select name="status" id="create-status">
                  <option value="Open" selected>Open</option>
                  <option value="Closed">Closed</option>
                </select>
              </label>

              ${error ? `<div class="alert-ds alert-error" role="alert" style="margin-top: 16px;">${error}</div>` : ''}

              <div class="admin-editor-actions">
                <button type="button" class="btn btn-secondary btn-size-m" id="discard-modal-btn">Cancel</button>
                <button type="submit" class="btn btn-primary btn-size-m">Create Event</button>
              </div>
            </form>
          </section>
        </div>
      `;
    } else if (showAddStudent) {
      modalHtml = `
        <div class="admin-modal-backdrop">
          <section class="admin-editor" role="dialog" aria-modal="true" aria-labelledby="admin-editor-title">
            <div id="admin-editor-title" class="heading heading-medium">Add Student Account</div>
            <p>Create a verified student login directly in Oracle SQL database.</p>
            <form id="admin-add-student-form">
              <label class="input-wrap">
                <span>FULL NAME</span>
                <input name="name" id="add-student-name" placeholder="e.g. Priya Sharma" required />
              </label>
              <label class="input-wrap">
                <span>COLLEGE EMAIL</span>
                <input name="email" id="add-student-email" type="email" placeholder="priya@college.edu" required />
              </label>
              <label class="input-wrap">
                <span>PASSWORD</span>
                <input name="password" id="add-student-password" type="password" placeholder="Temporary password" required />
              </label>
              <label class="input-wrap">
                <span>DEPARTMENT</span>
                <input name="department" id="add-student-dept" placeholder="e.g. Computer Science" required />
              </label>

              ${error ? `<div class="alert-ds alert-error" role="alert" style="margin-top: 16px;">${error}</div>` : ''}

              <div class="admin-editor-actions">
                <button type="button" class="btn btn-secondary btn-size-m" id="discard-modal-btn">Cancel</button>
                <button type="submit" class="btn btn-primary btn-size-m">Add Student</button>
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
          <p>Oracle SQL XE Connected<br /><small>Live Festival Backend</small></p>
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
      logoutBtn.addEventListener('click', async () => {
        await State.logout();
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

    // Create Event Button
    const createEventBtn = document.getElementById('create-event-btn');
    if (createEventBtn) {
      createEventBtn.addEventListener('click', () => {
        showCreateEvent = true;
        showAddStudent = false;
        editing = null;
        error = '';
        message = '';
        render();
      });
    }

    // Add Student Button
    const addStudentBtn = document.getElementById('add-student-btn');
    if (addStudentBtn) {
      addStudentBtn.addEventListener('click', () => {
        showAddStudent = true;
        showCreateEvent = false;
        editing = null;
        error = '';
        message = '';
        render();
      });
    }

    // Remove Student Buttons
    shellMount.querySelectorAll('.remove-student-btn').forEach((btn) => {
      btn.addEventListener('click', async () => {
        const studentId = btn.getAttribute('data-id');
        const studentName = btn.getAttribute('data-name');
        if (!confirm(`Are you sure you want to remove student "${studentName}"? This will also remove any event registrations for this student.`)) {
          return;
        }

        try {
          const res = await fetch('admin/student/delete', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: studentId })
          });
          const data = await res.json();
          if (res.ok && data.success) {
            message = `Student "${studentName}" was successfully removed from the database.`;
            await loadData();
          } else {
            alert(data.error || 'Failed to remove student.');
          }
        } catch (e) {
          alert('Network error while removing student.');
        }
      });
    });

    // Edit Event button clicks
    shellMount.querySelectorAll('.edit-event-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        const slugToEdit = btn.getAttribute('data-slug');
        const ev = liveEvents.find((e) => e.slug === slugToEdit) || State.getEvent(slugToEdit);
        if (ev) {
          editing = { ...ev };
          showCreateEvent = false;
          showAddStudent = false;
          error = '';
          message = '';
          render();
        }
      });
    });

    // Modal Discard / Cancel button
    const discardBtn = document.getElementById('discard-modal-btn');
    if (discardBtn) {
      discardBtn.addEventListener('click', () => {
        editing = null;
        showCreateEvent = false;
        showAddStudent = false;
        error = '';
        render();
      });
    }

    // Modal Edit Event Submit
    const editForm = document.getElementById('admin-edit-form');
    if (editForm && editing) {
      editForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const title = document.getElementById('edit-title').value.trim();
        const category = document.getElementById('edit-category').value;
        const venue = document.getElementById('edit-venue').value.trim();
        const feeNum = Number(document.getElementById('edit-fee').value);
        const capacity = Number(document.getElementById('edit-capacity').value);
        const status = document.getElementById('edit-status').value;

        if (!title || !venue || !Number.isFinite(feeNum) || feeNum < 0) {
          error = 'Enter a title, venue and a valid non-negative fee.';
          render();
          return;
        }

        try {
          const res = await fetch('admin/event/save', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              slug: editing.slug,
              title,
              category,
              venue,
              fee: feeNum,
              capacity,
              status
            })
          });
          if (res.ok) {
            message = `Event "${title}" updated successfully in Oracle DB.`;
            editing = null;
            error = '';
            await loadData();
          } else {
            error = 'Failed to update event in database.';
            render();
          }
        } catch (err) {
          error = 'Network error while updating event.';
          render();
        }
      });
    }

    // Modal Create Event Submit
    const createEventForm = document.getElementById('admin-create-event-form');
    if (createEventForm && showCreateEvent) {
      createEventForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const title = document.getElementById('create-title').value.trim();
        const category = document.getElementById('create-category').value;
        const venue = document.getElementById('create-venue').value.trim();
        const feeNum = Number(document.getElementById('create-fee').value);
        const capacity = Number(document.getElementById('create-capacity').value);
        const description = document.getElementById('create-description').value.trim();
        const status = document.getElementById('create-status').value;

        if (!title || !venue || !Number.isFinite(feeNum) || feeNum < 0) {
          error = 'Enter an event name, venue, and a valid non-negative fee.';
          render();
          return;
        }

        try {
          const res = await fetch('admin/event/save', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              title,
              category,
              venue,
              fee: feeNum,
              capacity,
              description,
              status
            })
          });
          const data = await res.json();
          if (res.ok && data.success) {
            message = `New event "${title}" successfully created and saved to Oracle DB!`;
            showCreateEvent = false;
            error = '';
            await loadData();
          } else {
            error = data.error || 'Failed to create event in database.';
            render();
          }
        } catch (err) {
          error = 'Network error while creating event.';
          render();
        }
      });
    }

    // Modal Add Student Submit
    const addStudentForm = document.getElementById('admin-add-student-form');
    if (addStudentForm && showAddStudent) {
      addStudentForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = document.getElementById('add-student-name').value.trim();
        const email = document.getElementById('add-student-email').value.trim();
        const password = document.getElementById('add-student-password').value;
        const department = document.getElementById('add-student-dept').value.trim();

        if (!name || !email || !password || !department) {
          error = 'All fields are required to create a student account.';
          render();
          return;
        }

        try {
          const res = await fetch('admin/student/add', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password, department })
          });
          const data = await res.json();
          if (res.ok && data.success) {
            message = `Student "${name}" (${email}) successfully added to Oracle DB!`;
            showAddStudent = false;
            error = '';
            await loadData();
          } else {
            error = data.error || 'Failed to add student to database.';
            render();
          }
        } catch (err) {
          error = 'Network error while adding student.';
          render();
        }
      });
    }
  }

  loadData();
}
