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
 * SignupServlet - Handles Student Registration and Account Creation.
 */
@WebServlet({"/signup", "/SignupServlet"})
public class SignupServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;
    private final UserDAO userDAO = new UserDAO();

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        response.sendRedirect(request.getContextPath() + "/signup.html");
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        String name = request.getParameter("name");
        String email = request.getParameter("email");
        String password = request.getParameter("password");
        String department = request.getParameter("department");

        if (name == null || name.trim().isEmpty() ||
            email == null || email.trim().isEmpty() ||
            password == null || password.trim().isEmpty()) {
            response.sendRedirect(request.getContextPath() + "/signup.html?error=" +
                URLEncoder.encode("All fields are required.", "UTF-8"));
            return;
        }

        try {
            User existing = userDAO.findByEmail(email.trim().toLowerCase());
            if (existing != null) {
                response.sendRedirect(request.getContextPath() + "/signup.html?error=" +
                    URLEncoder.encode("User already exists. Please login instead.", "UTF-8") + "&exists=1");
                return;
            }

            User user = new User();
            user.setFullName(name.trim());
            user.setEmail(email.trim().toLowerCase());
            user.setPasswordHash(PasswordUtil.hashPassword(password.trim()));
            user.setDepartment(department == null || department.trim().isEmpty() ? "General" : department.trim());
            user.setRole("STUDENT");

            userDAO.createUser(user);
            User created = userDAO.findByEmail(email.trim());

            HttpSession session = request.getSession(true);
            session.setAttribute("userId", created.getUserId());
            session.setAttribute("userName", created.getFullName());
            session.setAttribute("userEmail", created.getEmail());
            session.setAttribute("userRole", created.getRole().toUpperCase());
            session.setAttribute("userDept", created.getDepartment());
            session.setAttribute("user", created);

            response.sendRedirect(request.getContextPath() + "/user-home.jsp?welcome=1");
        } catch (SQLException e) {
            e.printStackTrace();
            response.sendRedirect(request.getContextPath() + "/signup.html?error=" +
                URLEncoder.encode("Database error: " + e.getMessage(), "UTF-8"));
        }
    }
}
