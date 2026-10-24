package com.techfest.dao;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

import com.techfest.config.DBConnection;
import com.techfest.model.User;

public class UserDAO {
    public boolean createUser(User user) throws SQLException {
        String sql = "INSERT INTO USERS (FULL_NAME, EMAIL, PASSWORD_HASH, ROLE, DEPARTMENT) VALUES (?, ?, ?, 'STUDENT', ?)";
        try (Connection conn = DBConnection.getConnection(); PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setString(1, user.getFullName());
            ps.setString(2, user.getEmail());
            ps.setString(3, user.getPasswordHash());
            ps.setString(4, user.getDepartment());
            return ps.executeUpdate() == 1;
        }
    }

    public User findByEmail(String email) throws SQLException {
        String sql = "SELECT USER_ID, FULL_NAME, EMAIL, PASSWORD_HASH, ROLE, DEPARTMENT FROM USERS WHERE EMAIL = ?";
        try (Connection conn = DBConnection.getConnection(); PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setString(1, email);
            try (ResultSet rs = ps.executeQuery()) {
                if (!rs.next()) {
                    return null;
                }

                User user = new User();
                user.setUserId(rs.getLong("USER_ID"));
                user.setFullName(rs.getString("FULL_NAME"));
                user.setEmail(rs.getString("EMAIL"));
                user.setPasswordHash(rs.getString("PASSWORD_HASH"));
                user.setRole(rs.getString("ROLE"));
                user.setDepartment(rs.getString("DEPARTMENT"));
                return user;
            }
        }
    }
}
