package com.example.demo.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.models.User;
import com.example.demo.repositories.UserRepository;


@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public boolean registerUser(User user) {
    	if (user.getFullName() == null || user.getFullName().isEmpty()) {
            throw new IllegalArgumentException("Full Name cannot be null or empty");
        }
        if (!userRepository.existsByEmail(user.getEmail())) {
            userRepository.save(user);
            return true;
        }
        return false;
    }
    
    public User authenticateUser(String email, String password) {
        return userRepository.findByEmailAndPassword(email, password);
    }

    public boolean changePassword(Long long1, String oldPassword, String newPassword) {
        User user = userRepository.findById(long1).orElse(null);
        if (user != null && user.getPassword().equals(oldPassword)) {
            user.setPassword(newPassword);
            userRepository.save(user);
            return true;
        }
        return false;
    }
    
    public User getUserById(Long userId) {
        return userRepository.findById(userId).orElse(null);
    }

	
}