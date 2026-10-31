package com.techfest;

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

/**
 * AdminDashboardServlet - Loads festival KPIs, events, registrations, and student records.
 */
@WebServlet({"/admin/dashboard", "/AdminDashboardServlet"})
public class AdminDashboardServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;

    private final EventDAO eventDAO = new EventDAO();
    private final RegistrationDAO registrationDAO = new RegistrationDAO();
    private final UserDAO userDAO = new UserDAO();

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        HttpSession session = request.getSession(false);
        String role = (session != null) ? (String) session.getAttribute("userRole") : null;
        if (!"ADMIN".equalsIgnoreCase(role)) {
            response.sendRedirect(request.getContextPath() + "/login.html?next=" + request.getRequestURI());
            return;
        }

        try {
            int totalEvents = eventDAO.countTotalEvents();
            int openEvents = eventDAO.countOpenEvents();
            int totalUsers = userDAO.countTotalUsers();
            int totalStudents = userDAO.countStudents();
            int totalRegistrations = registrationDAO.countTotalRegistrations();
            int confirmedPasses = registrationDAO.countConfirmedRegistrations();

            Map<String, Object> stats = new HashMap<>();
            stats.put("totalEvents", totalEvents);
            stats.put("openEvents", openEvents);
            stats.put("totalUsers", totalUsers);
            stats.put("totalStudents", totalStudents);
            stats.put("totalRegistrations", totalRegistrations);
            stats.put("confirmedPasses", confirmedPasses);

            request.setAttribute("stats", stats);
            request.setAttribute("events", eventDAO.getAllEvents());
            request.setAttribute("registrations", registrationDAO.getAllRegistrations());
            request.setAttribute("users", userDAO.getAllUsers());

            request.getRequestDispatcher("/admin/dashboard.jsp").forward(request, response);
        } catch (SQLException e) {
            e.printStackTrace();
            throw new ServletException("Failed to load admin metrics from Oracle database", e);
        }
    }
}
