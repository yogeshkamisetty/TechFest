package com.techfest.servlet;

import java.io.BufferedReader;
import java.io.IOException;
import java.sql.SQLException;
import java.util.List;
import java.util.Map;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.techfest.dao.UserDAO;
import com.techfest.model.User;
import com.techfest.util.JsonUtil;
import com.techfest.util.PasswordUtil;

@WebServlet({"/admin/students", "/admin/student/add", "/admin/student/delete"})
public class AdminStudentServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;
    private final UserDAO userDAO = new UserDAO();

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        try {
            List<User> students = userDAO.getAllStudents();
            String accept = request.getHeader("Accept");
            if (accept != null && accept.contains("application/json") || request.getParameter("json") != null) {
                JsonUtil.sendJson(response, HttpServletResponse.SC_OK, students);
                return;
            }

            request.setAttribute("students", students);
            if (getServletContext().getResource("/admin/students.jsp") != null) {
                request.getRequestDispatcher("/admin/students.jsp").forward(request, response);
            } else {
                JsonUtil.sendJson(response, HttpServletResponse.SC_OK, students);
            }
        } catch (SQLException e) {
            e.printStackTrace();
            JsonUtil.sendJson(response, HttpServletResponse.SC_INTERNAL_SERVER_ERROR, Map.of("error", e.getMessage()));
        }
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        String path = request.getServletPath();

        if ("/admin/student/delete".equals(path)) {
            handleDeleteStudent(request, response);
        } else {
            handleAddStudent(request, response);
        }
    }

    private void handleAddStudent(HttpServletRequest request, HttpServletResponse response) throws IOException {
        String name = null;
        String email = null;
        String password = null;
        String department = null;

        String contentType = request.getContentType();
        if (contentType != null && contentType.toLowerCase().contains("application/json")) {
            try (BufferedReader reader = request.getReader()) {
                JsonObject json = JsonParser.parseReader(reader).getAsJsonObject();
                if (json.has("name")) name = json.get("name").getAsString();
                if (json.has("email")) email = json.get("email").getAsString();
                if (json.has("password")) password = json.get("password").getAsString();
                if (json.has("department")) department = json.get("department").getAsString();
            } catch (Exception e) {
                JsonUtil.sendJson(response, HttpServletResponse.SC_BAD_REQUEST, Map.of("error", "Invalid JSON payload"));
                return;
            }
        } else {
            name = request.getParameter("name");
            email = request.getParameter("email");
            password = request.getParameter("password");
            department = request.getParameter("department");
        }

        if (name == null || name.trim().isEmpty() || email == null || email.trim().isEmpty() || password == null || password.trim().isEmpty()) {
            JsonUtil.sendJson(response, HttpServletResponse.SC_BAD_REQUEST, Map.of("error", "Name, email and password are required."));
            return;
        }

        try {
            User existing = userDAO.findByEmail(email);
            if (existing != null) {
                JsonUtil.sendJson(response, HttpServletResponse.SC_CONFLICT, Map.of("error", "A student with this email already exists."));
                return;
            }

            User user = new User();
            user.setFullName(name.trim());
            user.setEmail(email.trim().toLowerCase());
            user.setPasswordHash(PasswordUtil.hashPassword(password));
            user.setDepartment(department == null || department.trim().isEmpty() ? "General" : department.trim());
            user.setRole("STUDENT");

            userDAO.createUser(user);
            User created = userDAO.findByEmail(email);

            JsonUtil.sendJson(response, HttpServletResponse.SC_CREATED, Map.of(
                "success", true,
                "message", "Student added successfully",
                "student", created
            ));
        } catch (SQLException e) {
            e.printStackTrace();
            JsonUtil.sendJson(response, HttpServletResponse.SC_INTERNAL_SERVER_ERROR, Map.of("error", e.getMessage()));
        }
    }

    private void handleDeleteStudent(HttpServletRequest request, HttpServletResponse response) throws IOException {
        String idStr = null;
        String email = null;

        String contentType = request.getContentType();
        if (contentType != null && contentType.toLowerCase().contains("application/json")) {
            try (BufferedReader reader = request.getReader()) {
                JsonObject json = JsonParser.parseReader(reader).getAsJsonObject();
                if (json.has("id")) idStr = json.get("id").getAsString();
                if (json.has("userId")) idStr = json.get("userId").getAsString();
                if (json.has("email")) email = json.get("email").getAsString();
            } catch (Exception e) {
                JsonUtil.sendJson(response, HttpServletResponse.SC_BAD_REQUEST, Map.of("error", "Invalid JSON payload"));
                return;
            }
        } else {
            idStr = request.getParameter("id");
            if (idStr == null) idStr = request.getParameter("userId");
            email = request.getParameter("email");
        }

        try {
            boolean deleted = false;
            if (idStr != null && !idStr.trim().isEmpty()) {
                long userId = Long.parseLong(idStr.trim());
                deleted = userDAO.deleteUser(userId);
            } else if (email != null && !email.trim().isEmpty()) {
                deleted = userDAO.deleteUserByEmail(email.trim());
            } else {
                JsonUtil.sendJson(response, HttpServletResponse.SC_BAD_REQUEST, Map.of("error", "Student ID or email required for deletion."));
                return;
            }

            if (deleted) {
                JsonUtil.sendJson(response, HttpServletResponse.SC_OK, Map.of(
                    "success", true,
                    "message", "Student removed successfully."
                ));
            } else {
                JsonUtil.sendJson(response, HttpServletResponse.SC_NOT_FOUND, Map.of(
                    "error", "Student not found or already removed."
                ));
            }
        } catch (Exception e) {
            e.printStackTrace();
            JsonUtil.sendJson(response, HttpServletResponse.SC_INTERNAL_SERVER_ERROR, Map.of("error", e.getMessage()));
        }
    }
}
