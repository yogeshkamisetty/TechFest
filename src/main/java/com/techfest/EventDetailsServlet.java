package com.techfest;

import java.io.IOException;
import java.sql.SQLException;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * EventDetailsServlet - Retrieves a Single Event by slug or ID and Forwards to event-details.jsp.
 */
@WebServlet({"/event-details", "/EventDetailsServlet"})
public class EventDetailsServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;
    private final EventDAO eventDAO = new EventDAO();

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        String slug = request.getParameter("slug");
        String idStr = request.getParameter("id");

        try {
            Event event = null;
            if (slug != null && !slug.trim().isEmpty()) {
                event = eventDAO.getEventBySlug(slug.trim());
            } else if (idStr != null && !idStr.trim().isEmpty()) {
                event = eventDAO.getEventById(Long.parseLong(idStr.trim()));
            }

            if (event == null) {
                response.sendRedirect(request.getContextPath() + "/events.jsp");
                return;
            }

            request.setAttribute("event", event);
            request.getRequestDispatcher("/event-details.jsp").forward(request, response);
        } catch (SQLException | NumberFormatException e) {
            e.printStackTrace();
            response.sendRedirect(request.getContextPath() + "/events.jsp");
        }
    }
}
