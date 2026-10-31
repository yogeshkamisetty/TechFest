<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="java.util.List, com.techfest.Registration, com.techfest.RegistrationDAO" %>
<%
    HttpSession sess = request.getSession(false);
    String userRole = (sess != null) ? (String) sess.getAttribute("userRole") : null;
    if (!"ADMIN".equalsIgnoreCase(userRole)) {
        response.sendRedirect("../login.html?next=admin/registrations.jsp");
        return;
    }

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
  <title>Registrations Management — Tech Fest Hub</title>
  <link rel="icon" type="image/svg+xml" href="../assets/favicon.svg">
  <link rel="stylesheet" href="../css/style.css?v=6">
</head>
<body style="background: #FDF9F4; margin: 0; font-family: var(--body); color: #5B3A29;">
  <div style="max-width: 1200px; margin: 0 auto; padding: 32px 24px 64px;">
    <!-- Top Header -->
    <header style="display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #F0DCC0; padding-bottom: 20px; margin-bottom: 32px;">
      <div style="display: flex; align-items: center; gap: 14px;">
        <span class="tech-badge-icon">&lt;/&gt;</span>
        <div>
          <div style="font-weight: 800; font-size: 20px; letter-spacing: -0.02em; color: #5B3A29;">TECH FEST HUB — REGISTRATION AUDIT</div>
          <div style="font-size: 13px; color: #8A5A3C;">Campus Arena Administration Console &bull; Edition 2026</div>
        </div>
      </div>
      <div style="display: flex; align-items: center; gap: 14px;">
        <a href="dashboard.jsp" class="btn btn-secondary btn-size-m" style="text-decoration: none;">
          <span>&larr; Admin Dashboard</span>
        </a>
        <a href="../logout" class="btn btn-secondary btn-size-m" style="text-decoration: none; color: #D6336C;">
          <span>Logout</span>
        </a>
      </div>
    </header>

    <!-- Page Title -->
    <div style="margin-bottom: 24px; display: flex; justify-content: space-between; align-items: center;">
      <div>
        <h1 style="font-size: 26px; font-weight: 800; margin: 0 0 6px; color: #5B3A29;">All Student Registrations</h1>
        <p style="color: #8A5A3C; margin: 0; font-size: 14px;">Complete list of passes issued across campus events.</p>
      </div>
      <span style="font-family: var(--mono); font-size: 14px; font-weight: 700; color: #0B7A70;">
        <%= regs != null ? regs.size() : 0 %> TOTAL PASSES
      </span>
    </div>

    <!-- Table Wrap -->
    <div style="background: #FFFFFF; border: 1px solid #F0DCC0; border-radius: 16px; padding: 24px; box-shadow: 0 4px 16px rgba(138,90,60,0.06);">
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
              <th style="padding: 12px 14px;">Issued At</th>
              <th style="padding: 12px 14px;">Status</th>
            </tr>
          </thead>
          <tbody>
            <% if (regs != null && !regs.isEmpty()) {
                for (Registration r : regs) {
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
                <td style="padding: 12px 14px; font-size: 12px; color: #8A5A3C;"><%= r.getRegisteredAt() %></td>
                <td style="padding: 12px 14px;">
                  <span class="badge badge-<%= isConf ? "open" : "closed" %>">
                    <i></i><%= r.getStatus() != null ? r.getStatus().toUpperCase() : "CONFIRMED" %>
                  </span>
                </td>
              </tr>
            <%   }
               } else { %>
              <tr>
                <td colspan="8" style="text-align: center; padding: 24px; color: #8A5A3C;">No registrations found.</td>
              </tr>
            <% } %>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Footer Copyright -->
    <footer style="margin-top: 48px; border-top: 1px solid #F0DCC0; padding-top: 20px; text-align: center; font-size: 13px; color: #8A5A3C;">
      &copy; 2026 Tech Fest Hub &bull; Admin Console &bull; Powered by Java Servlets &amp; Oracle XE
    </footer>
  </div>
</body>
</html>
