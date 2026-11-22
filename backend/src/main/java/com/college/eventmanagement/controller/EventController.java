package com.college.eventmanagement.controller;

import com.college.eventmanagement.entity.Event;
import com.college.eventmanagement.repository.EventRepository;
import com.college.eventmanagement.repository.RegistrationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Pure CRUD Controller for Events.
 * Standard B.Tech beginner-friendly Spring Boot implementation.
 */
@RestController
@RequestMapping("/api/events")
public class EventController {

    @Autowired
    private EventRepository eventRepository;

    @Autowired
    private RegistrationRepository registrationRepository;

    // 1. READ ALL Events (GET)
    @GetMapping
    public List<Event> getAllEvents(@RequestParam(required = false) Long userId) {
        List<Event> events = eventRepository.findAllByOrderByEventDateAsc();
        LocalDate today = LocalDate.now();

        for (Event event : events) {
            Long count = registrationRepository.countByEventId(event.getId());
            event.setRegisteredCount(count);
            event.setAvailableSeats(Math.max(0, event.getTotalSeats() - count));
            event.setIsSeatFull(count >= event.getTotalSeats());
            event.setIsRegistrationClosed(today.isAfter(event.getRegistrationLastDate()));

            if (userId != null) {
                event.setIsUserRegistered(registrationRepository.existsByUserIdAndEventId(userId, event.getId()));
            }
        }
        return events;
    }

    // 2. READ ONE Event by ID (GET)
    @GetMapping("/{id}")
    public ResponseEntity<?> getEventById(@PathVariable Long id, @RequestParam(required = false) Long userId) {
        var opt = eventRepository.findById(id);
        if (opt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Event not found");
        }

        Event event = opt.get();
        Long count = registrationRepository.countByEventId(event.getId());
        event.setRegisteredCount(count);
        event.setAvailableSeats(Math.max(0, event.getTotalSeats() - count));
        event.setIsSeatFull(count >= event.getTotalSeats());
        event.setIsRegistrationClosed(LocalDate.now().isAfter(event.getRegistrationLastDate()));

        if (userId != null) {
            event.setIsUserRegistered(registrationRepository.existsByUserIdAndEventId(userId, event.getId()));
        }

        return ResponseEntity.ok(event);
    }

    // 3. CREATE Event (POST)
    @PostMapping
    public ResponseEntity<?> createEvent(@RequestBody Event event) {
        Map<String, Object> res = new HashMap<>();
        try {
            Event saved = eventRepository.save(event);
            res.put("success", true);
            res.put("message", "Event created successfully!");
            res.put("event", saved);
            return ResponseEntity.status(HttpStatus.CREATED).body(res);
        } catch (Exception e) {
            res.put("success", false);
            res.put("message", "Error creating event: " + e.getMessage());
            return ResponseEntity.badRequest().body(res);
        }
    }

    // 4. UPDATE Event (PUT)
    @PutMapping("/{id}")
    public ResponseEntity<?> updateEvent(@PathVariable Long id, @RequestBody Event updated) {
        Map<String, Object> res = new HashMap<>();
        var opt = eventRepository.findById(id);
        if (opt.isEmpty()) {
            res.put("success", false);
            res.put("message", "Event not found with ID: " + id);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(res);
        }

        Event existing = opt.get();
        existing.setEventName(updated.getEventName());
        existing.setEventDescription(updated.getEventDescription());
        existing.setEventDate(updated.getEventDate());
        existing.setEventTime(updated.getEventTime());
        existing.setEventVenue(updated.getEventVenue());
        existing.setEventCategory(updated.getEventCategory());
        existing.setTotalSeats(updated.getTotalSeats());
        existing.setRegistrationLastDate(updated.getRegistrationLastDate());
        existing.setCharge(updated.getCharge());

        Event saved = eventRepository.save(existing);
        res.put("success", true);
        res.put("message", "Event updated successfully!");
        res.put("event", saved);
        return ResponseEntity.ok(res);
    }

    // 5. DELETE Event (DELETE)
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteEvent(@PathVariable Long id) {
        Map<String, Object> res = new HashMap<>();
        if (!eventRepository.existsById(id)) {
            res.put("success", false);
            res.put("message", "Event not found with ID: " + id);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(res);
        }

        eventRepository.deleteById(id);
        res.put("success", true);
        res.put("message", "Event deleted successfully!");
        return ResponseEntity.ok(res);
    }
}
