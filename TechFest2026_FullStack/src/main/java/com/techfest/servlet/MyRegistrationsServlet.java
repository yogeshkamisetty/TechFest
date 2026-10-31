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
import com.techfest.util.JsonUtil;

@WebServlet("/my-registrations")
public class MyRegistrationsServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;
    private final RegistrationDAO registrationDAO = new RegistrationDAO();

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        HttpSession session = request.getSession(false);
        Long userId = session != null ? (Long) session.getAttribute("userId") : null;
        if (userId == null) {
            response.sendRedirect(request.getContextPath() + "/login.html?next=my-registrations.html");
            return;
        }

        try {
            List<Registration> regs = registrationDAO.getRegistrationsByUserId(userId);

            String accept = request.getHeader("Accept");
            if (accept != null && accept.contains("application/json")) {
                JsonUtil.sendJson(response, HttpServletResponse.SC_OK, regs);
                return;
            }

            request.setAttribute("registrations", regs);
            if (getServletContext().getResource("/my-registrations.jsp") != null) {
                request.getRequestDispatcher("/my-registrations.jsp").forward(request, response);
            } else {
                response.sendRedirect(request.getContextPath() + "/my-registrations.html");
            }
        } catch (SQLException e) {
            e.printStackTrace();
            throw new ServletException("Failed to fetch registrations", e);
        }
    }
}
