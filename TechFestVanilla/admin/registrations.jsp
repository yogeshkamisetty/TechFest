<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="java.util.List, com.techfest.model.Registration, com.techfest.dao.RegistrationDAO" %>
<%
    List<Registration> regs = (List<Registration>) request.getAttribute("registrations");
    if (regs == null) {
        try {
            regs = new RegistrationDAO().getAllRegistrations();
        } catch (Exception e) {
            regs = java.util.Collections.emptyList();
        }
    }
%>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Registrations Admin — Tech Fest Hub</title>
  <link rel="icon" type="image/svg+xml" href="../assets/favicon.svg">
  <link rel="stylesheet" href="../css/style.css">
</head>
<body>
  <div class="admin-shell">
    <!-- Sidebar -->
    <aside class="admin-sidebar">
      <div class="home-logo">
        <span class="lotus-ticket"><i></i><i></i><i></i></span>TECH FEST HUB
      </div>
      <span class="hud-label" style="font-size: 10px;">FESTIVAL OFFICE</span>

      <nav>
        <a href="dashboard.jsp">Overview</a>
        <a href="../events.jsp">Events</a>
        <a href="registrations.jsp" class="active">Registrations</a>
      </nav>

      <div class="admin-sidebar-bottom">
        <p>Live Oracle DB Pass Audit</p>
        <a href="../logout" class="btn btn-secondary btn-size-m" style="width: 100%; text-decoration: none; text-align: center;">Logout</a>
      </div>
    </aside>

    <div class="admin-content">
      <header class="admin-top">
        <span class="hud-label">MANAGE / REGISTRATIONS</span>
        <a href="../index.html">View festival &rarr;</a>
        <div class="admin-avatar">FA</div>
      </header>

      <main class="admin-main">
        <div class="admin-page-heading">
          <div>
            <span class="hud-label">LIVE PASS AUDIT</span>
            <div class="heading heading-large" style="margin-top: 8px;">Every pass, in one place</div>
            <p style="color: #8A5A3C; margin-top: 6px;">Real-time registration records stored in Oracle XE Database.</p>
          </div>
        </div>

        <div class="admin-table-wrap">
          <table class="table-ds" style="width: 100%; border-collapse: collapse;">
            <thead>
              <tr style="text-align: left; border-bottom: 2px solid #F0DCC0; height: 48px;">
                <th style="padding: 12px 16px;">PASS ID</th>
                <th style="padding: 12px 16px;">EVENT</th>
                <th style="padding: 12px 16px;">TEAM / TRACK</th>
                <th style="padding: 12px 16px;">REGISTERED ON</th>
                <th style="padding: 12px 16px;">STATUS</th>
              </tr>
            </thead>
            <tbody>
              <% if (regs != null && !regs.isEmpty()) {
                  for (Registration r : regs) {
                      boolean isConf = "CONFIRMED".equalsIgnoreCase(r.getStatus());
              %>
                <tr style="border-bottom: 1px solid #F0DCC0; height: 56px;">
                  <td style="padding: 12px 16px; font-weight: 700; color: #0B7A70;"><%= r.getRegNumber() %></td>
                  <td style="padding: 12px 16px; font-weight: 600;"><%= r.getEventName() %></td>
                  <td style="padding: 12px 16px;"><%= (r.getTeamName() != null ? r.getTeamName() + " · " : "") + (r.getTrackSelected() != null ? r.getTrackSelected() : "General") %></td>
                  <td style="padding: 12px 16px;"><%= r.getRegisteredAt() %></td>
                  <td style="padding: 12px 16px;">
                    <span class="badge badge-<%= isConf ? "open" : "closed" %>">
                      <i></i><%= r.getStatus().toUpperCase() %>
                    </span>
                  </td>
                </tr>
              <%   }
                 } else { %>
                <tr>
                  <td colspan="5" style="text-align: center; padding: 32px; color: #8A5A3C;">No registrations found in database.</td>
                </tr>
              <% } %>
            </tbody>
          </table>
        </div>
      </main>
    </div>
  </div>
</body>
</html>
