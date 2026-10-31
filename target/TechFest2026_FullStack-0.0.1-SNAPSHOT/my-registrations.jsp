<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="java.util.List, com.techfest.Registration, com.techfest.RegistrationDAO" %>
<%
    HttpSession sess = request.getSession(false);
    Long userId = (sess != null) ? (Long) sess.getAttribute("userId") : null;
    String userName = (sess != null) ? (String) sess.getAttribute("userName") : null;
    String userRole = (sess != null) ? (String) sess.getAttribute("userRole") : null;
    boolean isLoggedIn = (userName != null);
    boolean isAdmin = "ADMIN".equalsIgnoreCase(userRole);

    if (!isLoggedIn) {
        response.sendRedirect("login.html?next=my-registrations.jsp");
        return;
    }

    String firstName = userName != null ? userName.split(" ")[0] : "Student";
    String registeredSlug = request.getParameter("registered");

    List<Registration> regs = (List<Registration>) request.getAttribute("registrations");
    if (regs == null && userId != null) {
        try {
            regs = new RegistrationDAO().getRegistrationsByUserId(userId);
        } catch (Exception e) {
            regs = java.util.Collections.emptyList();
        }
    }
    if (regs == null) regs = java.util.Collections.emptyList();

    int totalCount = regs.size();
    long confirmedCount = regs.stream().filter(r -> "CONFIRMED".equalsIgnoreCase(r.getStatus())).count();
    long cancelledCount = totalCount - confirmedCount;
%>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>My Passes — Tech Fest Hub</title>
  <link rel="icon" type="image/svg+xml" href="assets/favicon.svg">
  <link rel="stylesheet" href="css/style.css?v=6">
