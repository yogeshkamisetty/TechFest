package com.techfest.servlet;

import java.io.IOException;
import java.sql.SQLException;
import java.util.Map;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.techfest.dao.EventDAO;
import com.techfest.model.Event;
import com.techfest.util.JsonUtil;

@WebServlet("/event-details")
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
            } else if (idStr != null) {
                event = eventDAO.getEventById(Long.parseLong(idStr.trim()));
            }

            if (event == null) {
                response.sendRedirect(request.getContextPath() + "/events.html");
                return;
            }

            String accept = request.getHeader("Accept");
            if (accept != null && accept.contains("application/json")) {
                JsonUtil.sendJson(response, HttpServletResponse.SC_OK, event);
                return;
            }

            request.setAttribute("event", event);
            if (getServletContext().getResource("/event-details.jsp") != null) {
                request.getRequestDispatcher("/event-details.jsp").forward(request, response);
            } else {
                response.sendRedirect(request.getContextPath() + "/event-details.html?slug=" + event.getSlug());
            }
        } catch (SQLException | NumberFormatException e) {
            e.printStackTrace();
            response.sendRedirect(request.getContextPath() + "/events.html");
        }
    }
}
