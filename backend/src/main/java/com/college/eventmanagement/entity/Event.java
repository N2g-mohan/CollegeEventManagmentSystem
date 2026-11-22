package com.college.eventmanagement.entity;

import jakarta.persistence.*;
import java.time.LocalDate;

/**
 * Event Entity representing college events.
 */
@Entity
@Table(name = "events")
public class Event {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "event_name", nullable = false)
    private String eventName;

    @Column(name = "event_description", columnDefinition = "TEXT")
    private String eventDescription;

    @Column(name = "event_date", nullable = false)
    private LocalDate eventDate;

    @Column(name = "event_time")
    private String eventTime;

    @Column(name = "event_venue")
    private String eventVenue;

    @Column(name = "event_category")
    private String eventCategory;

    @Column(name = "total_seats")
    private Integer totalSeats;

    @Column(name = "registration_last_date")
    private LocalDate registrationLastDate;

    // Entry charge / fee (0.0 means Free, >0 means paid offline at venue)
    @Column(name = "charge")
    private Double charge = 0.0;

    // Transient helper fields for simple UI display
    @Transient
    private Long registeredCount = 0L;

    @Transient
    private Long availableSeats = 0L;

    @Transient
    private Boolean isSeatFull = false;

    @Transient
    private Boolean isRegistrationClosed = false;

    @Transient
    private Boolean isUserRegistered = false;

    public Event() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getEventName() {
        return eventName;
    }

    public void setEventName(String eventName) {
        this.eventName = eventName;
    }

    public String getEventDescription() {
        return eventDescription;
    }

    public void setEventDescription(String eventDescription) {
        this.eventDescription = eventDescription;
    }

    public LocalDate getEventDate() {
        return eventDate;
    }

    public void setEventDate(LocalDate eventDate) {
        this.eventDate = eventDate;
    }

    public String getEventTime() {
        return eventTime;
    }

    public void setEventTime(String eventTime) {
        this.eventTime = eventTime;
    }

    public String getEventVenue() {
        return eventVenue;
    }

    public void setEventVenue(String eventVenue) {
        this.eventVenue = eventVenue;
    }

    public String getEventCategory() {
        return eventCategory;
    }

    public void setEventCategory(String eventCategory) {
        this.eventCategory = eventCategory;
    }

    public Integer getTotalSeats() {
        return totalSeats;
    }

    public void setTotalSeats(Integer totalSeats) {
        this.totalSeats = totalSeats;
    }

    public LocalDate getRegistrationLastDate() {
        return registrationLastDate;
    }

    public void setRegistrationLastDate(LocalDate registrationLastDate) {
        this.registrationLastDate = registrationLastDate;
    }

    public Double getCharge() {
        return charge != null ? charge : 0.0;
    }

    public void setCharge(Double charge) {
        this.charge = charge != null ? charge : 0.0;
    }

    public Long getRegisteredCount() {
        return registeredCount;
    }

    public void setRegisteredCount(Long registeredCount) {
        this.registeredCount = registeredCount;
    }

    public Long getAvailableSeats() {
        return availableSeats;
    }

    public void setAvailableSeats(Long availableSeats) {
        this.availableSeats = availableSeats;
    }

    public Boolean getIsSeatFull() {
        return isSeatFull;
    }

    public void setIsSeatFull(Boolean isSeatFull) {
        this.isSeatFull = isSeatFull;
    }

    public Boolean getIsRegistrationClosed() {
        return isRegistrationClosed;
    }

    public void setIsRegistrationClosed(Boolean isRegistrationClosed) {
        this.isRegistrationClosed = isRegistrationClosed;
    }

    public Boolean getIsUserRegistered() {
        return isUserRegistered;
    }

    public void setIsUserRegistered(Boolean isUserRegistered) {
        this.isUserRegistered = isUserRegistered;
    }
}
