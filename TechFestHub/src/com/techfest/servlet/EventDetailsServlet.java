package com.techfest.servlet;

import java.io.IOException;
import java.sql.SQLException;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.techfest.dao.EventDAO;
import com.techfest.model.Event;

@WebServlet("/event-details")
public class EventDetailsServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;

    private final EventDAO eventDAO = new EventDAO();

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        String eventIdParam = request.getParameter("eventId");
        if (eventIdParam == null) {
            response.sendRedirect(request.getContextPath() + "/events");
            return;
        }

        try {
            long eventId = Long.parseLong(eventIdParam);
            Event event = eventDAO.getEventById(eventId);
            if (event == null) {
                response.sendError(HttpServletResponse.SC_NOT_FOUND, "Event not found.");
                return;
            }
            request.setAttribute("event", event);
            request.getRequestDispatcher("/event-details.jsp").forward(request, response);
        } catch (NumberFormatException ex) {
            response.sendError(HttpServletResponse.SC_BAD_REQUEST, "Invalid event id.");
        } catch (SQLException ex) {
            throw new ServletException("Failed to load event", ex);
        }
    }
}
