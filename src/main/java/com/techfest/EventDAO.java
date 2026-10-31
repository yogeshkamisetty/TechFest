package com.techfest;

import java.math.BigDecimal;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;

/**
 * EventDAO - JDBC Data Access Object for EVENTS table.
 */
public class EventDAO {

    private static final String BASE_SELECT =
        "SELECT EVENT_ID, SLUG, EVENT_NAME, CATEGORY, DESCRIPTION, EVENT_DATE, CARD_DATE, VENUE, " +
        "REGISTRATION_FEE, MAX_PARTICIPANTS, REGISTRATION_DEADLINE, STATUS, COORDINATOR_NAME, COORDINATOR_PHONE FROM EVENTS ";

    public List<Event> getAllEvents() throws SQLException {
        String sql = BASE_SELECT + "ORDER BY EVENT_DATE ASC";
        List<Event> events = new ArrayList<>();
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql);
             ResultSet rs = ps.executeQuery()) {
            while (rs.next()) {
                events.add(mapEvent(rs));
            }
        }
        return events;
    }

    public Event getEventById(long eventId) throws SQLException {
        String sql = BASE_SELECT + "WHERE EVENT_ID = ?";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setLong(1, eventId);
            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) {
                    return mapEvent(rs);
                }
                return null;
            }
        }
    }

    public Event getEventBySlug(String slug) throws SQLException {
        if (slug == null) return null;
        String sql = BASE_SELECT + "WHERE LOWER(SLUG) = LOWER(?)";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setString(1, slug.trim());
            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) {
                    return mapEvent(rs);
                }
                return null;
            }
        }
    }

    public boolean createEvent(Event event) throws SQLException {
        String sql = "INSERT INTO EVENTS (SLUG, EVENT_NAME, CATEGORY, DESCRIPTION, EVENT_DATE, CARD_DATE, VENUE, " +
                     "REGISTRATION_FEE, MAX_PARTICIPANTS, REGISTRATION_DEADLINE, STATUS, COORDINATOR_NAME, COORDINATOR_PHONE) " +
                     "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setString(1, event.getSlug());
            ps.setString(2, event.getEventName());
            ps.setString(3, event.getCategory());
            ps.setString(4, event.getDescription());
            ps.setTimestamp(5, event.getEventDate() != null ? event.getEventDate() : new Timestamp(System.currentTimeMillis() + 86400000L * 7));
            ps.setString(6, event.getCardDate());
            ps.setString(7, event.getVenue());
            BigDecimal fee = event.getRegistrationFee() == null ? BigDecimal.ZERO : event.getRegistrationFee();
            ps.setBigDecimal(8, fee);
            if (event.getMaxParticipants() == null) {
                ps.setNull(9, java.sql.Types.INTEGER);
            } else {
                ps.setInt(9, event.getMaxParticipants());
            }
            if (event.getRegistrationDeadline() == null) {
                ps.setNull(10, java.sql.Types.TIMESTAMP);
            } else {
                ps.setTimestamp(10, event.getRegistrationDeadline());
            }
            ps.setString(11, event.getStatus() == null ? "OPEN" : event.getStatus().toUpperCase());
            ps.setString(12, event.getCoordinatorName());
            ps.setString(13, event.getCoordinatorPhone());
            return ps.executeUpdate() == 1;
        }
    }

    public boolean updateEvent(Event event) throws SQLException {
        String sql = "UPDATE EVENTS SET EVENT_NAME = ?, CATEGORY = ?, DESCRIPTION = ?, VENUE = ?, " +
                     "REGISTRATION_FEE = ?, MAX_PARTICIPANTS = ?, STATUS = ?, COORDINATOR_NAME = ?, COORDINATOR_PHONE = ? WHERE LOWER(SLUG) = LOWER(?)";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setString(1, event.getEventName());
            ps.setString(2, event.getCategory());
            ps.setString(3, event.getDescription());
            ps.setString(4, event.getVenue());
            BigDecimal fee = event.getRegistrationFee() == null ? BigDecimal.ZERO : event.getRegistrationFee();
            ps.setBigDecimal(5, fee);
            if (event.getMaxParticipants() == null) {
                ps.setNull(6, java.sql.Types.INTEGER);
            } else {
                ps.setInt(6, event.getMaxParticipants());
            }
            ps.setString(7, event.getStatus());
            ps.setString(8, event.getCoordinatorName());
            ps.setString(9, event.getCoordinatorPhone());
            ps.setString(10, event.getSlug().trim());
            return ps.executeUpdate() == 1;
        }
    }

    public boolean setStatus(String slug, String status) throws SQLException {
        String sql = "UPDATE EVENTS SET STATUS = ? WHERE LOWER(SLUG) = LOWER(?)";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setString(1, status);
            ps.setString(2, slug.trim());
            return ps.executeUpdate() == 1;
        }
    }

    public boolean setStatusById(long eventId, String status) throws SQLException {
        String sql = "UPDATE EVENTS SET STATUS = ? WHERE EVENT_ID = ?";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setString(1, status);
            ps.setLong(2, eventId);
            return ps.executeUpdate() == 1;
        }
    }

    public int countTotalEvents() throws SQLException {
        String sql = "SELECT COUNT(*) FROM EVENTS";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql);
             ResultSet rs = ps.executeQuery()) {
            return rs.next() ? rs.getInt(1) : 0;
        }
    }

    public int countOpenEvents() throws SQLException {
        String sql = "SELECT COUNT(*) FROM EVENTS WHERE UPPER(STATUS) = 'OPEN'";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql);
             ResultSet rs = ps.executeQuery()) {
            return rs.next() ? rs.getInt(1) : 0;
        }
    }

    private Event mapEvent(ResultSet rs) throws SQLException {
        Event event = new Event();
        event.setEventId(rs.getLong("EVENT_ID"));
        event.setSlug(rs.getString("SLUG"));
        event.setEventName(rs.getString("EVENT_NAME"));
        event.setCategory(rs.getString("CATEGORY"));
        event.setDescription(rs.getString("DESCRIPTION"));
        event.setEventDate(rs.getTimestamp("EVENT_DATE"));
        event.setCardDate(rs.getString("CARD_DATE"));
        event.setVenue(rs.getString("VENUE"));
        event.setRegistrationFee(rs.getBigDecimal("REGISTRATION_FEE"));
        int cap = rs.getInt("MAX_PARTICIPANTS");
        event.setMaxParticipants(rs.wasNull() ? null : cap);
        event.setRegistrationDeadline(rs.getTimestamp("REGISTRATION_DEADLINE"));
        event.setStatus(rs.getString("STATUS"));
        event.setCoordinatorName(rs.getString("COORDINATOR_NAME"));
        event.setCoordinatorPhone(rs.getString("COORDINATOR_PHONE"));
        return event;
    }
}
