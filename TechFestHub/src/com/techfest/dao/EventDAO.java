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
    public List<Event> getAllEvents() throws SQLException {
        String sql = "SELECT EVENT_ID, EVENT_NAME, CATEGORY, DESCRIPTION, EVENT_DATE, VENUE, REGISTRATION_FEE, MAX_PARTICIPANTS, REGISTRATION_DEADLINE, STATUS FROM EVENTS ORDER BY EVENT_DATE ASC";
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
        String sql = "SELECT EVENT_ID, EVENT_NAME, CATEGORY, DESCRIPTION, EVENT_DATE, VENUE, REGISTRATION_FEE, MAX_PARTICIPANTS, REGISTRATION_DEADLINE, STATUS FROM EVENTS WHERE EVENT_ID = ?";
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

    public boolean createEvent(Event event) throws SQLException {
        String sql = "INSERT INTO EVENTS (EVENT_NAME, CATEGORY, DESCRIPTION, EVENT_DATE, VENUE, REGISTRATION_FEE, MAX_PARTICIPANTS, REGISTRATION_DEADLINE, STATUS) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
        try (Connection conn = DBConnection.getConnection(); PreparedStatement ps = conn.prepareStatement(sql)) {
            applyEventParams(ps, event, false);
            return ps.executeUpdate() == 1;
        }
    }

    public boolean updateEvent(Event event) throws SQLException {
        String sql = "UPDATE EVENTS SET EVENT_NAME = ?, CATEGORY = ?, DESCRIPTION = ?, EVENT_DATE = ?, VENUE = ?, REGISTRATION_FEE = ?, MAX_PARTICIPANTS = ?, REGISTRATION_DEADLINE = ?, STATUS = ? WHERE EVENT_ID = ?";
        try (Connection conn = DBConnection.getConnection(); PreparedStatement ps = conn.prepareStatement(sql)) {
            applyEventParams(ps, event, true);
            return ps.executeUpdate() == 1;
        }
    }

    public boolean deleteEvent(long eventId) throws SQLException {
        String sql = "UPDATE EVENTS SET STATUS = 'CLOSED' WHERE EVENT_ID = ?";
        try (Connection conn = DBConnection.getConnection(); PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setLong(1, eventId);
            return ps.executeUpdate() == 1;
        }
    }

    private void applyEventParams(PreparedStatement ps, Event event, boolean includeId) throws SQLException {
        ps.setString(1, event.getEventName());
        ps.setString(2, event.getCategory());
        ps.setString(3, event.getDescription());
        ps.setTimestamp(4, event.getEventDate());
        ps.setString(5, event.getVenue());
        BigDecimal fee = event.getRegistrationFee() == null ? BigDecimal.ZERO : event.getRegistrationFee();
        ps.setBigDecimal(6, fee);
        if (event.getMaxParticipants() == null) {
            ps.setNull(7, java.sql.Types.INTEGER);
        } else {
            ps.setInt(7, event.getMaxParticipants());
        }
        Timestamp deadline = event.getRegistrationDeadline();
        if (deadline == null) {
            ps.setNull(8, java.sql.Types.TIMESTAMP);
        } else {
            ps.setTimestamp(8, deadline);
        }
        ps.setString(9, event.getStatus());
        if (includeId) {
            ps.setLong(10, event.getEventId());
        }
    }

    private Event mapEvent(ResultSet rs) throws SQLException {
        Event event = new Event();
        event.setEventId(rs.getLong("EVENT_ID"));
        event.setEventName(rs.getString("EVENT_NAME"));
        event.setCategory(rs.getString("CATEGORY"));
        event.setDescription(rs.getString("DESCRIPTION"));
        event.setEventDate(rs.getTimestamp("EVENT_DATE"));
        event.setVenue(rs.getString("VENUE"));
        event.setRegistrationFee(rs.getBigDecimal("REGISTRATION_FEE"));
        int maxParticipants = rs.getInt("MAX_PARTICIPANTS");
        event.setMaxParticipants(rs.wasNull() ? null : maxParticipants);
        event.setRegistrationDeadline(rs.getTimestamp("REGISTRATION_DEADLINE"));
        event.setStatus(rs.getString("STATUS"));
        return event;
    }
}
