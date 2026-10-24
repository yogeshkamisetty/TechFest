import { State, DEMO_CREDENTIALS, ADMIN_CREDENTIALS } from './state.js';

const urlParams = new URLSearchParams(window.location.search);
const rawNext = urlParams.get('next');
const nextUrl = rawNext && !rawNext.startsWith('//') ? rawNext : 'my-registrations.html';

const alertSvg = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9" /><path d="M12 7v6M12 17h.01" /></svg>`;
const checkSvg = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9" /><path d="m8 12 3 3 5-6" /></svg>`;
const eyeSvg = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/></svg>`;
const eyeOffSvg = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 3l18 18M10.6 5.1A11 11 0 0 1 12 5c6.5 0 10 7 10 7a17 17 0 0 1-3 3.9M6.6 6.6C3.7 8.4 2 12 2 12s3.5 7 10 7a10 10 0 0 0 5.4-1.6" /><path d="M9.9 9.9a3 3 0 0 0 4.2 4.2" /></svg>`;

// ==========================================
// LOGIN PAGE LOGIC
// ==========================================
const loginForm = document.getElementById('login-form');
if (loginForm) {
  const emailInput = document.getElementById('login-email');
  const passwordInput = document.getElementById('login-password');
  const emailGroup = document.getElementById('email-group');
  const passwordGroup = document.getElementById('password-group');
  const passwordHelp = document.getElementById('login-password-help');
  const toggleBtn = document.getElementById('toggle-password-btn');
  const eyeIcon = document.getElementById('eye-icon');
  const loginAlertSlot = document.getElementById('login-alert-slot');
  const submitShell = document.getElementById('login-submit-btn');
  const btnInner = document.getElementById('login-btn-inner');
  const signupLink = document.getElementById('signup-link');

  if (signupLink && rawNext) {
    signupLink.href = `signup.html?next=${encodeURIComponent(rawNext)}`;
  }

  // Pre-fill demo buttons
  const demoStudentBtn = document.getElementById('use-student-demo-btn');
  if (demoStudentBtn) {
    demoStudentBtn.addEventListener('click', () => {
      emailInput.value = DEMO_CREDENTIALS.email;
      passwordInput.value = DEMO_CREDENTIALS.password;
      clearLoginErrors();
    });
  }

  const demoAdminBtn = document.getElementById('use-admin-demo-btn');
  if (demoAdminBtn) {
    demoAdminBtn.addEventListener('click', () => {
      emailInput.value = ADMIN_CREDENTIALS.email;
      passwordInput.value = ADMIN_CREDENTIALS.password;
      clearLoginErrors();
    });
  }

  // Toggle password visibility
  let isPwdVisible = false;
  if (toggleBtn && passwordInput) {
    toggleBtn.addEventListener('click', () => {
      isPwdVisible = !isPwdVisible;
      passwordInput.type = isPwdVisible ? 'text' : 'password';
      toggleBtn.innerHTML = isPwdVisible ? eyeOffSvg : eyeSvg;
      toggleBtn.setAttribute('aria-label', isPwdVisible ? 'Hide password' : 'Show password');
    });
  }

  function clearLoginErrors() {
    if (loginAlertSlot) loginAlertSlot.innerHTML = '';
    if (emailGroup) emailGroup.classList.remove('input-error');
    if (passwordGroup) passwordGroup.classList.remove('input-error');
    if (passwordHelp) passwordHelp.style.display = 'none';
  }

  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    clearLoginErrors();

    const email = emailInput.value.trim();
    const password = passwordInput.value;

    if (!email || !password) {
      if (emailGroup && !email) emailGroup.classList.add('input-error');
      if (passwordGroup && !password) passwordGroup.classList.add('input-error');
      return;
    }

    // Show loading state
    if (submitShell) submitShell.disabled = true;
    if (btnInner) {
      btnInner.classList.add('is-loading');
      btnInner.innerHTML = `<span class="btn-spinner" aria-label="Logging in"></span>`;
    }

    setTimeout(() => {
      const ok = State.login(email, password);
      if (ok) {
        const user = State.getUser();
        if (user && user.role === 'admin' && !rawNext) {
          window.location.href = 'admin.html';
        } else {
          window.location.href = nextUrl;
        }
      } else {
        if (submitShell) submitShell.disabled = false;
        if (btnInner) {
          btnInner.classList.remove('is-loading');
          btnInner.textContent = 'Log In';
        }
        if (loginAlertSlot) {
          loginAlertSlot.innerHTML = `
            <div class="alert-ds alert-error" role="alert">
              ${alertSvg}Invalid email or password.
            </div>
          `;
        }
        if (emailGroup) emailGroup.classList.add('input-error');
        if (passwordGroup) passwordGroup.classList.add('input-error');
        if (passwordHelp) passwordHelp.style.display = 'flex';
      }
    }, 600);
  });
}

