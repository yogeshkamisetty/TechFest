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

@WebServlet("/signup")
public class SignupServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;
    private final UserDAO userDAO = new UserDAO();

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        if (getServletContext().getResource("/signup.jsp") != null) {
            request.getRequestDispatcher("/signup.jsp").forward(request, response);
        } else {
            response.sendRedirect(request.getContextPath() + "/signup.html");
        }
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        String name = null;
        String email = null;
        String password = null;
        String department = null;
        boolean isJson = false;

        String contentType = request.getContentType();
        if (contentType != null && contentType.toLowerCase().contains("application/json")) {
            isJson = true;
            try (BufferedReader reader = request.getReader()) {
                JsonObject json = JsonParser.parseReader(reader).getAsJsonObject();
                if (json.has("name")) name = json.get("name").getAsString();
                if (json.has("email")) email = json.get("email").getAsString();
                if (json.has("password")) password = json.get("password").getAsString();
                if (json.has("department")) department = json.get("department").getAsString();
            } catch (Exception e) {
                JsonUtil.sendJson(response, HttpServletResponse.SC_BAD_REQUEST, Map.of("error", "Invalid JSON"));
                return;
            }
        } else {
            name = request.getParameter("name");
            email = request.getParameter("email");
            password = request.getParameter("password");
            department = request.getParameter("department");
        }

        if (name == null || name.trim().isEmpty() || email == null || email.trim().isEmpty()
                || password == null || password.trim().isEmpty()) {
            if (isJson) {
                JsonUtil.sendJson(response, HttpServletResponse.SC_BAD_REQUEST, Map.of("error", "All fields are required."));
            } else {
                request.setAttribute("error", "All fields are required.");
                request.getRequestDispatcher("/signup.jsp").forward(request, response);
            }
            return;
        }

        try {
            User existing = userDAO.findByEmail(email);
            if (existing != null) {
                if (isJson) {
                    JsonUtil.sendJson(response, HttpServletResponse.SC_CONFLICT, Map.of("error", "An account with this email already exists."));
                } else {
                    request.setAttribute("error", "An account with this email already exists.");
                    request.getRequestDispatcher("/signup.jsp").forward(request, response);
                }
                return;
            }

            User user = new User();
            user.setFullName(name.trim());
            user.setEmail(email.trim().toLowerCase());
            user.setPasswordHash(PasswordUtil.hashPassword(password));
            user.setDepartment(department == null ? "General" : department.trim());
            user.setRole("STUDENT");

            userDAO.createUser(user);
            User created = userDAO.findByEmail(email);

            HttpSession session = request.getSession(true);
            session.setAttribute("userId", created.getUserId());
            session.setAttribute("userName", created.getFullName());
            session.setAttribute("userEmail", created.getEmail());
            session.setAttribute("userRole", created.getRole().toUpperCase());
            session.setAttribute("userDept", created.getDepartment());
            session.setAttribute("user", created); // Store JavaBean in session

            Map<String, Object> safeUser = new HashMap<>();
            safeUser.put("id", created.getUserId());
            safeUser.put("name", created.getFullName());
            safeUser.put("email", created.getEmail());
            safeUser.put("role", "student");
            safeUser.put("department", created.getDepartment());

            if (isJson) {
                Map<String, Object> res = new HashMap<>();
                res.put("success", true);
                res.put("user", safeUser);
                res.put("redirect", "index.html");
                JsonUtil.sendJson(response, HttpServletResponse.SC_CREATED, res);
            } else {
                response.sendRedirect(request.getContextPath() + "/index.html");
            }
        } catch (SQLException e) {
            e.printStackTrace();
            if (isJson) {
                JsonUtil.sendJson(response, HttpServletResponse.SC_INTERNAL_SERVER_ERROR, Map.of("error", "Database error: " + e.getMessage()));
            } else {
                throw new ServletException("Database error during registration", e);
            }
        }
    }
}
