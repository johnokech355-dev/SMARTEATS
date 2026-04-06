package com.rms.backend2.service;

import com.rms.backend2.model.User;
import com.rms.backend2.repository.UserRepository;
import com.rms.backend2.security.JwtUtil;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public AuthService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder,
                       JwtUtil jwtUtil) {

        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    // ✅ Register user
    public User register(User user){

        Optional<User> existing =
                userRepository.findByEmail(user.getEmail());

        if(existing.isPresent()){
            throw new RuntimeException("Email already exists");
        }

        user.setPassword(
                passwordEncoder.encode(user.getPassword())
        );

        return userRepository.save(user);
    }

    // ✅ LOGIN (NO ROLE INPUT 🔥)
    public String login(String email, String password){

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        if(!passwordEncoder.matches(password, user.getPassword())){
            throw new RuntimeException("Invalid password");
        }

        // Role comes from database (SAFE)
        return jwtUtil.generateToken(
                user.getEmail(),
                user.getRole().name()
        );
    }
}