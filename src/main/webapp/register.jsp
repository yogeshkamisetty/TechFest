<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="com.techfest.Event, com.techfest.EventDAO" %>
<%
    String slug = request.getParameter("slug");
    if (slug == null || slug.trim().isEmpty()) {
        response.sendRedirect("events.jsp");
        return;
    }

    Event event = null;
    try {
        event = new EventDAO().getEventBySlug(slug.trim());
    } catch (Exception ignored) {}

    if (event == null) {
        response.sendRedirect("events.jsp");
        return;
    }

    HttpSession sess = request.getSession(false);
    String userName = (sess != null) ? (String) sess.getAttribute("userName") : null;
    String userEmail = (sess != null) ? (String) sess.getAttribute("userEmail") : null;
    String userDept = (sess != null) ? (String) sess.getAttribute("userDept") : "Engineering";
    String userRole = (sess != null) ? (String) sess.getAttribute("userRole") : null;
    boolean isLoggedIn = (userName != null);
    boolean isAdmin = "ADMIN".equalsIgnoreCase(userRole);

    if (!isLoggedIn) {
        response.sendRedirect("login.html?next=register.jsp?slug=" + java.net.URLEncoder.encode(slug, "UTF-8"));
        return;
    }

    String error = request.getParameter("error");
    double feeNum = (event.getRegistrationFee() == null) ? 0.0 : event.getRegistrationFee().doubleValue();
    String fee = (feeNum == 0.0) ? "Free" : "₹" + (int) feeNum;
%>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Register for <%= event.getEventName() %> — Tech Fest Hub</title>
  <link rel="icon" type="image/svg+xml" href="assets/favicon.svg">
  <link rel="stylesheet" href="css/style.css?v=6">
