package com.rms.backend2.controller;

import com.rms.backend2.model.LoginRequest;
import com.rms.backend2.model.RegisterRequest;
import com.rms.backend2.model.AuthResponse;
import com.rms.backend2.model.Role;
import com.rms.backend2.model.User;
import com.rms.backend2.security.JwtUtil;
import com.rms.backend2.service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;
    private final JwtUtil jwtUtil;

    public AuthController(AuthService authService, JwtUtil jwtUtil){
        this.authService = authService;
        this.jwtUtil = jwtUtil;
    }

    // ✅ REGISTER
    @PostMapping("/register")
    public ResponseEntity<?> register(
            @RequestBody RegisterRequest request
    ){
        try{

        	User user = new User(
        	        request.getEmail(),
        	        request.getPassword(),
        	        request.getRole()
        	);

            User saved = authService.register(user);

            return ResponseEntity.ok(saved);

        } catch(Exception e){
            return ResponseEntity.badRequest()
                    .body(Map.of("error", e.getMessage()));
        }
    }

    // ✅ LOGIN (NO ROLE INPUT 🔥)
    @PostMapping("/login")
    public ResponseEntity<?> login(
            @RequestBody LoginRequest request
    ){

        try{

            String token = authService.login(
                    request.getEmail(),
                    request.getPassword()
            );

            String email = jwtUtil.extractUsername(token);
            String role = jwtUtil.extractRole(token);

            AuthResponse response =
                    new AuthResponse(token,email,role);

            return ResponseEntity.ok(response);

        } catch(Exception e){
            return ResponseEntity.status(401)
                    .body(Map.of("error", e.getMessage()));
        }
    }
}