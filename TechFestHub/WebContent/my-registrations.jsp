<%@ page import="java.util.List" %>
<%@ page import="com.techfest.model.Registration" %>
<%@ page import="com.techfest.util.CsrfUtil" %>
<%
    List<Registration> registrations = (List<Registration>) request.getAttribute("registrations");
    String message = request.getParameter("message");
    String csrfToken = CsrfUtil.ensureToken(session);
%>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Registrations</title>
    <link rel="stylesheet" href="css/style.css">
</head>
<body>
    <a class="skip-link" href="#main-content">Skip to content</a>
    <nav class="navbar">
        <div class="container space-between">
            <div>
                <div class="brand-title">Tech Fest Hub</div>
                <div class="brand-subtitle">My Registrations</div>
            </div>
            <div class="row">
                <a class="btn btn-secondary" href="<%= request.getContextPath() %>/events">Events</a>
                <form action="<%= request.getContextPath() %>/logout" method="post">
                    <input type="hidden" name="csrfToken" value="<%= csrfToken %>">
                    <button class="btn btn-primary" type="submit">Logout</button>
                </form>
            </div>
        </div>
    </nav>

    <main id="main-content" class="container">
        <div class="heading-wrap fade-up">
            <h1 class="section-title">My Registrations</h1>
            <p class="section-copy">Track all events you have joined so far.</p>
        </div>
        <% if (message != null) { %>
            <div class="success-message"><%= message %></div>
        <% } %>

        <div class="table-wrap">
            <table class="data-table compact">
                <thead>
                    <tr>
                        <th>Event</th>
                        <th>Registered At</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    <%
                        if (registrations != null && !registrations.isEmpty()) {
                            for (Registration registration : registrations) {
                    %>
                        <tr>
                            <td><%= registration.getEventName() %></td>
                            <td><%= registration.getRegisteredAt() %></td>
                            <td><%= registration.getStatus() %></td>
                        </tr>
                    <%
                            }
                        } else {
                    %>
                        <tr>
                            <td colspan="3" class="muted">No registrations found.</td>
                        </tr>
                    <% } %>
                </tbody>
            </table>
        </div>
    </main>
</body>
</html>
