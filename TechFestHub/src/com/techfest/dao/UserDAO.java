package com.techfest.dao;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

import com.techfest.config.DBConnection;
import com.techfest.model.User;

public class UserDAO {
    public boolean createUser(User user) throws SQLException {
        String sql = "INSERT INTO USERS (FULL_NAME, EMAIL, PASSWORD_HASH, ROLE, DEPARTMENT) VALUES (?, ?, ?, ?, ?)";
        try (Connection conn = DBConnection.getConnection(); PreparedStatement ps = conn.prepareStatement(sql)) {
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
        try (Connection conn = DBConnection.getConnection(); PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setString(1, email.trim());
            try (ResultSet rs = ps.executeQuery()) {
                if (!rs.next()) {
                    return null;
                }
                return mapUser(rs);
            }
        }
    }

    public User findById(long userId) throws SQLException {
        String sql = "SELECT USER_ID, FULL_NAME, EMAIL, PASSWORD_HASH, ROLE, DEPARTMENT, CREATED_AT FROM USERS WHERE USER_ID = ?";
        try (Connection conn = DBConnection.getConnection(); PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setLong(1, userId);
            try (ResultSet rs = ps.executeQuery()) {
                if (!rs.next()) {
                    return null;
                }
                return mapUser(rs);
            }
        }
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

    public int countStudents() throws SQLException {
        String sql = "SELECT COUNT(*) FROM USERS WHERE UPPER(ROLE) = 'STUDENT'";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql);
             ResultSet rs = ps.executeQuery()) {
            if (rs.next()) {
                return rs.getInt(1);
            }
            return 0;
        }
    }

    public boolean deleteUser(long userId) throws SQLException {
        String delRegs = "DELETE FROM REGISTRATIONS WHERE USER_ID = ?";
        String delUser = "DELETE FROM USERS WHERE USER_ID = ?";
        try (Connection conn = DBConnection.getConnection()) {
            conn.setAutoCommit(false);
            try {
                try (PreparedStatement ps1 = conn.prepareStatement(delRegs)) {
                    ps1.setLong(1, userId);
                    ps1.executeUpdate();
                }
                int deleted;
                try (PreparedStatement ps2 = conn.prepareStatement(delUser)) {
                    ps2.setLong(1, userId);
                    deleted = ps2.executeUpdate();
                }
                conn.commit();
                return deleted > 0;
            } catch (SQLException ex) {
                conn.rollback();
                throw ex;
            } finally {
                conn.setAutoCommit(true);
            }
        }
    }

    public boolean deleteUserByEmail(String email) throws SQLException {
        User u = findByEmail(email);
        if (u != null) {
            return deleteUser(u.getUserId());
        }
        return false;
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
