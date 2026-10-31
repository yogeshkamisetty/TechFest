<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="java.util.List, com.techfest.Registration, com.techfest.Event, com.techfest.RegistrationDAO, com.techfest.EventDAO" %>
<%
    HttpSession sess = request.getSession(false);
    String userRole = (sess != null) ? (String) sess.getAttribute("userRole") : null;
    Long userId = (sess != null) ? (Long) sess.getAttribute("userId") : null;
    String userName = (sess != null) ? (String) sess.getAttribute("userName") : null;
    String userEmail = (sess != null) ? (String) sess.getAttribute("userEmail") : null;
    String userDept = (sess != null) ? (String) sess.getAttribute("userDept") : null;

    if (userId == null || userRole == null) {
        response.sendRedirect("login.html?next=user-home.jsp");
        return;
    }
    if ("ADMIN".equalsIgnoreCase(userRole)) {
        response.sendRedirect("admin/dashboard.jsp");
        return;
    }

    RegistrationDAO regDAO = new RegistrationDAO();
    EventDAO eventDAO = new EventDAO();
    List<Registration> userRegs = null;
    List<Event> openEvents = null;
    int totalRegs = 0;
    int confirmedPasses = 0;
    int totalAvailableEvents = 0;

    try {
        userRegs = regDAO.getRegistrationsByUserId(userId);
        totalRegs = userRegs.size();
        for (Registration r : userRegs) {
            if ("CONFIRMED".equalsIgnoreCase(r.getStatus())) {
                confirmedPasses++;
            }
        }
        openEvents = eventDAO.getAllEvents();
        totalAvailableEvents = (openEvents != null) ? openEvents.size() : 0;
    } catch (Exception e) {
        userRegs = java.util.Collections.emptyList();
        openEvents = java.util.Collections.emptyList();
    }

    boolean isWelcome = "1".equals(request.getParameter("welcome"));
%>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Student Portal — Tech Fest Hub</title>
  <link rel="icon" type="image/svg+xml" href="assets/favicon.svg">
  <link rel="stylesheet" href="css/style.css?v=6">
