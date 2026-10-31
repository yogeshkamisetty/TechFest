package com.techfest.servlet;

import java.io.BufferedReader;
import java.io.IOException;
import java.sql.SQLException;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.techfest.dao.RegistrationDAO;
import com.techfest.dao.RegistrationException;
import com.techfest.model.Registration;
import com.techfest.util.JsonUtil;

@WebServlet("/event-register")
public class EventRegistrationServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;
    private final RegistrationDAO registrationDAO = new RegistrationDAO();

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        HttpSession session = request.getSession(false);
        Long userId = session != null ? (Long) session.getAttribute("userId") : null;
        if (userId == null) {
            response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Please log in to register.");
            return;
        }

        String slug = null;
        String teamName = null;
        String track = null;
        boolean isJson = false;

        String contentType = request.getContentType();
        if (contentType != null && contentType.toLowerCase().contains("application/json")) {
            isJson = true;
            try (BufferedReader reader = request.getReader()) {
                JsonObject json = JsonParser.parseReader(reader).getAsJsonObject();
                if (json.has("slug")) slug = json.get("slug").getAsString();
                if (json.has("teamName")) teamName = json.get("teamName").getAsString();
                if (json.has("track")) track = json.get("track").getAsString();
            } catch (Exception e) {
                JsonUtil.sendJson(response, HttpServletResponse.SC_BAD_REQUEST, Map.of("error", "Invalid JSON"));
                return;
            }
        } else {
            slug = request.getParameter("slug");
            teamName = request.getParameter("teamName");
            track = request.getParameter("track");
        }

        if (slug == null || slug.trim().isEmpty()) {
            if (isJson) {
                JsonUtil.sendJson(response, HttpServletResponse.SC_BAD_REQUEST, Map.of("error", "Event slug is required."));
            } else {
                response.sendRedirect(request.getContextPath() + "/events.html");
            }
            return;
        }

        try {
            Registration reg = registrationDAO.registerStudent(userId, slug.trim(), teamName, track);

            if (isJson) {
                Map<String, Object> res = new HashMap<>();
                res.put("success", true);
                res.put("registration", reg);
                JsonUtil.sendJson(response, HttpServletResponse.SC_CREATED, res);
            } else {
                response.sendRedirect(request.getContextPath() + "/my-registrations.html?registered=" + slug);
            }
        } catch (RegistrationException e) {
            if (isJson) {
                JsonUtil.sendJson(response, HttpServletResponse.SC_CONFLICT, Map.of("error", e.getMessage()));
            } else {
                request.setAttribute("error", e.getMessage());
                response.sendRedirect(request.getContextPath() + "/register.html?slug=" + slug + "&error=" + java.net.URLEncoder.encode(e.getMessage(), "UTF-8"));
            }
        } catch (SQLException e) {
            e.printStackTrace();
            if (isJson) {
                JsonUtil.sendJson(response, HttpServletResponse.SC_INTERNAL_SERVER_ERROR, Map.of("error", "Database error: " + e.getMessage()));
            } else {
                throw new ServletException("Registration failed due to database error", e);
            }
        }
    }
}