</head>
<body class="home-frame register-frame">
  <!-- Standard Navbar -->
  <header class="home-navbar" id="site-header">
    <div class="home-nav-inner">
      <a href="<%= isLoggedIn ? (isAdmin ? "admin/dashboard.jsp" : "user-home.jsp") : "index.html" %>" class="home-logo">
        <span class="tech-badge-icon">&lt;/&gt;</span>TECH FEST HUB
      </a>
      <nav aria-label="Primary">
        <a href="<%= isLoggedIn ? (isAdmin ? "admin/dashboard.jsp" : "user-home.jsp") : "index.html" %>">Home</a>
        <a href="events.jsp">Events</a>
        <a href="my-registrations.jsp">My Registrations</a>
      </nav>
      <div class="home-auth" style="display: flex; align-items: center; gap: 12px;">
        <span style="font-size: 13px; font-weight: 600; color: #5B3A29;"><%= userName %></span>
        <a href="logout" class="btn btn-secondary btn-size-m is-default"><span>Logout</span></a>
      </div>
      <button type="button" class="home-menu-btn" id="nav-menu-btn" aria-label="Open menu" aria-expanded="false" aria-controls="mobile-menu">
        <i></i><i></i><i></i>
      </button>
    </div>
    <div class="mobile-menu" id="mobile-menu" style="display: none;">
      <nav aria-label="Mobile">
        <a href="<%= isLoggedIn ? (isAdmin ? "admin/dashboard.jsp" : "user-home.jsp") : "index.html" %>">Home</a>
        <a href="events.jsp">Events</a>
        <a href="my-registrations.jsp">My Registrations</a>
      </nav>
      <div class="mobile-menu-auth">
        <a href="logout" class="btn btn-secondary btn-size-m is-default"><span>Logout</span></a>
      </div>
    </div>
  </header>

  <main class="home-container" style="max-width: 820px; padding: 40px 24px 80px;">
    <!-- Breadcrumb -->
    <div style="margin-bottom: 24px;">
      <a href="event-details.jsp?slug=<%= event.getSlug() %>" style="display: inline-flex; align-items: center; gap: 6px; color: #0B7A70; font-weight: 600; font-size: 14px; text-decoration: none;">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width: 16px; height: 16px;"><path d="m15 18-6-6 6-6"/></svg>
        Back to Event Details
      </a>
    </div>

    <!-- Error Alert Box -->
    <% if (error != null && !error.trim().isEmpty()) { %>
      <div class="alert-ds alert-error" role="alert" style="margin-bottom: 24px; padding: 14px 18px; border-radius: 12px; background: #FFF0F0; border: 1px solid #FFC9C9; color: #D6336C; display: flex; align-items: center; gap: 10px;">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width: 20px; height: 20px; flex-shrink: 0;"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
        <div>
          <b>Registration Notice:</b> <%= error %>
        </div>
      </div>
    <% } %>

    <% if (isAdmin) { %>
      <div style="background: white; border: 1px solid #F0DCC0; border-radius: 16px; padding: 32px; text-align: center;">
        <h2 style="color: #5B3A29; margin-top: 0;">Admin Account Detected</h2>
        <p style="color: #8A5A3C; margin: 12px 0 24px;">Administrator accounts manage registrations rather than participating. You can view all registrations in the admin dashboard.</p>
        <a href="admin/dashboard.jsp" class="btn btn-primary btn-size-l" style="text-decoration: none;"><span>Open Admin Dashboard</span></a>
      </div>
    <% } else { %>
      <div style="background: white; border: 1px solid #F0DCC0; border-radius: 16px; padding: 36px; box-shadow: 0 4px 20px rgba(91,58,41,0.06);">
        <div style="border-bottom: 1px solid #F0DCC0; padding-bottom: 20px; margin-bottom: 24px;">
          <span class="hud-label" style="color: #0B7A70; font-weight: 700;">EVENT PASS REGISTRATION // 2026</span>
          <h1 style="font-size: 26px; color: #5B3A29; margin: 6px 0 10px; font-weight: 800;"><%= event.getEventName() %></h1>
          <div style="display: flex; flex-wrap: wrap; gap: 16px; font-size: 14px; color: #8A5A3C;">
            <span>Category: <b style="color: #5B3A29;"><%= event.getCategory() %></b></span>
            <span>Venue: <b style="color: #5B3A29;"><%= event.getVenue() %></b></span>
            <span>Fee: <b style="color: #0B7A70;"><%= fee %></b></span>
          </div>
        </div>

        <form action="<%= (feeNum > 0.0) ? "payment.jsp" : "event-register" %>" method="<%= (feeNum > 0.0) ? "GET" : "POST" %>">
          <input type="hidden" name="slug" value="<%= event.getSlug() %>">
          <% if (feeNum == 0.0) { %>
            <input type="hidden" name="paymentStatus" value="FREE">
            <input type="hidden" name="paymentReference" value="FREE-PASS">
          <% } %>

          <!-- Participant Info (Read-only) -->
          <div style="background: #FFFDF9; border: 1px solid #F0DCC0; border-radius: 12px; padding: 18px; margin-bottom: 24px;">
            <span class="hud-label" style="font-size: 11px;">REGISTERING AS</span>
            <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 8px;">
              <div>
                <b style="font-size: 16px; color: #5B3A29;"><%= userName %></b>
                <span style="display: block; font-size: 13px; color: #8A5A3C; margin-top: 2px;"><%= userEmail %> &bull; <%= userDept %></span>
              </div>
              <span class="badge badge-open">STUDENT</span>
            </div>
          </div>

          <!-- Registration Type Selection -->
          <div style="margin-bottom: 24px; padding: 18px; background: #FFFDF9; border: 1px solid #F0DCC0; border-radius: 12px;">
            <label style="display: block; font-size: 12px; font-weight: 700; color: #8A5A3C; margin-bottom: 12px; letter-spacing: 0.5px;">REGISTRATION TYPE</label>
            <div style="display: flex; gap: 24px; align-items: center; flex-wrap: wrap;">
              <label style="display: flex; align-items: center; gap: 8px; font-size: 14px; color: #5B3A29; cursor: pointer;">
                <input type="radio" name="regType" id="reg-type-solo" value="INDIVIDUAL" checked onchange="handleRegTypeChange(this.value)" style="accent-color: #0B7A70;">
                <b>Individual Entry (Solo)</b>
              </label>
              <label style="display: flex; align-items: center; gap: 8px; font-size: 14px; color: #5B3A29; cursor: pointer;">
                <input type="radio" name="regType" id="reg-type-team" value="TEAM" onchange="handleRegTypeChange(this.value)" style="accent-color: #0B7A70;">
                <b>Team Entry (2 - 4 Members)</b>
              </label>
            </div>
          </div>

          <!-- Team Details Section (Hidden by default, shown when Team is selected) -->
          <div id="team-fields-container" style="display: none; background: #FFFDF9; border: 1px solid #0B7A70; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px;">
              <span style="font-size: 13px; font-weight: 700; color: #0B7A70; font-family: var(--mono);">TEAM DETAILS (UP TO 4 MEMBERS)</span>
              <span class="badge badge-open" style="font-size: 11px;">TEAM ROSTER</span>
            </div>

            <!-- Team Name -->
            <div class="form-group" style="margin-bottom: 16px;">
              <label for="reg-team" style="display: block; font-size: 12px; font-weight: 700; color: #5B3A29; margin-bottom: 6px;">TEAM NAME *</label>
              <input id="reg-team" name="teamName" type="text" placeholder="e.g. CyberKnights, AlgoWarriors" style="width: 100%; box-sizing: border-box; padding: 12px 14px; border: 1px solid #E0CEB8; border-radius: 10px; font-size: 14px; background: white; color: #5B3A29;" />
            </div>

            <!-- Team Leader (prefilled) -->
            <div class="form-group" style="margin-bottom: 14px;">
              <label style="display: block; font-size: 12px; font-weight: 700; color: #8A5A3C; margin-bottom: 4px;">TEAM LEADER (YOU)</label>
              <input type="text" value="<%= userName %> (<%= userEmail %>)" readonly style="width: 100%; box-sizing: border-box; padding: 10px 14px; border: 1px solid #E0CEB8; border-radius: 8px; font-size: 13px; background: #F5EAE0; color: #5B3A29;" />
            </div>

            <!-- Member 2 -->
            <div class="form-group" style="margin-bottom: 14px;">
              <label for="member2" style="display: block; font-size: 12px; font-weight: 700; color: #5B3A29; margin-bottom: 4px;">MEMBER 2 (NAME &amp; DEPT)</label>
              <input id="member2" name="member2" type="text" placeholder="e.g. Rohan Verma (CSE)" style="width: 100%; box-sizing: border-box; padding: 10px 14px; border: 1px solid #E0CEB8; border-radius: 8px; font-size: 13px; background: white; color: #5B3A29;" />
            </div>

            <!-- Member 3 -->
            <div class="form-group" style="margin-bottom: 14px;">
              <label for="member3" style="display: block; font-size: 12px; font-weight: 700; color: #5B3A29; margin-bottom: 4px;">MEMBER 3 (OPTIONAL)</label>
              <input id="member3" name="member3" type="text" placeholder="e.g. Priya Singh (ECE)" style="width: 100%; box-sizing: border-box; padding: 10px 14px; border: 1px solid #E0CEB8; border-radius: 8px; font-size: 13px; background: white; color: #5B3A29;" />
            </div>

            <!-- Member 4 -->
            <div class="form-group" style="margin-bottom: 6px;">
              <label for="member4" style="display: block; font-size: 12px; font-weight: 700; color: #5B3A29; margin-bottom: 4px;">MEMBER 4 (OPTIONAL)</label>
              <input id="member4" name="member4" type="text" placeholder="e.g. Amit Kumar (IT)" style="width: 100%; box-sizing: border-box; padding: 10px 14px; border: 1px solid #E0CEB8; border-radius: 8px; font-size: 13px; background: white; color: #5B3A29;" />
            </div>
          </div>

          <!-- Track / Focus Selection -->
          <div class="form-group" style="margin-bottom: 24px;">
            <label for="reg-track" style="display: block; font-size: 12px; font-weight: 700; color: #8A5A3C; margin-bottom: 6px; letter-spacing: 0.5px;">TRACK / TOPIC PREFERENCE</label>
            <select id="reg-track" name="track" style="width: 100%; box-sizing: border-box; padding: 12px 14px; border: 1px solid #E0CEB8; border-radius: 10px; font-size: 14px; background: white; color: #5B3A29;">
              <option value="General Track">General Track</option>
              <option value="Open Innovation">Open Innovation</option>
              <option value="Web &amp; Cloud">Web &amp; Cloud</option>
              <option value="AI / ML &amp; Data">AI / ML &amp; Data</option>
              <option value="Hardware / Robotics">Hardware / Robotics</option>
            </select>
          </div>

          <div style="border-top: 1px solid #F0DCC0; padding-top: 24px; display: flex; justify-content: flex-end; gap: 14px;">
            <a href="event-details.jsp?slug=<%= event.getSlug() %>" class="btn btn-secondary btn-size-l" style="text-decoration: none;">Cancel</a>
            <% if (feeNum > 0.0) { %>
              <button type="submit" class="btn btn-primary btn-size-l">
                <span>Proceed to Payment (<%= fee %>) &rarr;</span>
              </button>
            <% } else { %>
              <button type="submit" class="btn btn-primary btn-size-l">
                <span>Confirm Registration (Free) &rarr;</span>
              </button>
            <% } %>
          </div>
        </form>
      </div>
    <% } %>
  </main>

  <script>
    function handleRegTypeChange(type) {
      var container = document.getElementById('team-fields-container');
      var teamInput = document.getElementById('reg-team');
      if (type === 'TEAM') {
        container.style.display = 'block';
        teamInput.required = true;
      } else {
        container.style.display = 'none';
        teamInput.required = false;
        teamInput.value = '';
      }
    }
  </script>

  <!-- Standard Clean Footer -->
  <footer class="home-footer">
    <div class="home-footer-inner home-container">
      <div class="footer-brand">
        <div class="home-logo">
          <span class="tech-badge-icon">&lt;/&gt;</span>TECH FEST HUB
        </div>
        <p>Annual Technical Festival 2026. Explore technical events, compete with your peers and register your digital pass in seconds.</p>
      </div>
      <div class="footer-links">
        <b>Quick Links</b>
        <a href="<%= isLoggedIn ? (isAdmin ? "admin/dashboard.jsp" : "user-home.jsp") : "index.html" %>">Home</a>
        <a href="events.jsp">Events</a>
        <a href="my-registrations.jsp">My Registrations</a>
        <a href="logout">Logout</a>
      </div>
      <div class="footer-info">
        <b>Contact &amp; Venue</b>
        <p>Main Administrative Block, Campus Arena<br>Email: techfest2026@college.edu<br>Helpline: +91 98765 43210</p>
      </div>
    </div>
    <div class="footer-bottom home-container">
      <p>&copy; 2026 Tech Fest Hub</p>
    </div>
  </footer>

  <script src="js/script.js"></script>
</body>
</html>
