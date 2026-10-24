<%@ page import="java.util.List" %>
<%@ page import="com.techfest.model.Registration" %>
<%
    List<Registration> registrations = (List<Registration>) request.getAttribute("registrations");
%>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>All Registrations</title>
    <link rel="stylesheet" href="../css/style.css">
</head>
<body>
    <a class="skip-link" href="#main-content">Skip to content</a>
    <nav class="navbar">
        <div class="container space-between">
            <div>
                <div class="brand-title">Registrations</div>
                <div class="brand-subtitle">All Student Entries</div>
            </div>
            <div class="row">
                <a class="btn btn-secondary" href="<%= request.getContextPath() %>/admin/dashboard">Dashboard</a>
                <a class="btn btn-secondary" href="<%= request.getContextPath() %>/admin/manage-events">Manage Events</a>
            </div>
        </div>
    </nav>

    <main id="main-content" class="container">
        <div class="heading-wrap fade-up">
            <h1 class="section-title">All Event Registrations</h1>
            <p class="section-copy">Auditable view of every registration record across events.</p>
        </div>
        <div class="table-wrap">
            <table class="data-table compact">
                <thead>
                    <tr>
                        <th>Student</th>
                        <th>Email</th>
                        <th>Event</th>
                        <th>Status</th>
                        <th>Registered At</th>
                    </tr>
                </thead>
                <tbody>
                    <%
                        if (registrations != null && !registrations.isEmpty()) {
                            for (Registration registration : registrations) {
                    %>
                    <tr>
                        <td><%= registration.getUserName() %></td>
                        <td><%= registration.getUserEmail() %></td>
                        <td><%= registration.getEventName() %></td>
                        <td><%= registration.getStatus() %></td>
                        <td><%= registration.getRegisteredAt() %></td>
                    </tr>
                    <%      }
                        } else { %>
                    <tr>
                        <td colspan="5" class="muted">No registrations available.</td>
                    </tr>
                    <% } %>
                </tbody>
            </table>
        </div>
    </main>
</body>
</html>
