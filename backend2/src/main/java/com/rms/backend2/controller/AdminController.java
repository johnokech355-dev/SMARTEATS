package com.rms.backend2.controller;

import com.rms.backend2.model.User;
import com.rms.backend2.repository.UserRepository;
import com.rms.backend2.service.AuthService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final AuthService authService;
    private final UserRepository userRepository;

    public AdminController(AuthService authService,
                           UserRepository userRepository){
        this.authService = authService;
        this.userRepository = userRepository;
    }

    // ✅ CREATE USER
    @PostMapping("/users")
    @PreAuthorize("hasRole('OWNER')")
    public User createUser(@RequestBody User user){
        return authService.register(user);
    }

    // ✅ GET ALL USERS
    @GetMapping("/users")
    @PreAuthorize("hasRole('OWNER')")
    public List<User> getUsers(){
        return userRepository.findAll();
    }

    // 🔥 DELETE USER
    @DeleteMapping("/users/{id}")
    @PreAuthorize("hasRole('OWNER')")
    public void deleteUser(@PathVariable Long id){
        userRepository.deleteById(id);
    }
}