</head>
<body class="home-frame registrations-frame">
  <!-- Standard Navbar -->
  <header class="home-navbar" id="site-header">
    <div class="home-nav-inner">
      <a href="user-home.jsp" class="home-logo">
        <span class="tech-badge-icon">&lt;/&gt;</span>TECH FEST HUB
      </a>
      <nav aria-label="Primary">
        <a href="user-home.jsp">Home</a>
        <a href="events.jsp">Events</a>
        <a href="my-registrations.jsp" class="active">My Registrations</a>
      </nav>
      <div class="home-auth" style="display: flex; align-items: center; gap: 12px;">
        <span style="font-size: 13px; font-weight: 600; color: #5B3A29;">
          <%= userName %>
        </span>
        <a href="logout" class="btn btn-secondary btn-size-m is-default"><span>Logout</span></a>
      </div>
      <button type="button" class="home-menu-btn" id="nav-menu-btn" aria-label="Open menu" aria-expanded="false" aria-controls="mobile-menu">
        <i></i><i></i><i></i>
      </button>
    </div>
    <div class="mobile-menu" id="mobile-menu" style="display: none;">
      <nav aria-label="Mobile">
        <a href="user-home.jsp">Home</a>
        <a href="events.jsp">Events</a>
        <a href="my-registrations.jsp" class="active">My Registrations</a>
      </nav>
      <div class="mobile-menu-auth">
        <a href="logout" class="btn btn-secondary btn-size-m is-default"><span>Logout</span></a>
      </div>
    </div>
  </header>

  <main class="home-container registrations-main" style="padding-top: 40px; padding-bottom: 80px;">
    <header class="registrations-header">
      <span class="hud-label" style="color: #0B7A70; font-weight: 700;">STUDENT PASS PORTAL</span>
      <h1 style="font-size: 28px; font-weight: 800; color: #5B3A29; margin: 8px 0 16px;">
        Hi <%= firstName %>, here are your event passes
      </h1>

      <% if (registeredSlug != null) { %>
        <div class="alert-ds alert-success" role="alert" style="margin-bottom: 24px; padding: 14px 18px; border-radius: 12px; background: #E1F7EA; border: 1px solid #34B26B; color: #1E6B3E; display: flex; align-items: center; gap: 10px;">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width: 20px; height: 20px; flex-shrink: 0;"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
          <div>
            <b>Registration Confirmed!</b> Your official technical pass has been issued and saved.
          </div>
        </div>
      <% } %>

      <div style="display: flex; gap: 16px; margin-top: 16px; flex-wrap: wrap;">
        <div style="background: #FFFFFF; border: 1px solid #F0DCC0; border-radius: 12px; padding: 12px 20px; min-width: 140px;">
          <span class="hud-label" style="font-size: 10px;">TOTAL PASSES</span>
          <div style="font-size: 24px; font-weight: 800; color: #5B3A29; margin-top: 2px;"><%= totalCount %></div>
        </div>
        <div style="background: #FFFFFF; border: 1px solid #F0DCC0; border-radius: 12px; padding: 12px 20px; min-width: 140px; border-left: 4px solid #34B26B;">
          <span class="hud-label" style="font-size: 10px; color: #1E6B3E;">CONFIRMED</span>
          <div style="font-size: 24px; font-weight: 800; color: #1E6B3E; margin-top: 2px;"><%= confirmedCount %></div>
        </div>
        <div style="background: #FFFFFF; border: 1px solid #F0DCC0; border-radius: 12px; padding: 12px 20px; min-width: 140px; border-left: 4px solid #E0475B;">
          <span class="hud-label" style="font-size: 10px; color: #E0475B;">CANCELLED</span>
          <div style="font-size: 24px; font-weight: 800; color: #E0475B; margin-top: 2px;"><%= cancelledCount %></div>
        </div>
      </div>
    </header>

    <% if (regs.isEmpty()) { %>
      <section style="background: #FFFFFF; border: 1px dashed #F0DCC0; border-radius: 16px; text-align: center; padding: 64px 20px; margin-top: 32px;">
        <div style="font-family: var(--mono); font-size: 32px; color: #8A5A3C; margin-bottom: 12px;">&lt;PASS_EMPTY /&gt;</div>
        <h2 style="font-size: 20px; color: #5B3A29; margin-bottom: 8px;">No event passes yet</h2>
        <p style="color: #8A5A3C; margin-bottom: 24px;">Browse the live campus arena events and claim your pass in seconds.</p>
        <a href="events.jsp" class="btn btn-primary btn-size-l" style="text-decoration: none;"><span>Explore Events</span></a>
      </section>
    <% } else { %>
      <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(480px, 1fr)); gap: 24px; margin-top: 32px;">
        <% for (Registration r : regs) {
            boolean isConfirmed = "CONFIRMED".equalsIgnoreCase(r.getStatus());
            String regNum = r.getRegNumber() != null ? r.getRegNumber() : ("#" + r.getRegistrationId());
            String cat = r.getEventCategory() != null ? r.getEventCategory() : "Technical";
            String venue = r.getEventVenue() != null ? r.getEventVenue() : "Campus Arena";
            String dateStr = r.getEventDate() != null ? r.getEventDate().toString() : "Festival Day";
            String team = (r.getTeamName() != null && !r.getTeamName().trim().isEmpty()) ? r.getTeamName() : "Solo Entry";
            String track = (r.getTrackSelected() != null && !r.getTrackSelected().trim().isEmpty()) ? r.getTrackSelected() : "General";
        %>
          <!-- Clean Technical Event Pass -->
          <article style="background: #FFFFFF; border: 1px solid #E8C468; border-radius: 16px; overflow: hidden; box-shadow: 0 6px 20px rgba(138,90,60,0.08); display: flex; flex-direction: column;">
            <!-- Pass Header Band -->
            <div style="background: linear-gradient(90deg, #5B3A29, #2C1810); color: #FFF9F0; padding: 12px 20px; display: flex; justify-content: space-between; align-items: center;">
              <div style="display: flex; align-items: center; gap: 8px;">
                <span style="font-family: var(--mono); font-weight: 700; font-size: 12px; color: #FFC83D;">&lt;/&gt; TECH FEST HUB</span>
                <span style="font-size: 11px; opacity: 0.7;">&bull; TECH FEST 2026</span>
              </div>
              <span class="badge badge-<%= isConfirmed ? "open" : "closed" %>" style="font-size: 11px; padding: 3px 10px;">
                <i></i><%= r.getStatus().toUpperCase() %>
              </span>
            </div>

            <!-- Pass Core Info -->
            <div style="padding: 24px 20px; flex: 1;">
              <div style="font-size: 20px; font-weight: 800; color: #5B3A29; margin-bottom: 16px; letter-spacing: -0.01em;">
                <%= r.getEventName() %>
              </div>

              <!-- Pass Metadata Grid -->
              <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 14px 20px; font-size: 13px;">
                <div>
                  <span style="display: block; font-family: var(--mono); font-size: 11px; color: #8A5A3C; text-transform: uppercase; margin-bottom: 2px;">Participant Name</span>
                  <b style="color: #5B3A29;"><%= r.getUserName() != null ? r.getUserName() : userName %></b>
                </div>

                <div>
                  <span style="display: block; font-family: var(--mono); font-size: 11px; color: #8A5A3C; text-transform: uppercase; margin-bottom: 2px;">Registration Number</span>
                  <b style="color: #0B7A70; font-family: var(--mono); font-size: 14px;"><%= regNum %></b>
                </div>

                <div>
                  <span style="display: block; font-family: var(--mono); font-size: 11px; color: #8A5A3C; text-transform: uppercase; margin-bottom: 2px;">Event Date</span>
                  <b style="color: #5B3A29;"><%= dateStr %></b>
                </div>

                <div>
                  <span style="display: block; font-family: var(--mono); font-size: 11px; color: #8A5A3C; text-transform: uppercase; margin-bottom: 2px;">Venue</span>
                  <b style="color: #5B3A29;"><%= venue %></b>
                </div>

                <div>
                  <span style="display: block; font-family: var(--mono); font-size: 11px; color: #8A5A3C; text-transform: uppercase; margin-bottom: 2px;">Category</span>
                  <b style="color: #5B3A29;"><%= cat %></b>
                </div>

                <div>
                  <span style="display: block; font-family: var(--mono); font-size: 11px; color: #8A5A3C; text-transform: uppercase; margin-bottom: 2px;">Team / Track</span>
                  <b style="color: #5B3A29;"><%= team %> &bull; <%= track %></b>
                </div>
              </div>
            </div>

            <!-- Pass Footer Stub -->
            <div style="padding: 14px 20px; background: #FFFDF9; border-top: 1px dashed #F0DCC0; display: flex; justify-content: space-between; align-items: center;">
              <span style="font-size: 12px; color: #8A5A3C; font-family: var(--mono);">
                Issued: <%= r.getRegisteredAt() %>
              </span>
              <a href="event-details.jsp?slug=<%= r.getEventSlug() %>" class="btn btn-secondary btn-size-s" style="text-decoration: none;">
                <span>View Event &rarr;</span>
              </a>
            </div>
          </article>
        <% } %>
      </div>
    <% } %>
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