// ==========================================
// SIGNUP PAGE LOGIC
// ==========================================
const signupForm = document.getElementById('signup-form');
if (signupForm) {
  const sName = document.getElementById('signup-name');
  const sEmail = document.getElementById('signup-email');
  const sPassword = document.getElementById('signup-password');
  const sConfirm = document.getElementById('signup-confirm');
  const sDept = document.getElementById('signup-department');
  const deptMenu = document.getElementById('dept-menu');

  const nameGroup = document.getElementById('name-group');
  const emailGroup = document.getElementById('email-group');
  const passwordGroup = document.getElementById('password-group');
  const confirmGroup = document.getElementById('confirm-group');
  const deptGroup = document.getElementById('dept-group');

  const nameError = document.getElementById('name-error');
  const emailError = document.getElementById('email-error');
  const passwordError = document.getElementById('password-error');
  const matchLine = document.getElementById('match-line');
  const deptError = document.getElementById('dept-error');

  const strengthMeter = document.getElementById('strength-meter');
  const togglePwdBtn = document.getElementById('toggle-signup-pwd');
  const toggleConfirmBtn = document.getElementById('toggle-signup-confirm');
  const signupAlertSlot = document.getElementById('signup-alert-slot');
  const signupSubmitBtn = document.getElementById('signup-submit-btn');
  const signupBtnInner = document.getElementById('signup-btn-inner');
  const loginLink = document.getElementById('login-link');

  if (loginLink && rawNext) {
    loginLink.href = `login.html?next=${encodeURIComponent(rawNext)}`;
  }

  // Toggle password eye
  let pwdVis = false;
  if (togglePwdBtn && sPassword) {
    togglePwdBtn.addEventListener('click', () => {
      pwdVis = !pwdVis;
      sPassword.type = pwdVis ? 'text' : 'password';
      togglePwdBtn.innerHTML = pwdVis ? eyeOffSvg : eyeSvg;
    });
  }

  let confVis = false;
  if (toggleConfirmBtn && sConfirm) {
    toggleConfirmBtn.addEventListener('click', () => {
      confVis = !confVis;
      sConfirm.type = confVis ? 'text' : 'password';
      toggleConfirmBtn.innerHTML = confVis ? eyeOffSvg : eyeSvg;
    });
  }

  // Password strength
  function checkStrength(p) {
    if (!p) return 'empty';
    const score = Number(p.length >= 8) + Number(/\d/.test(p)) + Number(/[^A-Za-z0-9]|[A-Z]/.test(p));
    return score >= 3 ? 'strong' : score === 2 ? 'medium' : 'weak';
  }

  if (sPassword && strengthMeter) {
    sPassword.addEventListener('input', (e) => {
      const val = e.target.value;
      const lvl = checkStrength(val);
      strengthMeter.className = `strength-set signup-strength strength-${lvl}`;
      const count = { empty: 0, weak: 1, medium: 2, strong: 4 }[lvl] || 0;
      const bars = strengthMeter.querySelectorAll('i');
      bars.forEach((b, i) => {
        b.className = i < count ? 'filled' : '';
      });
      updateMatchLine();
    });
  }

  // Password match verification
  function updateMatchLine() {
    if (!matchLine) return;
    const pwd = sPassword ? sPassword.value : '';
    const conf = sConfirm ? sConfirm.value : '';

    if (!conf) {
      matchLine.style.display = 'none';
      matchLine.innerHTML = '';
      return;
    }

    matchLine.style.display = 'flex';
    if (pwd === conf) {
      matchLine.innerHTML = `${checkSvg}<span>Passwords match</span>`;
      matchLine.className = 'match-line';
      if (confirmGroup) confirmGroup.classList.remove('input-error');
    } else {
      matchLine.innerHTML = `<span class="helper-alert">${alertSvg}</span><span>Passwords do not match</span>`;
      matchLine.className = 'match-line';
    }
  }

  if (sConfirm) {
    sConfirm.addEventListener('input', updateMatchLine);
  }

  // Department autocomplete
  const departments = ['Computer Science', 'Electronics', 'Mechanical', 'Design', 'Information Technology'];

  function renderDeptSuggestions(filterText) {
    if (!deptMenu) return;
    const q = filterText.trim().toLowerCase();
    const matches = departments.filter((d) => d.toLowerCase().includes(q));

    if (matches.length === 0) {
      deptMenu.style.display = 'none';
      return;
    }

    deptMenu.innerHTML = matches
      .map((d) => `<button type="button" role="option" data-dept="${d}">${d}</button>`)
      .join('');
    deptMenu.style.display = 'flex';

    deptMenu.querySelectorAll('button').forEach((b) => {
      b.addEventListener('mousedown', (e) => e.preventDefault());
      b.addEventListener('click', () => {
        sDept.value = b.getAttribute('data-dept');
        deptMenu.style.display = 'none';
        if (deptGroup) deptGroup.classList.remove('input-error');
      });
    });
  }

  if (sDept) {
    sDept.addEventListener('focus', () => renderDeptSuggestions(sDept.value));
    sDept.addEventListener('input', (e) => renderDeptSuggestions(e.target.value));
    sDept.addEventListener('blur', () => {
      setTimeout(() => {
        if (deptMenu) deptMenu.style.display = 'none';
      }, 150);
    });
  }

  signupForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = sName.value.trim();
    const email = sEmail.value.trim();
    const password = sPassword.value;
    const confirm = sConfirm.value;
    const department = sDept.value.trim();

    let hasError = false;

    // Validate Name
    if (!name) {
      hasError = true;
      nameGroup.classList.add('input-error');
      nameError.innerHTML = `<span class="helper-alert">${alertSvg}</span>Enter your full name.`;
      nameError.style.display = 'flex';
    } else {
      nameGroup.classList.remove('input-error');
      nameError.style.display = 'none';
    }

    // Validate Email
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      hasError = true;
      emailGroup.classList.add('input-error');
      emailError.innerHTML = `<span class="helper-alert">${alertSvg}</span>Enter a valid college email.`;
      emailError.style.display = 'flex';
    } else {
      emailGroup.classList.remove('input-error');
      emailError.style.display = 'none';
    }

    // Validate Password
    if (password.length < 8 || !/\d/.test(password)) {
      hasError = true;
      passwordGroup.classList.add('input-error');
      passwordError.innerHTML = `<span class="helper-alert">${alertSvg}</span>Use 8+ characters with a number`;
      passwordError.style.display = 'flex';
    } else {
      passwordGroup.classList.remove('input-error');
      passwordError.style.display = 'none';
    }

    // Validate Confirm Password
    if (!confirm || confirm !== password) {
      hasError = true;
      confirmGroup.classList.add('input-error');
      matchLine.style.display = 'flex';
      matchLine.innerHTML = `<span class="helper-alert">${alertSvg}</span>Passwords do not match`;
    } else {
      confirmGroup.classList.remove('input-error');
    }

    // Validate Department
    if (!department) {
      hasError = true;
      deptGroup.classList.add('input-error');
      deptError.innerHTML = `<span class="helper-alert">${alertSvg}</span>Enter your department.`;
      deptError.style.display = 'flex';
    } else {
      deptGroup.classList.remove('input-error');
      deptError.style.display = 'none';
    }

    if (hasError) return;

    // Loading state
    if (signupSubmitBtn) signupSubmitBtn.disabled = true;
    if (signupBtnInner) {
      signupBtnInner.classList.add('is-loading');
      signupBtnInner.innerHTML = `<span class="btn-spinner" aria-label="Creating account"></span>`;
    }

    setTimeout(() => {
      const res = State.signup({ name, email, password, department });
      if (res === 'ok') {
        window.location.href = nextUrl;
      } else {
        if (signupSubmitBtn) signupSubmitBtn.disabled = false;
        if (signupBtnInner) {
          signupBtnInner.classList.remove('is-loading');
          signupBtnInner.textContent = 'Create Account';
        }
        if (signupAlertSlot) {
          signupAlertSlot.innerHTML = `
            <div class="alert-ds alert-error" role="alert">
              ${alertSvg}An account with this email already exists. <a href="login.html" class="inline-link" style="color:#0B7A70;font-weight:600;margin-left:4px;">Log in instead</a>
            </div>
          `;
        }
      }
    }, 600);
  });
}
