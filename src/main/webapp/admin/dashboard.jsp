<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="java.util.List, java.util.Map, com.techfest.Event, com.techfest.Registration, com.techfest.User, com.techfest.EventDAO, com.techfest.RegistrationDAO, com.techfest.UserDAO" %>
<%
    HttpSession sess = request.getSession(false);
    String userRole = (sess != null) ? (String) sess.getAttribute("userRole") : null;
    if (!"ADMIN".equalsIgnoreCase(userRole)) {
        response.sendRedirect("../login.html?next=admin/dashboard.jsp");
        return;
    }

    Map<String, Object> stats = (Map<String, Object>) request.getAttribute("stats");
    List<Event> events = (List<Event>) request.getAttribute("events");
    List<Registration> registrations = (List<Registration>) request.getAttribute("registrations");
    List<User> users = (List<User>) request.getAttribute("users");

    if (stats == null) {
        try {
            EventDAO ed = new EventDAO();
            RegistrationDAO rd = new RegistrationDAO();
            UserDAO ud = new UserDAO();
            stats = new java.util.HashMap<>();
            stats.put("totalUsers", ud.countTotalUsers());
            stats.put("totalEvents", ed.countTotalEvents());
            stats.put("openEvents", ed.countOpenEvents());
            stats.put("totalStudents", ud.countStudents());
            stats.put("totalRegistrations", rd.countTotalRegistrations());
            stats.put("confirmedPasses", rd.countConfirmedRegistrations());
            events = ed.getAllEvents();
            registrations = rd.getAllRegistrations();
            users = ud.getAllUsers();
        } catch (Exception e) {
            stats = java.util.Collections.emptyMap();
            events = java.util.Collections.emptyList();
            registrations = java.util.Collections.emptyList();
            users = java.util.Collections.emptyList();
        }
    }
%>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Admin Dashboard — Tech Fest Hub</title>
  <link rel="icon" type="image/svg+xml" href="../assets/favicon.svg">
  <link rel="stylesheet" href="../css/style.css?v=6">
