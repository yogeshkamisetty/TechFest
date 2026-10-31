package com.techfest.config;

import java.sql.Connection;
import java.sql.DatabaseMetaData;
import java.sql.ResultSet;

/**
 * Diagnostic utility to verify Oracle DB Connection and Tables.
 * Aligns with B.Tech Full Stack Development Syllabus (Unit I: JDBC).
 */
public class TestConnection {
    public static void main(String[] args) {
        System.out.println("Testing TechFest2026 Oracle XE Connection...");
        try (Connection con = DBConnection.getConnection()) {
            DatabaseMetaData meta = con.getMetaData();
            System.out.println(" Connected to: " + meta.getDatabaseProductName() + " " + meta.getDatabaseProductVersion());
            System.out.println(" User: " + meta.getUserName());

            String[] tables = {"USERS", "EVENTS", "REGISTRATIONS"};
            for (String tbl : tables) {
                try (ResultSet rs = con.createStatement().executeQuery("SELECT count(*) FROM " + tbl)) {
                    if (rs.next()) {
                        System.out.println(" " + tbl + " count: " + rs.getInt(1));
                    }
                }
            }
            System.out.println("\nAll TechFest2026 database tables verified successfully!");
        } catch (Exception e) {
            System.err.println("Database connection notice: " + e.getMessage());
        }
    }
}
