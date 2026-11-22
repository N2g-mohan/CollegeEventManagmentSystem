package com.college.eventmanagement.config;

import com.college.eventmanagement.entity.Event;
import com.college.eventmanagement.entity.User;
import com.college.eventmanagement.repository.EventRepository;
import com.college.eventmanagement.repository.UserRepository;
import com.college.eventmanagement.util.PasswordUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDate;

/**
 * Initializes default admin account and sample college events on startup.
 */
@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EventRepository eventRepository;

    @Override
    public void run(String... args) {
        String adminEmail = "admin@college.edu";
        var optAdmin = userRepository.findByEmail(adminEmail);

        if (optAdmin.isEmpty()) {
            User admin = new User();
            admin.setFullName("College Admin");
            admin.setEmail(adminEmail);
            admin.setPassword(PasswordUtil.hashPassword("admin123"));
            admin.setCollegeRollNumber("ADMIN-001");
            admin.setDepartment("Academic Affairs");
            admin.setAcademicYear("Staff");
            admin.setRole("ADMIN");
            userRepository.save(admin);
            System.out.println(">>> Default Admin created: admin@college.edu / admin123");
        } else {
            // Ensure admin password is valid BCrypt hash for 'admin123'
            User admin = optAdmin.get();
            if (!PasswordUtil.checkPassword("admin123", admin.getPassword())) {
                admin.setPassword(PasswordUtil.hashPassword("admin123"));
                userRepository.save(admin);
                System.out.println(">>> Updated Admin password hash for admin123");
            }
        }

        // Add sample college events if empty
        if (eventRepository.count() == 0) {
            Event event1 = new Event();
            event1.setEventName("TechnoVision 2026 - Annual Tech Symposium");
            event1.setEventDescription("A flagship annual technical symposium featuring hackathons, coding challenges, project exhibitions, and technical quiz competitions.");
            event1.setEventDate(LocalDate.now().plusDays(20));
            event1.setEventTime("09:30 AM");
            event1.setEventVenue("Auditorium Block A");
            event1.setEventCategory("Technical");
            event1.setTotalSeats(100);
            event1.setRegistrationLastDate(LocalDate.now().plusDays(15));
            event1.setCharge(0.0);
            eventRepository.save(event1);

            Event event2 = new Event();
            event2.setEventName("Hands-on Workshop: Machine Learning with Python");
            event2.setEventDescription("An intensive hands-on workshop covering data preprocessing, model training, evaluation, and practical machine learning models.");
            event2.setEventDate(LocalDate.now().plusDays(12));
            event2.setEventTime("10:00 AM");
            event2.setEventVenue("Seminar Hall 2");
            event2.setEventCategory("Workshop");
            event2.setTotalSeats(50);
            event2.setRegistrationLastDate(LocalDate.now().plusDays(8));
            event2.setCharge(150.0);
            eventRepository.save(event2);

            Event event3 = new Event();
            event3.setEventName("Rhythm & Harmony - Annual Cultural Night");
            event3.setEventDescription("Celebrate student creativity with music bands, classical dance, drama, and live singing performances.");
            event3.setEventDate(LocalDate.now().plusDays(25));
            event3.setEventTime("05:00 PM");
            event3.setEventVenue("Open Air Theatre (OAT)");
            event3.setEventCategory("Cultural");
            event3.setTotalSeats(200);
            event3.setRegistrationLastDate(LocalDate.now().plusDays(22));
            event3.setCharge(0.0);
            eventRepository.save(event3);
        } else {
            // Ensure charge is not null for any existing events
            var allEvents = eventRepository.findAll();
            for (Event e : allEvents) {
                if (e.getCharge() == null) {
                    e.setCharge(0.0);
                    eventRepository.save(e);
                }
            }
        }
    }
}
