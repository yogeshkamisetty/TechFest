<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="com.techfest.Event, com.techfest.EventDAO" %>
<%
    String slug = request.getParameter("slug");
    Event event = (Event) request.getAttribute("event");
    if (event == null && slug != null) {
        try {
            event = new EventDAO().getEventBySlug(slug.trim());
        } catch (Exception ignored) {}
    }
    if (event == null) {
        response.sendRedirect("events.jsp");
        return;
    }
    String status = event.getStatus() != null ? event.getStatus() : "OPEN";
    boolean isOpen = "OPEN".equalsIgnoreCase(status) || "Open".equalsIgnoreCase(status);
    double feeNum = (event.getRegistrationFee() == null) ? 0.0 : event.getRegistrationFee().doubleValue();
    String fee = (feeNum == 0.0) ? "Free" : "₹" + (int) feeNum;

    HttpSession sess = request.getSession(false);
    String userName = (sess != null) ? (String) sess.getAttribute("userName") : null;
    String userRole = (sess != null) ? (String) sess.getAttribute("userRole") : null;
    boolean isLoggedIn = (userName != null);
    boolean isAdmin = "ADMIN".equalsIgnoreCase(userRole);
%>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title><%= event.getEventName() %> — Tech Fest Hub</title>
  <link rel="icon" type="image/svg+xml" href="assets/favicon.svg">
  <link rel="stylesheet" href="css/style.css?v=6">
