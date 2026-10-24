package com.techfest.config;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

public class DBConnection {
    static {
        try {
            Class.forName("oracle.jdbc.OracleDriver");
        } catch (ClassNotFoundException e) {
            try {
                Class.forName("oracle.jdbc.driver.OracleDriver");
            } catch (ClassNotFoundException ignored) {
            }
        }
    }

    private DBConnection() {
    }

    private static String getSetting(String key, String fallback) {
        String val = System.getenv(key);
        if (val == null || val.trim().isEmpty()) {
            val = System.getProperty(key);
        }
        if (val == null || val.trim().isEmpty()) {
            val = fallback;
        }
        return val;
    }

    public static Connection getConnection() throws SQLException {
        String url = getSetting("TECHFEST_DB_URL", "jdbc:oracle:thin:@localhost:1521:xe");
        String user = getSetting("TECHFEST_DB_USER", "techfest");
        String password = getSetting("TECHFEST_DB_PASSWORD", "techfest");

        if (url == null || user == null || password == null) {
            throw new SQLException("Database configuration is missing.");
        }
        return DriverManager.getConnection(url, user, password);
    }
}
