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
import com.techfest.util.JsonUtil;

@WebServlet("/admin/registrations")
public class AdminRegistrationsServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;
    private final RegistrationDAO registrationDAO = new RegistrationDAO();

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        try {
            List<Registration> list = registrationDAO.getAllRegistrations();
            String accept = request.getHeader("Accept");
            if ((accept != null && accept.contains("application/json")) || request.getParameter("json") != null || request.getHeader("X-Requested-With") != null) {
                JsonUtil.sendJson(response, HttpServletResponse.SC_OK, list);
                return;
            }

            request.setAttribute("registrations", list);
            if (getServletContext().getResource("/admin/registrations.jsp") != null) {
                request.getRequestDispatcher("/admin/registrations.jsp").forward(request, response);
            } else {
                response.sendRedirect(request.getContextPath() + "/admin.html");
            }
        } catch (SQLException e) {
            e.printStackTrace();
            throw new ServletException("Failed to load registrations", e);
        }
    }
}
