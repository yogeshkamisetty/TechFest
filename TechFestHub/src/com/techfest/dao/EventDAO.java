package com.techfest.dao;

import java.math.BigDecimal;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;

import com.techfest.config.DBConnection;
import com.techfest.model.Event;

public class EventDAO {
    private static final String BASE_SELECT =
        "SELECT EVENT_ID, SLUG, EVENT_NAME, CATEGORY, DESCRIPTION, EVENT_DATE, CARD_DATE, VENUE, REGISTRATION_FEE, MAX_PARTICIPANTS, REGISTRATION_DEADLINE, STATUS FROM EVENTS ";

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
        try (Connection conn = DBConnection.getConnection(); PreparedStatement ps = conn.prepareStatement(sql)) {
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
        try (Connection conn = DBConnection.getConnection(); PreparedStatement ps = conn.prepareStatement(sql)) {
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
        String sql = "INSERT INTO EVENTS (SLUG, EVENT_NAME, CATEGORY, DESCRIPTION, EVENT_DATE, CARD_DATE, VENUE, REGISTRATION_FEE, MAX_PARTICIPANTS, REGISTRATION_DEADLINE, STATUS) "
                   + "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        try (Connection conn = DBConnection.getConnection(); PreparedStatement ps = conn.prepareStatement(sql)) {
            applyEventParams(ps, event, false);
            return ps.executeUpdate() == 1;
        }
    }

    public boolean updateEvent(Event event) throws SQLException {
        String sql = "UPDATE EVENTS SET EVENT_NAME = ?, CATEGORY = ?, DESCRIPTION = ?, EVENT_DATE = ?, CARD_DATE = ?, VENUE = ?, REGISTRATION_FEE = ?, MAX_PARTICIPANTS = ?, REGISTRATION_DEADLINE = ?, STATUS = ? "
                   + "WHERE SLUG = ?";
        try (Connection conn = DBConnection.getConnection(); PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setString(1, event.getEventName());
            ps.setString(2, event.getCategory());
            ps.setString(3, event.getDescription());
            ps.setTimestamp(4, event.getEventDate());
            ps.setString(5, event.getCardDate());
            ps.setString(6, event.getVenue());
            BigDecimal fee = event.getRegistrationFee() == null ? BigDecimal.ZERO : event.getRegistrationFee();
            ps.setBigDecimal(7, fee);
            if (event.getMaxParticipants() == null) {
                ps.setNull(8, java.sql.Types.INTEGER);
            } else {
                ps.setInt(8, event.getMaxParticipants());
            }
            if (event.getRegistrationDeadline() == null) {
                ps.setNull(9, java.sql.Types.TIMESTAMP);
            } else {
                ps.setTimestamp(9, event.getRegistrationDeadline());
            }
            ps.setString(10, event.getStatus());
            ps.setString(11, event.getSlug());
            return ps.executeUpdate() == 1;
        }
    }

    public boolean setStatus(String slug, String status) throws SQLException {
        String sql = "UPDATE EVENTS SET STATUS = ? WHERE LOWER(SLUG) = LOWER(?)";
        try (Connection conn = DBConnection.getConnection(); PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setString(1, status);
            ps.setString(2, slug.trim());
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

    private void applyEventParams(PreparedStatement ps, Event event, boolean includeId) throws SQLException {
        ps.setString(1, event.getSlug());
        ps.setString(2, event.getEventName());
        ps.setString(3, event.getCategory());
        ps.setString(4, event.getDescription());
        ps.setTimestamp(5, event.getEventDate());
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
        ps.setString(11, event.getStatus());
        if (includeId) {
            ps.setLong(12, event.getEventId());
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
        return event;
    }
}
