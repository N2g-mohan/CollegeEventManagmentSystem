-- ========================================================
-- College Event Management System - MySQL Database Schema
-- Database: college_event_management_db
-- ========================================================

CREATE DATABASE IF NOT EXISTS college_event_management_db;
USE college_event_management_db;

-- 1. Users Table (for Admin and Students)
CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    college_roll_number VARCHAR(255),
    department VARCHAR(255),
    academic_year VARCHAR(255),
    role VARCHAR(20) NOT NULL DEFAULT 'STUDENT'
);

-- 2. Events Table (created and managed by Admin)
CREATE TABLE IF NOT EXISTS events (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    event_name VARCHAR(255) NOT NULL,
    event_description TEXT,
    event_date DATE NOT NULL,
    event_time VARCHAR(255),
    event_venue VARCHAR(255),
    event_category VARCHAR(255),
    total_seats INT,
    registration_last_date DATE,
    charge DECIMAL(10,2) DEFAULT 0.00
);

-- 3. Registrations Table (links Student and Event)
CREATE TABLE IF NOT EXISTS registrations (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    event_id BIGINT NOT NULL,
    registration_date DATETIME,
    status VARCHAR(20) DEFAULT 'CONFIRMED',
    CONSTRAINT fk_registrations_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_registrations_event FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE
);

-- Default Admin Account (Password: admin123)
INSERT INTO users (full_name, email, password, college_roll_number, department, academic_year, role)
SELECT 'System Admin', 'admin@college.edu', '$2a$10$bu./Yb/whCcMWCNMRMr..O1iWYfQFyDAZnwjyYkLIksP9bSAHSvUK', 'ADMIN-001', 'Management', 'Staff', 'ADMIN'
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'admin@college.edu');
