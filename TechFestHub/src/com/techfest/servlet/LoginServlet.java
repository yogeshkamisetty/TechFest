package com.techfest.servlet;

import java.io.BufferedReader;
import java.io.IOException;
import java.sql.SQLException;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.techfest.dao.UserDAO;
import com.techfest.model.User;
import com.techfest.util.JsonUtil;
import com.techfest.util.PasswordUtil;

@WebServlet("/login")
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
                response.sendRedirect(request.getContextPath() + "/admin.html");
            } else {
                response.sendRedirect(request.getContextPath() + "/index.html");
            }
            return;
        }

        // Serve JSP if exists, or redirect to login.html
        if (getServletContext().getResource("/login.jsp") != null) {
            request.getRequestDispatcher("/login.jsp").forward(request, response);
        } else {
            response.sendRedirect(request.getContextPath() + "/login.html");
        }
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        String email = null;
        String password = null;
        boolean isJson = false;

        String contentType = request.getContentType();
        if (contentType != null && contentType.toLowerCase().contains("application/json")) {
            isJson = true;
            try (BufferedReader reader = request.getReader()) {
                JsonObject json = JsonParser.parseReader(reader).getAsJsonObject();
                if (json.has("email")) email = json.get("email").getAsString();
                if (json.has("password")) password = json.get("password").getAsString();
            } catch (Exception e) {
                JsonUtil.sendJson(response, HttpServletResponse.SC_BAD_REQUEST, Map.of("error", "Invalid JSON payload"));
                return;
            }
        } else {
            email = request.getParameter("email");
            password = request.getParameter("password");
        }

        if (email == null || email.trim().isEmpty() || password == null || password.trim().isEmpty()) {
            if (isJson) {
                JsonUtil.sendJson(response, HttpServletResponse.SC_BAD_REQUEST, Map.of("error", "Email and password are required"));
            } else {
                request.setAttribute("error", "Email and password are required.");
                request.getRequestDispatcher("/login.jsp").forward(request, response);
            }
            return;
        }

        try {
            User user = userDAO.findByEmail(email);
            if (user == null || !PasswordUtil.verifyPassword(password, user.getPasswordHash())) {
                if (isJson) {
                    JsonUtil.sendJson(response, HttpServletResponse.SC_UNAUTHORIZED, Map.of("error", "Check your email and password and try again."));
                } else {
                    request.setAttribute("error", "Invalid email or password.");
                    request.getRequestDispatcher("/login.jsp").forward(request, response);
                }
                return;
            }

            HttpSession session = request.getSession(true);
            session.setAttribute("userId", user.getUserId());
            session.setAttribute("userName", user.getFullName());
            session.setAttribute("userEmail", user.getEmail());
            session.setAttribute("userRole", user.getRole().toUpperCase());
            session.setAttribute("userDept", user.getDepartment());
            session.setAttribute("user", user); // Store User JavaBean in session

            Map<String, Object> safeUser = new HashMap<>();
            safeUser.put("id", user.getUserId());
            safeUser.put("name", user.getFullName());
            safeUser.put("email", user.getEmail());
            safeUser.put("role", user.getRole().toLowerCase());
            safeUser.put("department", user.getDepartment());

            if (isJson) {
                Map<String, Object> res = new HashMap<>();
                res.put("success", true);
                res.put("user", safeUser);
                res.put("redirect", "index.html");
                JsonUtil.sendJson(response, HttpServletResponse.SC_OK, res);
            } else {
                String next = request.getParameter("next");
                if (next != null && !next.trim().isEmpty()) {
                    response.sendRedirect(next);
                } else {
                    response.sendRedirect(request.getContextPath() + "/index.html");
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
            if (isJson) {
                JsonUtil.sendJson(response, HttpServletResponse.SC_INTERNAL_SERVER_ERROR, Map.of("error", "Database error: " + e.getMessage()));
            } else {
                throw new ServletException("Database error during login", e);
            }
        }
    }
}
