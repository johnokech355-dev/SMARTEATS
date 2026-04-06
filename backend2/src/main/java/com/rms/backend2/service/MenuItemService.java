package com.rms.backend2.service;

import com.rms.backend2.model.MenuItem;
import com.rms.backend2.repository.MenuItemRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class MenuItemService {

    private final MenuItemRepository repository;

    public MenuItemService(MenuItemRepository repository) {
        this.repository = repository;
    }

    public List<MenuItem> getAllItems() {
        return repository.findAll();
    }

    public Optional<MenuItem> getItemById(Long id) {
        return repository.findById(id);
    }

    public MenuItem addItem(MenuItem item) {
        return repository.save(item);
    }

    public MenuItem updateItem(Long id, MenuItem item) {
        return repository.findById(id)
                .map(existing -> {
                    existing.setName(item.getName());
                    existing.setCategory(item.getCategory());
                    existing.setPrice(item.getPrice());
                    existing.setDescription(item.getDescription());
                    existing.setStatus(item.getStatus());
                    existing.setPopularity(item.getPopularity());
                    existing.setImage(item.getImage());
                    return repository.save(existing);
                })
                .orElseGet(() -> {
                    item.setId(id);
                    return repository.save(item);
                });
    }

    public void deleteItem(Long id) {
        repository.deleteById(id);
    }
}
