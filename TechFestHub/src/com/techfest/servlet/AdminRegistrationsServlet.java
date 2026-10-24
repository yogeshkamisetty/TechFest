package com.techfest.servlet;

import java.io.IOException;
import java.sql.SQLException;
import java.util.List;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.techfest.dao.RegistrationDAO;
import com.techfest.model.Registration;

@WebServlet("/admin/registrations")
public class AdminRegistrationsServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;

    private final RegistrationDAO registrationDAO = new RegistrationDAO();

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        try {
            List<Registration> registrations = registrationDAO.getAllRegistrations();
            request.setAttribute("registrations", registrations);
            request.getRequestDispatcher("/admin/registrations.jsp").forward(request, response);
        } catch (SQLException ex) {
            throw new ServletException("Could not load registrations", ex);
        }
    }
}