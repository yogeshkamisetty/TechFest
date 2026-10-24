package com.techfest.util;

import java.security.SecureRandom;
import java.util.Base64;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

public class CsrfUtil {
    public static final String CSRF_SESSION_KEY = "csrfToken";

    private CsrfUtil() {
    }

    public static String ensureToken(HttpSession session) {
        Object existing = session.getAttribute(CSRF_SESSION_KEY);
        if (existing instanceof String) {
            return (String) existing;
        }

        byte[] random = new byte[24];
        new SecureRandom().nextBytes(random);
        String token = Base64.getUrlEncoder().withoutPadding().encodeToString(random);
        session.setAttribute(CSRF_SESSION_KEY, token);
        return token;
    }

    public static boolean isValid(HttpServletRequest request) {
        HttpSession session = request.getSession(false);
        if (session == null) {
            return false;
        }
        String expected = (String) session.getAttribute(CSRF_SESSION_KEY);
        String provided = request.getParameter("csrfToken");
        return expected != null && expected.equals(provided);
    }
}