</head>
<body class="home-frame">
  <!-- Standard Navbar -->
  <header class="home-navbar" id="site-header">
    <div class="home-nav-inner">
      <a href="user-home.jsp" class="home-logo">
        <span class="tech-badge-icon">&lt;/&gt;</span>TECH FEST HUB
      </a>
      <nav aria-label="Primary">
        <a href="user-home.jsp" class="active">Home</a>
        <a href="events.jsp">Events</a>
        <a href="my-registrations.jsp">My Registrations</a>
      </nav>
      <div class="home-auth" style="display: flex; align-items: center; gap: 12px;">
        <span style="font-size: 13px; font-weight: 600; color: #5B3A29;">
          <%= userName != null ? userName : "Student" %>
        </span>
        <a href="logout" class="btn btn-secondary btn-size-m is-default"><span>Logout</span></a>
      </div>
      <button type="button" class="home-menu-btn" id="nav-menu-btn" aria-label="Open menu" aria-expanded="false" aria-controls="mobile-menu">
        <i></i><i></i><i></i>
      </button>
    </div>
    <div class="mobile-menu" id="mobile-menu" style="display: none;">
      <nav aria-label="Mobile">
        <a href="user-home.jsp" class="active">Home</a>
        <a href="events.jsp">Events</a>
        <a href="my-registrations.jsp">My Registrations</a>
      </nav>
      <div class="mobile-menu-auth">
        <a href="logout" class="btn btn-secondary btn-size-m is-default"><span>Logout</span></a>
      </div>
    </div>
  </header>

  <main class="home-container" style="padding-top: 40px; padding-bottom: 80px;">
    <% if (isWelcome) { %>
      <div class="alert-ds alert-success" style="margin-bottom: 24px; padding: 16px 20px; border-radius: 12px; background: #E1F7EA; border: 1px solid #34B26B; color: #1E6B3E; display: flex; align-items: center; gap: 12px;">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width: 22px; height: 22px; flex-shrink: 0;"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
        <div>
          <b>Account Created Successfully!</b> Welcome to Tech Fest Hub 2026. Explore technical events and register your passes below.
        </div>
      </div>
    <% } %>

    <!-- Student Welcome Banner -->
    <div style="background: #FFFFFF; border: 1px solid #F0DCC0; border-radius: 16px; padding: 32px; box-shadow: 0 4px 16px rgba(138,90,60,0.06); margin-bottom: 32px;">
      <div style="display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; gap: 20px;">
        <div>
          <span class="hud-label" style="color: #0B7A70; font-weight: 700;">STUDENT ARENA PORTAL // 2026</span>
          <h1 style="font-size: 28px; font-weight: 800; color: #5B3A29; margin: 8px 0 6px;">
            Welcome, <%= userName != null ? userName : "Student" %>
          </h1>
          <p style="color: #8A5A3C; margin: 0; font-size: 14px;">
            <%= userDept != null ? userDept : "General" %> &bull; <%= userEmail != null ? userEmail : "" %>
          </p>
        </div>
        <div style="display: flex; gap: 12px; flex-wrap: wrap;">
          <a href="events.jsp" class="btn btn-primary btn-size-m" style="text-decoration: none;">
            <span>Browse Events</span>
          </a>
          <a href="my-registrations.jsp" class="btn btn-secondary btn-size-m" style="text-decoration: none;">
            <span>My Registrations (<%= confirmedPasses %>)</span>
          </a>
          <a href="logout" class="btn btn-secondary btn-size-m" style="text-decoration: none; color: #D6336C;">
            <span>Logout</span>
          </a>
        </div>
      </div>
    </div>

    <!-- Summary KPIs -->
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 20px; margin-bottom: 40px;">
      <div style="background: #FFFFFF; border: 1px solid #F0DCC0; border-radius: 14px; padding: 20px; border-left: 4px solid #0B7A70;">
        <span class="hud-label" style="font-size: 11px;">CONFIRMED PASSES</span>
        <div style="font-size: 32px; font-weight: 800; color: #5B3A29; margin-top: 4px;"><%= confirmedPasses %></div>
        <p style="color: #8A5A3C; font-size: 13px; margin: 4px 0 0;">Active event passes</p>
      </div>
      <div style="background: #FFFFFF; border: 1px solid #F0DCC0; border-radius: 14px; padding: 20px; border-left: 4px solid #D45D3A;">
        <span class="hud-label" style="font-size: 11px;">TOTAL REGISTRATIONS</span>
        <div style="font-size: 32px; font-weight: 800; color: #5B3A29; margin-top: 4px;"><%= totalRegs %></div>
        <p style="color: #8A5A3C; font-size: 13px; margin: 4px 0 0;">Submitted entries</p>
      </div>
      <div style="background: #FFFFFF; border: 1px solid #F0DCC0; border-radius: 14px; padding: 20px; border-left: 4px solid #FFC83D;">
        <span class="hud-label" style="font-size: 11px;">CAMPUS EVENTS</span>
        <div style="font-size: 32px; font-weight: 800; color: #5B3A29; margin-top: 4px;"><%= totalAvailableEvents %></div>
        <p style="color: #8A5A3C; font-size: 13px; margin: 4px 0 0;">Competitions open</p>
      </div>
    </div>

    <!-- Section: My Registered Events -->
    <div style="margin-bottom: 48px;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
        <h2 style="font-size: 20px; font-weight: 700; color: #5B3A29; margin: 0;">My Registered Events</h2>
        <a href="my-registrations.jsp" style="color: #0B7A70; font-weight: 600; font-size: 14px; text-decoration: none;">View All Passes &rarr;</a>
      </div>

      <% if (userRegs != null && !userRegs.isEmpty()) { %>
        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 20px;">
          <% for (int i = 0; i < Math.min(userRegs.size(), 3); i++) {
              Registration r = userRegs.get(i);
              boolean isConfirmed = "CONFIRMED".equalsIgnoreCase(r.getStatus());
          %>
            <div style="background: #FFFFFF; border: 1px solid #F0DCC0; border-radius: 14px; padding: 20px; display: flex; flex-direction: column; justify-content: space-between;">
              <div>
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                  <span class="badge badge-<%= isConfirmed ? "open" : "closed" %>">
                    <i></i><%= r.getStatus().toUpperCase() %>
                  </span>
                  <span style="font-family: var(--mono); font-size: 12px; font-weight: 700; color: #0B7A70;">
                    <%= r.getRegNumber() != null ? r.getRegNumber() : ("#" + r.getRegistrationId()) %>
                  </span>
                </div>
                <div style="font-size: 17px; font-weight: 700; color: #5B3A29; margin-bottom: 8px;">
                  <%= r.getEventName() %>
                </div>
                <div style="font-size: 13px; color: #8A5A3C; line-height: 1.5;">
                  <div>Track: <b><%= r.getTrackSelected() != null ? r.getTrackSelected() : "General" %></b></div>
                  <% if (r.getTeamName() != null && !r.getTeamName().trim().isEmpty()) { %>
                    <div>Team: <b><%= r.getTeamName() %></b></div>
                  <% } %>
                </div>
              </div>
              <div style="margin-top: 16px; padding-top: 12px; border-top: 1px solid #F5EAE0; display: flex; justify-content: space-between; align-items: center;">
                <span style="font-size: 11px; color: #8A5A3C;">Registered: <%= r.getRegisteredAt() %></span>
                <a href="event-details.jsp?slug=<%= r.getEventSlug() %>" style="color: #0B7A70; font-weight: 600; font-size: 13px; text-decoration: none;">Details &rarr;</a>
              </div>
            </div>
          <% } %>
        </div>
      <% } else { %>
        <div style="background: #FFFFFF; border: 1px dashed #F0DCC0; border-radius: 14px; padding: 40px 20px; text-align: center;">
          <p style="color: #8A5A3C; margin-bottom: 16px; font-size: 15px;">You have not registered for any events yet.</p>
          <a href="events.jsp" class="btn btn-primary btn-size-m" style="text-decoration: none;"><span>Explore Campus Events</span></a>
        </div>
      <% } %>
    </div>

    <!-- Section: Upcoming Campus Arena Events -->
    <div>
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
        <h2 style="font-size: 20px; font-weight: 700; color: #5B3A29; margin: 0;">Explore Campus Arena Events</h2>
        <a href="events.jsp" style="color: #0B7A70; font-weight: 600; font-size: 14px; text-decoration: none;">Browse Full Catalog &rarr;</a>
      </div>

      <% if (openEvents != null && !openEvents.isEmpty()) { %>
        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 20px;">
          <% for (int i = 0; i < Math.min(openEvents.size(), 3); i++) {
              Event e = openEvents.get(i);
              String st = e.getStatus() != null ? e.getStatus() : "OPEN";
              boolean isOpen = "OPEN".equalsIgnoreCase(st) || "Open".equalsIgnoreCase(st);
              double feeNum = (e.getRegistrationFee() == null) ? 0.0 : e.getRegistrationFee().doubleValue();
              String fee = (feeNum == 0.0) ? "Free" : "₹" + (int) feeNum;
          %>
            <div style="background: #FFFFFF; border: 1px solid #F0DCC0; border-radius: 14px; padding: 20px; display: flex; flex-direction: column; justify-content: space-between;">
              <div>
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                  <span class="event-category cat-<%= e.getCategory().toLowerCase() %>">
                    <i></i><%= e.getCategory() %>
                  </span>
                  <span class="badge badge-<%= isOpen ? "open" : "closed" %>">
                    <i></i><%= st.toUpperCase() %>
                  </span>
                </div>
                <div style="font-size: 17px; font-weight: 700; color: #5B3A29; margin-bottom: 8px;">
                  <%= e.getEventName() %>
                </div>
                <div style="font-size: 13px; color: #8A5A3C; margin-bottom: 4px;">
                  Venue: <b><%= e.getVenue() %></b>
                </div>
                <div style="font-size: 13px; color: #8A5A3C;">
                  Fee: <b><%= fee %></b>
                </div>
              </div>
              <div style="margin-top: 16px; padding-top: 12px; border-top: 1px solid #F5EAE0; display: flex; justify-content: space-between; align-items: center; gap: 8px;">
                <a href="event-details.jsp?slug=<%= e.getSlug() %>" class="btn btn-secondary btn-size-s" style="flex: 1; text-align: center; text-decoration: none;">
                  <span>Details</span>
                </a>
                <% if (isOpen) { %>
                  <a href="register.jsp?slug=<%= e.getSlug() %>" class="btn btn-primary btn-size-s" style="flex: 1; text-align: center; text-decoration: none;">
                    <span>Register</span>
                  </a>
                <% } else { %>
                  <button class="btn btn-secondary btn-size-s" disabled style="flex: 1; opacity: 0.6;">
                    <span>Closed</span>
                  </button>
                <% } %>
              </div>
            </div>
          <% } %>
        </div>
      <% } %>
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
        <a href="user-home.jsp">Home</a>
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
