package com.techfest.servlet;

import java.io.BufferedReader;
import java.io.IOException;
import java.math.BigDecimal;
import java.sql.SQLException;
import java.sql.Timestamp;
import java.util.Map;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.techfest.dao.EventDAO;
import com.techfest.model.Event;
import com.techfest.util.JsonUtil;

@WebServlet({"/admin/event/save", "/admin/event/status"})
public class AdminEventServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;
    private final EventDAO eventDAO = new EventDAO();

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        String path = request.getServletPath();

        if ("/admin/event/status".equals(path)) {
            handleStatusChange(request, response);
        } else {
            handleSaveEvent(request, response);
        }
    }

    private void handleStatusChange(HttpServletRequest request, HttpServletResponse response) throws IOException {
        String slug = request.getParameter("slug");
        String status = request.getParameter("status");

        if (slug == null || status == null) {
            JsonUtil.sendJson(response, HttpServletResponse.SC_BAD_REQUEST, Map.of("error", "Slug and status are required."));
            return;
        }

        try {
            boolean ok = eventDAO.setStatus(slug, status);
            JsonUtil.sendJson(response, HttpServletResponse.SC_OK, Map.of("success", ok, "slug", slug, "status", status));
        } catch (SQLException e) {
            e.printStackTrace();
            JsonUtil.sendJson(response, HttpServletResponse.SC_INTERNAL_SERVER_ERROR, Map.of("error", e.getMessage()));
        }
    }

    private void handleSaveEvent(HttpServletRequest request, HttpServletResponse response) throws IOException {
        try {
            JsonObject json;
            try (BufferedReader reader = request.getReader()) {
                json = JsonParser.parseReader(reader).getAsJsonObject();
            }

            String slug = json.has("slug") ? json.get("slug").getAsString().trim() : null;
            String name = json.has("eventName") ? json.get("eventName").getAsString().trim() : null;
            if (name == null && json.has("title")) name = json.get("title").getAsString().trim();

            if (name == null || name.isEmpty()) {
                JsonUtil.sendJson(response, HttpServletResponse.SC_BAD_REQUEST, Map.of("error", "Event name is required."));
                return;
            }

            if (slug == null || slug.isEmpty()) {
                slug = name.toLowerCase().replaceAll("[^a-z0-9]+", "-").replaceAll("^-|-$", "");
            }

            String category = json.has("category") ? json.get("category").getAsString().trim() : "General";
            String venue = json.has("venue") ? json.get("venue").getAsString().trim() : "Campus";
            String feeStr = json.has("fee") ? json.get("fee").getAsString().replaceAll("[^0-9.]", "") : "0";
            String status = json.has("status") ? json.get("status").getAsString().trim() : "OPEN";
            int capacity = json.has("capacity") ? json.get("capacity").getAsInt() : 100;
            String description = json.has("description") ? json.get("description").getAsString().trim() : "Exciting technical festival event.";
            String cardDate = json.has("cardDate") ? json.get("cardDate").getAsString().trim() : "14 Nov";

            Event existing = eventDAO.getEventBySlug(slug);
            Event e = existing != null ? existing : new Event();
            e.setSlug(slug);
            e.setEventName(name);
            e.setCategory(category);
            e.setDescription(description);
            e.setVenue(venue);
            e.setCardDate(cardDate);
            e.setRegistrationFee(feeStr.isEmpty() ? BigDecimal.ZERO : new BigDecimal(feeStr));
            e.setMaxParticipants(capacity);
            e.setStatus(status.toUpperCase());

            if (existing != null) {
                eventDAO.updateEvent(e);
            } else {
                e.setEventDate(new Timestamp(System.currentTimeMillis() + 86400000L * 14));
                eventDAO.createEvent(e);
            }

            JsonUtil.sendJson(response, HttpServletResponse.SC_OK, Map.of("success", true, "event", e));
        } catch (Exception e) {
            e.printStackTrace();
            JsonUtil.sendJson(response, HttpServletResponse.SC_INTERNAL_SERVER_ERROR, Map.of("error", e.getMessage()));
        }
    }
}
