package com.techfest.model;

import java.io.Serializable;
import java.sql.Timestamp;

public class Registration implements Serializable {
    private static final long serialVersionUID = 1L;

    private Long registrationId;
    private String regNumber;
    private Long userId;
    private Long eventId;
    private String eventSlug;
    private String eventName;
    private String teamName;
    private String trackSelected;
    private Timestamp registeredAt;
    private String status;
    private String userName;
    private String userEmail;
    private String department;

    public Registration() {
    }

    public Long getRegistrationId() {
        return registrationId;
    }

    public void setRegistrationId(Long registrationId) {
        this.registrationId = registrationId;
    }

    public String getRegNumber() {
        return regNumber;
    }

    public void setRegNumber(String regNumber) {
        this.regNumber = regNumber;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public Long getEventId() {
        return eventId;
    }

    public void setEventId(Long eventId) {
        this.eventId = eventId;
    }

    public String getEventSlug() {
        return eventSlug;
    }

    public void setEventSlug(String eventSlug) {
        this.eventSlug = eventSlug;
    }

    public String getEventName() {
        return eventName;
    }

    public void setEventName(String eventName) {
        this.eventName = eventName;
    }

    public String getTeamName() {
        return teamName;
    }

    public void setTeamName(String teamName) {
        this.teamName = teamName;
    }

    public String getTrackSelected() {
        return trackSelected;
    }

    public void setTrackSelected(String trackSelected) {
        this.trackSelected = trackSelected;
    }

    public Timestamp getRegisteredAt() {
        return registeredAt;
    }

    public void setRegisteredAt(Timestamp registeredAt) {
        this.registeredAt = registeredAt;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public String getUserEmail() {
        return userEmail;
    }

    public void setUserEmail(String userEmail) {
        this.userEmail = userEmail;
    }

    public String getDepartment() {
        return department;
    }

    public void setDepartment(String department) {
        this.department = department;
    }
}
