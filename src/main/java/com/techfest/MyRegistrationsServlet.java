package com.techfest;

import java.io.IOException;
import java.net.URLEncoder;
import java.sql.SQLException;
import java.util.List;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

/**
 * MyRegistrationsServlet - Fetches Registered Event Passes for Current Student.
 */
@WebServlet({"/my-registrations", "/MyRegistrationsServlet"})
public class MyRegistrationsServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;
    private final RegistrationDAO registrationDAO = new RegistrationDAO();

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        HttpSession session = request.getSession(false);
        Long userId = (session != null) ? (Long) session.getAttribute("userId") : null;
        if (userId == null) {
            response.sendRedirect(request.getContextPath() + "/login.html?next=" +
                URLEncoder.encode(request.getContextPath() + "/my-registrations.jsp", "UTF-8"));
            return;
        }

        try {
            List<Registration> regs = registrationDAO.getRegistrationsByUserId(userId);
            request.setAttribute("registrations", regs);
            request.getRequestDispatcher("/my-registrations.jsp").forward(request, response);
        } catch (SQLException e) {
            e.printStackTrace();
            throw new ServletException("Failed to fetch registrations", e);
        }
    }
}
