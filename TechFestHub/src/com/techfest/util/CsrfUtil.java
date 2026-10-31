package com.techfest.util;

import java.security.SecureRandom;
import java.util.Base64;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

public class CsrfUtil {
    private static final String CSRF_TOKEN_SESSION_ATTR = "CSRF_TOKEN";
    private static final SecureRandom RANDOM = new SecureRandom();

    private CsrfUtil() {
    }

    public static String getToken(HttpSession session) {
        if (session == null) {
            return "";
        }
        String token = (String) session.getAttribute(CSRF_TOKEN_SESSION_ATTR);
        if (token == null) {
            byte[] bytes = new byte[32];
            RANDOM.nextBytes(bytes);
            token = Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
            session.setAttribute(CSRF_TOKEN_SESSION_ATTR, token);
        }
        return token;
    }

    public static boolean isValidToken(HttpServletRequest request) {
        HttpSession session = request.getSession(false);
        if (session == null) {
            return false;
        }
        String sessionToken = (String) session.getAttribute(CSRF_TOKEN_SESSION_ATTR);
        String reqToken = request.getParameter("csrf_token");
        if (reqToken == null) {
            reqToken = request.getHeader("X-CSRF-Token");
        }
        return sessionToken != null && sessionToken.equals(reqToken);
    }
}
