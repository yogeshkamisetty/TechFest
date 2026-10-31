package com.techfest.servlet;

import java.io.IOException;
import java.sql.SQLException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import com.techfest.dao.EventDAO;
import com.techfest.dao.RegistrationDAO;
import com.techfest.dao.UserDAO;
import com.techfest.model.Event;
import com.techfest.model.Registration;
import com.techfest.model.User;
import com.techfest.util.JsonUtil;

@WebServlet("/api/*")
public class ApiServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;

    private final EventDAO eventDAO = new EventDAO();
    private final RegistrationDAO registrationDAO = new RegistrationDAO();
    private final UserDAO userDAO = new UserDAO();

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        String path = request.getPathInfo();
        if (path == null) path = "/";

        try {
            if ("/auth/me".equalsIgnoreCase(path)) {
                handleAuthMe(request, response);
            } else if ("/events".equalsIgnoreCase(path)) {
                List<Event> events = eventDAO.getAllEvents();
                JsonUtil.sendJson(response, HttpServletResponse.SC_OK, events);
            } else if (path.startsWith("/events/")) {
                String slug = path.substring("/events/".length());
                Event event = eventDAO.getEventBySlug(slug);
                if (event != null) {
                    JsonUtil.sendJson(response, HttpServletResponse.SC_OK, event);
                } else {
                    JsonUtil.sendJson(response, HttpServletResponse.SC_NOT_FOUND, Map.of("error", "Event not found"));
                }
            } else if ("/registrations".equalsIgnoreCase(path)) {
                handleMyRegistrations(request, response);
            } else if ("/admin/overview".equalsIgnoreCase(path)) {
                handleAdminOverview(request, response);
            } else {
                JsonUtil.sendJson(response, HttpServletResponse.SC_NOT_FOUND, Map.of("error", "Endpoint not found"));
            }
        } catch (SQLException e) {
            e.printStackTrace();
            JsonUtil.sendJson(response, HttpServletResponse.SC_INTERNAL_SERVER_ERROR, Map.of("error", "Database error: " + e.getMessage()));
        }
    }

    private void handleAuthMe(HttpServletRequest request, HttpServletResponse response) throws IOException, SQLException {
        HttpSession session = request.getSession(false);
        if (session == null || session.getAttribute("userEmail") == null) {
            JsonUtil.sendJson(response, HttpServletResponse.SC_OK, Map.of("authenticated", false));
            return;
        }

        String email = (String) session.getAttribute("userEmail");
        User user = userDAO.findByEmail(email);
        if (user == null) {
            JsonUtil.sendJson(response, HttpServletResponse.SC_OK, Map.of("authenticated", false));
            return;
        }

        Map<String, Object> data = new HashMap<>();
        data.put("authenticated", true);
        data.put("id", user.getUserId());
        data.put("name", user.getFullName());
        data.put("email", user.getEmail());
        data.put("role", user.getRole().toLowerCase());
        data.put("department", user.getDepartment());
        JsonUtil.sendJson(response, HttpServletResponse.SC_OK, data);
    }

    private void handleMyRegistrations(HttpServletRequest request, HttpServletResponse response) throws IOException, SQLException {
        HttpSession session = request.getSession(false);
        Long userId = session != null ? (Long) session.getAttribute("userId") : null;
        if (userId == null) {
            JsonUtil.sendJson(response, HttpServletResponse.SC_UNAUTHORIZED, Map.of("error", "Please log in"));
            return;
        }

        List<Registration> list = registrationDAO.getRegistrationsByUserId(userId);
        JsonUtil.sendJson(response, HttpServletResponse.SC_OK, list);
    }

    private void handleAdminOverview(HttpServletRequest request, HttpServletResponse response) throws IOException, SQLException {
        HttpSession session = request.getSession(false);
        String role = session != null ? (String) session.getAttribute("userRole") : null;
        if (!"ADMIN".equalsIgnoreCase(role)) {
            JsonUtil.sendJson(response, HttpServletResponse.SC_FORBIDDEN, Map.of("error", "Admin privileges required"));
            return;
        }

        Map<String, Object> overview = new HashMap<>();
        overview.put("totalEvents", eventDAO.countTotalEvents());
        overview.put("openEvents", eventDAO.countOpenEvents());
        overview.put("totalStudents", userDAO.countStudents());
        overview.put("confirmedPasses", registrationDAO.countConfirmedRegistrations());
        overview.put("events", eventDAO.getAllEvents());
        overview.put("students", userDAO.getAllStudents());
        overview.put("registrations", registrationDAO.getAllRegistrations());

        JsonUtil.sendJson(response, HttpServletResponse.SC_OK, overview);
    }
}
