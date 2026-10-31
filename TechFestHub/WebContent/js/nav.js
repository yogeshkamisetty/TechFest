import { State } from './state.js';

export function renderNavbar(active = 'Home', showToran = true) {
  const container = document.getElementById('navbar-mount');
  if (!container) return;

  const user = State.getUser();
  const firstName = user ? user.name.split(' ')[0] : '';
  const firstInitial = firstName ? firstName[0] : '';

  let userNavLinks = `<a href="index.html#how-it-works">How it works</a>`;
  let mobileUserNavLinks = `<a href="index.html#how-it-works">How it works</a>`;
  if (user) {
    if (user.role === 'admin') {
      userNavLinks = `<a href="admin.html" class="${active === 'Admin' ? 'active' : ''}">Admin</a>`;
      mobileUserNavLinks = `<a href="admin.html" class="${active === 'Admin' ? 'active' : ''}">Admin</a>`;
    } else {
      userNavLinks = `<a href="my-registrations.html" class="${active === 'MyReg' ? 'active' : ''}">My Registrations</a>`;
      mobileUserNavLinks = `<a href="my-registrations.html" class="${active === 'MyReg' ? 'active' : ''}">My Registrations</a>`;
    }
  }

  let userActionHtml = `
    <div class="home-auth">
      <a href="login.html">Login</a>
      <a href="signup.html" class="btn btn-primary btn-size-m is-default" data-layer="btn btn-primary"><span>Sign Up</span></a>
    </div>
  `;

  let mobileUserActionHtml = `
    <div class="mobile-menu-auth">
      <a href="login.html" class="btn btn-secondary btn-size-m is-default"><span>Login</span></a>
      <a href="signup.html" class="btn btn-primary btn-size-m is-default"><span>Sign Up</span></a>
    </div>
  `;

  if (user) {
    userActionHtml = `
      <div class="user-pill home-user">
        <span>${firstInitial}</span>
        Hi, ${firstName}
        <button type="button" class="btn btn-ghost btn-size-m is-default" id="nav-logout-btn"><span>Logout</span></button>
      </div>
    `;

    mobileUserActionHtml = `
      <div class="mobile-menu-user">
        <span class="mobile-avatar">${firstInitial}</span>
        <div>
          <b>${user.name}</b>
          <small>${user.email}</small>
        </div>
        <button type="button" id="mobile-logout-btn">Logout</button>
      </div>
    `;
  }

  container.innerHTML = `
    <header class="home-navbar" data-layer="navbar" id="site-header">
      <div class="home-nav-inner">
        <a href="index.html" class="home-logo">
          <span class="lotus-ticket"><i></i><i></i><i></i></span>TECH FEST HUB
        </a>
        <nav aria-label="Primary">
          <a href="index.html" class="${active === 'Home' ? 'active' : ''}">Home</a>
          <a href="events.html" class="${active === 'Events' ? 'active' : ''}">Events</a>
          ${userNavLinks}
        </nav>
        ${userActionHtml}
        <button type="button" class="home-menu-btn" id="nav-menu-btn" aria-label="Open menu" aria-expanded="false" aria-controls="mobile-menu">
          <i></i><i></i><i></i>
        </button>
      </div>
      <div class="mobile-menu" id="mobile-menu" style="display: none;">
        <nav aria-label="Mobile">
          <a href="index.html" class="${active === 'Home' ? 'active' : ''}">Home</a>
          <a href="events.html" class="${active === 'Events' ? 'active' : ''}">Events</a>
          ${mobileUserNavLinks}
        </nav>
        ${mobileUserActionHtml}
      </div>
    </header>
  `;

  // Scroll listener
  const header = document.getElementById('site-header');
  if (header) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 24) {
        header.classList.add('is-scrolled');
      } else {
        header.classList.remove('is-scrolled');
      }
    }, { passive: true });
  }

  // Mobile menu toggle
  const toggleBtn = document.getElementById('nav-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  if (toggleBtn && mobileMenu && header) {
    toggleBtn.addEventListener('click', () => {
      const isOpen = header.classList.toggle('menu-open');
      mobileMenu.style.display = isOpen ? 'block' : 'none';
      toggleBtn.setAttribute('aria-expanded', String(isOpen));
      toggleBtn.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
    });

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && header.classList.contains('menu-open')) {
        header.classList.remove('menu-open');
        mobileMenu.style.display = 'none';
        toggleBtn.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // Logout listener
  const handleLogout = async () => {
    await State.logout();
    window.location.href = 'index.html';
  };
  const logoutBtn = document.getElementById('nav-logout-btn');
  if (logoutBtn) logoutBtn.addEventListener('click', handleLogout);
  const mobileLogoutBtn = document.getElementById('mobile-logout-btn');
  if (mobileLogoutBtn) mobileLogoutBtn.addEventListener('click', handleLogout);
}

export function renderFooter(mountId = 'footer-mount') {
  const mount = document.getElementById(mountId);
  if (!mount) return;

  mount.innerHTML = `
    <footer class="footer-ds" data-layer="footer">
      <div class="footer-cols">
        <div>
          <span class="brand-ds">
            <span class="logo-mark"><i></i><i></i><i></i><i></i></span>TECH FEST HUB
          </span>
          <p>Discover, compete and innovate at India’s brightest campus tech festival.</p>
        </div>
        <div>
          <b>Explore</b>
          <a href="events.html">Events</a>
          <a href="login.html">Login</a>
          <a href="signup.html">Sign Up</a>
        </div>
        <div>
          <b>Account</b>
          <a href="my-registrations.html">My Registrations</a>
        </div>
        <div>
          <b>Contact</b>
          <a href="mailto:hello@techfesthub.example">hello@techfesthub.example</a>
        </div>
      </div>
      <div class="copyright">
        © 2026 TECH FEST HUB
      </div>
    </footer>
  `;
}
