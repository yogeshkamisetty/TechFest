<%@ page import="java.util.List" %>
<%@ page import="com.techfest.model.Event" %>
<%@ page import="com.techfest.util.CsrfUtil" %>
<%
    List<Event> events = (List<Event>) request.getAttribute("events");
    String message = request.getParameter("message");
    String csrfToken = CsrfUtil.ensureToken(session);
%>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Manage Events</title>
    <link rel="stylesheet" href="../css/style.css">
</head>
<body>
    <a class="skip-link" href="#main-content">Skip to content</a>
    <nav class="navbar">
        <div class="container space-between">
            <div>
                <div class="brand-title">Manage Events</div>
                <div class="brand-subtitle">Create And Control</div>
            </div>
            <div class="row">
                <a class="btn btn-secondary" href="<%= request.getContextPath() %>/admin/dashboard">Dashboard</a>
                <a class="btn btn-secondary" href="<%= request.getContextPath() %>/admin/registrations">Registrations</a>
            </div>
        </div>
    </nav>

    <main id="main-content" class="container">
        <% if (message != null) { %>
            <div class="success-message"><%= message %></div>
        <% } %>

        <section class="form-container fade-up">
            <h2>Create Event</h2>
            <p class="section-copy">Use agreed field names so backend parsing remains consistent.</p>
            <form action="${pageContext.request.contextPath}/admin/event/create" method="post">
                <input type="hidden" name="csrfToken" value="<%= csrfToken %>">
                <div class="form-group"><label>Event Name</label><input class="form-input" type="text" name="eventName" required></div>
                <div class="form-group"><label>Category</label><input class="form-input" type="text" name="category" required></div>
                <div class="form-group"><label>Description</label><textarea class="form-input" name="description"></textarea></div>
                <div class="form-group"><label>Event Date</label><input class="form-input" type="datetime-local" name="eventDate" required></div>
                <div class="form-group"><label>Venue</label><input class="form-input" type="text" name="venue" required></div>
                <div class="form-group"><label>Registration Fee</label><input class="form-input" type="number" step="0.01" min="0" name="registrationFee" required></div>
                <div class="form-group"><label>Max Participants</label><input class="form-input" type="number" min="1" name="maxParticipants"></div>
                <div class="form-group"><label>Registration Deadline</label><input class="form-input" type="datetime-local" name="registrationDeadline"></div>
                <div class="form-group">
                    <label>Status</label>
                    <select class="form-input" name="status" required>
                        <option value="OPEN">OPEN</option>
                        <option value="CLOSED">CLOSED</option>
                        <option value="COMPLETED">COMPLETED</option>
                    </select>
                </div>
                <button class="btn btn-primary" type="submit">Add Event</button>
            </form>
        </section>

        <div class="heading-wrap">
            <h2 class="section-title">Existing Events</h2>
            <p class="section-copy">Close events from here when registrations should stop.</p>
        </div>
        <div class="table-wrap">
            <table class="data-table compact">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <%
                        if (events != null && !events.isEmpty()) {
                            for (Event event : events) {
                    %>
                    <tr>
                        <td><%= event.getEventId() %></td>
                        <td><%= event.getEventName() %></td>
                        <td><%= event.getStatus() %></td>
                        <td>
                            <form action="${pageContext.request.contextPath}/admin/event/delete" method="post" style="display:inline;">
                                <input type="hidden" name="csrfToken" value="<%= csrfToken %>">
                                <input type="hidden" name="eventId" value="<%= event.getEventId() %>">
                                <button class="btn btn-secondary" type="submit">Close Event</button>
                            </form>
                        </td>
                    </tr>
                    <%      }
                        } else { %>
                    <tr>
                        <td colspan="4" class="muted">No events found.</td>
                    </tr>
                    <% } %>
                </tbody>
            </table>
        </div>
    </main>
</body>
</html>
