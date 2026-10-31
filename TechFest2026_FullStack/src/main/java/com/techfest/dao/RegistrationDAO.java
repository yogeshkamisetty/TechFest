package com.techfest.dao;

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
    public Registration registerStudent(long userId, String eventSlug, String teamName, String track)
            throws SQLException, RegistrationException {
        String lockAndReadEvent =
            "SELECT EVENT_ID, EVENT_NAME, STATUS, MAX_PARTICIPANTS, REGISTRATION_DEADLINE FROM EVENTS WHERE LOWER(SLUG) = LOWER(?) FOR UPDATE";
        String readCurrentCount =
            "SELECT COUNT(*) AS TOTAL FROM REGISTRATIONS WHERE EVENT_ID = ? AND UPPER(STATUS) = 'CONFIRMED'";
        String readExisting =
            "SELECT STATUS FROM REGISTRATIONS WHERE USER_ID = ? AND EVENT_ID = ?";
        String insertRegistration =
            "INSERT INTO REGISTRATIONS (USER_ID, EVENT_ID, TEAM_NAME, TRACK_SELECTED, STATUS) VALUES (?, ?, ?, ?, 'CONFIRMED')";
        String readInserted =
            "SELECT REGISTRATION_ID, REG_NUMBER, REGISTERED_AT, STATUS FROM REGISTRATIONS WHERE USER_ID = ? AND EVENT_ID = ?";

        try (Connection conn = DBConnection.getConnection()) {
            conn.setAutoCommit(false);
            try {
                long eventId;
                String eventName;
                String eventStatus;
                Integer maxParticipants;
                Timestamp deadline;

                try (PreparedStatement ps = conn.prepareStatement(lockAndReadEvent)) {
                    ps.setString(1, eventSlug.trim());
                    try (ResultSet rs = ps.executeQuery()) {
                        if (!rs.next()) {
                            throw new RegistrationException("Event not found: " + eventSlug);
                        }
                        eventId = rs.getLong("EVENT_ID");
                        eventName = rs.getString("EVENT_NAME");
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
                    ps.setString(3, teamName);
                    ps.setString(4, track);
                    ps.executeUpdate();
                }

                Registration reg = new Registration();
                try (PreparedStatement ps = conn.prepareStatement(readInserted)) {
                    ps.setLong(1, userId);
                    ps.setLong(2, eventId);
                    try (ResultSet rs = ps.executeQuery()) {
                        if (rs.next()) {
                            reg.setRegistrationId(rs.getLong("REGISTRATION_ID"));
                            reg.setRegNumber(rs.getString("REG_NUMBER"));
                            reg.setRegisteredAt(rs.getTimestamp("REGISTERED_AT"));
                            reg.setStatus(rs.getString("STATUS"));
                        }
                    }
                }

                conn.commit();

                reg.setUserId(userId);
                reg.setEventId(eventId);
                reg.setEventSlug(eventSlug);
                reg.setEventName(eventName);
                reg.setTeamName(teamName);
                reg.setTrackSelected(track);
                return reg;
            } catch (RegistrationException | SQLException ex) {
                conn.rollback();
                throw ex;
            } finally {
                conn.setAutoCommit(true);
            }
        }
    }

    public List<Registration> getRegistrationsByUserId(long userId) throws SQLException {
        String sql =
            "SELECT r.REGISTRATION_ID, r.REG_NUMBER, r.USER_ID, r.EVENT_ID, r.TEAM_NAME, r.TRACK_SELECTED, r.REGISTERED_AT, r.STATUS, e.SLUG AS EVENT_SLUG, e.EVENT_NAME "
            + "FROM REGISTRATIONS r JOIN EVENTS e ON e.EVENT_ID = r.EVENT_ID WHERE r.USER_ID = ? ORDER BY r.REGISTERED_AT DESC";
        List<Registration> list = new ArrayList<>();

        try (Connection conn = DBConnection.getConnection(); PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setLong(1, userId);
            try (ResultSet rs = ps.executeQuery()) {
                while (rs.next()) {
                    list.add(mapRegistration(rs));
                }
            }
        }
        return list;
    }

    public List<Registration> getAllRegistrations() throws SQLException {
        String sql =
            "SELECT r.REGISTRATION_ID, r.REG_NUMBER, r.USER_ID, r.EVENT_ID, r.TEAM_NAME, r.TRACK_SELECTED, r.REGISTERED_AT, r.STATUS, e.SLUG AS EVENT_SLUG, e.EVENT_NAME, u.FULL_NAME AS USER_NAME, u.EMAIL AS USER_EMAIL, u.DEPARTMENT AS USER_DEPT "
            + "FROM REGISTRATIONS r JOIN EVENTS e ON e.EVENT_ID = r.EVENT_ID JOIN USERS u ON u.USER_ID = r.USER_ID ORDER BY r.REGISTERED_AT DESC";
        List<Registration> list = new ArrayList<>();

        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql);
             ResultSet rs = ps.executeQuery()) {
            while (rs.next()) {
                list.add(mapRegistration(rs));
            }
        }
        return list;
    }

    public int countConfirmedRegistrations() throws SQLException {
        String sql = "SELECT COUNT(*) FROM REGISTRATIONS WHERE UPPER(STATUS) = 'CONFIRMED'";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql);
             ResultSet rs = ps.executeQuery()) {
            return rs.next() ? rs.getInt(1) : 0;
        }
    }

    public boolean isRegistered(long userId, String eventSlug) throws SQLException {
        String sql = "SELECT 1 FROM REGISTRATIONS r JOIN EVENTS e ON e.EVENT_ID = r.EVENT_ID WHERE r.USER_ID = ? AND LOWER(e.SLUG) = LOWER(?)";
        try (Connection conn = DBConnection.getConnection(); PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setLong(1, userId);
            ps.setString(2, eventSlug.trim());
            try (ResultSet rs = ps.executeQuery()) {
                return rs.next();
            }
        }
    }

    private Registration mapRegistration(ResultSet rs) throws SQLException {
        Registration r = new Registration();
        r.setRegistrationId(rs.getLong("REGISTRATION_ID"));
        r.setRegNumber(rs.getString("REG_NUMBER"));
        r.setUserId(rs.getLong("USER_ID"));
        r.setEventId(rs.getLong("EVENT_ID"));
        r.setTeamName(rs.getString("TEAM_NAME"));
        r.setTrackSelected(rs.getString("TRACK_SELECTED"));
        r.setRegisteredAt(rs.getTimestamp("REGISTERED_AT"));
        r.setStatus(rs.getString("STATUS"));
        r.setEventSlug(rs.getString("EVENT_SLUG"));
        r.setEventName(rs.getString("EVENT_NAME"));
        try {
            r.setUserName(rs.getString("USER_NAME"));
            r.setUserEmail(rs.getString("USER_EMAIL"));
            r.setDepartment(rs.getString("USER_DEPT"));
        } catch (SQLException ignored) {
        }
        return r;
    }
}
