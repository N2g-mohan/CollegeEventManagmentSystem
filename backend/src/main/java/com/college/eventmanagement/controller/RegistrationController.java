package com.college.eventmanagement.controller;

import com.college.eventmanagement.entity.Event;
import com.college.eventmanagement.entity.Registration;
import com.college.eventmanagement.entity.User;
import com.college.eventmanagement.repository.EventRepository;
import com.college.eventmanagement.repository.RegistrationRepository;
import com.college.eventmanagement.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Pure CRUD Controller for Registrations.
 * Handles student participation, cancellation, and registration lists.
 */
@RestController
@RequestMapping("/api/registrations")
public class RegistrationController {

    @Autowired
    private RegistrationRepository registrationRepository;

    @Autowired
    private EventRepository eventRepository;

    @Autowired
    private UserRepository userRepository;

    // 1. READ Student Registrations (GET)
    @GetMapping("/student/{userId}")
    public List<Registration> getStudentRegistrations(@PathVariable Long userId) {
        return registrationRepository.findByUserId(userId);
    }

    // 2. READ Event Registered Students (GET)
    @GetMapping("/event/{eventId}")
    public List<Registration> getEventRegistrations(@PathVariable Long eventId) {
        return registrationRepository.findByEventId(eventId);
    }

    // 3. CREATE Registration (POST)
    @PostMapping
    public ResponseEntity<?> registerStudent(@RequestBody Map<String, Long> payload) {
        Map<String, Object> res = new HashMap<>();
        Long userId = payload.get("userId");
        Long eventId = payload.get("eventId");

        if (userId == null || eventId == null) {
            res.put("success", false);
            res.put("message", "User ID and Event ID are required");
            return ResponseEntity.badRequest().body(res);
        }

        var optUser = userRepository.findById(userId);
        var optEvent = eventRepository.findById(eventId);

        if (optUser.isEmpty() || optEvent.isEmpty()) {
            res.put("success", false);
            res.put("message", "Student or Event not found");
            return ResponseEntity.badRequest().body(res);
        }

        User user = optUser.get();
        Event event = optEvent.get();

        // Simple duplicate check
        if (registrationRepository.existsByUserIdAndEventId(userId, eventId)) {
            res.put("success", false);
            res.put("message", "You are already registered for this event");
            return ResponseEntity.badRequest().body(res);
        }

        // Simple deadline check
        if (LocalDate.now().isAfter(event.getRegistrationLastDate())) {
            res.put("success", false);
            res.put("message", "Registration deadline has passed");
            return ResponseEntity.badRequest().body(res);
        }

        // Simple seat capacity check
        Long registeredCount = registrationRepository.countByEventId(eventId);
        if (registeredCount >= event.getTotalSeats()) {
            res.put("success", false);
            res.put("message", "All seats are fully booked for this event");
            return ResponseEntity.badRequest().body(res);
        }

        // Save registration in MySQL
        Registration registration = new Registration(user, event);
        Registration saved = registrationRepository.save(registration);

        String successMessage;
        if (event.getCharge() != null && event.getCharge() > 0) {
            String feeStr = (event.getCharge() == Math.floor(event.getCharge())) ? String.valueOf(event.getCharge().intValue()) : String.valueOf(event.getCharge());
            successMessage = "Registered successfully! Entry Fee: ₹" + feeStr + " (Offline payment at venue desk).";
        } else {
            successMessage = "Registered successfully for " + event.getEventName() + " (Free Event).";
        }

        res.put("success", true);
        res.put("message", successMessage);
        res.put("registrationId", saved.getId());
        return ResponseEntity.status(HttpStatus.CREATED).body(res);
    }

    // 4. DELETE Registration by userId and eventId
    @DeleteMapping
    public ResponseEntity<?> cancelRegistration(@RequestParam Long userId, @RequestParam Long eventId) {
        Map<String, Object> res = new HashMap<>();

        if (!registrationRepository.existsByUserIdAndEventId(userId, eventId)) {
            res.put("success", false);
            res.put("message", "Registration not found");
            return ResponseEntity.badRequest().body(res);
        }

        registrationRepository.deleteByUserIdAndEventId(userId, eventId);
        res.put("success", true);
        res.put("message", "Registration cancelled successfully");
        return ResponseEntity.ok(res);
    }

    // 5. DELETE Registration by ID (Admin remove student)
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteRegistrationById(@PathVariable Long id) {
        Map<String, Object> res = new HashMap<>();
        if (!registrationRepository.existsById(id)) {
            res.put("success", false);
            res.put("message", "Registration not found with ID: " + id);
            return ResponseEntity.badRequest().body(res);
        }

        registrationRepository.deleteById(id);
        res.put("success", true);
        res.put("message", "Registration removed successfully");
        return ResponseEntity.ok(res);
    }
}
