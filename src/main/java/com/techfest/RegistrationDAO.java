package com.techfest;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;

/**
 * RegistrationDAO - JDBC Data Access Object for REGISTRATIONS table.
 */
public class RegistrationDAO {

    public Registration registerStudent(long userId, String eventSlug, String teamName, String track)
            throws SQLException, RegistrationException {
        return registerStudent(userId, eventSlug, teamName, track, "NOT_REQUIRED", null);
    }

    public Registration registerStudent(long userId, String eventSlug, String teamName, String track,
                                        String paymentStatus, String paymentReference)
            throws SQLException, RegistrationException {
        String lockAndReadEvent =
            "SELECT EVENT_ID, EVENT_NAME, STATUS, MAX_PARTICIPANTS, REGISTRATION_DEADLINE FROM EVENTS WHERE LOWER(SLUG) = LOWER(?) FOR UPDATE";
        String readCurrentCount =
            "SELECT COUNT(*) AS TOTAL FROM REGISTRATIONS WHERE EVENT_ID = ? AND UPPER(STATUS) = 'CONFIRMED'";
        String readExisting =
            "SELECT STATUS FROM REGISTRATIONS WHERE USER_ID = ? AND EVENT_ID = ?";
        String insertRegistration =
            "INSERT INTO REGISTRATIONS (REGISTRATION_ID, REG_NUMBER, USER_ID, EVENT_ID, TEAM_NAME, TRACK_SELECTED, STATUS, PAYMENT_STATUS, PAYMENT_REFERENCE) " +
            "VALUES (?, ?, ?, ?, ?, ?, 'CONFIRMED', ?, ?)";
        String readInserted =
            "SELECT REGISTRATION_ID, REG_NUMBER, REGISTERED_AT, STATUS, PAYMENT_STATUS, PAYMENT_REFERENCE FROM REGISTRATIONS WHERE USER_ID = ? AND EVENT_ID = ?";

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

                // Check duplicate registration
                try (PreparedStatement ps = conn.prepareStatement(readExisting)) {
                    ps.setLong(1, userId);
                    ps.setLong(2, eventId);
                    try (ResultSet rs = ps.executeQuery()) {
                        if (rs.next()) {
                            throw new RegistrationException("You are already registered for this event.");
                        }
                    }
                }

                // Check capacity
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

                String pStatus = (paymentStatus == null || paymentStatus.trim().isEmpty()) ? "NOT_REQUIRED" : paymentStatus.trim().toUpperCase();
                String pRef = (paymentReference == null || paymentReference.trim().isEmpty()) ? null : paymentReference.trim();

                long regId;
                try (PreparedStatement ps = conn.prepareStatement("SELECT REGISTRATIONS_SEQ.NEXTVAL FROM DUAL");
                     ResultSet rs = ps.executeQuery()) {
                    rs.next();
                    regId = rs.getLong(1);
                }
                String regNumber = String.format("REG-%06d", regId);

                try (PreparedStatement ps = conn.prepareStatement(insertRegistration)) {
                    ps.setLong(1, regId);
                    ps.setString(2, regNumber);
                    ps.setLong(3, userId);
                    ps.setLong(4, eventId);
                    ps.setString(5, teamName);
                    ps.setString(6, track);
                    ps.setString(7, pStatus);
                    ps.setString(8, pRef);
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
                            reg.setPaymentStatus(rs.getString("PAYMENT_STATUS"));
                            reg.setPaymentReference(rs.getString("PAYMENT_REFERENCE"));
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
            "SELECT r.REGISTRATION_ID, r.REG_NUMBER, r.USER_ID, u.FULL_NAME AS USER_NAME, u.EMAIL AS USER_EMAIL, " +
            "r.EVENT_ID, e.SLUG AS EVENT_SLUG, e.EVENT_NAME, e.CATEGORY AS EVENT_CATEGORY, e.EVENT_DATE, e.VENUE AS EVENT_VENUE, " +
            "r.TEAM_NAME, r.TRACK_SELECTED, r.REGISTERED_AT, r.STATUS, r.PAYMENT_STATUS, r.PAYMENT_REFERENCE " +
            "FROM REGISTRATIONS r " +
            "JOIN EVENTS e ON r.EVENT_ID = e.EVENT_ID " +
            "JOIN USERS u ON r.USER_ID = u.USER_ID " +
            "WHERE r.USER_ID = ? ORDER BY r.REGISTERED_AT DESC";

        List<Registration> list = new ArrayList<>();
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setLong(1, userId);
            try (ResultSet rs = ps.executeQuery()) {
                while (rs.next()) {
                    Registration reg = new Registration();
                    reg.setRegistrationId(rs.getLong("REGISTRATION_ID"));
                    reg.setRegNumber(rs.getString("REG_NUMBER"));
                    reg.setUserId(rs.getLong("USER_ID"));
                    reg.setUserName(rs.getString("USER_NAME"));
                    reg.setUserEmail(rs.getString("USER_EMAIL"));
                    reg.setEventId(rs.getLong("EVENT_ID"));
                    reg.setEventSlug(rs.getString("EVENT_SLUG"));
                    reg.setEventName(rs.getString("EVENT_NAME"));
                    reg.setEventCategory(rs.getString("EVENT_CATEGORY"));
                    reg.setEventDate(rs.getTimestamp("EVENT_DATE"));
                    reg.setEventVenue(rs.getString("EVENT_VENUE"));
                    reg.setTeamName(rs.getString("TEAM_NAME"));
                    reg.setTrackSelected(rs.getString("TRACK_SELECTED"));
                    reg.setRegisteredAt(rs.getTimestamp("REGISTERED_AT"));
                    reg.setStatus(rs.getString("STATUS"));
                    reg.setPaymentStatus(rs.getString("PAYMENT_STATUS"));
                    reg.setPaymentReference(rs.getString("PAYMENT_REFERENCE"));
                    list.add(reg);
                }
            }
        }
        return list;
    }

