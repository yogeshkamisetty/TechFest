<%@ page import="java.util.List" %>
<%@ page import="java.util.Map" %>
<%@ page import="com.techfest.model.Event" %>
<%@ page import="com.techfest.util.CsrfUtil" %>
<%
    List<Event> events = (List<Event>) request.getAttribute("events");
    Map<Long, Integer> registrationCounts = (Map<Long, Integer>) request.getAttribute("registrationCounts");
    Integer totalEvents = (Integer) request.getAttribute("totalEvents");
    Integer openEvents = (Integer) request.getAttribute("openEvents");
    Integer totalRegistrations = (Integer) request.getAttribute("totalRegistrations");
    String csrfToken = CsrfUtil.ensureToken(session);
%>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Dashboard</title>
    <link rel="stylesheet" href="../css/style.css">
</head>
<body>
    <a class="skip-link" href="#main-content">Skip to content</a>
    <nav class="navbar">
        <div class="container space-between">
            <div>
                <div class="brand-title">Admin Dashboard</div>
                <div class="brand-subtitle">Operations Overview</div>
            </div>
            <div class="row">
                <a class="btn btn-secondary" href="<%= request.getContextPath() %>/events">Public Events</a>
                <a class="btn btn-secondary" href="<%= request.getContextPath() %>/admin/manage-events">Manage Events</a>
                <a class="btn btn-secondary" href="<%= request.getContextPath() %>/admin/registrations">Registrations</a>
                <form action="<%= request.getContextPath() %>/logout" method="post">
                    <input type="hidden" name="csrfToken" value="<%= csrfToken %>">
                    <button class="btn btn-primary" type="submit">Logout</button>
                </form>
            </div>
        </div>
    </nav>

    <main id="main-content" class="container">
        <div class="heading-wrap fade-up">
            <h1 class="section-title">Overview</h1>
            <p class="section-copy">Monitor activity, event status, and participation metrics.</p>
        </div>
        <div class="event-grid">
            <div class="dashboard-card">
                <span class="kpi-icon">EV</span>
                <p class="stat-label">Total Events</p>
                <p class="stat-value"><%= totalEvents == null ? 0 : totalEvents %></p>
            </div>
            <div class="dashboard-card">
                <span class="kpi-icon">OP</span>
                <p class="stat-label">Open Events</p>
                <p class="stat-value"><%= openEvents == null ? 0 : openEvents %></p>
            </div>
            <div class="dashboard-card">
                <span class="kpi-icon">RG</span>
                <p class="stat-label">Total Registrations</p>
                <p class="stat-value"><%= totalRegistrations == null ? 0 : totalRegistrations %></p>
            </div>
        </div>

        <h2 class="section-title">Event Snapshot</h2>
        <div class="table-wrap">
            <table class="data-table compact">
                <thead>
                    <tr>
                        <th>Event</th>
                        <th>Status</th>
                        <th>Registrations</th>
                    </tr>
                </thead>
                <tbody>
                    <%
                        if (events != null && !events.isEmpty()) {
                            for (Event event : events) {
                    %>
                        <tr>
                            <td><%= event.getEventName() %></td>
                            <td><%= event.getStatus() %></td>
                            <td><%= registrationCounts == null ? 0 : registrationCounts.getOrDefault(event.getEventId(), 0) %></td>
                        </tr>
                    <%      }
                        } else { %>
                        <tr>
                            <td colspan="3" class="muted">No events available.</td>
                        </tr>
                    <% } %>
                </tbody>
            </table>
        </div>
    </main>
</body>
</html>
