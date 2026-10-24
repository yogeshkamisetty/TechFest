<%@ page import="com.techfest.util.CsrfUtil" %>
<%
    String error = request.getParameter("error");
    String csrfToken = CsrfUtil.ensureToken(session);
%>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sign Up</title>
    <link rel="stylesheet" href="css/style.css">
</head>
<body>
    <main class="auth-shell fade-up">
        <section class="auth-intro">
            <h1>Create Student Account</h1>
            <p>Join the fest portal to register for events and track your participation in one place.</p>
            <div class="glass">
                <p class="muted">All new signups are created with STUDENT role only.</p>
            </div>
        </section>
        <section class="auth-panel">
            <div class="form-container" style="margin: 0; max-width: none;">
                <% if (error != null) { %>
                    <div class="error-message"><%= error %></div>
                <% } %>

                <form id="signupForm" action="${pageContext.request.contextPath}/signup" method="post">
                    <input type="hidden" name="csrfToken" value="<%= csrfToken %>">
                    <div class="form-group">
                        <label>Full Name</label>
                        <input class="form-input" type="text" name="fullName" required maxlength="100">
                    </div>
                    <div class="form-group">
                        <label>Email</label>
                        <input class="form-input" type="email" name="email" required maxlength="150">
                    </div>
                    <div class="form-group">
                        <label>Password</label>
                        <input class="form-input" id="password" type="password" name="password" required minlength="8">
                    </div>
                    <div class="form-group">
                        <label>Confirm Password</label>
                        <input class="form-input" id="confirmPassword" type="password" name="confirmPassword" required minlength="8">
                    </div>
                    <div class="form-group">
                        <label>Department</label>
                        <input class="form-input" type="text" name="department" maxlength="100">
                    </div>
                    <button class="btn btn-primary" type="submit">Sign Up</button>
                </form>

                <p class="muted">Already registered? <a href="${pageContext.request.contextPath}/login.jsp">Login</a>.</p>
            </div>
        </section>
    </main>
    <script src="js/main.js"></script>
</body>
</html>
