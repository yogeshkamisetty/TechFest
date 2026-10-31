/**
 * Tech Fest Hub — Clean, Lightweight Client Script
 * Handles UI Interactivity: Mobile Menu, Login/Signup Helpers, Event Filtering.
 */
document.addEventListener('DOMContentLoaded', () => {
  // ==========================================
  // 1. Mobile Menu Toggle
  // ==========================================
  const menuBtn = document.getElementById('nav-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener('click', () => {
      const isClosed = mobileMenu.style.display === 'none' || mobileMenu.style.display === '';
      mobileMenu.style.display = isClosed ? 'block' : 'none';
      menuBtn.setAttribute('aria-expanded', isClosed ? 'true' : 'false');
    });
  }

  // Header scroll shadow
  const header = document.getElementById('site-header');
  if (header) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 20) {
        header.classList.add('is-scrolled');
      } else {
        header.classList.remove('is-scrolled');
      }
    }, { passive: true });
  }

  // ==========================================
  // 2. Login Page Helpers
  // ==========================================
  const loginEmail = document.getElementById('login-email');
  const loginPassword = document.getElementById('login-password');
  const studentDemoBtn = document.getElementById('use-student-demo-btn');
  const adminDemoBtn = document.getElementById('use-admin-demo-btn');
  const togglePwdBtn = document.getElementById('toggle-password-btn');
  const loginAlertSlot = document.getElementById('login-alert-slot');
  const loginNextInput = document.getElementById('login-next');

  const urlParams = new URLSearchParams(window.location.search);
  const errorParam = urlParams.get('error');
  const nextParam = urlParams.get('next');

  if (loginNextInput && nextParam) {
    loginNextInput.value = nextParam;
  }

  if (loginAlertSlot && errorParam) {
    loginAlertSlot.innerHTML = `
      <div class="alert-ds alert-error" role="alert" style="margin-bottom: 20px; padding: 12px 16px; border-radius: 10px; background: #FFF0F0; border: 1px solid #FFC9C9; color: #D6336C; display: flex; align-items: center; gap: 8px;">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width: 18px; height: 18px; flex-shrink: 0;"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
        <span>${escapeHtml(errorParam)}</span>
      </div>
    `;
  }

  if (studentDemoBtn && loginEmail && loginPassword) {
    studentDemoBtn.addEventListener('click', () => {
      loginEmail.value = 'aarav@college.edu';
      loginPassword.value = 'Utsav@2026';
    });
  }

  if (adminDemoBtn && loginEmail && loginPassword) {
    adminDemoBtn.addEventListener('click', () => {
      loginEmail.value = 'admin@techfesthub.demo';
      loginPassword.value = 'ArenaAdmin@2026';
    });
  }

  if (togglePwdBtn && loginPassword) {
    togglePwdBtn.addEventListener('click', () => {
      const isText = loginPassword.type === 'text';
      loginPassword.type = isText ? 'password' : 'text';
    });
  }

  // ==========================================
  // 3. Signup Page Helpers
  // ==========================================
  const signupAlertSlot = document.getElementById('signup-alert-slot');
  const signupPwd = document.getElementById('signup-password');
  const toggleSignupPwdBtn = document.getElementById('toggle-signup-pwd');

  if (signupAlertSlot && errorParam) {
    const isExists = urlParams.get('exists') || errorParam.toLowerCase().includes('already exists');
    signupAlertSlot.innerHTML = `
      <div class="alert-ds alert-error" role="alert" style="margin-bottom: 20px; padding: 14px 18px; border-radius: 12px; background: #FFF0F0; border: 1px solid #FFC9C9; color: #D6336C; display: flex; flex-direction: column; gap: 10px;">
        <div style="display: flex; align-items: center; gap: 8px;">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width: 18px; height: 18px; flex-shrink: 0;"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          <span style="font-weight: 600;">${escapeHtml(errorParam)}</span>
        </div>
        ${isExists ? `<div style="margin-top: 4px;"><a href="login.html" class="btn btn-secondary btn-size-m is-default" style="text-decoration: none; display: inline-block;"><span>Go to Login &rarr;</span></a></div>` : ''}
      </div>
    `;
  }

  if (toggleSignupPwdBtn && signupPwd) {
    toggleSignupPwdBtn.addEventListener('click', () => {
      const isText = signupPwd.type === 'text';
      signupPwd.type = isText ? 'password' : 'text';
    });
  }

  // ==========================================
  // 4. Events Filter & Search (events.jsp)
  // ==========================================
  const searchInput = document.getElementById('search-input');
  const sortSelect = document.getElementById('sort-select');
  const openOnlyToggle = document.getElementById('open-only-toggle');
  const categoryChips = document.querySelectorAll('#category-chips-row button');
  const eventGrid = document.getElementById('events-grid-mount');
  const filterCount = document.getElementById('filter-count');

  if (eventGrid) {
    let currentCategory = 'all';
    let isOpenOnly = false;
    let searchQuery = '';

    // Read URL category param if present (e.g. ?category=Coding)
    const initialCat = urlParams.get('category');
    if (initialCat) {
      currentCategory = initialCat;
      categoryChips.forEach(chip => {
        if (chip.getAttribute('data-cat').toLowerCase() === initialCat.toLowerCase()) {
          categoryChips.forEach(c => c.classList.remove('is-active'));
          chip.classList.add('is-active');
        }
      });
      applyFilters();
    }

    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        searchQuery = e.target.value.trim().toLowerCase();
        applyFilters();
      });
    }

    if (openOnlyToggle) {
      openOnlyToggle.addEventListener('click', () => {
        isOpenOnly = !isOpenOnly;
        openOnlyToggle.setAttribute('aria-checked', isOpenOnly ? 'true' : 'false');
        openOnlyToggle.classList.toggle('is-active', isOpenOnly);
        applyFilters();
      });
    }

    categoryChips.forEach(chip => {
      chip.addEventListener('click', () => {
        categoryChips.forEach(c => c.classList.remove('is-active'));
        chip.classList.add('is-active');
        currentCategory = chip.getAttribute('data-cat');
        applyFilters();
      });
    });

    if (sortSelect) {
      sortSelect.addEventListener('change', () => {
        sortCards(sortSelect.value);
      });
    }

    function applyFilters() {
      const cards = eventGrid.querySelectorAll('.ds-event-card');
      let visibleCount = 0;

      cards.forEach(card => {
        const cat = (card.getAttribute('data-category') || '').toLowerCase();
        const status = (card.getAttribute('data-status') || '').toUpperCase();
        const name = (card.getAttribute('data-name') || '').toLowerCase();

        const matchCat = (currentCategory === 'all' || cat === currentCategory.toLowerCase());
        const matchOpen = (!isOpenOnly || status === 'OPEN');
        const matchSearch = (!searchQuery || name.includes(searchQuery) || cat.includes(searchQuery));

        if (matchCat && matchOpen && matchSearch) {
          card.style.display = '';
          visibleCount++;
        } else {
          card.style.display = 'none';
        }
      });

      if (filterCount) {
        filterCount.textContent = `${visibleCount} EVENT${visibleCount === 1 ? '' : 'S'}`;
      }
    }

    function sortCards(mode) {
      const cards = Array.from(eventGrid.querySelectorAll('.ds-event-card'));
      cards.sort((a, b) => {
        if (mode === 'fee') {
          const feeA = parseFloat(a.getAttribute('data-fee') || '0');
          const feeB = parseFloat(b.getAttribute('data-fee') || '0');
          return feeA - feeB;
        } else if (mode === 'name') {
          const nameA = (a.getAttribute('data-name') || '').toLowerCase();
          const nameB = (b.getAttribute('data-name') || '').toLowerCase();
          return nameA.localeCompare(nameB);
        }
        return 0; // Default ordering
      });
      cards.forEach(card => eventGrid.appendChild(card));
    }
  }

  function escapeHtml(str) {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
});