    public List<Registration> getAllRegistrations() throws SQLException {
        String sql =
            "SELECT r.REGISTRATION_ID, r.REG_NUMBER, r.USER_ID, u.FULL_NAME AS USER_NAME, u.EMAIL AS USER_EMAIL, " +
            "r.EVENT_ID, e.SLUG AS EVENT_SLUG, e.EVENT_NAME, e.CATEGORY AS EVENT_CATEGORY, e.EVENT_DATE, e.VENUE AS EVENT_VENUE, " +
            "r.TEAM_NAME, r.TRACK_SELECTED, r.REGISTERED_AT, r.STATUS, r.PAYMENT_STATUS, r.PAYMENT_REFERENCE " +
            "FROM REGISTRATIONS r " +
            "JOIN USERS u ON r.USER_ID = u.USER_ID " +
            "JOIN EVENTS e ON r.EVENT_ID = e.EVENT_ID " +
            "ORDER BY r.REGISTERED_AT DESC";

        List<Registration> list = new ArrayList<>();
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql);
             ResultSet rs = ps.executeQuery()) {
            while (rs.next()) {
                Registration reg = new Registration();
                reg.setRegistrationId(rs.getLong("REGISTRATION_ID"));
                reg.setRegNumber(rs.getString("REG_NUMBER"));
                reg.setUserId(rs.getLong("USER_ID"));
                reg.setUserName(rs.getString("USER_NAME"));
                reg.setUserEmail(rs.getString("USER_EMAIL"));
                reg.setEventId(rs.getLong("EVENT_ID"));
                reg.setEventSlug(rs.getString("EVENT_SLUG"));
                reg.setEventName(rs.getString("EVENT_NAME"));
                reg.setEventCategory(rs.getString("EVENT_CATEGORY"));
                reg.setEventDate(rs.getTimestamp("EVENT_DATE"));
                reg.setEventVenue(rs.getString("EVENT_VENUE"));
                reg.setTeamName(rs.getString("TEAM_NAME"));
                reg.setTrackSelected(rs.getString("TRACK_SELECTED"));
                reg.setRegisteredAt(rs.getTimestamp("REGISTERED_AT"));
                reg.setStatus(rs.getString("STATUS"));
                reg.setPaymentStatus(rs.getString("PAYMENT_STATUS"));
                reg.setPaymentReference(rs.getString("PAYMENT_REFERENCE"));
                list.add(reg);
            }
        }
        return list;
    }

    public int countTotalRegistrations() throws SQLException {
        String sql = "SELECT COUNT(*) FROM REGISTRATIONS";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql);
             ResultSet rs = ps.executeQuery()) {
            return rs.next() ? rs.getInt(1) : 0;
        }
    }

    public int countConfirmedRegistrations() throws SQLException {
        String sql = "SELECT COUNT(*) FROM REGISTRATIONS WHERE UPPER(STATUS) = 'CONFIRMED'";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql);
             ResultSet rs = ps.executeQuery()) {
            return rs.next() ? rs.getInt(1) : 0;
        }
    }
}
