package com.example.demo.controllers;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.demo.dto.ChangePasswordRequest;
import com.example.demo.dto.LoginRequest;
import com.example.demo.models.User;
import com.example.demo.repositories.UserRepository;
import com.example.demo.services.UserService;

import jakarta.servlet.http.HttpSession;

@RestController

//@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private UserRepository userRepository;
    @PostMapping("/register")
    public ResponseEntity<String> registerUser(@RequestBody User user, HttpSession session) {
        boolean success = userService.registerUser(user);

        if (success) {
            session.setAttribute("successMsg", "Registered Successfully");
            return ResponseEntity.ok("Registered Successfully");
        } else {
            session.setAttribute("errorMsg", "Email already exists!");
            return ResponseEntity.badRequest().body("Email already exists!");
        }
    }
    
    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody LoginRequest loginRequest) {
        System.out.println("Received Login Request: " + loginRequest.getEmail() + " " + loginRequest.getPassword());

        User user = userRepository.findByEmail(loginRequest.getEmail());
        if (user == null) {
            System.out.println("User not found: " + loginRequest.getEmail());
            return ResponseEntity.status(401).body(Map.of("success", false, "message", "User not found"));
        }

        System.out.println("Stored Password: " + user.getPassword());

        if (!user.getPassword().equals(loginRequest.getPassword())) {
            System.out.println("Password does not match!");
            return ResponseEntity.status(401).body(Map.of("success", false, "message", "Invalid credentials"));
        }

        System.out.println("Login successful!");
        
        // ✅ Return userId in response
        return ResponseEntity.ok(Map.of("success", true, "userId", user.getId(), "message", "Login Successful"));
    }


    
    @PostMapping("/logout")
    public ResponseEntity<String> logout(HttpSession session) {
        session.invalidate();
        return ResponseEntity.ok("User Logged Out Successfully");
    }
    
    @PostMapping("/changePassword")
    public ResponseEntity<String> changePassword(@RequestBody ChangePasswordRequest request) {
        boolean isChanged = userService.changePassword(request.getUserId(), request.getOldPassword(), request.getNewPassword());
        if (isChanged) {
            return ResponseEntity.ok("Password Changed Successfully");
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Incorrect Old Password");
    }


}