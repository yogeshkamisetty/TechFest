<%@ page import="java.util.List" %>
<%@ page import="com.techfest.model.Event" %>
<%@ page import="com.techfest.util.CsrfUtil" %>
<%
    String csrfToken = CsrfUtil.ensureToken(session);
    String role = (String) session.getAttribute("userRole");
    String userName = (String) session.getAttribute("userName");
%>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Events - Tech Fest Hub</title>
    <link rel="stylesheet" href="css/style.css">
</head>
<body>
    <a class="skip-link" href="#main-content">Skip to content</a>
    <nav class="navbar">
        <div class="container space-between">
            <div>
                <div class="brand-title">Tech Fest Hub</div>
                <div class="brand-subtitle">Event Discovery</div>
            </div>
            <div class="row">
                <% if (userName != null) { %>
                    <span class="muted">Welcome, <%= userName %></span>
                    <a class="btn btn-secondary" href="<%= request.getContextPath() %>/my-registrations">My Registrations</a>
                    <% if ("ADMIN".equalsIgnoreCase(role)) { %>
                        <a class="btn btn-secondary" href="<%= request.getContextPath() %>/admin/dashboard">Admin</a>
                    <% } %>
                    <form action="<%= request.getContextPath() %>/logout" method="post">
                        <input type="hidden" name="csrfToken" value="<%= csrfToken %>">
                        <button class="btn btn-primary" type="submit">Logout</button>
                    </form>
                <% } else { %>
                    <a class="btn btn-secondary" href="<%= request.getContextPath() %>/login.jsp">Login</a>
                    <a class="btn btn-primary" href="<%= request.getContextPath() %>/signup.jsp">Sign Up</a>
                <% } %>
            </div>
        </div>
    </nav>

    <main id="main-content" class="container">
        <section class="heading-wrap fade-up">
            <h1 class="section-title">Event Listing</h1>
            <p class="section-copy">Pick your next challenge and reserve your slot.</p>
        </section>
        <div class="event-grid">
            <%
                List<Event> events = (List<Event>) request.getAttribute("events");
                if (events != null && !events.isEmpty()) {
                    for (Event event : events) {
                        String statusClass = "status-open";
                        if (!"OPEN".equalsIgnoreCase(event.getStatus())) {
                            statusClass = "status-closed";
                        }
            %>
                <article class="event-card fade-up">
                    <span class="module-icon">EV</span>
                    <span class="event-category"><%= event.getCategory() %></span>
                    <h3 class="event-title"><%= event.getEventName() %></h3>
                    <div class="event-meta">
                        <p class="event-date">Date: <%= event.getEventDate() %></p>
                        <p class="event-venue">Venue: <%= event.getVenue() %></p>
                        <span class="status-pill <%= statusClass %>"><%= event.getStatus() %></span>
                    </div>
                    <a class="btn btn-primary" href="<%= request.getContextPath() %>/event-details?eventId=<%= event.getEventId() %>">View Details</a>
                </article>
            <%
                    }
                } else {
            %>
                <div class="glass">
                    <p class="muted">No events available yet.</p>
                </div>
            <% } %>
        </div>
    </main>
</body>
</html>
