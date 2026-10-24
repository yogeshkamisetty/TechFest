package com.techfest.servlet;

import java.io.IOException;
import java.sql.SQLException;
import java.util.List;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import com.techfest.dao.RegistrationDAO;
import com.techfest.model.Registration;

@WebServlet("/my-registrations")
public class MyRegistrationsServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;

    private final RegistrationDAO registrationDAO = new RegistrationDAO();

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        HttpSession session = request.getSession(false);
        if (session == null || session.getAttribute("userId") == null) {
            response.sendRedirect(request.getContextPath() + "/login.jsp?message=Please+log+in");
            return;
        }

        try {
            long userId = ((Number) session.getAttribute("userId")).longValue();
            List<Registration> registrations = registrationDAO.getRegistrationsByUserId(userId);
            request.setAttribute("registrations", registrations);
            request.getRequestDispatcher("/my-registrations.jsp").forward(request, response);
        } catch (SQLException ex) {
            throw new ServletException("Could not load registrations", ex);
        }
    }
}