</head>
<body style="background: #FDF9F4; margin: 0; font-family: var(--body); color: #5B3A29;">
  <!-- Admin Container -->
  <div style="max-width: 1200px; margin: 0 auto; padding: 32px 24px 64px;">

    <!-- Top Navigation & Branding -->
    <header style="display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #F0DCC0; padding-bottom: 20px; margin-bottom: 32px;">
      <div style="display: flex; align-items: center; gap: 14px;">
        <span class="tech-badge-icon">&lt;/&gt;</span>
        <div>
          <div style="font-weight: 800; font-size: 20px; letter-spacing: -0.02em; color: #5B3A29;">TECH FEST HUB — ADMIN DASHBOARD</div>
          <div style="font-size: 13px; color: #8A5A3C;">Campus Arena Administration Console &bull; Edition 2026</div>
        </div>
      </div>
      <div style="display: flex; align-items: center; gap: 16px;">
        <span style="font-size: 13px; font-weight: 600; color: #0B7A70; background: #E1F7EA; padding: 6px 14px; border-radius: 999px;">
          Administrator Active
        </span>
        <a href="../logout" class="btn btn-secondary btn-size-m" style="text-decoration: none; color: #D6336C;">
          <span>Logout</span>
        </a>
      </div>
    </header>

    <!-- Welcome Headline -->
    <div style="margin-bottom: 32px;">
      <h1 style="font-size: 28px; font-weight: 800; margin: 0 0 6px; color: #5B3A29;">Welcome, Administrator</h1>
      <p style="color: #8A5A3C; margin: 0; font-size: 15px;">Monitor festival statistics, manage event registration status, review student passes, and inspect user records.</p>
    </div>

    <!-- SUMMARY CARDS -->
    <section style="margin-bottom: 40px;">
      <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 16px;">
        <span class="hud-label" style="color: #0B7A70; font-weight: 700;">SUMMARY METRICS</span>
      </div>
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 20px;">
        <div style="background: #FFFFFF; border: 1px solid #F0DCC0; border-radius: 14px; padding: 20px; border-left: 4px solid #FF9933; box-shadow: 0 4px 14px rgba(138,90,60,0.05);">
          <span class="hud-label" style="font-size: 11px;">TOTAL EVENTS</span>
          <div style="font-size: 32px; font-weight: 800; color: #5B3A29; margin-top: 4px;"><%= stats.getOrDefault("totalEvents", events != null ? events.size() : 0) %></div>
          <p style="color: #8A5A3C; font-size: 12px; margin: 4px 0 0;">Configured campus competitions</p>
        </div>

        <div style="background: #FFFFFF; border: 1px solid #F0DCC0; border-radius: 14px; padding: 20px; border-left: 4px solid #0B7A70; box-shadow: 0 4px 14px rgba(138,90,60,0.05);">
          <span class="hud-label" style="font-size: 11px; color: #0B7A70;">OPEN EVENTS</span>
          <div style="font-size: 32px; font-weight: 800; color: #0B7A70; margin-top: 4px;"><%= stats.getOrDefault("openEvents", 0) %></div>
          <p style="color: #8A5A3C; font-size: 12px; margin: 4px 0 0;">Accepting new registrations</p>
        </div>

        <div style="background: #FFFFFF; border: 1px solid #F0DCC0; border-radius: 14px; padding: 20px; border-left: 4px solid #7C9BFF; box-shadow: 0 4px 14px rgba(138,90,60,0.05);">
          <span class="hud-label" style="font-size: 11px;">STUDENTS</span>
          <div style="font-size: 32px; font-weight: 800; color: #5B3A29; margin-top: 4px;"><%= stats.getOrDefault("totalStudents", 0) %></div>
          <p style="color: #8A5A3C; font-size: 12px; margin: 4px 0 0;">Registered student participants</p>
        </div>

        <div style="background: #FFFFFF; border: 1px solid #F0DCC0; border-radius: 14px; padding: 20px; border-left: 4px solid #34B26B; box-shadow: 0 4px 14px rgba(138,90,60,0.05);">
          <span class="hud-label" style="font-size: 11px; color: #1E6B3E;">REGISTRATIONS</span>
          <div style="font-size: 32px; font-weight: 800; color: #1E6B3E; margin-top: 4px;"><%= stats.getOrDefault("totalRegistrations", registrations != null ? registrations.size() : 0) %></div>
          <p style="color: #8A5A3C; font-size: 12px; margin: 4px 0 0;">Total issued passes</p>
        </div>
      </div>
    </section>

    <!-- SECTION 1: EVENT MANAGEMENT -->
    <section id="events-section" style="background: #FFFFFF; border: 1px solid #F0DCC0; border-radius: 16px; padding: 28px; box-shadow: 0 4px 16px rgba(138,90,60,0.06); margin-bottom: 40px;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; border-bottom: 1px solid #F5EAE0; padding-bottom: 14px;">
        <div>
          <span class="hud-label" style="color: #0B7A70; font-weight: 700;">MANAGEMENT</span>
          <h2 style="font-size: 20px; font-weight: 800; margin: 4px 0 0; color: #5B3A29;">Event Management</h2>
        </div>
        <a href="../events.jsp" style="color: #0B7A70; font-weight: 600; font-size: 13px; text-decoration: none;">View Live Catalog &rarr;</a>
      </div>

      <div style="overflow-x: auto;">
        <table style="width: 100%; border-collapse: collapse; font-size: 14px; text-align: left;">
          <thead>
            <tr style="border-bottom: 2px solid #F0DCC0; color: #8A5A3C; font-family: var(--mono); font-size: 12px; text-transform: uppercase;">
              <th style="padding: 12px 14px;">Event Name</th>
              <th style="padding: 12px 14px;">Category</th>
              <th style="padding: 12px 14px;">Venue</th>
              <th style="padding: 12px 14px;">Fee</th>
              <th style="padding: 12px 14px;">Status</th>
              <th style="padding: 12px 14px; text-align: right;">Action</th>
            </tr>
          </thead>
          <tbody>
            <% if (events != null && !events.isEmpty()) {
                for (Event e : events) {
                    String st = e.getStatus() != null ? e.getStatus() : "OPEN";
                    boolean isOpen = "OPEN".equalsIgnoreCase(st) || "Open".equalsIgnoreCase(st);
                    String fee = (e.getRegistrationFee() == null || e.getRegistrationFee().doubleValue() == 0) ? "Free" : "₹" + e.getRegistrationFee().intValue();
                    String nextStatus = isOpen ? "CLOSED" : "OPEN";
            %>
              <tr style="border-bottom: 1px solid #F5EAE0;">
                <td style="padding: 14px; font-weight: 700; color: #5B3A29;">
                  <a href="../event-details.jsp?slug=<%= e.getSlug() %>" style="color: #5B3A29; text-decoration: none;"><%= e.getEventName() %></a>
                </td>
                <td style="padding: 14px;"><%= e.getCategory() %></td>
                <td style="padding: 14px; color: #8A5A3C;"><%= e.getVenue() %></td>
                <td style="padding: 14px; font-weight: 600; color: #0B7A70;"><%= fee %></td>
                <td style="padding: 14px;">
                  <span class="badge badge-<%= isOpen ? "open" : "closed" %>">
                    <i></i><%= st.toUpperCase() %>
                  </span>
                </td>
                <td style="padding: 14px; text-align: right;">
                  <a href="../admin/event/status?slug=<%= e.getSlug() %>&status=<%= nextStatus %>&redirect=/admin/dashboard.jsp"
                     class="btn btn-secondary btn-size-s"
                     style="text-decoration: none; font-size: 12px; padding: 6px 14px;">
                    <span>Mark <%= nextStatus %></span>
                  </a>
                </td>
              </tr>
            <%   }
               } else { %>
              <tr>
                <td colspan="6" style="text-align: center; padding: 24px; color: #8A5A3C;">No events found.</td>
              </tr>
            <% } %>
          </tbody>
        </table>
      </div>
    </section>

    <!-- SECTION 2: REGISTRATION MANAGEMENT -->
    <section id="registrations-section" style="background: #FFFFFF; border: 1px solid #F0DCC0; border-radius: 16px; padding: 28px; box-shadow: 0 4px 16px rgba(138,90,60,0.06); margin-bottom: 40px;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; border-bottom: 1px solid #F5EAE0; padding-bottom: 14px;">
        <div>
          <span class="hud-label" style="color: #0B7A70; font-weight: 700;">AUDIT</span>
          <h2 style="font-size: 20px; font-weight: 800; margin: 4px 0 0; color: #5B3A29;">Registration Management</h2>
        </div>
        <a href="registrations.jsp" class="btn btn-secondary btn-size-s" style="text-decoration: none;">
          <span>View All Registrations &rarr;</span>
        </a>
      </div>

      <div style="overflow-x: auto;">
        <table style="width: 100%; border-collapse: collapse; font-size: 14px; text-align: left;">
          <thead>
            <tr style="border-bottom: 2px solid #F0DCC0; color: #8A5A3C; font-family: var(--mono); font-size: 12px; text-transform: uppercase;">
              <th style="padding: 12px 14px;">Reg No</th>
              <th style="padding: 12px 14px;">Student</th>
              <th style="padding: 12px 14px;">Email</th>
              <th style="padding: 12px 14px;">Event</th>
              <th style="padding: 12px 14px;">Team</th>
              <th style="padding: 12px 14px;">Track</th>
              <th style="padding: 12px 14px;">Status</th>
            </tr>
          </thead>
          <tbody>
            <% if (registrations != null && !registrations.isEmpty()) {
                int limit = Math.min(registrations.size(), 8);
                for (int i = 0; i < limit; i++) {
                    Registration r = registrations.get(i);
                    boolean isConf = "CONFIRMED".equalsIgnoreCase(r.getStatus());
                    String studentDisplay = r.getUserName() != null ? r.getUserName() : ("User #" + r.getUserId());
                    String emailDisplay = r.getUserEmail() != null ? r.getUserEmail() : "—";
                    String teamDisplay = (r.getTeamName() != null && !r.getTeamName().trim().isEmpty()) ? r.getTeamName() : "Solo";
                    String trackDisplay = (r.getTrackSelected() != null && !r.getTrackSelected().trim().isEmpty()) ? r.getTrackSelected() : "General";
            %>
              <tr style="border-bottom: 1px solid #F5EAE0;">
                <td style="padding: 12px 14px; font-family: var(--mono); font-weight: 700; color: #0B7A70;">
                  <%= r.getRegNumber() != null ? r.getRegNumber() : ("#" + r.getRegistrationId()) %>
                </td>
                <td style="padding: 12px 14px; font-weight: 600;"><%= studentDisplay %></td>
                <td style="padding: 12px 14px; color: #8A5A3C; font-size: 13px;"><%= emailDisplay %></td>
                <td style="padding: 12px 14px; font-weight: 600;"><%= r.getEventName() != null ? r.getEventName() : ("Event #" + r.getEventId()) %></td>
                <td style="padding: 12px 14px; color: #8A5A3C;"><%= teamDisplay %></td>
                <td style="padding: 12px 14px; color: #8A5A3C;"><%= trackDisplay %></td>
                <td style="padding: 12px 14px;">
                  <span class="badge badge-<%= isConf ? "open" : "closed" %>">
                    <i></i><%= r.getStatus() != null ? r.getStatus().toUpperCase() : "CONFIRMED" %>
                  </span>
                </td>
              </tr>
            <%   }
               } else { %>
              <tr>
                <td colspan="7" style="text-align: center; padding: 24px; color: #8A5A3C;">No registrations recorded.</td>
              </tr>
            <% } %>
          </tbody>
        </table>
      </div>
    </section>

    <!-- SECTION 3: USER RECORDS -->
    <section id="users-section" style="background: #FFFFFF; border: 1px solid #F0DCC0; border-radius: 16px; padding: 28px; box-shadow: 0 4px 16px rgba(138,90,60,0.06); margin-bottom: 40px;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; border-bottom: 1px solid #F5EAE0; padding-bottom: 14px;">
        <div>
          <span class="hud-label" style="color: #0B7A70; font-weight: 700;">ACCOUNTS</span>
          <h2 style="font-size: 20px; font-weight: 800; margin: 4px 0 0; color: #5B3A29;">User Records</h2>
        </div>
        <span style="font-size: 13px; color: #8A5A3C;"><%= users != null ? users.size() : 0 %> registered users</span>
      </div>

      <div style="overflow-x: auto;">
        <table style="width: 100%; border-collapse: collapse; font-size: 14px; text-align: left;">
          <thead>
            <tr style="border-bottom: 2px solid #F0DCC0; color: #8A5A3C; font-family: var(--mono); font-size: 12px; text-transform: uppercase;">
              <th style="padding: 12px 14px;">User ID</th>
              <th style="padding: 12px 14px;">Name</th>
              <th style="padding: 12px 14px;">Email</th>
              <th style="padding: 12px 14px;">Department</th>
              <th style="padding: 12px 14px;">Role</th>
              <th style="padding: 12px 14px;">Created Date</th>
            </tr>
          </thead>
          <tbody>
            <% if (users != null && !users.isEmpty()) {
                for (User u : users) {
                    boolean isAdm = "ADMIN".equalsIgnoreCase(u.getRole());
            %>
              <tr style="border-bottom: 1px solid #F5EAE0;">
                <td style="padding: 12px 14px; font-family: var(--mono); font-weight: 700; color: #8A5A3C;">#<%= u.getUserId() %></td>
                <td style="padding: 12px 14px; font-weight: 600;"><%= u.getFullName() %></td>
                <td style="padding: 12px 14px; color: #8A5A3C;"><%= u.getEmail() %></td>
                <td style="padding: 12px 14px;"><%= u.getDepartment() != null ? u.getDepartment() : "General" %></td>
                <td style="padding: 12px 14px;">
                  <span class="badge badge-<%= isAdm ? "completed" : "open" %>">
                    <i></i><%= u.getRole() != null ? u.getRole().toUpperCase() : "STUDENT" %>
                  </span>
                </td>
                <td style="padding: 12px 14px; color: #8A5A3C; font-size: 13px;"><%= u.getCreatedAt() != null ? u.getCreatedAt() : "—" %></td>
              </tr>
            <%   }
               } else { %>
              <tr>
                <td colspan="6" style="text-align: center; padding: 24px; color: #8A5A3C;">No users found.</td>
              </tr>
            <% } %>
          </tbody>
        </table>
      </div>
    </section>

    <!-- SECTION 4: QUICK ACTIONS -->
    <section style="background: #FFFFFF; border: 1px solid #F0DCC0; border-radius: 16px; padding: 24px; box-shadow: 0 4px 16px rgba(138,90,60,0.06);">
      <div style="font-weight: 800; font-size: 16px; color: #5B3A29; margin-bottom: 16px;">Quick Actions</div>
      <div style="display: flex; flex-wrap: wrap; gap: 14px;">
        <a href="../index.html" class="btn btn-primary btn-size-m" style="text-decoration: none;">
          <span>View Website</span>
        </a>
        <a href="../events.jsp" class="btn btn-secondary btn-size-m" style="text-decoration: none;">
          <span>View Events</span>
        </a>
        <a href="registrations.jsp" class="btn btn-secondary btn-size-m" style="text-decoration: none;">
          <span>View Registrations</span>
        </a>
        <a href="../logout" class="btn btn-secondary btn-size-m" style="text-decoration: none; color: #D6336C;">
          <span>Logout</span>
        </a>
      </div>
    </section>

    <!-- Footer Copyright -->
    <footer style="margin-top: 48px; border-top: 1px solid #F0DCC0; padding-top: 20px; text-align: center; font-size: 13px; color: #8A5A3C;">
      &copy; 2026 Tech Fest Hub &bull; Admin Console &bull; Powered by Java Servlets &amp; Oracle XE
    </footer>
  </div>
</body>
</html>
