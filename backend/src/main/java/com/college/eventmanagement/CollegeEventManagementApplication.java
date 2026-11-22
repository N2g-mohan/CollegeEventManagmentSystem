package com.college.eventmanagement;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Main Entry Point for College Event Management System.
 */
@SpringBootApplication
public class CollegeEventManagementApplication {

    public static void main(String[] args) {
        SpringApplication.run(CollegeEventManagementApplication.class, args);
        System.out.println("=================================================");
        System.out.println(" College Event Management System is Running!");
        System.out.println(" Open: http://localhost:8080 in your web browser");
        System.out.println("=================================================");
    }
}
