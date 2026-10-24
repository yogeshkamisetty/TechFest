<%@ page import="com.techfest.model.Event" %>
<%@ page import="com.techfest.util.CsrfUtil" %>
<%
    Event event = (Event) request.getAttribute("event");
    String message = request.getParameter("message");
    String role = (String) session.getAttribute("userRole");
    Object userId = session.getAttribute("userId");
    String csrfToken = CsrfUtil.ensureToken(session);
%>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Event Details</title>
    <link rel="stylesheet" href="css/style.css">
</head>
<body>
    <nav class="navbar">
        <div class="container space-between">
            <div>
                <div class="brand-title">Tech Fest Hub</div>
                <div class="brand-subtitle">Event Details</div>
            </div>
            <a class="btn btn-secondary" href="<%= request.getContextPath() %>/events">Back to Events</a>
        </div>
    </nav>

    <main class="container">
        <% if (message != null && !message.trim().isEmpty()) { %>
            <div class="error-message"><%= message %></div>
        <% } %>

        <% if (event == null) { %>
            <p class="error-message">Event not found.</p>
        <% } else { %>
            <article class="event-card fade-up">
                <h1 class="event-title"><%= event.getEventName() %></h1>
                <p><span class="event-category"><%= event.getCategory() %></span></p>
                <p><%= event.getDescription() == null ? "No description provided." : event.getDescription() %></p>
                <div class="event-meta">
                    <p class="event-date">Date: <%= event.getEventDate() %></p>
                    <p class="event-venue">Venue: <%= event.getVenue() %></p>
                    <p class="event-venue">Fee: <%= event.getRegistrationFee() %></p>
                    <span class="status-pill <%= "OPEN".equalsIgnoreCase(event.getStatus()) ? "status-open" : "status-closed" %>"><%= event.getStatus() %></span>
                </div>
            </article>

            <% if (userId == null) { %>
                <p class="muted">Please log in to register for this event.</p>
                <a class="btn btn-primary" href="<%= request.getContextPath() %>/login.jsp">Login</a>
            <% } else if ("OPEN".equalsIgnoreCase(event.getStatus())) { %>
                <form class="form-container" action="<%= request.getContextPath() %>/event-register" method="post">
                    <input type="hidden" name="csrfToken" value="<%= csrfToken %>">
                    <input type="hidden" name="eventId" value="<%= event.getEventId() %>">
                    <button type="submit" class="btn btn-primary">Register for Event</button>
                </form>
            <% } else { %>
                <p class="error-message">Registration is closed for this event.</p>
            <% } %>

            <% if ("ADMIN".equalsIgnoreCase(role)) { %>
                <a class="btn btn-secondary" href="<%= request.getContextPath() %>/admin/manage-events">Manage Events</a>
            <% } %>
        <% } %>
    </main>
</body>
</html>
