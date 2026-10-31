<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%
    String error = (String) request.getAttribute("error");
%>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Sign Up — Tech Fest Hub</title>
  <link rel="icon" type="image/svg+xml" href="assets/favicon.svg">
  <link rel="stylesheet" href="css/style.css?v=6">
</head>
<body class="login-frame signup-frame" data-layer="05-signup">
  <div class="auth-split signup-split" data-layer="auth-split">
    <!-- Left Form Section -->
    <section class="auth-form-side signup-form-side">
      <a class="auth-logo" href="index.html" aria-label="Tech Fest Hub home">
        <span class="lotus-ticket"><i></i><i></i><i></i></span>TECH FEST HUB
      </a>
      <div class="form-container signup-card" data-layer="form-container">
        <span class="login-eyebrow">JOIN THE ARENA</span>
        <div class="login-title" role="heading" aria-level="1">Create your student account</div>
        <p class="login-sub">Takes less than a minute.</p>

        <div class="signup-alert-slot" data-layer="alert-slot" id="signup-alert-slot">
          <% if (error != null && !error.isEmpty()) { %>
            <div class="alert-ds alert-error" role="alert" style="margin-bottom: 20px;">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width: 18px; height: 18px; margin-right: 8px;"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              <%= error %>
            </div>
          <% } %>
        </div>

        <form id="signup-form" action="signup" method="POST" novalidate>
          <div class="form-group signup-field" id="name-group">
            <label for="signup-name">FULL NAME</label>
            <div class="form-input">
              <span class="input-left-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></svg>
              </span>
              <input id="signup-name" name="name" type="text" autocomplete="name" placeholder="Aarav Sharma" required />
            </div>
          </div>

          <div class="form-group signup-field" id="email-group">
            <label for="signup-email">EMAIL</label>
            <div class="form-input">
              <span class="input-left-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="3"/><path d="m4 7 8 6 8-6"/></svg>
              </span>
              <input id="signup-email" name="email" type="email" autocomplete="email" placeholder="you@college.edu" required />
            </div>
          </div>

          <div class="form-group signup-field" id="password-group">
            <label for="signup-password">PASSWORD</label>
            <div class="form-input">
              <span class="input-left-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="5" y="10" width="14" height="11" rx="3"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/></svg>
              </span>
              <input id="signup-password" name="password" type="password" autocomplete="new-password" placeholder="Create a password" required />
              <button type="button" class="input-eye" id="toggle-signup-pwd" aria-label="Toggle password visibility">
                <svg id="eye-icon-pwd" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/></svg>
              </button>
            </div>
            <div class="strength-set signup-strength strength-empty" id="strength-meter" data-layer="strength-meter">
              <div>
                <i class="bar"></i><i class="bar"></i><i class="bar"></i><i class="bar"></i>
              </div>
              <p>Use 8+ characters with a number</p>
            </div>
          </div>

          <div class="department-wrap">
            <div class="form-group signup-field" id="dept-group">
              <label for="signup-department">DEPARTMENT</label>
              <div class="form-input">
                <span class="input-left-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 21V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v16M16 9h2a2 2 0 0 1 2 2v10M2 21h20M8 7h4M8 11h4M8 15h4" /></svg>
                </span>
                <input id="signup-department" name="department" type="text" autocomplete="off" placeholder="e.g. Computer Science" required />
              </div>
            </div>
          </div>

          <button type="submit" class="submit-shell signup-submit" id="signup-submit-btn">
            <span class="btn btn-primary btn-size-l" id="signup-btn-inner">Create Account</span>
          </button>
        </form>

        <p class="login-create signup-login">Already have an account? <a href="login.jsp" id="login-link">Log in</a></p>
        <a class="login-back" href="index.html">← Back to home</a>
      </div>
    </section>

    <!-- Right Decorative Scene -->
    <section class="auth-scene signup-scene">
      <div class="signup-scene-3d">
        <div class="sun-orb"></div>
        <span class="cat-pill cp-0"><code>&lt;/&gt;</code></span>
        <span class="cat-pill cp-1"><code>~</code></span>
        <span class="cat-pill cp-2"><code>?</code></span>
        <span class="cat-pill cp-3"><code>⚡</code></span>
        <span class="cat-pill cp-4"><code>✦</code></span>
        <span class="cat-pill cp-5"><code>◆</code></span>
        <div class="floating-pass-sample">TFH</div>
      </div>
      <div class="auth-quote">Join 500+ students competing this season.</div>
    </section>
  </div>

  <script type="module" src="js/auth.js"></script>
</body>
</html>
