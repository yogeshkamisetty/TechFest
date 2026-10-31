package com.techfest.servlet;

import java.io.IOException;
import java.sql.SQLException;
import java.util.List;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.techfest.dao.EventDAO;
import com.techfest.model.Event;
import com.techfest.util.JsonUtil;

@WebServlet("/events")
public class EventListServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;
    private final EventDAO eventDAO = new EventDAO();

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        try {
            List<Event> events = eventDAO.getAllEvents();

            String accept = request.getHeader("Accept");
            if (accept != null && accept.contains("application/json")) {
                JsonUtil.sendJson(response, HttpServletResponse.SC_OK, events);
                return;
            }

            request.setAttribute("events", events);
            if (getServletContext().getResource("/events.jsp") != null) {
                request.getRequestDispatcher("/events.jsp").forward(request, response);
            } else {
                response.sendRedirect(request.getContextPath() + "/events.html");
            }
        } catch (SQLException e) {
            e.printStackTrace();
            throw new ServletException("Failed to fetch events from Oracle DB", e);
        }
    }
}
