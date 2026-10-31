<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="java.util.List, com.techfest.model.Registration, com.techfest.dao.RegistrationDAO" %>
<%
    HttpSession sess = request.getSession(false);
    Long userId = sess != null ? (Long) sess.getAttribute("userId") : null;
    String userName = sess != null ? (String) sess.getAttribute("userName") : "Participant";
    String firstName = userName != null ? userName.split(" ")[0] : "Student";

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
<body class="home-frame registrations-frame" data-layer="06-my-registrations">
  <div class="page-wash" aria-hidden="true"></div>

  <!-- Navbar Mount -->
  <div id="navbar-mount"></div>

  <main class="home-container registrations-main">
    <header class="registrations-header" data-layer="page-header">
      <span class="login-eyebrow">YOUR PASSES</span>
      <div class="registrations-title" role="heading" aria-level="1">
        Hi <em><%= firstName %></em>, here are your events
      </div>

      <div class="stat-row" data-layer="stat-row">
        <div class="stat-ds dashboard-card dot-ash">
          <strong><%= totalCount %></strong>
          <span><i></i>TOTAL</span>
        </div>
        <div class="stat-ds dashboard-card dot-green">
          <strong><%= confirmedCount %></strong>
          <span><i></i>CONFIRMED</span>
        </div>
        <div class="stat-ds dashboard-card dot-red">
          <strong><%= cancelledCount %></strong>
          <span><i></i>CANCELLED</span>
        </div>
      </div>
    </header>

    <% if (regs.isEmpty()) { %>
      <section class="registrations-empty">
        <div class="empty-ticket-art" aria-hidden="true"><span>TFH</span></div>
        <div role="heading" aria-level="2">No registrations yet</div>
        <p>Pick an event and claim your first pass.</p>
        <a href="events.jsp" class="btn btn-primary btn-size-l"><span>Explore Events</span></a>
      </section>
    <% } else { %>
      <div class="my-pass-grid" data-layer="pass-grid">
        <% for (Registration r : regs) {
            boolean isConfirmed = "CONFIRMED".equalsIgnoreCase(r.getStatus());
        %>
          <article class="pass-ds <%= isConfirmed ? "" : "pass-cancelled" %>">
            <span class="pass-ds-paisley" aria-hidden="true"></span>
            <div class="pass-ds-body">
              <span class="pass-ds-cat">
                <i></i><%= r.getTrackSelected() != null ? r.getTrackSelected() : "Event Pass" %>
              </span>
              <div class="pass-ds-title" role="heading" aria-level="3"><%= r.getEventName() %></div>
              <div class="pass-ds-meta">
                <span>Pass Issued: <%= r.getRegisteredAt() %></span>
                <% if (r.getTeamName() != null && !r.getTeamName().isEmpty()) { %>
                  <span>Team: <b><%= r.getTeamName() %></b></span>
                <% } %>
              </div>
              <div class="pass-ds-action">
                <a href="event-details.jsp?slug=<%= r.getEventSlug() %>" class="btn btn-secondary btn-size-s">View Event</a>
              </div>
            </div>

            <!-- Perforation separator -->
            <div class="pass-ds-perf" aria-hidden="true"></div>

            <!-- Pass stub with barcode -->
            <div class="pass-ds-stub">
              <span class="badge badge-<%= isConfirmed ? "open" : "closed" %>">
                <i></i><%= r.getStatus().toUpperCase() %>
              </span>
              <div class="barcode-ds" aria-label="Barcode <%= r.getRegNumber() %>">
                <svg viewBox="0 0 100 28" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="barcode-grad-<%= r.getRegistrationId() %>" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stop-color="#FF9933"/>
                      <stop offset="100%" stop-color="#19B5A5"/>
                    </linearGradient>
                  </defs>
                  <rect x="0" y="0" width="3" height="28" fill="url(#barcode-grad-<%= r.getRegistrationId() %>)"/>
                  <rect x="6" y="0" width="2" height="28" fill="url(#barcode-grad-<%= r.getRegistrationId() %>)"/>
                  <rect x="11" y="0" width="4" height="28" fill="url(#barcode-grad-<%= r.getRegistrationId() %>)"/>
                  <rect x="18" y="0" width="2" height="28" fill="url(#barcode-grad-<%= r.getRegistrationId() %>)"/>
                  <rect x="23" y="0" width="5" height="28" fill="url(#barcode-grad-<%= r.getRegistrationId() %>)"/>
                  <rect x="31" y="0" width="2" height="28" fill="url(#barcode-grad-<%= r.getRegistrationId() %>)"/>
                  <rect x="36" y="0" width="4" height="28" fill="url(#barcode-grad-<%= r.getRegistrationId() %>)"/>
                  <rect x="43" y="0" width="2" height="28" fill="url(#barcode-grad-<%= r.getRegistrationId() %>)"/>
                  <rect x="48" y="0" width="3" height="28" fill="url(#barcode-grad-<%= r.getRegistrationId() %>)"/>
                  <rect x="54" y="0" width="5" height="28" fill="url(#barcode-grad-<%= r.getRegistrationId() %>)"/>
                  <rect x="62" y="0" width="2" height="28" fill="url(#barcode-grad-<%= r.getRegistrationId() %>)"/>
                  <rect x="67" y="0" width="4" height="28" fill="url(#barcode-grad-<%= r.getRegistrationId() %>)"/>
                  <rect x="74" y="0" width="2" height="28" fill="url(#barcode-grad-<%= r.getRegistrationId() %>)"/>
                  <rect x="79" y="0" width="4" height="28" fill="url(#barcode-grad-<%= r.getRegistrationId() %>)"/>
                  <rect x="86" y="0" width="2" height="28" fill="url(#barcode-grad-<%= r.getRegistrationId() %>)"/>
                  <rect x="91" y="0" width="5" height="28" fill="url(#barcode-grad-<%= r.getRegistrationId() %>)"/>
                  <rect x="98" y="0" width="2" height="28" fill="url(#barcode-grad-<%= r.getRegistrationId() %>)"/>
                </svg>
              </div>
              <div class="pass-stub-meta">
                <b><%= r.getRegNumber() != null ? r.getRegNumber() : "REG-000" + r.getRegistrationId() %></b>
                <span>Tech Fest 2026</span>
              </div>
            </div>
            <div class="pass-ds-shimmer" aria-hidden="true"></div>
          </article>
        <% } %>
      </div>
    <% } %>
  </main>

  <!-- Footer Mount -->
  <div class="home-footer" id="footer-mount"></div>

  <script type="module" src="js/registrations.js"></script>
</body>
</html>
