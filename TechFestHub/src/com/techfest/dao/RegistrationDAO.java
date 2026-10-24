package com.techfest.dao;

import java.util.Map;
import java.util.HashMap;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;

import com.techfest.config.DBConnection;
import com.techfest.model.Registration;

public class RegistrationDAO {
    public void registerStudent(long userId, long eventId) throws SQLException, RegistrationException {
        String lockAndReadEvent = "SELECT STATUS, MAX_PARTICIPANTS, REGISTRATION_DEADLINE FROM EVENTS WHERE EVENT_ID = ? FOR UPDATE";
        String readCurrentCount = "SELECT COUNT(*) AS TOTAL FROM REGISTRATIONS WHERE EVENT_ID = ? AND STATUS = 'CONFIRMED'";
        String readExisting = "SELECT STATUS FROM REGISTRATIONS WHERE USER_ID = ? AND EVENT_ID = ?";
        String insertRegistration = "INSERT INTO REGISTRATIONS (USER_ID, EVENT_ID, STATUS) VALUES (?, ?, 'CONFIRMED')";

        try (Connection conn = DBConnection.getConnection()) {
            conn.setAutoCommit(false);
            try {
                String eventStatus;
                Integer maxParticipants;
                Timestamp deadline;

                try (PreparedStatement ps = conn.prepareStatement(lockAndReadEvent)) {
                    ps.setLong(1, eventId);
                    try (ResultSet rs = ps.executeQuery()) {
                        if (!rs.next()) {
                            throw new RegistrationException("Event not found.");
                        }
                        eventStatus = rs.getString("STATUS");
                        int cap = rs.getInt("MAX_PARTICIPANTS");
                        maxParticipants = rs.wasNull() ? null : cap;
                        deadline = rs.getTimestamp("REGISTRATION_DEADLINE");
                    }
                }

                if (!"OPEN".equalsIgnoreCase(eventStatus)) {
                    throw new RegistrationException("This event is not open for registration.");
                }

                if (deadline != null && deadline.before(new Timestamp(System.currentTimeMillis()))) {
                    throw new RegistrationException("Registration deadline has passed.");
                }

                try (PreparedStatement ps = conn.prepareStatement(readExisting)) {
                    ps.setLong(1, userId);
                    ps.setLong(2, eventId);
                    try (ResultSet rs = ps.executeQuery()) {
                        if (rs.next()) {
                            throw new RegistrationException("You are already registered for this event.");
                        }
                    }
                }

                if (maxParticipants != null) {
                    int current;
                    try (PreparedStatement ps = conn.prepareStatement(readCurrentCount)) {
                        ps.setLong(1, eventId);
                        try (ResultSet rs = ps.executeQuery()) {
                            rs.next();
                            current = rs.getInt("TOTAL");
                        }
                    }
                    if (current >= maxParticipants) {
                        throw new RegistrationException("This event has reached maximum capacity.");
                    }
                }

                try (PreparedStatement ps = conn.prepareStatement(insertRegistration)) {
                    ps.setLong(1, userId);
                    ps.setLong(2, eventId);
                    ps.executeUpdate();
                }

                conn.commit();
            } catch (RegistrationException | SQLException ex) {
                conn.rollback();
                throw ex;
            } finally {
                conn.setAutoCommit(true);
            }
        }
    }

    public List<Registration> getRegistrationsByUserId(long userId) throws SQLException {
        String sql = "SELECT r.REGISTRATION_ID, r.USER_ID, r.EVENT_ID, r.REGISTERED_AT, r.STATUS, e.EVENT_NAME FROM REGISTRATIONS r JOIN EVENTS e ON e.EVENT_ID = r.EVENT_ID WHERE r.USER_ID = ? ORDER BY r.REGISTERED_AT DESC";
        List<Registration> registrations = new ArrayList<>();

        try (Connection conn = DBConnection.getConnection(); PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setLong(1, userId);
            try (ResultSet rs = ps.executeQuery()) {
                while (rs.next()) {
                    Registration registration = mapRegistration(rs);
                    registration.setEventName(rs.getString("EVENT_NAME"));
                    registrations.add(registration);
                }
            }
        }
        return registrations;
    }

    public List<Registration> getAllRegistrations() throws SQLException {
        String sql = "SELECT r.REGISTRATION_ID, r.USER_ID, r.EVENT_ID, r.REGISTERED_AT, r.STATUS, u.FULL_NAME, u.EMAIL, e.EVENT_NAME FROM REGISTRATIONS r JOIN USERS u ON u.USER_ID = r.USER_ID JOIN EVENTS e ON e.EVENT_ID = r.EVENT_ID ORDER BY r.REGISTERED_AT DESC";
        List<Registration> registrations = new ArrayList<>();

        try (Connection conn = DBConnection.getConnection();
                PreparedStatement ps = conn.prepareStatement(sql);
                ResultSet rs = ps.executeQuery()) {
            while (rs.next()) {
                Registration registration = mapRegistration(rs);
                registration.setUserName(rs.getString("FULL_NAME"));
                registration.setUserEmail(rs.getString("EMAIL"));
                registration.setEventName(rs.getString("EVENT_NAME"));
                registrations.add(registration);
            }
        }

        return registrations;
    }

    public Map<Long, Integer> getRegistrationCountsByEvent() throws SQLException {
        String sql = "SELECT EVENT_ID, COUNT(*) AS TOTAL FROM REGISTRATIONS WHERE STATUS = 'CONFIRMED' GROUP BY EVENT_ID";
        Map<Long, Integer> counts = new HashMap<>();
        try (Connection conn = DBConnection.getConnection();
                PreparedStatement ps = conn.prepareStatement(sql);
                ResultSet rs = ps.executeQuery()) {
            while (rs.next()) {
                counts.put(rs.getLong("EVENT_ID"), rs.getInt("TOTAL"));
            }
        }
        return counts;
    }

    private Registration mapRegistration(ResultSet rs) throws SQLException {
        Registration registration = new Registration();
        registration.setRegistrationId(rs.getLong("REGISTRATION_ID"));
        registration.setUserId(rs.getLong("USER_ID"));
        registration.setEventId(rs.getLong("EVENT_ID"));
        registration.setRegisteredAt(rs.getTimestamp("REGISTERED_AT"));
        registration.setStatus(rs.getString("STATUS"));
        return registration;
    }
}
