package com.techfest.servlet;

import java.io.IOException;
import java.sql.SQLException;
import java.util.List;
import java.util.Map;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.techfest.dao.EventDAO;
import com.techfest.dao.RegistrationDAO;
import com.techfest.model.Event;

@WebServlet("/admin/dashboard")
public class AdminDashboardServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;

    private final EventDAO eventDAO = new EventDAO();
    private final RegistrationDAO registrationDAO = new RegistrationDAO();

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        try {
            List<Event> events = eventDAO.getAllEvents();
            Map<Long, Integer> registrationCounts = registrationDAO.getRegistrationCountsByEvent();

            int totalEvents = events.size();
            int openEvents = 0;
            int totalRegistrations = 0;

            for (Event event : events) {
                if ("OPEN".equalsIgnoreCase(event.getStatus())) {
                    openEvents++;
                }
                totalRegistrations += registrationCounts.getOrDefault(event.getEventId(), 0);
            }

            request.setAttribute("events", events);
            request.setAttribute("registrationCounts", registrationCounts);
            request.setAttribute("totalEvents", totalEvents);
            request.setAttribute("openEvents", openEvents);
            request.setAttribute("totalRegistrations", totalRegistrations);
            request.getRequestDispatcher("/admin/dashboard.jsp").forward(request, response);
        } catch (SQLException ex) {
            throw new ServletException("Could not load admin dashboard", ex);
        }
    }
}
