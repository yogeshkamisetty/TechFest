package com.techfest.servlet;

import java.io.IOException;
import java.sql.SQLException;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import com.techfest.dao.UserDAO;
import com.techfest.model.User;
import com.techfest.util.CsrfUtil;
import com.techfest.util.PasswordUtil;

@WebServlet("/login")
public class LoginServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;

    private final UserDAO userDAO = new UserDAO();

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        if (!CsrfUtil.isValid(request)) {
            response.sendError(HttpServletResponse.SC_FORBIDDEN, "Invalid CSRF token.");
            return;
        }

        String email = request.getParameter("email");
        String password = request.getParameter("password");

        if (email == null || password == null || email.trim().isEmpty() || password.isEmpty()) {
            response.sendRedirect(request.getContextPath() + "/login.jsp?error=Invalid+credentials");
            return;
        }

        try {
            User user = userDAO.findByEmail(email.trim().toLowerCase());
            if (user == null || !PasswordUtil.verifyPassword(password, user.getPasswordHash())) {
                response.sendRedirect(request.getContextPath() + "/login.jsp?error=Invalid+credentials");
                return;
            }

            HttpSession oldSession = request.getSession(false);
            if (oldSession != null) {
                oldSession.invalidate();
            }

            HttpSession session = request.getSession(true);
            session.setAttribute("userId", user.getUserId());
            session.setAttribute("userName", user.getFullName());
            session.setAttribute("userRole", user.getRole());
            CsrfUtil.ensureToken(session);

            if ("ADMIN".equalsIgnoreCase(user.getRole())) {
                response.sendRedirect(request.getContextPath() + "/admin/dashboard");
            } else {
                response.sendRedirect(request.getContextPath() + "/events");
            }
        } catch (SQLException ex) {
            throw new ServletException("Login failed", ex);
        }
    }
}
