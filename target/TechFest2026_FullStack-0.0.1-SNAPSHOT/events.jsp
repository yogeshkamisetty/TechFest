<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="java.util.List, com.techfest.Event, com.techfest.EventDAO" %>
<%
    List<Event> events = (List<Event>) request.getAttribute("events");
    if (events == null) {
        try {
            events = new EventDAO().getAllEvents();
        } catch (Exception e) {
            events = java.util.Collections.emptyList();
        }
    }
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
  <title>Events — Tech Fest Hub</title>
  <link rel="icon" type="image/svg+xml" href="assets/favicon.svg">
  <link rel="stylesheet" href="css/style.css?v=6">
</head>
<body class="home-frame events-frame" data-layer="02-events">
  <!-- Standard Navbar -->
  <header class="home-navbar" data-layer="navbar" id="site-header">
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
          <span style="font-size: 13px; font-weight: 600; color: #5B3A29;">
            <%= userName %>
          </span>
          <a href="logout" class="btn btn-secondary btn-size-m is-default"><span>Logout</span></a>
        </div>
      <% } else { %>
        <div class="home-auth">
          <a href="login.html">Login</a>
          <a href="signup.html" class="btn btn-primary btn-size-m is-default" data-layer="btn btn-primary"><span>Sign Up</span></a>
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

  <main>
    <!-- Events Header -->
    <section class="events-header" style="height: auto; padding: 48px 0 24px;">
      <div class="home-container">
        <div class="breadcrumb">CAMPUS ARENA / EVENTS</div>
        <h1 class="events-title" style="margin-top: 8px;">Explore Technical <em>Events</em></h1>
        <p style="margin-top: 8px;">Browse technical events across campus, filter by category and register your pass in seconds.</p>
      </div>
    </section>

    <!-- Filter Bar -->
    <div class="events-filter home-container" data-layer="filter-bar">
      <div class="filter-row" style="display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 16px;">
        <label class="search-ds" style="flex: 1; min-width: 240px; display: flex; align-items: center; gap: 8px; background: #FFFFFF; border: 1px solid #F0DCC0; border-radius: 12px; padding: 0 14px; height: 46px;">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" aria-hidden="true" style="width:18px;height:18px; color: #8A5A3C;">
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-4-4" />
          </svg>
          <input type="search" id="search-input" placeholder="Search events by name…" aria-label="Search events by name" style="border: 0; outline: 0; width: 100%; background: transparent;">
        </label>

        <label class="events-select" style="display: flex; align-items: center; gap: 8px;">
          <span>Sort:</span>
          <select id="sort-select">
            <option value="date">Date (soonest)</option>
            <option value="fee">Fee: low to high</option>
            <option value="name">Name A–Z</option>
          </select>
        </label>

        <button type="button" class="toggle-ds" id="open-only-toggle" role="switch" aria-checked="false">
          <i></i>Open only
        </button>

        <span class="filter-count" id="filter-count" style="font-family: var(--mono); font-size: 13px; font-weight: 700; color: #0B7A70;"><%= events != null ? events.size() : 0 %> EVENTS</span>
      </div>

      <div class="chip-row" id="category-chips-row" style="display: flex; gap: 8px; flex-wrap: wrap; margin-top: 12px;">
        <button type="button" class="event-category cat-all is-active" data-cat="all"><i></i>All</button>
        <button type="button" class="event-category cat-coding" data-cat="Coding"><i></i>Coding</button>
        <button type="button" class="event-category cat-hackathon" data-cat="Hackathon"><i></i>Hackathon</button>
        <button type="button" class="event-category cat-robotics" data-cat="Robotics"><i></i>Robotics</button>
        <button type="button" class="event-category cat-quiz" data-cat="Quiz"><i></i>Quiz</button>
        <button type="button" class="event-category cat-gaming" data-cat="Gaming"><i></i>Gaming</button>
        <button type="button" class="event-category cat-design" data-cat="Design"><i></i>Design</button>
      </div>
    </div>

    <!-- Event Grid -->
    <section class="events-grid home-container" id="events-grid-mount" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 24px; align-items: stretch; margin-bottom: 80px;">
      <% if (events != null && !events.isEmpty()) {
          for (Event e : events) {
              String status = e.getStatus() != null ? e.getStatus() : "OPEN";
              boolean isOpen = "OPEN".equalsIgnoreCase(status) || "Open".equalsIgnoreCase(status);
              double feeNum = (e.getRegistrationFee() == null) ? 0.0 : e.getRegistrationFee().doubleValue();
              String fee = (feeNum == 0.0) ? "Free" : "₹" + (int) feeNum;
      %>
        <article class="ds-event-card cat-<%= e.getCategory().toLowerCase() %> status-<%= status.toLowerCase() %>"
                 data-slug="<%= e.getSlug() %>"
                 data-category="<%= e.getCategory() %>"
                 data-status="<%= status %>"
                 data-name="<%= e.getEventName() %>"
                 data-fee="<%= feeNum %>">
          <div class="event-art">
            <div class="clay-emblem"><span>✦</span></div>
          </div>
          <div class="event-body">
            <span class="event-category cat-<%= e.getCategory().toLowerCase() %>">
              <i></i><%= e.getCategory() %>
            </span>
            <div class="event-title" role="heading" aria-level="3"><%= e.getEventName() %></div>
            <div class="event-date-row">
              <span class="event-date"><%= e.getCardDate() != null ? e.getCardDate() : e.getEventDate() %></span>
            </div>
            <div class="event-venue">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 21s7-5.5 7-12a7 7 0 0 0-14 0c0 6.5 7 12 7 12Z"/><circle cx="12" cy="9" r="2.5"/></svg>
              <%= e.getVenue() %>
            </div>
          </div>
          <div class="event-perforation"></div>
          <div class="event-stub-ds">
            <div class="stub-meta" style="display: flex; justify-content: space-between; align-items: center;">
              <span class="fee-badge fee-<%= feeNum == 0 ? "free" : "paid" %>"><%= fee %></span>
              <span class="badge badge-<%= isOpen ? "open" : (status.equalsIgnoreCase("COMPLETED") ? "completed" : "closed") %>">
                <i></i><%= status.toUpperCase() %>
              </span>
            </div>
            <div class="stub-actions" style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
              <a href="event-details.jsp?slug=<%= e.getSlug() %>" class="btn btn-secondary btn-size-m" style="text-decoration: none; text-align: center;">
                <span>Details</span>
              </a>
              <% if (isAdmin) { %>
                <span class="badge" style="display: flex; align-items: center; justify-content: center; font-size:12px; color:#8A5A3C; background:rgba(232,196,104,0.3);">Admin</span>
              <% } else if (isOpen) { %>
                <a href="register.jsp?slug=<%= e.getSlug() %>" class="btn btn-primary btn-size-m" style="text-decoration: none; text-align: center;">
                  <span>Register</span>
                </a>
              <% } else { %>
                <button type="button" class="btn btn-secondary btn-size-m" disabled style="opacity: 0.6;">
                  <span>Closed</span>
                </button>
              <% } %>
            </div>
          </div>
        </article>
      <%   }
         } else { %>
        <div style="grid-column: 1 / -1; text-align: center; padding: 48px 0; color: #8A5A3C;">
          <p>No events found matching your criteria.</p>
        </div>
      <% } %>
    </section>
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
