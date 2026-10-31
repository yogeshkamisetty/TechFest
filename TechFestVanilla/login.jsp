<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%
    String error = (String) request.getAttribute("error");
    String next = request.getParameter("next");
%>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Login — Tech Fest Hub</title>
  <link rel="icon" type="image/svg+xml" href="assets/favicon.svg">
  <link rel="stylesheet" href="css/style.css?v=6">
</head>
<body class="login-frame" data-layer="04-login">
  <div class="auth-split" data-layer="auth-split">
    <!-- Left Decorative Scene -->
    <section class="auth-scene" data-layer="auth-scene">
      <a class="auth-logo" href="index.html" aria-label="Tech Fest Hub home">
        <span class="lotus-ticket"><i></i><i></i><i></i></span>TECH FEST HUB
      </a>
      <div class="login-scene-3d" data-layer="3d-login-scene">
        <div class="login-mandala">
          <div class="mandala-petals outer">
            <i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i>
          </div>
          <div class="mandala-petals inner">
            <i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i>
          </div>
          <div class="sun-orb"></div>
        </div>
        <span class="login-gem one"></span>
        <span class="login-gem two"></span>
        <span class="login-gem three"></span>
        <div class="login-orbit"></div>
      </div>
      <div class="auth-kolam" data-layer="kolam-floor"></div>
      <div class="auth-quote-block">
        <div class="auth-quote">Your next challenge is one login away.</div>
        <div class="auth-chips">
          <span>9 EVENTS</span>
          <span>7 CATEGORIES</span>
          <span>1 CAMPUS</span>
        </div>
      </div>
    </section>

    <!-- Right Form Section -->
    <section class="auth-form-side">
      <div class="form-container login-card" data-layer="form-container">
        <span class="login-eyebrow">WELCOME BACK</span>
        <div class="login-title" role="heading" aria-level="1">Log in to Tech Fest Hub</div>
        <p class="login-sub">Enter your college email to pick up where you left off.</p>

        <!-- Quick Demo Accounts -->
        <div class="demo-credentials">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="8" cy="15" r="4" /><path d="m10.8 12.2 8.2-8.2M16 7l2 2M14 9l2 2" /></svg>
          <div>
            <b>Demo account</b>
            <span>aarav@college.edu · Utsav@2026</span>
          </div>
          <button type="button" id="use-student-demo-btn">Use demo</button>
        </div>

        <div class="demo-credentials">
          <div>
            <b>Festival admin demo</b>
            <span>admin@techfesthub.demo · ArenaAdmin@2026</span>
          </div>
          <button type="button" id="use-admin-demo-btn">Use admin</button>
        </div>

        <div id="login-alert-slot" class="login-alert-slot" data-layer="alert-slot">
          <% if (error != null && !error.isEmpty()) { %>
            <div class="alert-ds alert-error" role="alert" style="margin-bottom: 20px;">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width: 18px; height: 18px; margin-right: 8px;"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              <%= error %>
            </div>
          <% } %>
        </div>

        <form id="login-form" action="login" method="POST" novalidate>
          <% if (next != null) { %>
            <input type="hidden" name="next" value="<%= next %>">
          <% } %>

          <div class="form-group" id="email-group">
            <label for="login-email">EMAIL</label>
            <div class="form-input">
              <span class="input-left-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="3"/><path d="m4 7 8 6 8-6"/></svg>
              </span>
              <input id="login-email" name="email" type="email" autocomplete="email" placeholder="you@college.edu" required />
            </div>
          </div>

          <div class="form-group" id="password-group">
            <label for="login-password">PASSWORD</label>
            <div class="form-input">
              <span class="input-left-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="5" y="10" width="14" height="11" rx="3"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/></svg>
              </span>
              <input id="login-password" name="password" type="password" autocomplete="current-password" placeholder="Enter your password" required />
              <button type="button" class="input-eye" id="toggle-password-btn" aria-label="Toggle password visibility">
                <svg id="eye-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/></svg>
              </button>
            </div>
          </div>

          <div class="login-submit">
            <button type="submit" class="submit-shell" id="login-submit-btn">
              <span class="btn btn-primary btn-size-l" id="login-btn-inner">Log In</span>
            </button>
          </div>
        </form>

        <div class="login-or"><span>or</span></div>
        <p class="login-create">New here? <a href="signup.jsp" id="signup-link">Create an account</a></p>
        <a class="login-back" href="index.html">← Back to home</a>
      </div>
    </section>
  </div>

  <script type="module" src="js/auth.js"></script>
</body>
</html>
