package com.techfest.servlet;

import java.io.IOException;
import java.sql.SQLException;
import java.util.regex.Pattern;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.techfest.dao.UserDAO;
import com.techfest.model.User;
import com.techfest.util.CsrfUtil;
import com.techfest.util.PasswordUtil;

@WebServlet("/signup")
public class SignupServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;
    private static final Pattern EMAIL_PATTERN = Pattern.compile("^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+$");

    private final UserDAO userDAO = new UserDAO();

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        if (!CsrfUtil.isValid(request)) {
            response.sendError(HttpServletResponse.SC_FORBIDDEN, "Invalid CSRF token.");
            return;
        }

        String fullName = trim(request.getParameter("fullName"));
        String email = trim(request.getParameter("email"));
        String password = request.getParameter("password");
        String confirmPassword = request.getParameter("confirmPassword");
        String department = trim(request.getParameter("department"));

        String validationMessage = validateInput(fullName, email, password, confirmPassword);
        if (validationMessage != null) {
            response.sendRedirect(request.getContextPath() + "/signup.jsp?error=" + encode(validationMessage));
            return;
        }

        User user = new User();
        user.setFullName(fullName);
        user.setEmail(email.toLowerCase());
        user.setPasswordHash(PasswordUtil.hashPassword(password));
        user.setDepartment(department);
        user.setRole("STUDENT");

        try {
            userDAO.createUser(user);
            response.sendRedirect(request.getContextPath() + "/login.jsp?message=" + encode("Account created successfully."));
        } catch (SQLException ex) {
            String msg = ex.getMessage() != null && ex.getMessage().toUpperCase().contains("UNIQUE")
                    ? "Email already exists."
                    : "Unable to create account right now.";
            response.sendRedirect(request.getContextPath() + "/signup.jsp?error=" + encode(msg));
        }
    }

    private String validateInput(String fullName, String email, String password, String confirmPassword) {
        if (isBlank(fullName) || isBlank(email) || isBlank(password) || isBlank(confirmPassword)) {
            return "All required fields must be filled.";
        }
        if (fullName.length() < 3 || fullName.length() > 100) {
            return "Full name must be between 3 and 100 characters.";
        }
        if (!EMAIL_PATTERN.matcher(email).matches()) {
            return "Enter a valid email address.";
        }
        if (password.length() < 8) {
            return "Password must be at least 8 characters.";
        }
        if (!password.equals(confirmPassword)) {
            return "Passwords do not match.";
        }
        return null;
    }

    private String trim(String value) {
        return value == null ? null : value.trim();
    }

    private boolean isBlank(String value) {
        return value == null || value.trim().isEmpty();
    }

    private String encode(String value) {
        return value.replace(" ", "+");
    }
}
