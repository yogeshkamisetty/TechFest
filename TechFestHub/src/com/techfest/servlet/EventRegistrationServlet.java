package com.techfest.servlet;

import java.io.IOException;
import java.sql.SQLException;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import com.techfest.dao.RegistrationDAO;
import com.techfest.dao.RegistrationException;
import com.techfest.util.CsrfUtil;

@WebServlet("/event-register")
public class EventRegistrationServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;

    private final RegistrationDAO registrationDAO = new RegistrationDAO();

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        if (!CsrfUtil.isValid(request)) {
            response.sendError(HttpServletResponse.SC_FORBIDDEN, "Invalid CSRF token.");
            return;
        }

        HttpSession session = request.getSession(false);
        if (session == null || session.getAttribute("userId") == null) {
            response.sendRedirect(request.getContextPath() + "/login.jsp?message=Please+log+in");
            return;
        }

        String eventIdParam = request.getParameter("eventId");
        if (eventIdParam == null) {
            response.sendError(HttpServletResponse.SC_BAD_REQUEST, "eventId is required.");
            return;
        }

        try {
            long userId = ((Number) session.getAttribute("userId")).longValue();
            long eventId = Long.parseLong(eventIdParam);

            registrationDAO.registerStudent(userId, eventId);
            response.sendRedirect(request.getContextPath() + "/my-registrations?message=Registration+successful");
        } catch (RegistrationException ex) {
            response.sendRedirect(
                    request.getContextPath() + "/event-details?eventId=" + eventIdParam + "&message=" + encode(ex.getMessage()));
        } catch (NumberFormatException ex) {
            response.sendError(HttpServletResponse.SC_BAD_REQUEST, "Invalid event id.");
        } catch (SQLException ex) {
            throw new ServletException("Registration failed", ex);
        }
    }

    private String encode(String value) {
        return value == null ? "" : value.replace(" ", "+");
    }
}
