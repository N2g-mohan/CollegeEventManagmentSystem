package com.college.eventmanagement.controller;

import com.college.eventmanagement.entity.User;
import com.college.eventmanagement.repository.UserRepository;
import com.college.eventmanagement.util.PasswordUtil;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

/**
 * Controller for simple Student Signup and Login CRUD operations.
 */
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    // 1. Student Signup (Create User)
    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody User user) {
        Map<String, Object> res = new HashMap<>();

        if (user.getEmail() == null || user.getEmail().trim().isEmpty() ||
            user.getPassword() == null || user.getPassword().trim().isEmpty() ||
            user.getFullName() == null || user.getFullName().trim().isEmpty()) {
            res.put("success", false);
            res.put("message", "Full Name, Email and Password are required");
            return ResponseEntity.badRequest().body(res);
        }

        if (userRepository.existsByEmail(user.getEmail().trim().toLowerCase())) {
            res.put("success", false);
            res.put("message", "An account with this email already exists");
            return ResponseEntity.badRequest().body(res);
        }

        user.setEmail(user.getEmail().trim().toLowerCase());
        user.setRole("STUDENT");
        user.setPassword(PasswordUtil.hashPassword(user.getPassword().trim()));

        User savedUser = userRepository.save(user);

        res.put("success", true);
        res.put("message", "Account created successfully!");
        res.put("user", savedUser);
        return ResponseEntity.status(HttpStatus.CREATED).body(res);
    }

    // 2. Login (Verify User)
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> creds, HttpSession session) {
        Map<String, Object> res = new HashMap<>();
        String email = creds.get("email");
        String password = creds.get("password");

        if (email == null || password == null) {
            res.put("success", false);
            res.put("message", "Email and Password are required");
            return ResponseEntity.badRequest().body(res);
        }

        var optUser = userRepository.findByEmail(email.trim().toLowerCase());
        if (optUser.isEmpty() || !PasswordUtil.checkPassword(password.trim(), optUser.get().getPassword())) {
            res.put("success", false);
            res.put("message", "Invalid email or password");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(res);
        }

        User user = optUser.get();
        session.setAttribute("currentUser", user);

        res.put("success", true);
        res.put("message", "Welcome back, " + user.getFullName() + "!");
        res.put("user", user);
        return ResponseEntity.ok(res);
    }

    // 3. Logout
    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpSession session) {
        session.invalidate();
        Map<String, Object> res = new HashMap<>();
        res.put("success", true);
        res.put("message", "Logged out successfully");
        return ResponseEntity.ok(res);
    }
}
