package com.techfest;

import java.io.IOException;
import java.net.URLEncoder;
import java.sql.SQLException;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

/**
 * LoginServlet - Handles User Authentication and Session Creation.
 */
@WebServlet({"/login", "/LoginServlet"})
public class LoginServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;
    private final UserDAO userDAO = new UserDAO();

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        HttpSession session = request.getSession(false);
        if (session != null && session.getAttribute("userEmail") != null) {
            String role = (String) session.getAttribute("userRole");
            if ("ADMIN".equalsIgnoreCase(role)) {
                response.sendRedirect(request.getContextPath() + "/admin/dashboard.jsp");
            } else {
                response.sendRedirect(request.getContextPath() + "/user-home.jsp");
            }
            return;
        }

        response.sendRedirect(request.getContextPath() + "/login.html");
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        String email = request.getParameter("email");
        String password = request.getParameter("password");
        String next = request.getParameter("next");

        if (email == null || email.trim().isEmpty() || password == null || password.trim().isEmpty()) {
            response.sendRedirect(request.getContextPath() + "/login.html?error=" +
                URLEncoder.encode("Email and password are required.", "UTF-8"));
            return;
        }

        try {
            User user = userDAO.findByEmail(email.trim());
            if (user == null || !PasswordUtil.verifyPassword(password.trim(), user.getPasswordHash())) {
                response.sendRedirect(request.getContextPath() + "/login.html?error=" +
                    URLEncoder.encode("Invalid email or password.", "UTF-8"));
                return;
            }

            HttpSession session = request.getSession(true);
            session.setAttribute("userId", user.getUserId());
            session.setAttribute("userName", user.getFullName());
            session.setAttribute("userEmail", user.getEmail());
            session.setAttribute("userRole", user.getRole().toUpperCase());
            session.setAttribute("userDept", user.getDepartment());
            session.setAttribute("user", user);

            boolean isAdmin = "ADMIN".equalsIgnoreCase(user.getRole());

            if (next != null && !next.trim().isEmpty() && !next.contains("://")) {
                response.sendRedirect(next);
            } else if (isAdmin) {
                response.sendRedirect(request.getContextPath() + "/admin/dashboard.jsp");
            } else {
                response.sendRedirect(request.getContextPath() + "/user-home.jsp");
            }
        } catch (SQLException e) {
            e.printStackTrace();
            response.sendRedirect(request.getContextPath() + "/login.html?error=" +
                URLEncoder.encode("Database error: " + e.getMessage(), "UTF-8"));
        }
    }
}
