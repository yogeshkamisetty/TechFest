package com.techfest;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

/**
 * UserDAO - JDBC Data Access Object for USERS table.
 */
public class UserDAO {

    public boolean createUser(User user) throws SQLException {
        String sql = "INSERT INTO USERS (FULL_NAME, EMAIL, PASSWORD_HASH, ROLE, DEPARTMENT) VALUES (?, ?, ?, ?, ?)";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setString(1, user.getFullName());
            ps.setString(2, user.getEmail().trim().toLowerCase());
            ps.setString(3, user.getPasswordHash());
            ps.setString(4, user.getRole() == null ? "STUDENT" : user.getRole().toUpperCase());
            ps.setString(5, user.getDepartment());
            return ps.executeUpdate() == 1;
        }
    }

    public User findByEmail(String email) throws SQLException {
        if (email == null) return null;
        String sql = "SELECT USER_ID, FULL_NAME, EMAIL, PASSWORD_HASH, ROLE, DEPARTMENT, CREATED_AT FROM USERS WHERE LOWER(EMAIL) = LOWER(?)";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setString(1, email.trim());
            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) {
                    return mapUser(rs);
                }
                return null;
            }
        }
    }

    public User findById(long userId) throws SQLException {
        String sql = "SELECT USER_ID, FULL_NAME, EMAIL, PASSWORD_HASH, ROLE, DEPARTMENT, CREATED_AT FROM USERS WHERE USER_ID = ?";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setLong(1, userId);
            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) {
                    return mapUser(rs);
                }
                return null;
            }
        }
    }

    public List<User> getAllUsers() throws SQLException {
        String sql = "SELECT USER_ID, FULL_NAME, EMAIL, PASSWORD_HASH, ROLE, DEPARTMENT, CREATED_AT FROM USERS ORDER BY USER_ID ASC";
        List<User> list = new ArrayList<>();
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql);
             ResultSet rs = ps.executeQuery()) {
            while (rs.next()) {
                list.add(mapUser(rs));
            }
        }
        return list;
    }

    public List<User> getAllStudents() throws SQLException {
        String sql = "SELECT USER_ID, FULL_NAME, EMAIL, PASSWORD_HASH, ROLE, DEPARTMENT, CREATED_AT FROM USERS WHERE UPPER(ROLE) = 'STUDENT' ORDER BY CREATED_AT DESC";
        List<User> list = new ArrayList<>();
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql);
             ResultSet rs = ps.executeQuery()) {
            while (rs.next()) {
                list.add(mapUser(rs));
            }
        }
        return list;
    }

    public int countTotalUsers() throws SQLException {
        String sql = "SELECT COUNT(*) FROM USERS";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql);
             ResultSet rs = ps.executeQuery()) {
            return rs.next() ? rs.getInt(1) : 0;
        }
    }

    public int countStudents() throws SQLException {
        String sql = "SELECT COUNT(*) FROM USERS WHERE UPPER(ROLE) = 'STUDENT'";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql);
             ResultSet rs = ps.executeQuery()) {
            return rs.next() ? rs.getInt(1) : 0;
        }
    }

    private User mapUser(ResultSet rs) throws SQLException {
        User user = new User();
        user.setUserId(rs.getLong("USER_ID"));
        user.setFullName(rs.getString("FULL_NAME"));
        user.setEmail(rs.getString("EMAIL"));
        user.setPasswordHash(rs.getString("PASSWORD_HASH"));
        user.setRole(rs.getString("ROLE"));
        user.setDepartment(rs.getString("DEPARTMENT"));
        user.setCreatedAt(rs.getTimestamp("CREATED_AT"));
        return user;
    }
}
