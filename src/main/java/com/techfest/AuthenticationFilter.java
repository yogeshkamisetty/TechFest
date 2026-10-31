package com.techfest;

import java.io.IOException;
import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.annotation.WebFilter;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

/**
 * AuthenticationFilter - Intercepts restricted routes and enforces role/session checks.
 */
@WebFilter("/*")
public class AuthenticationFilter implements Filter {

    @Override
    public void init(FilterConfig filterConfig) {
    }

    @Override
    public void doFilter(ServletRequest req, ServletResponse res, FilterChain chain)
            throws IOException, ServletException {
        HttpServletRequest request = (HttpServletRequest) req;
        HttpServletResponse response = (HttpServletResponse) res;

        String uri = request.getRequestURI();
        String contextPath = request.getContextPath();
        String path = uri.substring(contextPath.length());

        // Always allow static resources
        if (path.startsWith("/css/") || path.startsWith("/js/") || path.startsWith("/assets/") ||
            path.startsWith("/images/") || path.endsWith(".svg") || path.endsWith(".css") ||
            path.endsWith(".js") || path.endsWith(".ico") || path.endsWith(".png") || path.endsWith(".jpg")) {
            chain.doFilter(req, res);
            return;
        }

        HttpSession session = request.getSession(false);
        String userRole = (session != null) ? (String) session.getAttribute("userRole") : null;
        boolean loggedIn = (userRole != null);
        boolean isAdmin = "ADMIN".equalsIgnoreCase(userRole);

        boolean isAdminRoute = path.startsWith("/admin") || path.contains("admin/");
        boolean isProtectedStudentRoute =
            path.startsWith("/my-registrations") ||
            path.startsWith("/register.jsp") ||
            path.startsWith("/event-register") ||
            path.startsWith("/register-event") ||
            path.startsWith("/user-home");

        if (isAdminRoute && !isAdmin) {
            response.sendRedirect(contextPath + "/login.html?next=" + request.getRequestURI());
            return;
        }

        if (path.startsWith("/user-home") && isAdmin) {
            response.sendRedirect(contextPath + "/admin/dashboard.jsp");
            return;
        }

        if (isProtectedStudentRoute && !loggedIn) {
            response.sendRedirect(contextPath + "/login.html?next=" + request.getRequestURI());
            return;
        }

        chain.doFilter(req, res);
    }

    @Override
    public void destroy() {
    }
}
