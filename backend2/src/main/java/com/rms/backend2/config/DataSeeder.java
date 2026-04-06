package com.rms.backend2.config;

import com.rms.backend2.model.Role;
import com.rms.backend2.model.User;
import com.rms.backend2.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DataSeeder {

    @Bean
    CommandLineRunner initUsers(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        return args -> {
            if (userRepository.count() == 0) {
                System.out.println("Seeding initial users...");

                userRepository.save(new User("owner@smarteats.com", passwordEncoder.encode("owner123"), Role.OWNER));
                userRepository.save(new User("manager@smarteats.com", passwordEncoder.encode("manager123"), Role.MANAGER));
                userRepository.save(new User("chef@smarteats.com", passwordEncoder.encode("chef123"), Role.CHEF));
                userRepository.save(new User("waiter@smarteats.com", passwordEncoder.encode("waiter123"), Role.WAITER));
                userRepository.save(new User("cashier@smarteats.com", passwordEncoder.encode("cashier123"), Role.CASHIER));
                userRepository.save(new User("admin@smarteats.com", passwordEncoder.encode("admin123"), Role.ADMIN));

                System.out.println("✅ Demo users seeded successfully!");
            } else {
                System.out.println("✅ Users already exist, skipping seeding.");
            }

            // Password verification test (for debugging only)
            // Fetch one user and verify the password matches
            userRepository.findByEmail("owner@smarteats.com").ifPresent(user -> {
                BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
                boolean matches = encoder.matches("owner123", user.getPassword());
                System.out.println("🔍 Password check for owner@smarteats.com: " + (matches ? "✅ MATCH" : "❌ NO MATCH"));
            });
        };
    }
}
