package com.techfest.servlet;

import java.io.IOException;
import java.sql.SQLException;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.techfest.dao.EventDAO;
import com.techfest.dao.RegistrationDAO;
import com.techfest.dao.UserDAO;
import com.techfest.util.JsonUtil;

@WebServlet("/admin/dashboard")
public class AdminDashboardServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;

    private final EventDAO eventDAO = new EventDAO();
    private final RegistrationDAO registrationDAO = new RegistrationDAO();
    private final UserDAO userDAO = new UserDAO();

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        try {
            int totalEvents = eventDAO.countTotalEvents();
            int openEvents = eventDAO.countOpenEvents();
            int totalStudents = userDAO.countStudents();
            int confirmedPasses = registrationDAO.countConfirmedRegistrations();

            Map<String, Object> stats = new HashMap<>();
            stats.put("totalEvents", totalEvents);
            stats.put("openEvents", openEvents);
            stats.put("totalStudents", totalStudents);
            stats.put("confirmedPasses", confirmedPasses);

            String accept = request.getHeader("Accept");
            if ((accept != null && accept.contains("application/json")) || request.getParameter("json") != null || request.getHeader("X-Requested-With") != null) {
                JsonUtil.sendJson(response, HttpServletResponse.SC_OK, stats);
                return;
            }

            request.setAttribute("stats", stats);
            request.setAttribute("events", eventDAO.getAllEvents());

            if (getServletContext().getResource("/admin/dashboard.jsp") != null) {
                request.getRequestDispatcher("/admin/dashboard.jsp").forward(request, response);
            } else {
                response.sendRedirect(request.getContextPath() + "/admin.html");
            }
        } catch (SQLException e) {
            e.printStackTrace();
            throw new ServletException("Failed to load admin metrics", e);
        }
    }
}
