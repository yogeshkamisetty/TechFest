package com.techfest;

import java.io.IOException;
import java.net.URLEncoder;
import java.sql.SQLException;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

/**
 * RegistrationServlet - Handles Student Event Registrations and Passes.
 */
@WebServlet({"/event-register", "/register-event", "/RegistrationServlet", "/registration"})
public class RegistrationServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;
    private final RegistrationDAO registrationDAO = new RegistrationDAO();

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        String slug = request.getParameter("slug");
        if (slug != null && !slug.trim().isEmpty()) {
            response.sendRedirect(request.getContextPath() + "/register.jsp?slug=" + URLEncoder.encode(slug.trim(), "UTF-8"));
        } else {
            response.sendRedirect(request.getContextPath() + "/events.jsp");
        }
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        HttpSession session = request.getSession(false);
        Long userId = (session != null) ? (Long) session.getAttribute("userId") : null;
        String userRole = (session != null) ? (String) session.getAttribute("userRole") : null;

        String slug = request.getParameter("slug");
        String regType = request.getParameter("regType");
        String teamName = request.getParameter("teamName");
        String track = request.getParameter("track");
        if (track == null || track.trim().isEmpty()) {
            track = request.getParameter("trackSelected");
        }
        String members = request.getParameter("members");
        if (members == null || members.trim().isEmpty()) {
            String m2 = request.getParameter("member2");
            String m3 = request.getParameter("member3");
            String m4 = request.getParameter("member4");
            StringBuilder sb = new StringBuilder();
            if (m2 != null && !m2.trim().isEmpty()) sb.append(m2.trim());
            if (m3 != null && !m3.trim().isEmpty()) {
                if (sb.length() > 0) sb.append(", ");
                sb.append(m3.trim());
            }
            if (m4 != null && !m4.trim().isEmpty()) {
                if (sb.length() > 0) sb.append(", ");
                sb.append(m4.trim());
            }
            members = sb.toString();
        }

        String finalTeamName;
        if ("TEAM".equalsIgnoreCase(regType)) {
            finalTeamName = (teamName != null && !teamName.trim().isEmpty()) ? teamName.trim() : "Team Entry";
        } else {
            finalTeamName = "Solo Entry";
        }

        String finalTrack = (track != null && !track.trim().isEmpty()) ? track.trim() : "General Track";
        if (members != null && !members.trim().isEmpty()) {
            finalTrack = finalTrack + " | Members: " + members.trim();
        }
        if (finalTrack.length() > 145) {
            finalTrack = finalTrack.substring(0, 145);
        }

        String paymentStatus = request.getParameter("paymentStatus");
        String paymentReference = request.getParameter("paymentReference");

        if (slug == null || slug.trim().isEmpty()) {
            String eventIdStr = request.getParameter("eventId");
            if (eventIdStr != null && !eventIdStr.trim().isEmpty()) {
                try {
                    Event ev = new EventDAO().getEventById(Long.parseLong(eventIdStr.trim()));
                    if (ev != null) {
                        slug = ev.getSlug();
                    }
                } catch (Exception ignored) {}
            }
        }

        if (slug == null || slug.trim().isEmpty()) {
            response.sendRedirect(request.getContextPath() + "/events.jsp");
            return;
        }

        // 1. Authentication check
        if (userId == null) {
            response.sendRedirect(request.getContextPath() + "/login.html?next=" +
                URLEncoder.encode(request.getContextPath() + "/register.jsp?slug=" + slug.trim(), "UTF-8"));
            return;
        }

        // 2. Role check: Admin accounts cannot register as participants
        if ("ADMIN".equalsIgnoreCase(userRole)) {
            response.sendRedirect(request.getContextPath() + "/register.jsp?slug=" + slug.trim() +
                "&error=" + URLEncoder.encode("Administrators cannot register for events as participants.", "UTF-8"));
            return;
        }

        // 3. Payment simulation check for paid events
        Event ev = null;
        try {
            ev = new EventDAO().getEventBySlug(slug.trim());
        } catch (Exception ignored) {}

        double feeNum = (ev != null && ev.getRegistrationFee() != null) ? ev.getRegistrationFee().doubleValue() : 0.0;
        if (feeNum > 0.0) {
            if (paymentStatus == null || !"SUCCESS".equalsIgnoreCase(paymentStatus.trim())) {
                response.sendRedirect(request.getContextPath() + "/payment.jsp?slug=" + URLEncoder.encode(slug.trim(), "UTF-8") +
                    "&regType=" + URLEncoder.encode(regType != null ? regType : "INDIVIDUAL", "UTF-8") +
                    "&teamName=" + URLEncoder.encode(finalTeamName, "UTF-8") +
                    "&track=" + URLEncoder.encode(track != null ? track : "General Track", "UTF-8") +
                    "&members=" + URLEncoder.encode(members != null ? members : "", "UTF-8"));
                return;
            }
        } else {
            if (paymentStatus == null || paymentStatus.trim().isEmpty()) {
                paymentStatus = "FREE";
                paymentReference = "FREE-PASS";
            }
        }

        try {
            registrationDAO.registerStudent(userId, slug.trim(), finalTeamName, finalTrack, paymentStatus, paymentReference);
            response.sendRedirect(request.getContextPath() + "/my-registrations.jsp?registered=" + URLEncoder.encode(slug.trim(), "UTF-8"));
        } catch (RegistrationException e) {
            response.sendRedirect(request.getContextPath() + "/register.jsp?slug=" + slug.trim() +
                "&error=" + URLEncoder.encode(e.getMessage(), "UTF-8"));
        } catch (SQLException e) {
            e.printStackTrace();
            response.sendRedirect(request.getContextPath() + "/register.jsp?slug=" + slug.trim() +
                "&error=" + URLEncoder.encode("Database error: " + e.getMessage(), "UTF-8"));
        }
    }
}
