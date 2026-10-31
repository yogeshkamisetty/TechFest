package com.techfest;

import java.io.IOException;
import java.sql.SQLException;
import java.util.List;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * EventServlet - Retrieves All Events from Oracle DB and Forwards to events.jsp.
 */
@WebServlet({"/events", "/EventServlet", "/event-list"})
public class EventServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;
    private final EventDAO eventDAO = new EventDAO();

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        try {
            List<Event> events = eventDAO.getAllEvents();
            request.setAttribute("events", events);
            request.getRequestDispatcher("/events.jsp").forward(request, response);
        } catch (SQLException e) {
            e.printStackTrace();
            throw new ServletException("Failed to fetch events from Oracle DB", e);
        }
    }
}
