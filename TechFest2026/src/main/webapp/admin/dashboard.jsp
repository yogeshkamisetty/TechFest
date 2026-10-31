<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="java.util.List, java.util.Map, com.techfest.model.Event, com.techfest.dao.EventDAO, com.techfest.dao.RegistrationDAO, com.techfest.dao.UserDAO" %>
<%
    Map<String, Object> stats = (Map<String, Object>) request.getAttribute("stats");
    List<Event> events = (List<Event>) request.getAttribute("events");

    if (stats == null) {
        try {
            EventDAO ed = new EventDAO();
            RegistrationDAO rd = new RegistrationDAO();
            UserDAO ud = new UserDAO();
            stats = new java.util.HashMap<>();
            stats.put("totalEvents", ed.countTotalEvents());
            stats.put("openEvents", ed.countOpenEvents());
            stats.put("totalStudents", ud.countStudents());
            stats.put("confirmedPasses", rd.countConfirmedRegistrations());
            events = ed.getAllEvents();
        } catch (Exception e) {
            stats = java.util.Collections.emptyMap();
            events = java.util.Collections.emptyList();
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
  <link rel="stylesheet" href="../css/style.css">
</head>
<body>
  <div class="admin-shell">
    <!-- Sidebar (256px) -->
    <aside class="admin-sidebar">
      <div class="home-logo">
        <span class="lotus-ticket"><i></i><i></i><i></i></span>TECH FEST HUB
      </div>
      <span class="hud-label" style="font-size: 10px;">FESTIVAL OFFICE</span>

      <nav>
        <a href="dashboard.jsp" class="active">Overview</a>
        <a href="../events.jsp">Events</a>
        <a href="registrations.jsp">Registrations</a>
      </nav>

      <div class="admin-sidebar-bottom">
        <p>Local Oracle XE Connected</p>
        <a href="../logout" class="btn btn-secondary btn-size-m" style="width: 100%; text-decoration: none; text-align: center;">Logout</a>
      </div>
    </aside>

    <!-- Main Content Area -->
    <div class="admin-content">
      <header class="admin-top">
        <span class="hud-label">UTSAV ARENA / ADMIN</span>
        <a href="../index.html">View festival &rarr;</a>
        <div class="admin-avatar">FA</div>
      </header>

      <main class="admin-main">
        <div class="admin-page-heading">
          <div>
            <span class="hud-label">WELCOME BACK, FESTIVAL TEAM</span>
            <div class="heading heading-large" style="margin-top: 8px;">Festival at a glance</div>
            <p style="color: #8A5A3C; margin-top: 6px;">Live statistics from Oracle XE Database.</p>
          </div>
          <span class="admin-season">TECH FEST<br /><b>2026</b></span>
        </div>

        <!-- 4 Metric Cards -->
        <div class="admin-stats">
          <div class="admin-stat">
            <span class="hud-label">EVENTS</span>
            <strong><%= stats.getOrDefault("totalEvents", 9) %></strong>
          </div>
          <div class="admin-stat mint">
            <span class="hud-label">OPEN FOR REGISTRATION</span>
            <strong><%= stats.getOrDefault("openEvents", 6) %></strong>
          </div>
          <div class="admin-stat pink">
            <span class="hud-label">STUDENT ACCOUNTS</span>
            <strong><%= stats.getOrDefault("totalStudents", 1) %></strong>
          </div>
          <div class="admin-stat blue">
            <span class="hud-label">CONFIRMED PASSES</span>
            <strong><%= stats.getOrDefault("confirmedPasses", 3) %></strong>
          </div>
        </div>

        <!-- Events Programme Table -->
        <div class="admin-section-head">
          <div class="heading" style="font-size: 28px; font-weight: 700;">The programme</div>
          <a href="../events.jsp">Manage events &rarr;</a>
        </div>

        <div class="admin-table-wrap">
          <table class="table-ds" style="width: 100%; border-collapse: collapse;">
            <thead>
              <tr style="text-align: left; border-bottom: 2px solid #F0DCC0; height: 48px;">
                <th style="padding: 12px 16px;">EVENT</th>
                <th style="padding: 12px 16px;">CATEGORY</th>
                <th style="padding: 12px 16px;">VENUE</th>
                <th style="padding: 12px 16px;">FEE</th>
                <th style="padding: 12px 16px;">STATUS</th>
                <th style="padding: 12px 16px;">ACTION</th>
              </tr>
            </thead>
            <tbody>
              <% if (events != null) {
                  for (Event e : events) {
                      String st = e.getStatus();
                      boolean isOpen = "OPEN".equalsIgnoreCase(st) || "Open".equalsIgnoreCase(st);
                      String fee = (e.getRegistrationFee() == null || e.getRegistrationFee().doubleValue() == 0) ? "Free" : "₹" + e.getRegistrationFee().intValue();
              %>
                <tr style="border-bottom: 1px solid #F0DCC0; height: 56px;">
                  <td style="padding: 12px 16px; font-weight: 600;">
                    <a href="../event-details.jsp?slug=<%= e.getSlug() %>"><%= e.getEventName() %></a>
                  </td>
                  <td style="padding: 12px 16px;"><%= e.getCategory() %></td>
                  <td style="padding: 12px 16px;"><%= e.getVenue() %></td>
                  <td style="padding: 12px 16px;"><%= fee %></td>
                  <td style="padding: 12px 16px;">
                    <span class="badge badge-<%= isOpen ? "open" : (st.equalsIgnoreCase("COMPLETED") ? "completed" : "closed") %>">
                      <i></i><%= st.toUpperCase() %>
                    </span>
                  </td>
                  <td style="padding: 12px 16px;">
                    <a href="../event-details.jsp?slug=<%= e.getSlug() %>" style="color: #0B7A70; font-weight: 600;">Edit</a>
                  </td>
                </tr>
              <%   }
                 } %>
            </tbody>
          </table>
        </div>
      </main>
    </div>
  </div>
</body>
</html>