</head>
<body class="home-frame">
  <!-- Standard Navbar -->
  <header class="home-navbar" id="site-header">
    <div class="home-nav-inner">
      <a href="<%= isLoggedIn ? (isAdmin ? "admin/dashboard.jsp" : "user-home.jsp") : "index.html" %>" class="home-logo">
        <span class="tech-badge-icon">&lt;/&gt;</span>TECH FEST HUB
      </a>
      <nav aria-label="Primary">
        <a href="<%= isLoggedIn ? (isAdmin ? "admin/dashboard.jsp" : "user-home.jsp") : "index.html" %>">Home</a>
        <a href="events.jsp" class="active">Events</a>
        <% if (isLoggedIn) { %>
          <% if (isAdmin) { %>
            <a href="admin/dashboard.jsp">Admin</a>
          <% } else { %>
            <a href="my-registrations.jsp">My Registrations</a>
          <% } %>
        <% } %>
      </nav>
      <% if (isLoggedIn) { %>
        <div class="home-auth" style="display: flex; align-items: center; gap: 12px;">
          <span style="font-size: 13px; font-weight: 600; color: #5B3A29;"><%= userName %></span>
          <a href="logout" class="btn btn-secondary btn-size-m is-default"><span>Logout</span></a>
        </div>
      <% } else { %>
        <div class="home-auth">
          <a href="login.html">Login</a>
          <a href="signup.html" class="btn btn-primary btn-size-m is-default"><span>Sign Up</span></a>
        </div>
      <% } %>
      <button type="button" class="home-menu-btn" id="nav-menu-btn" aria-label="Open menu" aria-expanded="false" aria-controls="mobile-menu">
        <i></i><i></i><i></i>
      </button>
    </div>
    <div class="mobile-menu" id="mobile-menu" style="display: none;">
      <nav aria-label="Mobile">
        <a href="<%= isLoggedIn ? (isAdmin ? "admin/dashboard.jsp" : "user-home.jsp") : "index.html" %>">Home</a>
        <a href="events.jsp" class="active">Events</a>
        <% if (isLoggedIn) { %>
          <% if (isAdmin) { %>
            <a href="admin/dashboard.jsp">Admin</a>
          <% } else { %>
            <a href="my-registrations.jsp">My Registrations</a>
          <% } %>
        <% } %>
      </nav>
      <div class="mobile-menu-auth">
        <% if (isLoggedIn) { %>
          <a href="logout" class="btn btn-secondary btn-size-m is-default"><span>Logout</span></a>
        <% } else { %>
          <a href="login.html" class="btn btn-secondary btn-size-m is-default"><span>Login</span></a>
          <a href="signup.html" class="btn btn-primary btn-size-m is-default"><span>Sign Up</span></a>
        <% } %>
      </div>
    </div>
  </header>

  <main class="home-container" style="padding-top: 32px; padding-bottom: 80px; max-width: 960px;">
    <!-- Back Link -->
    <div style="margin-bottom: 24px;">
      <a href="events.jsp" style="display: inline-flex; align-items: center; gap: 6px; color: #0B7A70; font-weight: 600; font-size: 14px; text-decoration: none;">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width: 16px; height: 16px;"><path d="m15 18-6-6 6-6"/></svg>
        Back to Events
      </a>
    </div>

    <!-- Category & Status Badge -->
    <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 12px;">
      <span class="event-category cat-<%= event.getCategory().toLowerCase() %>">
        <i></i><%= event.getCategory() %>
      </span>
      <span class="badge badge-<%= isOpen ? "open" : "closed" %>">
        <i></i><%= status.toUpperCase() %>
      </span>
    </div>

    <!-- Event Title -->
    <h1 style="font-size: 36px; font-weight: 800; color: #5B3A29; margin: 0 0 16px; line-height: 1.2; letter-spacing: -0.02em;">
      <%= event.getEventName() %>
    </h1>

    <!-- Description -->
    <div style="background: #FFFFFF; border: 1px solid #F0DCC0; border-radius: 16px; padding: 28px; box-shadow: 0 4px 16px rgba(138,90,60,0.06); margin-bottom: 28px;">
      <h2 style="font-size: 18px; font-weight: 700; color: #5B3A29; margin: 0 0 12px;">About the Event</h2>
      <p style="color: #8A5A3C; font-size: 16px; line-height: 1.6; margin: 0;">
        <%= event.getDescription() %>
      </p>
    </div>

    <!-- Clean Tech Specs Grid -->
    <div style="background: #FFFFFF; border: 1px solid #F0DCC0; border-radius: 16px; padding: 28px; box-shadow: 0 4px 16px rgba(138,90,60,0.06); margin-bottom: 32px;">
      <h2 style="font-size: 18px; font-weight: 700; color: #5B3A29; margin: 0 0 20px;">Event Specifications</h2>

      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; font-size: 14px;">
        <div style="padding: 16px; background: #FFFDF9; border: 1px solid #F5EAE0; border-radius: 12px;">
          <span style="display: block; font-family: var(--mono); font-size: 11px; color: #8A5A3C; text-transform: uppercase; margin-bottom: 4px;">Date</span>
          <b style="color: #5B3A29; font-size: 15px;"><%= event.getCardDate() != null ? event.getCardDate() : event.getEventDate() %></b>
        </div>

        <div style="padding: 16px; background: #FFFDF9; border: 1px solid #F5EAE0; border-radius: 12px;">
          <span style="display: block; font-family: var(--mono); font-size: 11px; color: #8A5A3C; text-transform: uppercase; margin-bottom: 4px;">Venue</span>
          <b style="color: #5B3A29; font-size: 15px;"><%= event.getVenue() %></b>
        </div>

        <div style="padding: 16px; background: #FFFDF9; border: 1px solid #F5EAE0; border-radius: 12px;">
          <span style="display: block; font-family: var(--mono); font-size: 11px; color: #8A5A3C; text-transform: uppercase; margin-bottom: 4px;">Registration Fee</span>
          <b style="color: #0B7A70; font-size: 16px;"><%= fee %></b>
        </div>

        <div style="padding: 16px; background: #FFFDF9; border: 1px solid #F5EAE0; border-radius: 12px;">
          <span style="display: block; font-family: var(--mono); font-size: 11px; color: #8A5A3C; text-transform: uppercase; margin-bottom: 4px;">Capacity</span>
          <b style="color: #5B3A29; font-size: 15px;"><%= event.getMaxParticipants() != null ? event.getMaxParticipants() : 100 %> seats</b>
        </div>

        <div style="padding: 16px; background: #FFFDF9; border: 1px solid #F5EAE0; border-radius: 12px;">
          <span style="display: block; font-family: var(--mono); font-size: 11px; color: #8A5A3C; text-transform: uppercase; margin-bottom: 4px;">Status</span>
          <span class="badge badge-<%= isOpen ? "open" : "closed" %>" style="display: inline-flex;">
            <i></i><%= status.toUpperCase() %>
          </span>
        </div>

        <div style="padding: 16px; background: #FFFDF9; border: 1px solid #F5EAE0; border-radius: 12px;">
          <span style="display: block; font-family: var(--mono); font-size: 11px; color: #8A5A3C; text-transform: uppercase; margin-bottom: 4px;">Deadline</span>
          <b style="color: #5B3A29; font-size: 14px;"><%= event.getRegistrationDeadline() != null ? event.getRegistrationDeadline() : "48h before event" %></b>
        </div>
      </div>

      <!-- Action Button -->
      <div style="margin-top: 28px; padding-top: 20px; border-top: 1px solid #F5EAE0; display: flex; justify-content: flex-end;">
        <% if (isAdmin) { %>
          <div style="padding: 12px 18px; border-radius: 10px; background: #FFF1C9; border: 1px solid #E8C468; color: #5B3A29; font-size: 13px; font-weight: 600;">
            Admin Mode: Participant registration is disabled for administrators.
          </div>
        <% } else if (isOpen) { %>
          <a href="register.jsp?slug=<%= event.getSlug() %>" class="btn btn-primary btn-size-l" style="text-decoration: none; min-width: 200px; text-align: center;">
            <span>Register Now &rarr;</span>
          </a>
        <% } else { %>
          <button type="button" class="btn btn-secondary btn-size-l" disabled style="opacity: 0.6; min-width: 200px;">
            <span>Registration Closed</span>
          </button>
        <% } %>
      </div>
    </div>

    <!-- Timeline & Important Dates -->
    <div style="background: #FFFFFF; border: 1px solid #F0DCC0; border-radius: 16px; padding: 28px; box-shadow: 0 4px 16px rgba(138,90,60,0.06);">
      <h2 style="font-size: 18px; font-weight: 700; color: #5B3A29; margin: 0 0 16px;">Timeline &amp; Checkpoints</h2>
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 16px;">
        <div style="border-left: 3px solid #0B7A70; padding-left: 14px;">
          <span style="font-family: var(--mono); font-size: 11px; color: #0B7A70; font-weight: 700;">PHASE 01</span>
          <div style="font-weight: 700; color: #5B3A29; margin-top: 2px;">Registrations Open</div>
          <p style="color: #8A5A3C; font-size: 13px; margin: 4px 0 0;">Register your team or solo entry online.</p>
        </div>
        <div style="border-left: 3px solid #FF9933; padding-left: 14px;">
          <span style="font-family: var(--mono); font-size: 11px; color: #FF9933; font-weight: 700;">PHASE 02</span>
          <div style="font-weight: 700; color: #5B3A29; margin-top: 2px;">Entry Deadline</div>
          <p style="color: #8A5A3C; font-size: 13px; margin: 4px 0 0;"><%= event.getRegistrationDeadline() != null ? event.getRegistrationDeadline() : "48h before event" %></p>
        </div>
        <div style="border-left: 3px solid #D45D3A; padding-left: 14px;">
          <span style="font-family: var(--mono); font-size: 11px; color: #D45D3A; font-weight: 700;">PHASE 03</span>
          <div style="font-weight: 700; color: #5B3A29; margin-top: 2px;">Arena Competition</div>
          <p style="color: #8A5A3C; font-size: 13px; margin: 4px 0 0;">Report to <%= event.getVenue() %> with your pass.</p>
        </div>
      </div>
    </div>
  </main>

  <!-- Standard Footer -->
  <footer class="home-footer">
    <div class="home-footer-inner home-container">
      <div class="footer-brand">
        <div class="home-logo">
          <span class="tech-badge-icon">&lt;/&gt;</span>TECH FEST HUB
        </div>
        <p>Annual Technical Festival 2026. Explore, compete, innovate and celebrate on campus.</p>
      </div>
      <div class="footer-links">
        <b>Quick Links</b>
        <a href="<%= isLoggedIn ? (isAdmin ? "admin/dashboard.jsp" : "user-home.jsp") : "index.html" %>">Home</a>
        <a href="events.jsp">Events</a>
        <a href="my-registrations.jsp">My Registrations</a>
      </div>
      <div class="footer-info">
        <b>Technical Fest 2026</b>
        <p>Explore &bull; Compete &bull; Innovate<br>Main Administrative Block, Campus Arena</p>
      </div>
    </div>
    <div class="footer-bottom home-container">
      <p>&copy; 2026 Tech Fest Hub. Powered by Java Servlets, JSP &amp; Oracle XE.</p>
    </div>
  </footer>

  <script src="js/script.js"></script>
</body>
</html>
