package com.techfest.config;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

/**
 * Database Connection Manager for Oracle Database.
 * Aligned with B.Tech Full Stack Development Syllabus (Unit I: JDBC).
 */
public class DBConnection {

    private static final String URL = "jdbc:oracle:thin:@localhost:1521:xe";
    private static final String USER = "system";
    private static final String PASS = "25342534";

    static {
        try {
            // Creation of object for DriverClass and registering Driver
            oracle.jdbc.driver.OracleDriver driver = new oracle.jdbc.driver.OracleDriver();
            DriverManager.registerDriver(driver);
            System.out.println("Oracle JDBC Driver Registered Successfully");
        } catch (Exception e) {
            System.err.println("Driver Registration Failed: " + e.getMessage());
        }
    }

    private DBConnection() {
    }

    /**
     * Establishes and returns connection to Oracle Database
     */
    public static Connection getConnection() throws SQLException {
        return DriverManager.getConnection(URL, USER, PASS);
    }
}
