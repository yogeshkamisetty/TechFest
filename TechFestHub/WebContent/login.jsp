<%@ page import="com.techfest.util.CsrfUtil" %>
<%
    String error = request.getParameter("error");
    String message = request.getParameter("message");
    String csrfToken = CsrfUtil.ensureToken(session);
%>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login</title>
    <link rel="stylesheet" href="css/style.css">
</head>
<body>
    <main class="auth-shell fade-up">
        <section class="auth-intro">
            <h1>Welcome Back</h1>
            <p>Sign in to register for events, track your entries, and manage your fest journey.</p>
            <div class="glass">
                <p class="muted">Tip: Admin users are redirected to the dashboard automatically.</p>
            </div>
        </section>
        <section class="auth-panel">
            <div class="form-container" style="margin: 0; max-width: none;">
                <h2 class="section-title">Login</h2>
                <% if (error != null) { %>
                    <div class="error-message"><%= error %></div>
                <% } %>
                <% if (message != null) { %>
                    <div class="success-message"><%= message %></div>
                <% } %>

                <form action="${pageContext.request.contextPath}/login" method="post">
                    <input type="hidden" name="csrfToken" value="<%= csrfToken %>">
                    <div class="form-group">
                        <label>Email</label>
                        <input class="form-input" type="email" name="email" required>
                    </div>
                    <div class="form-group">
                        <label>Password</label>
                        <input class="form-input" type="password" name="password" required>
                    </div>
                    <button class="btn btn-primary" type="submit">Login</button>
                </form>

                <p class="muted">No account? <a href="${pageContext.request.contextPath}/signup.jsp">Create one</a>.</p>
                <p><a class="btn btn-secondary" href="${pageContext.request.contextPath}/events">Back to events</a></p>
            </div>
        </section>
    </main>
</body>
</html>
