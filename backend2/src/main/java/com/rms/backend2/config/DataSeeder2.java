package com.rms.backend2.config;

import com.rms.backend2.model.MenuItem;
import com.rms.backend2.repository.MenuItemRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DataSeeder2 {

    @Bean
    CommandLineRunner initMenu(MenuItemRepository repository) {
        return args -> {
            if (repository.count() == 0) {
                repository.save(new MenuItem(null, "Ugali & Sukuma Wiki", "Main Dish", 150.0, "Available",
                        "Classic Kenyan meal served with vegetables",
                        null, 0));

                repository.save(new MenuItem(null, "Nyama Choma", "Grilled", 350.0, "Available",
                        "Roasted goat meat served with kachumbari",
                        null, 0));

                repository.save(new MenuItem(null, "Chapati", "Side Dish", 50.0, "Available",
                        "Soft layered flatbread perfect with stew",
                        null, 0));
            }
        };
    }
}
