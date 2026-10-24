package com.techfest.servlet;

import java.io.IOException;
import java.math.BigDecimal;
import java.sql.SQLException;
import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.time.format.DateTimeParseException;
import java.util.List;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.techfest.dao.EventDAO;
import com.techfest.model.Event;
import com.techfest.util.CsrfUtil;

@WebServlet({ "/admin/event/create", "/admin/event/update", "/admin/event/delete", "/admin/manage-events" })
public class AdminEventServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;

    private final EventDAO eventDAO = new EventDAO();

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        String path = request.getServletPath();
        if ("/admin/manage-events".equals(path)) {
            try {
                List<Event> events = eventDAO.getAllEvents();
                request.setAttribute("events", events);
                request.getRequestDispatcher("/admin/manage-events.jsp").forward(request, response);
            } catch (SQLException ex) {
                throw new ServletException("Could not load manage events page", ex);
            }
            return;
        }

        response.sendError(HttpServletResponse.SC_METHOD_NOT_ALLOWED);
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        if (!CsrfUtil.isValid(request)) {
            response.sendError(HttpServletResponse.SC_FORBIDDEN, "Invalid CSRF token.");
            return;
        }

        String path = request.getServletPath();

        try {
            if ("/admin/event/create".equals(path)) {
                Event event = parseEventFromRequest(request, false);
                eventDAO.createEvent(event);
                response.sendRedirect(request.getContextPath() + "/admin/manage-events?message=Event+created");
                return;
            }

            if ("/admin/event/update".equals(path)) {
                Event event = parseEventFromRequest(request, true);
                eventDAO.updateEvent(event);
                response.sendRedirect(request.getContextPath() + "/admin/manage-events?message=Event+updated");
                return;
            }

            if ("/admin/event/delete".equals(path)) {
                long eventId = Long.parseLong(request.getParameter("eventId"));
                eventDAO.deleteEvent(eventId);
                response.sendRedirect(request.getContextPath() + "/admin/manage-events?message=Event+closed");
                return;
            }

            response.sendError(HttpServletResponse.SC_NOT_FOUND);
        } catch (IllegalArgumentException ex) {
            response.sendRedirect(request.getContextPath() + "/admin/manage-events?message=" + encode(ex.getMessage()));
        } catch (SQLException ex) {
            throw new ServletException("Admin event action failed", ex);
        }
    }

    private Event parseEventFromRequest(HttpServletRequest request, boolean includeId) {
        Event event = new Event();

        if (includeId) {
            event.setEventId(parseLong(request.getParameter("eventId"), "eventId is required."));
        }

        event.setEventName(require(request.getParameter("eventName"), "eventName is required."));
        event.setCategory(require(request.getParameter("category"), "category is required."));
        event.setDescription(blankToNull(request.getParameter("description")));
        event.setEventDate(parseTimestamp(request.getParameter("eventDate"), "eventDate is invalid."));
        event.setVenue(require(request.getParameter("venue"), "venue is required."));
        event.setRegistrationFee(parseBigDecimal(request.getParameter("registrationFee"), "registrationFee is invalid."));
        event.setMaxParticipants(parseIntegerOrNull(request.getParameter("maxParticipants"), "maxParticipants is invalid."));
        event.setRegistrationDeadline(
                parseTimestampOrNull(request.getParameter("registrationDeadline"), "registrationDeadline is invalid."));
        event.setStatus(require(request.getParameter("status"), "status is required.").toUpperCase());

        if (event.getRegistrationFee().compareTo(BigDecimal.ZERO) < 0) {
            throw new IllegalArgumentException("registrationFee cannot be negative.");
        }
        if (event.getMaxParticipants() != null && event.getMaxParticipants() <= 0) {
            throw new IllegalArgumentException("maxParticipants must be greater than zero.");
        }
        if (event.getRegistrationDeadline() != null && event.getRegistrationDeadline().after(event.getEventDate())) {
            throw new IllegalArgumentException("registrationDeadline must be before eventDate.");
        }

        return event;
    }

    private String require(String value, String message) {
        if (value == null || value.trim().isEmpty()) {
            throw new IllegalArgumentException(message);
        }
        return value.trim();
    }

    private String blankToNull(String value) {
        if (value == null || value.trim().isEmpty()) {
            return null;
        }
        return value.trim();
    }

    private long parseLong(String value, String message) {
        try {
            return Long.parseLong(require(value, message));
        } catch (NumberFormatException ex) {
            throw new IllegalArgumentException(message);
        }
    }

    private BigDecimal parseBigDecimal(String value, String message) {
        try {
            return new BigDecimal(require(value, message));
        } catch (NumberFormatException ex) {
            throw new IllegalArgumentException(message);
        }
    }

    private Integer parseIntegerOrNull(String value, String message) {
        if (value == null || value.trim().isEmpty()) {
            return null;
        }
        try {
            return Integer.valueOf(value.trim());
        } catch (NumberFormatException ex) {
            throw new IllegalArgumentException(message);
        }
    }

    private Timestamp parseTimestamp(String value, String message) {
        String required = require(value, message);
        try {
            return Timestamp.valueOf(LocalDateTime.parse(required));
        } catch (DateTimeParseException ex) {
            throw new IllegalArgumentException(message);
        }
    }

    private Timestamp parseTimestampOrNull(String value, String message) {
        if (value == null || value.trim().isEmpty()) {
            return null;
        }
        try {
            return Timestamp.valueOf(LocalDateTime.parse(value.trim()));
        } catch (DateTimeParseException ex) {
            throw new IllegalArgumentException(message);
        }
    }

    private String encode(String value) {
        return value == null ? "" : value.replace(" ", "+");
    }
}
