package com.techfest;

import java.io.IOException;
import java.math.BigDecimal;
import java.sql.SQLException;
import java.sql.Timestamp;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

/**
 * AdminEventServlet - Handles Event creation, updates, and status toggles for Admin.
 */
@WebServlet({"/admin/event/save", "/admin/event/status", "/event/status", "/AdminEventServlet"})
public class AdminEventServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;
    private final EventDAO eventDAO = new EventDAO();

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        doPost(request, response);
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        HttpSession session = request.getSession(false);
        String role = (session != null) ? (String) session.getAttribute("userRole") : null;
        if (!"ADMIN".equalsIgnoreCase(role)) {
            response.sendRedirect(request.getContextPath() + "/login.html");
            return;
        }

        String path = request.getServletPath();

        if (path != null && path.contains("/status")) {
            handleStatusChange(request, response);
        } else {
            handleSaveEvent(request, response);
        }
    }

    private void handleStatusChange(HttpServletRequest request, HttpServletResponse response)
            throws IOException {
        String slug = request.getParameter("slug");
        String idStr = request.getParameter("id");
        String status = request.getParameter("status");
        String action = request.getParameter("action");

        if (status == null && action != null) {
            if ("close".equalsIgnoreCase(action)) {
                status = "CLOSED";
            } else if ("open".equalsIgnoreCase(action)) {
                status = "OPEN";
            }
        }

        if (status != null && !status.trim().isEmpty()) {
            String newStatus = status.trim().toUpperCase();
            try {
                if (idStr != null && !idStr.trim().isEmpty()) {
                    long eventId = Long.parseLong(idStr.trim());
                    eventDAO.setStatusById(eventId, newStatus);
                } else if (slug != null && !slug.trim().isEmpty()) {
                    eventDAO.setStatus(slug.trim(), newStatus);
                }
            } catch (Exception e) {
                e.printStackTrace();
            }
        }

        String redirect = request.getParameter("redirect");
        if (redirect != null && !redirect.trim().isEmpty()) {
            String cp = request.getContextPath();
            if (redirect.startsWith(cp)) {
                response.sendRedirect(redirect);
            } else if (redirect.startsWith("/")) {
                response.sendRedirect(cp + redirect);
            } else {
                response.sendRedirect(cp + "/admin/" + redirect);
            }
        } else {
            response.sendRedirect(request.getContextPath() + "/admin/dashboard.jsp");
        }
    }

    private void handleSaveEvent(HttpServletRequest request, HttpServletResponse response)
            throws IOException {
        try {
            String slug = request.getParameter("slug");
            String name = request.getParameter("eventName");
            String category = request.getParameter("category");
            String venue = request.getParameter("venue");
            String feeStr = request.getParameter("fee");
            String status = request.getParameter("status");
            String capacityStr = request.getParameter("capacity");
            String desc = request.getParameter("description");

            if (slug == null || slug.trim().isEmpty() || name == null || name.trim().isEmpty()) {
                response.sendRedirect(request.getContextPath() + "/admin/dashboard.jsp?error=Missing+event+name+or+slug");
                return;
            }

            Event existing = eventDAO.getEventBySlug(slug.trim());
            Event e = (existing != null) ? existing : new Event();
            e.setSlug(slug.trim());
            e.setEventName(name.trim());
            e.setCategory(category != null ? category.trim() : "General");
            e.setVenue(venue != null ? venue.trim() : "Campus");
            e.setDescription(desc != null ? desc.trim() : "");

            BigDecimal fee = BigDecimal.ZERO;
            if (feeStr != null && !feeStr.trim().isEmpty()) {
                try {
                    fee = new BigDecimal(feeStr.replaceAll("[^0-9.]", ""));
                } catch (Exception ignored) {
                }
            }
            e.setRegistrationFee(fee);

            int capacity = 100;
            if (capacityStr != null && !capacityStr.trim().isEmpty()) {
                try {
                    capacity = Integer.parseInt(capacityStr.trim());
                } catch (Exception ignored) {
                }
            }
            e.setMaxParticipants(capacity);
            e.setStatus(status != null && !status.trim().isEmpty() ? status.trim() : "OPEN");

            if (existing != null) {
                eventDAO.updateEvent(e);
            } else {
                e.setEventDate(new Timestamp(System.currentTimeMillis() + 86400000L * 14));
                e.setCardDate("Nov 2026");
                eventDAO.createEvent(e);
            }

            response.sendRedirect(request.getContextPath() + "/admin/dashboard.jsp?success=Event+saved");
        } catch (Exception e) {
            e.printStackTrace();
            response.sendRedirect(request.getContextPath() + "/admin/dashboard.jsp?error=" +
                java.net.URLEncoder.encode("Failed to save event: " + e.getMessage(), "UTF-8"));
        }
    }
}
