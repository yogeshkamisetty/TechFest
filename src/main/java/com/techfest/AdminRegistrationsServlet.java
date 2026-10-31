package com.techfest;

import java.io.IOException;
import java.sql.SQLException;
import java.util.List;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

/**
 * AdminRegistrationsServlet - Fetches all participant registrations and forwards to registrations.jsp.
 */
@WebServlet({"/admin/registrations", "/AdminRegistrationsServlet"})
public class AdminRegistrationsServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;
    private final RegistrationDAO registrationDAO = new RegistrationDAO();

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        HttpSession session = request.getSession(false);
        String role = (session != null) ? (String) session.getAttribute("userRole") : null;
        if (!"ADMIN".equalsIgnoreCase(role)) {
            response.sendRedirect(request.getContextPath() + "/login.html");
            return;
        }

        try {
            List<Registration> list = registrationDAO.getAllRegistrations();
            request.setAttribute("registrations", list);
            request.getRequestDispatcher("/admin/registrations.jsp").forward(request, response);
        } catch (SQLException e) {
            e.printStackTrace();
            throw new ServletException("Failed to load registrations", e);
        }
    }
}
